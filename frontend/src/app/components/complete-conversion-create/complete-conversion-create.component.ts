import {Component, OnInit, ViewChild} from '@angular/core';
import {TreeviewComponent, TreeviewItem} from '@filipve1994/ngx-treeview';
import {FileExplorerApiService} from '../../services/file-explorer-api/file-explorer-api.service';
import {CompleteConversionCreation} from '../../shared/models/complete-conversion-creation.model';
import {CompleteConversionApiService} from '../../services/complete-conversion-api/complete-conversion-api.service';

@Component({
  selector: 'app-complete-conversion-create',
  templateUrl: './complete-conversion-create.component.html',
  styleUrls: ['./complete-conversion-create.component.scss']
})
export class CompleteConversionCreateComponent implements OnInit {

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
  completeConversionCreation: CompleteConversionCreation;

  constructor(private fileExplorerApiService: FileExplorerApiService, private completeConversionApiService: CompleteConversionApiService) {
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

    if (!this.completeConversionCreation.name || this.completeConversionCreation.name.length === 0) {
      this.formErrors.push('Provide a name for the complete conversion.');
    }

    if (!this.inputSelection || this.inputSelection.length === 0) {
      this.formErrors.push('Select at least one input file.');
    }

    if (!this.outputSelection || this.outputSelection.length !== 1) {
      this.formErrors.push('Select an output folder.');
    }
  }

  convert() {
    this.completeConversionCreation.input = this.inputSelection;
    this.completeConversionCreation.output = this.outputSelection[0];

    this.completeConversionApiService.convert(this.completeConversionCreation).subscribe();
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
    this.completeConversionCreation = {
      name: '',
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
