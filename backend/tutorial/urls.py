"""tutorial URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from tutorial.quickstart import views

urlpatterns = [
    path('file-explorer/input', views.file_explorer_input, name='File Explorer - Input'),
    path('file-explorer/output', views.file_explorer_output, name='File Explorer - Output'),
    path('json-workflow', views.api_json_workflow, name='Json Workflow'),
    path('json-workflow/<int:pk>', views.api_delete_json_workflow, name='Json Workflow - Delete'),
    path('json-workflow/job/<int:pk>', views.api_restart_job_of_json_workflow, name='Json Workflow - Job Restart'),
    path('json-workflow/list', views.api_list_json_workflows, name='Json Workflow - List'),
    path('complete-conversion', views.api_complete_conversion, name='Complete Conversion'),
    path('complete-conversion/<int:pk>', views.api_delete_complete_conversion, name='Complete Conversion - Delete'),
    path('complete-conversion/job/<int:pk>', views.api_restart_job_of_complete_conversion,
         name='Complete Conversion - Job Restart'),
    path('complete-conversion/list', views.api_list_complete_conversions, name='Complete Conversion - List'),
    path('admin/', admin.site.urls),
]
