from rest_framework import serializers

from db.models import JsonWorkflow, JsonWorkflowJob, CompleteConversion, CompleteConversionJob, IntakeCatalog, \
    IntakeSource


class JsonWorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = JsonWorkflow
        fields = ['id', 'name', 'created_at', 'combine', 'intake_source']


class JsonWorkflowJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JsonWorkflowJob
        fields = ['id', 'job_id', 'file_name', 'input', 'output', 'created_at', 'status', 'exception', 'ended_at',
                  'started_at']


class CompleteConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompleteConversion
        fields = ['id', 'name', 'created_at', 'status', 'precision', 'auto_chunks', 'packed', 'unique_times',
                  'remove_existing_folder', 'chunks', 'intake_source']


class CompleteConversionJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompleteConversionJob
        fields = ['id', 'job_id', 'file_name', 'input', 'output', 'created_at', 'status', 'exception', 'ended_at',
                  'started_at']


class IntakeCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntakeCatalog
        fields = ['id', 'name', 'created_at', 'updated_at']


class IntakeSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntakeSource
        fields = ['id', 'name', 'created_at', 'updated_at', 'intake_catalog']
