import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import {IntakeCatalogApiService} from '../../services/intake-catalog-api/intake-catalog-api.service';
import * as _ from 'lodash';
import {IntakeCatalog} from '../../shared/models/intake-catalog.model';
import {faPencilAlt, faSearch, faStop, faTrash} from '@fortawesome/free-solid-svg-icons';
import {IntakeCatalogCreate} from '../../shared/models/intake-catalog/intake-catalog.create.model';
import {IntakeSourceCreate} from '../../shared/models/intake-catalog/intake-source.create.model';

@Component({
  selector: 'app-intake-catalog-overview',
  templateUrl: './intake-catalog-overview.component.html',
  styleUrls: ['./intake-catalog-overview.component.scss']
})
export class IntakeCatalogOverviewComponent implements OnInit {

  @Input() intakeCatalogCreate: IntakeCatalogCreate;
  @Output() intakeCatalogCreateChange = new EventEmitter<IntakeCatalogCreate>();

  faSearch = faSearch;
  faTrash = faTrash;
  faStop = faStop;
  faPencilAlt = faPencilAlt;

  public intakeCatalogs: IntakeCatalog[];

  constructor(private intakeCatalogApiService: IntakeCatalogApiService) {
  }

  ngOnInit(): void {
    this.reloadIntakeCatalogs();
  }

  reloadIntakeCatalogs() {
    this.intakeCatalogApiService.loadIntakeCatalogs().subscribe(intakeCatalogs => {
      this.intakeCatalogs = _.orderBy(intakeCatalogs, 'id', 'desc');
    });
  }

  formatSources(intakeCatalog: IntakeCatalog) {
    return _.chain(intakeCatalog.sources).map((s) => s.name).join(', ').value();
  }

  create() {
    this.intakeCatalogCreate = {
      id: 0,
      name: '',
      sources: [],
    };
    this.intakeCatalogCreateChange.emit(this.intakeCatalogCreate);
  }

  edit(intakeCatalog: IntakeCatalog) {

    let intakeSourceCreates: IntakeSourceCreate[] = [];

    for (let source of intakeCatalog.sources) {
      intakeSourceCreates.push({
        id: source.id,
        name: source.name,
        json_workflow: source.json_workflow,
        complete_conversion: source.complete_conversion
      })
    }

    this.intakeCatalogCreate = {
      id: intakeCatalog.id,
      name: intakeCatalog.name,
      sources: intakeSourceCreates
    };
    this.intakeCatalogCreateChange.emit(this.intakeCatalogCreate);
  }

  delete(id: number) {

    this.intakeCatalogApiService.delete(id).subscribe(() => {
      this.reloadIntakeCatalogs();

      if (this.intakeCatalogCreate.id === id) {
        this.intakeCatalogCreate = null;
        this.intakeCatalogCreateChange.emit(this.intakeCatalogCreate);
      }
    });
  }
}
