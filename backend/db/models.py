from django.db import models


class JsonWorkflow(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField()
    status = models.CharField(null=True, max_length=30)
    combine = models.BooleanField(default=False)
    timeout = models.IntegerField(default=600)
    intake_source = models.TextField(default=None, null=True)


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
    remove_existing_folder = models.BooleanField(default=False)
    chunks = models.CharField(null=True, max_length=1000)
    timeout = models.IntegerField(default=600)
    intake_source = models.TextField(default=None, null=True)


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


class IntakeCatalog(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()


class IntakeSource(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    intake_catalog = models.ForeignKey(IntakeCatalog, on_delete=models.CASCADE)
    json_workflow = models.ForeignKey(JsonWorkflow, on_delete=models.CASCADE)
    complete_conversion = models.ForeignKey(CompleteConversion, on_delete=models.CASCADE)
