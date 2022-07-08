import {Component, OnInit} from '@angular/core';
import {faSearch, faTrash, faUndo, faStop} from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import {JsonWorkflow} from '../../shared/models/json-workflow.model';
import {JsonWorkflowApiService} from '../../services/json-workflow-api/json-workflow-api.service';
import {JsonWorkflowJob} from '../../shared/models/json-workflow-job.model';

@Component({
  selector: 'app-json-workflow-overview',
  templateUrl: './json-workflow-overview.component.html',
  styleUrls: ['./json-workflow-overview.component.scss']
})
export class JsonWorkflowOverviewComponent implements OnInit {

  faSearch = faSearch;
  faTrash = faTrash;
  faUndo = faUndo;
  faStop = faStop;

  jsonWorkflows: JsonWorkflow[];
  selectedJsonWorkflow: JsonWorkflow;
  jsonWorkflowJobs: JsonWorkflowJob[];
  failedJob: JsonWorkflowJob;

  constructor(private jsonWorkflowApiService: JsonWorkflowApiService) {
  }

  ngOnInit(): void {
    this.reloadJsonWorkflows();
  }

  reloadJsonWorkflows() {
    this.jsonWorkflowApiService.loadWorkflows().subscribe(jsonWorkflows => {
      this.jsonWorkflows = _.orderBy(jsonWorkflows, 'id', 'desc');
    });
  }

  deleteJsonWorkflow(id: number) {
    this.resetData();
    this.jsonWorkflowApiService.delete(id).subscribe(() => this.reloadJsonWorkflows());
  }

  getJobCount(jsonWorkflow: JsonWorkflow) {
    let counts = _.countBy(jsonWorkflow.jobs, (job) => {
      return job.status === 'finished' ? 'finished' : 'notFinished'
    });

    let finished = counts['finished'] ? counts['finished'] : 0;

    return finished + '/' + jsonWorkflow.jobs.length;
  }

  retry(id: number) {
    this.resetData();
    this.jsonWorkflowApiService.restart(id).subscribe(() => this.reloadJsonWorkflows());
  }

  refresh() {
    this.resetData();
    this.reloadJsonWorkflows();
  }

  resetData() {
    this.failedJob = null;
    this.selectedJsonWorkflow = null;
    this.jsonWorkflows = [];
    this.jsonWorkflowJobs = [];
  }

  jobFailedAsNetCDF3(jsonWorkflowJob: JsonWorkflowJob) {
    return jsonWorkflowJob.status === 'failed' &&
      jsonWorkflowJob.exception &&
      jsonWorkflowJob.exception.indexOf('NETCDF3') !== -1;
  }

  workflowFailedAsNetCDF3(jsonWorkflow: JsonWorkflow) {
    return jsonWorkflow.status === 'failed' &&
      _.some(jsonWorkflow.jobs, job => job.status === 'failed' && job.exception && job.exception.indexOf('NETCDF3') !== -1);
  }

  killJsonWorkflow(id: number) {
    this.jsonWorkflowApiService.kill(id).subscribe(() => this.reloadJsonWorkflows());
  }
}
