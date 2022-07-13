import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IntakeCatalogApiService} from '../../services/intake-catalog-api/intake-catalog-api.service';
import * as _ from 'lodash';
import {IntakeCatalog} from '../../shared/models/intake-catalog.model';
import {faSearch, faStop, faTrash, faUndo} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-intake-catalog-overview',
  templateUrl: './intake-catalog-overview.component.html',
  styleUrls: ['./intake-catalog-overview.component.scss']
})
export class IntakeCatalogOverviewComponent implements OnInit {

  @Input() currentIntakeCatalog: IntakeCatalog;
  @Output() currentIntakeCatalogChange = new EventEmitter<IntakeCatalog>();

  faSearch = faSearch;
  faTrash = faTrash;
  faUndo = faUndo;
  faStop = faStop;

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
    _.chain(intakeCatalog.sources).map((s) => s.name).join(', ').value();
  }

  create() {
    this.currentIntakeCatalog = {
      created_at: null,
      id: 0,
      name: '',
      sources: [],
      updated_at: null
    };
    this.currentIntakeCatalogChange.emit(this.currentIntakeCatalog);
  }

  edit(intakeCatalog: IntakeCatalog) {
    this.currentIntakeCatalog = intakeCatalog;
    this.currentIntakeCatalogChange.emit(this.currentIntakeCatalog);
  }

  delete(id: number) {
    this.intakeCatalogApiService.delete(id).subscribe(() => this.reloadIntakeCatalogs());
  }
}
