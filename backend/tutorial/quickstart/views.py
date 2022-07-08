import json
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

from db.models import JsonWorkflow, JsonWorkflowJob, CompleteConversion, CompleteConversionJob
from db.serializers import JsonWorkflowSerializer, JsonWorkflowJobSerializer, CompleteConversionSerializer, \
    CompleteConversionJobSerializer
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
        process_json_workflow(json_workflow, i, redis, json_workflow_serializer)
        i = i + 1

    return JsonResponse(json_workflow_serializer.data, safe=False)


@atomic
def process_json_workflow(json_workflow: JsonWorkflow, index: int, redis: Redis,
                          json_workflow_serializer: JsonWorkflowSerializer):
    json_workflow_jobs = list(JsonWorkflowJob.objects.filter(json_workflow=json_workflow.id))

    states = ["no-jobs", "no-rq-job-available", "failed", "started", "queued", "deferred", "canceled", "finished"]
    current_state = 0 if len(json_workflow_jobs) == 0 else (len(states) + 1)

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
def api_complete_conversion(request):
    pathlib.Path(request.data['output']).mkdir(exist_ok=True)
    redis = open_redis_connection()
    queue = Queue(connection=redis)

    chunk_dictionary = {}
    for chunk in request.data['chunks']:
        chunk_dictionary[chunk['name']] = chunk['value']

    complete_conversion = CompleteConversion(
        name=request.data['name'],
        created_at=timezone.now(),
        precision=request.data['precision'],
        auto_chunks=request.data['autoChunks'],
        packed=request.data['packed'],
        unique_times=request.data['uniqueTimes'],
        remove_existing_folder=request.data['removeExistingFolder'],
        chunks=json.dumps(chunk_dictionary),
        timeout=request.data['timeout']
    )
    complete_conversion.save()

    relative_output_path = os.path.relpath(request.data['output'], os.environ['NC2ZARR_OUTPUT'])

    for absolute_path in request.data['input']:
        relative_input_path = os.path.relpath(absolute_path, os.environ['NC2ZARR_INPUT'])
        file_name = os.path.basename(absolute_path)

        os.path.join(relative_output_path, file_name + ".zarr")

        job_remove_existing_folder = None

        if complete_conversion.remove_existing_folder and os.path.exists(
                os.path.join(request.data['output'], file_name + ".zarr")):
            job_remove_existing_folder = queue.enqueue(
                "worker.complete_conversion.complete_converter.remove_existing_folder",
                relative_output_path,
                file_name,
                result_ttl=None,
                failure_ttl=None,
                job_timeout=complete_conversion.timeout)

            complete_conversion_job = CompleteConversionJob(job_id=job_remove_existing_folder.id,
                                                            type='remove-existing-folder',
                                                            file_name='REMOVE EXISTING FOLDER',
                                                            input=relative_output_path,
                                                            output='-',
                                                            created_at=timezone.now(),
                                                            complete_conversion=complete_conversion)
            complete_conversion_job.save()

        job = queue.enqueue("worker.complete_conversion.complete_converter.complete_conversion",
                            relative_input_path,
                            relative_output_path,
                            file_name,
                            complete_conversion.precision,
                            complete_conversion.auto_chunks,
                            complete_conversion.packed,
                            complete_conversion.unique_times,
                            chunk_dictionary,
                            job_timeout=complete_conversion.timeout,
                            depends_on=job_remove_existing_folder,
                            result_ttl=None,
                            failure_ttl=None)

        complete_conversion_job = CompleteConversionJob(job_id=job.id,
                                                        type='convert',
                                                        file_name=file_name,
                                                        input=relative_input_path,
                                                        output=relative_output_path,
                                                        created_at=timezone.now(),
                                                        complete_conversion=complete_conversion)
        complete_conversion_job.save()

        intake_job = queue.enqueue(
            "worker.intake_catalog_generation.intake_catalog_generator.generate_intake_catalog_for_zarr",
            relative_output_path,
            file_name,
            result_ttl=None,
            failure_ttl=None,
            depends_on=job,
            job_timeout=complete_conversion.timeout)

        intake_complete_conversion_job = CompleteConversionJob(job_id=intake_job.id,
                                                               type='intake',
                                                               file_name='INTAKE',
                                                               input='-',
                                                               output=os.path.join(relative_output_path, file_name),
                                                               created_at=timezone.now(),
                                                               complete_conversion=complete_conversion)
        intake_complete_conversion_job.save()

    return Response()


@api_view(['POST'])
@atomic
def api_json_workflow(request):
    """
    Generate JSON meta files.
    """
    pathlib.Path(request.data['output']).mkdir(exist_ok=True)
    redis = open_redis_connection()
    queue = Queue(connection=redis)

    json_workflow = JsonWorkflow(
        name=request.data['name'],
        created_at=timezone.now(),
        combine=request.data['combine'],
        timeout=request.data['timeout'])
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
                            failure_ttl=None,
                            job_timeout=json_workflow.timeout)
        jobs.append(job)

        json_workflow_job = JsonWorkflowJob(job_id=job.id,
                                            type='convert',
                                            file_name=file_name,
                                            input=relative_input_path,
                                            output=relative_output_path,
                                            created_at=timezone.now(),
                                            json_workflow=json_workflow)
        json_workflow_job.save()

    if json_workflow.combine:
        output_file_name = request.data['outputFileName']

        job = queue.enqueue("worker.json_workflow.json_converter.combine_json",
                            relative_input_paths_for_combine,
                            relative_output_path,
                            output_file_name,
                            result_ttl=None,
                            failure_ttl=None,
                            depends_on=jobs,
                            job_timeout=json_workflow.timeout)

        json_workflow_job = JsonWorkflowJob(job_id=job.id,
                                            type='combine',
                                            file_name='COMBINE',
                                            input='-',
                                            output=os.path.join(relative_output_path, output_file_name),
                                            created_at=timezone.now(),
                                            json_workflow=json_workflow)
        json_workflow_job.save()

        intake_job = queue.enqueue(
            "worker.intake_catalog_generation.intake_catalog_generator.generate_intake_catalog_for_json_metadata",
            relative_output_path,
            output_file_name,
            result_ttl=None,
            failure_ttl=None,
            depends_on=job,
            job_timeout=json_workflow.timeout)

        intake_json_workflow_job = JsonWorkflowJob(job_id=intake_job.id,
                                                   type='intake',
                                                   file_name='INTAKE',
                                                   input='-',
                                                   output=os.path.join(relative_output_path, output_file_name),
                                                   created_at=timezone.now(),
                                                   json_workflow=json_workflow)
        intake_json_workflow_job.save()

        for relative_input_path in relative_input_paths_for_combine:
            clean_up_job = queue.enqueue("worker.json_workflow.json_converter.clean_up_after_combine",
                                         relative_input_path,
                                         result_ttl=None,
                                         failure_ttl=None,
                                         depends_on=job)

            clean_up_json_workflow_job = JsonWorkflowJob(job_id=clean_up_job.id,
                                                         type='clean-up',
                                                         file_name='CLEAN-UP',
                                                         input=relative_input_path,
                                                         output='-',
                                                         created_at=timezone.now(),
                                                         json_workflow=json_workflow)
            clean_up_json_workflow_job.save()

    return Response()


@api_view(['DELETE'])
def api_delete_json_workflow(request, pk: int):
    JsonWorkflow.objects.filter(id=pk).delete()
    return Response()


@api_view(['POST'])
def api_restart_job_of_json_workflow(request, pk: int):
    job = JsonWorkflowJob.objects.get(id=pk)
    redis = open_redis_connection()
    queue = Queue(connection=redis)
    queue.failed_job_registry.requeue(job.job_id)
    return Response()


@api_view(['DELETE'])
def api_delete_complete_conversion(request, pk: int):
    CompleteConversion.objects.filter(id=pk).delete()
    return Response()


@api_view(['POST'])
def api_restart_job_of_complete_conversion(request, pk: int):
    job = CompleteConversionJob.objects.get(id=pk)
    redis = open_redis_connection()
    queue = Queue(connection=redis)
    queue.failed_job_registry.requeue(job.job_id)
    return Response()


@api_view(['GET'])
def api_list_complete_conversions(request):
    complete_conversions = CompleteConversion.objects.all()
    complete_conversion_serializer = CompleteConversionSerializer(complete_conversions, many=True)

    redis = open_redis_connection()
    i = 0
    for complete_conversion in complete_conversions:
        process(complete_conversion, i, redis, complete_conversion_serializer)
        i = i + 1

    return JsonResponse(complete_conversion_serializer.data, safe=False)


@atomic
def process(complete_conversion: CompleteConversion, index: int, redis: Redis,
            complete_conversion_serializer: CompleteConversionSerializer):
    complete_conversion_jobs = list(CompleteConversionJob.objects.filter(complete_conversion=complete_conversion.id))

    states = ["no-jobs", "no-rq-job-available", "failed", "started", "queued", "deferred", "canceled", "finished"]
    current_state = 0 if len(complete_conversion_jobs) == 0 else (len(states) + 1)

    jobs = Job.fetch_many(list(map(lambda j: j.job_id, complete_conversion_jobs)), connection=redis)

    job_dict = {}

    for job in jobs:
        if job is not None:
            job_dict[job.id] = job

    for job in complete_conversion_jobs:

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

    complete_conversion_serializer.data[index]['status'] = states[current_state]
    complete_conversion.status = states[current_state]
    complete_conversion.save()

    complete_conversion_job_serializer = CompleteConversionJobSerializer(complete_conversion_jobs, many=True)
    complete_conversion_serializer.data[index]['jobs'] = complete_conversion_job_serializer.data


@api_view(['POST'])
def api_kill_json_workflow(request, pk: int):
    jobs = list(JsonWorkflowJob.objects.filter(json_workflow=pk))
    stop_all_jobs(list(map(lambda c: c.job_id, jobs)))
    return Response()


@api_view(['POST'])
def api_kill_complete_conversion(request, pk: int):
    jobs = list(CompleteConversionJob.objects.filter(complete_conversion=pk))
    stop_all_jobs(list(map(lambda c: c.job_id, jobs)))
    return Response()


def stop_all_jobs(job_ids: list):
    redis = open_redis_connection()
    for job in Job.fetch_many(job_ids, connection=redis):
        if job.get_status() in ['deferred', 'queued', 'started']:
            job.cancel()
