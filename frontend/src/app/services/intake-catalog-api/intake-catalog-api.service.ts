import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IntakeCatalog} from '../../shared/models/intake-catalog.model';

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
}
