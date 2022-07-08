import {Component, OnInit, ViewChild} from '@angular/core';
import {TreeviewComponent, TreeviewItem} from '@filipve1994/ngx-treeview';
import {FileExplorerApiService} from '../../services/file-explorer-api/file-explorer-api.service';
import {CompleteConversionCreation} from '../../shared/models/complete-conversion-creation.model';
import {CompleteConversionApiService} from '../../services/complete-conversion-api/complete-conversion-api.service';
import {faMinus} from '@fortawesome/free-solid-svg-icons';
import {Chunk} from '../../shared/models/chunk.model';

@Component({
  selector: 'app-complete-conversion-create',
  templateUrl: './complete-conversion-create.component.html',
  styleUrls: ['./complete-conversion-create.component.scss']
})
export class CompleteConversionCreateComponent implements OnInit {

  faMinus = faMinus;

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
  useAdvancedConfiguration: boolean;

  readonly defaultForAutoChunks: boolean = true;
  readonly defaultForChunks: Chunk[] = [];
  readonly defaultForPacked: boolean = false;
  readonly defaultForUniqueTimes: boolean = true;
  readonly defaultForPrecision: number = 0.01;
  readonly defaultForRemoveExistingFolder: boolean = false;
  readonly defaultForTimeout: number = 600;

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

    if (!this.completeConversionCreation.autoChunks && this.completeConversionCreation.chunks.length === 0) {
      this.formErrors.push('Auto chunks are deselected. Create at least one custom chunk.');
    }

    if (!this.completeConversionCreation.precision || this.completeConversionCreation.precision <= 0) {
      this.formErrors.push('Insert a precision value greater 0.');
    }
  }

  convert() {
    this.completeConversionCreation.input = this.inputSelection;
    this.completeConversionCreation.output = this.outputSelection[0];

    this.completeConversionApiService.convert(this.completeConversionCreation).subscribe();
  }

  addNewChunk() {
    this.completeConversionCreation.chunks.push({name: '', value: 0});
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
      output: null,
      chunks: this.defaultForChunks,
      autoChunks: this.defaultForAutoChunks,
      packed: this.defaultForPacked,
      uniqueTimes: this.defaultForUniqueTimes,
      precision: this.defaultForPrecision,
      removeExistingFolder: this.defaultForRemoveExistingFolder,
      timeout: this.defaultForTimeout
    };

    this.updateTreeviewComponent();
  }

  updateTreeviewComponent() {

    if (!this.treeviewComponent) {
      return;
    }

    this.treeviewComponent.raiseSelectedChange();
  }

  removeChunk(i: number) {
    this.completeConversionCreation.chunks.splice(i, 1);
  }

  resetToDefaultValuesIfDeactivated() {

    if (this.useAdvancedConfiguration) {
      return;
    }

    this.completeConversionCreation.chunks = this.defaultForChunks;
    this.completeConversionCreation.autoChunks = this.defaultForAutoChunks;
    this.completeConversionCreation.packed = this.defaultForPacked;
    this.completeConversionCreation.uniqueTimes = this.defaultForUniqueTimes;
    this.completeConversionCreation.precision = this.defaultForPrecision;
    this.completeConversionCreation.removeExistingFolder = this.defaultForRemoveExistingFolder;
    this.completeConversionCreation.timeout = this.defaultForTimeout;

    this.checkIfConvertButtonCanBeActivated();
  }
}
