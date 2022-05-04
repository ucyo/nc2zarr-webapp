import {Component, OnInit} from '@angular/core';
import {FileExplorerApiService} from '../../services/file-explorer-api/file-explorer-api.service';
import {TreeviewItem} from '@filipve1994/ngx-treeview';
import * as _ from 'lodash';
import {JsonWorkflowApiService} from '../../services/json-workflow-api/json-workflow-api.service';
import {JsonWorkflow} from '../../shared/models/json-workflow.model';
import {JsonWorkflowJob} from '../../shared/models/json-workflow-job.model';
import {faSearch, faTrash, faUndo} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-json-workflow',
  templateUrl: './json-workflow.component.html',
  styleUrls: ['./json-workflow.component.scss']
})
export class JsonWorkflowComponent implements OnInit {

  faSearch = faSearch;
  faTrash = faTrash;
  faUndo = faUndo;

  inputItems: TreeviewItem[];
  outputItems: TreeviewItem[];
  config = {
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500
  };
  conversionAllowed: boolean;
  inputSelection: string[];
  outputSelection: string[];
  jsonWorkflowName: string;
  jsonWorkflows: JsonWorkflow[];
  selectedJsonWorkflow: JsonWorkflow;
  jsonWorkflowJobs: JsonWorkflowJob[];
  failedJob: JsonWorkflowJob;

  constructor(private fileExplorerApiService: FileExplorerApiService, private jsonWorkflowApiService: JsonWorkflowApiService) {
  }

  ngOnInit(): void {

    this.conversionAllowed = false;

    this.fileExplorerApiService.loadInput().subscribe(result => {
      this.inputItems = [new TreeviewItem(result as any)];
    });

    this.fileExplorerApiService.loadOutput().subscribe(result => {
      this.outputItems = [new TreeviewItem(result as any)];
    });

    this.reloadJsonWorkflows();
  }

  reloadJsonWorkflows() {
    this.jsonWorkflowApiService.loadWorkflows().subscribe(jsonWorkflows => {
      this.jsonWorkflows = _.orderBy(jsonWorkflows, 'id', 'desc');
    });
  }

  onSelectedChangeForInput($event: any[]) {
    this.inputSelection = $event;
    this.checkIfConvertButtonCanBeActivated();
  }

  onSelectedChangeForOutput($event: any[]) {
    this.outputSelection = $event;
    this.checkIfConvertButtonCanBeActivated();
  }

  checkIfConvertButtonCanBeActivated() {

    let canBeActive = true;

    if (!this.jsonWorkflowName || this.jsonWorkflowName.length === 0) {
      canBeActive = false;
    }

    if (!this.inputSelection || this.inputSelection.length === 0 || _.some(this.inputSelection, (path) => !_.includes(path, '.nc'))) {
      canBeActive = false;
    }

    if (!this.outputSelection || this.outputSelection.length !== 1) {
      canBeActive = false;
    }

    this.conversionAllowed = canBeActive;
  }

  convert() {
    this.jsonWorkflowApiService.convert(this.jsonWorkflowName, this.inputSelection, this.outputSelection[0]).subscribe();
  }

  deleteJsonWorkflow(id: number) {
    this.failedJob = null;
    this.selectedJsonWorkflow = null;
    this.jsonWorkflows = [];
    this.jsonWorkflowJobs = [];

    this.jsonWorkflowApiService.delete(id).subscribe(() => this.reloadJsonWorkflows());
  }

  getJobCount(jsonWorkflow: JsonWorkflow) {
    let counts = _.countBy(jsonWorkflow.jobs, (job) => {
      return job.status === 'finished' ? 'finished' : 'notFinished'
    });

    let finished = counts['finished']? counts['finished']: 0;

    return finished + '/' + jsonWorkflow.jobs.length;
  }

  retry(id: number) {
    this.failedJob = null;
    this.selectedJsonWorkflow = null;
    this.jsonWorkflows = [];
    this.jsonWorkflowJobs = [];

    this.jsonWorkflowApiService.restart(id).subscribe(() => this.reloadJsonWorkflows());
  }
}
