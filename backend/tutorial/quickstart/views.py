import os
import pathlib

from django.db.transaction import atomic
from django.http import JsonResponse
from django.utils import timezone
from redis import Redis
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rq import Queue
from rq.job import Job

from db.models import JsonWorkflow, JsonWorkflowJob
from db.serializers import JsonWorkflowSerializer, JsonWorkflowJobSerializer
from tutorial.file_explorer.list_folders_and_files import list_folders_and_files, list_folders


@api_view(['GET'])
def file_explorer_input(request):
    """
    Retrieve folder structure of input folder.
    """
    if request.method == 'GET':
        return Response(list_folders_and_files(os.environ['NC2ZARR_INPUT']))


@api_view(['GET'])
def file_explorer_output(request):
    """
    Retrieve folder structure of input folder.
    """
    if request.method == 'GET':
        return Response(list_folders(os.environ['NC2ZARR_OUTPUT']))


def open_redis_connection() -> Redis:
    if "NC2ZARR_PROD" in os.environ and os.environ["NC2ZARR_PROD"] == "True":
        host = "redis"
    else:
        host = "localhost"

    return Redis(host=host)


@api_view(['GET'])
def api_list_json_workflows(request):
    """
    Retrieve folder structure of input folder.
    """
    json_workflows = JsonWorkflow.objects.all()
    json_workflow_serializer = JsonWorkflowSerializer(json_workflows, many=True)

    redis = open_redis_connection()
    i = 0
    for json_workflow in json_workflows:
        process(json_workflow, i, redis, json_workflow_serializer)
        i = i + 1

    return JsonResponse(json_workflow_serializer.data, safe=False)


@atomic
def process(json_workflow: JsonWorkflow, index: int, redis: Redis, json_workflow_serializer: JsonWorkflowSerializer):
    json_workflow_jobs = list(JsonWorkflowJob.objects.filter(json_workflow=json_workflow.id))

    states = ["no-jobs", "no-rq-job-available", "failed", "started", "queued", "finished"]
    current_state = 0 if len(json_workflow_jobs) == 0 else 5

    jobs = Job.fetch_many(list(map(lambda j: j.job_id, json_workflow_jobs)), connection=redis)

    job_dict = {}

    for job in jobs:
        if job is not None:
            job_dict[job.id] = job

    for job in json_workflow_jobs:

        if job.job_id in job_dict:
            job.status = job_dict[job.job_id].get_status()
            job.exception = job_dict[job.job_id].exc_info
            job.ended_at = job_dict[job.job_id].ended_at
            job.started_at = job_dict[job.job_id].started_at
        else:
            job.status = "finished"

        i = states.index(job.status)
        if i < current_state:
            current_state = i

        job.save()

    json_workflow_serializer.data[index]['status'] = states[current_state]
    json_workflow.status = states[current_state]
    json_workflow.save()

    json_workflow_job_serializer = JsonWorkflowJobSerializer(json_workflow_jobs, many=True)
    json_workflow_serializer.data[index]['jobs'] = json_workflow_job_serializer.data


@api_view(['POST'])
@atomic
def api_json_workflow(request):
    """
    Generate JSON meta files.
    """
    pathlib.Path(request.data['output']).mkdir(exist_ok=True)
    redis = open_redis_connection()
    queue = Queue(connection=redis)

    json_workflow = JsonWorkflow(name=request.data['name'], created_at=timezone.now())
    json_workflow.save()

    relative_input_paths_for_combine = []
    relative_output_path = ''
    jobs = []

    for absolute_path in request.data['input']:
        relative_input_path = os.path.relpath(absolute_path, os.environ['NC2ZARR_INPUT'])
        relative_output_path = os.path.relpath(request.data['output'], os.environ['NC2ZARR_OUTPUT'])

        file_name = os.path.basename(absolute_path)

        # The input paths for the combine process are the output paths of the conversion processes.
        # Therefore, we want build paths like './foo.json'.
        relative_input_paths_for_combine.append(os.path.join(relative_output_path, file_name) + ".json")

        job = queue.enqueue("worker.json_workflow.json_converter.gen_json",
                            relative_input_path,
                            relative_output_path,
                            file_name,
                            result_ttl=None,
                            failure_ttl=None)
        jobs.append(job)

        json_workflow_job = JsonWorkflowJob(job_id=job.id,
                                            type='convert',
                                            file_name=file_name,
                                            input=relative_input_path,
                                            output=relative_output_path,
                                            created_at=timezone.now(),
                                            json_workflow=json_workflow)
        json_workflow_job.save()

    if request.data['combine']:
        output_file_name = request.data['outputFileName']

        job = queue.enqueue("worker.json_workflow.json_converter.combine_json",
                            relative_input_paths_for_combine,
                            relative_output_path,
                            output_file_name,
                            result_ttl=None,
                            failure_ttl=None,
                            depends_on=jobs)

        json_workflow_job = JsonWorkflowJob(job_id=job.id,
                                            type='combine',
                                            file_name='COMBINE',
                                            input='-',
                                            output=os.path.join(relative_output_path, output_file_name),
                                            created_at=timezone.now(),
                                            json_workflow=json_workflow)
        json_workflow_job.save()

    return Response()


@api_view(['DELETE'])
def api_delete_json_workflow(request, pk: int):
    JsonWorkflow.objects.filter(id=pk).delete()
    return Response()


@api_view(['POST'])
def api_restart_job(request, pk: int):
    job = JsonWorkflowJob.objects.get(id=pk)
    redis = open_redis_connection()
    queue = Queue(connection=redis)
    queue.failed_job_registry.requeue(job.job_id)
    return Response()
