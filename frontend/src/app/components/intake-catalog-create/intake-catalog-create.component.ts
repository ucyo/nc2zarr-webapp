import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faMinus} from '@fortawesome/free-solid-svg-icons';
import {IntakeCatalogApiService} from '../../services/intake-catalog-api/intake-catalog-api.service';
import {JsonWorkflowApiService} from '../../services/json-workflow-api/json-workflow-api.service';
import {CompleteConversionApiService} from '../../services/complete-conversion-api/complete-conversion-api.service';
import {IntakeCatalogCreate} from '../../shared/models/intake-catalog/intake-catalog.create.model';
import {IntakeCatalogOverviewComponent} from '../intake-catalog-overview/intake-catalog-overview.component';

@Component({
  selector: 'app-intake-catalog-create',
  templateUrl: './intake-catalog-create.component.html',
  styleUrls: ['./intake-catalog-create.component.scss']
})
export class IntakeCatalogCreateComponent implements OnInit {

  faMinus = faMinus;
  possibleSources = [];
  selectedPossibleSources: any[] = [];
  formErrors: string[] = [];

  @Input() intakeCatalogCreate: IntakeCatalogCreate;
  @Output() intakeCatalogCreateChange = new EventEmitter<IntakeCatalogCreate>();

  constructor(private intakeCatalogApiService: IntakeCatalogApiService,
              private jsonWorkflowApiService: JsonWorkflowApiService,
              private completeConversionApiService: CompleteConversionApiService) {
  }

  ngOnInit(): void {

    for (let source of this.intakeCatalogCreate.sources) {
      this.selectedPossibleSources.push({
        id: source.id,
        name: source.name,
        json_workflow: source.json_workflow,
        complete_conversion: source.complete_conversion
      });
    }

    this.checkIfSaveButtonCanBeActivated();

    this.jsonWorkflowApiService.load().subscribe(jsonWorkflows => {
      for (let jsonWorkflow of jsonWorkflows) {
        if (jsonWorkflow.status === 'finished' && jsonWorkflow.intake_source) {
          this.possibleSources.push({
            json_workflow: jsonWorkflow.id,
            complete_conversion: null,
            name: jsonWorkflow.name,
            type: 'JSON Workflow',
            yaml: jsonWorkflow.intake_source,
            created_at: jsonWorkflow.created_at
          })
        }
      }
    });

    this.completeConversionApiService.load().subscribe(completeConversions => {
      for (let completeConversion of completeConversions) {
        if (completeConversion.status === 'finished' && completeConversion.intake_source) {
          this.possibleSources.push({
            json_workflow: null,
            complete_conversion: completeConversion.id,
            name: completeConversion.name,
            type: 'Complete Conversion',
            yaml: completeConversion.intake_source,
            created_at: completeConversion.created_at
          })
        }
      }
    });
  }

  cancel(): void {
    this.intakeCatalogCreate = null;
    this.intakeCatalogCreateChange.emit(this.intakeCatalogCreate);
  }

  checkIfSaveButtonCanBeActivated() {
    this.formErrors = [];

    if (!this.intakeCatalogCreate.name || this.intakeCatalogCreate.name.length === 0) {
      this.formErrors.push('Provide a name for the Intake catalog.');
    }

    if (!this.intakeCatalogCreate.sources || this.intakeCatalogCreate.sources.length === 0) {
      this.formErrors.push('Select at least one Intake source.');
    }

    for (let source of this.intakeCatalogCreate.sources) {
      if (!source.name || source.name.length === 0) {
        this.formErrors.push('Specify a name for all Intake sources.');
      }
    }
  }

  addNewSource() {
    this.intakeCatalogCreate.sources.push({
      id: 0,
      name: '',
      json_workflow: 0,
      complete_conversion: 0
    });

    this.selectedPossibleSources.push(null);
  }

  onSourceSelected($event: any, i: number) {
    this.intakeCatalogCreate.sources[i].json_workflow = $event.json_workflow;
    this.intakeCatalogCreate.sources[i].complete_conversion = $event.complete_conversion;

    this.checkIfSaveButtonCanBeActivated();
  }

  compareWith(item, selected) {
    return item.json_workflow === selected.json_workflow && item.complete_conversion === selected.complete_conversion;
  }

  createOrUpdate() {

    if (this.intakeCatalogCreate.id === 0) {
      this.intakeCatalogApiService.create(this.intakeCatalogCreate).subscribe(() => {
        this.intakeCatalogCreate = null;
        this.intakeCatalogCreateChange.emit(this.intakeCatalogCreate);
        this.selectedPossibleSources = [];
        window.location.reload();
      });

    } else {
      this.intakeCatalogApiService.update(this.intakeCatalogCreate).subscribe(() => {
        this.intakeCatalogCreate = null;
        this.intakeCatalogCreateChange.emit(this.intakeCatalogCreate);
        this.selectedPossibleSources = [];
        window.location.reload();
      });
    }
  }
}
