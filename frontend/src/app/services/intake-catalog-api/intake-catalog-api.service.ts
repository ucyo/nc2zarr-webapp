import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IntakeCatalog} from '../../shared/models/intake-catalog.model';
import {IntakeCatalogCreate} from '../../shared/models/intake-catalog/intake-catalog.create.model';

@Injectable({
  providedIn: 'root'
})
export class IntakeCatalogApiService {

  constructor(private httpClient: HttpClient) {
  }

  loadIntakeCatalogs() {
    return this.httpClient.get<IntakeCatalog[]>('intake-catalog/list');
  }

  delete(id: number) {
    return this.httpClient.delete('intake-catalog/' + id);
  }

  create(intakeCatalogCreate: IntakeCatalogCreate) {
    return this.httpClient.post('intake-catalog', intakeCatalogCreate);
  }

  update(intakeCatalogCreate: IntakeCatalogCreate) {
    return this.httpClient.put('intake-catalog/update/' + intakeCatalogCreate.id, intakeCatalogCreate);
  }
}
