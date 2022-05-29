from django.db import models


class JsonWorkflow(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField()
    status = models.CharField(null=True, max_length=30)
    combine = models.BooleanField(default=False)


class JsonWorkflowJob(models.Model):
    job_id = models.CharField(max_length=200)
    type = models.CharField(null=True, max_length=200)
    file_name = models.CharField(max_length=200)
    input = models.CharField(max_length=1000)
    output = models.CharField(max_length=1000)
    created_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True)
    started_at = models.DateTimeField(null=True)
    exception = models.CharField(null=True, max_length=10000)
    json_workflow = models.ForeignKey(JsonWorkflow, on_delete=models.CASCADE)
    status = models.CharField(null=True, max_length=30)


class CompleteConversion(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField()
    status = models.CharField(null=True, max_length=30)
    precision = models.FloatField(null=True)
    auto_chunks = models.BooleanField(default=True)
    packed = models.BooleanField(default=True)
    unique_times = models.BooleanField(default=True)
    chunks = models.CharField(null=True, max_length=1000)


class CompleteConversionJob(models.Model):
    job_id = models.CharField(max_length=200)
    type = models.CharField(null=True, max_length=200)
    file_name = models.CharField(max_length=200)
    input = models.CharField(max_length=1000)
    output = models.CharField(max_length=1000)
    created_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True)
    started_at = models.DateTimeField(null=True)
    exception = models.CharField(null=True, max_length=10000)
    complete_conversion = models.ForeignKey(CompleteConversion, on_delete=models.CASCADE)
    status = models.CharField(null=True, max_length=30)
