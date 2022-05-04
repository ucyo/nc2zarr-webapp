import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {TreeviewItem} from '@filipve1994/ngx-treeview';
import {FileExplorerApiService} from '../../services/file-explorer-api/file-explorer-api.service';
import {JsonWorkflowApiService} from '../../services/json-workflow-api/json-workflow-api.service';

@Component({
  selector: 'app-json-workflow-create',
  templateUrl: './json-workflow-create.component.html',
  styleUrls: ['./json-workflow-create.component.scss']
})
export class JsonWorkflowCreateComponent implements OnInit {

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

    if (!this.inputSelection ||
      this.inputSelection.length === 0 ||
      _.some(this.inputSelection, (path) => !_.includes(path, '.nc'))) {
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
}
