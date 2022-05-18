from rest_framework import serializers

from db.models import JsonWorkflow, JsonWorkflowJob, CompleteConversion, CompleteConversionJob


class JsonWorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = JsonWorkflow
        fields = ['id', 'name', 'created_at']


class JsonWorkflowJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JsonWorkflowJob
        fields = ['id', 'job_id', 'file_name', 'input', 'output', 'created_at', 'status', 'exception', 'ended_at',
                  'started_at']


class CompleteConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompleteConversion
        fields = ['id', 'name', 'created_at']


class CompleteConversionJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompleteConversionJob
        fields = ['id', 'job_id', 'file_name', 'input', 'output', 'created_at', 'status', 'exception', 'ended_at',
                  'started_at']
