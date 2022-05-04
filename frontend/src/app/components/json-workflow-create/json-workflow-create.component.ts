import {Component, OnInit, ViewChild} from '@angular/core';
import {TreeviewComponent, TreeviewItem} from '@filipve1994/ngx-treeview';
import {FileExplorerApiService} from '../../services/file-explorer-api/file-explorer-api.service';
import {JsonWorkflowApiService} from '../../services/json-workflow-api/json-workflow-api.service';
import {JsonWorkflowCreation} from '../../shared/models/json-workflow-creation.model';

@Component({
  selector: 'app-json-workflow-create',
  templateUrl: './json-workflow-create.component.html',
  styleUrls: ['./json-workflow-create.component.scss']
})
export class JsonWorkflowCreateComponent implements OnInit {

  @ViewChild(TreeviewComponent, {static: false})
  treeviewComponent: TreeviewComponent;
  inputItems: TreeviewItem[] = [];
  outputItems: TreeviewItem[] = [];
  config = {
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500
  };
  inputSelection: string[];
  outputSelection: string[];
  formErrors: string[] = [];
  jsonWorkflowCreation: JsonWorkflowCreation;

  constructor(private fileExplorerApiService: FileExplorerApiService, private jsonWorkflowApiService: JsonWorkflowApiService) {
  }

  ngOnInit(): void {

    this.resetFields();

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

    this.formErrors = [];

    if (!this.jsonWorkflowCreation.name || this.jsonWorkflowCreation.name.length === 0) {
      this.formErrors.push('Provide a name for the JSON workflow.');
    }

    if (!this.inputSelection || this.inputSelection.length === 0) {
      this.formErrors.push('Select at least one input file.');
    }

    if (!this.outputSelection || this.outputSelection.length !== 1) {
      this.formErrors.push('Select an output folder.');
    }

    if (this.jsonWorkflowCreation.combine &&
      (!this.jsonWorkflowCreation.outputFileName || this.jsonWorkflowCreation.outputFileName.length === 0)
    ) {
      this.formErrors.push('Provide a name for the combined JSON file.');
    }
  }

  convert() {
    this.jsonWorkflowCreation.input = this.inputSelection;
    this.jsonWorkflowCreation.output = this.outputSelection[0];

    this.jsonWorkflowApiService.convert(this.jsonWorkflowCreation).subscribe();
  }

  resetFields() {

    this.inputItems.forEach(item => {
      item.checked = false;
      item.collapsed = true;
      item.correctChecked();
    });
    this.outputItems.forEach(item => {
      item.checked = false;
      item.collapsed = true;
      item.correctChecked();
    });

    this.inputSelection = [];
    this.outputSelection = [];
    this.formErrors = [];
    this.jsonWorkflowCreation = {
      name: '',
      combine: false,
      outputFileName: '',
      input: [],
      output: null
    };

    this.updateTreeviewComponent();
  }

  updateTreeviewComponent() {

    if (!this.treeviewComponent) {
      return;
    }

    this.treeviewComponent.raiseSelectedChange();
  }
}
