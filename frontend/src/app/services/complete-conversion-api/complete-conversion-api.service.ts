import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompleteConversionCreation} from '../../shared/models/complete-conversion-creation.model';
import {CompleteConversion} from '../../shared/models/complete-conversion.model';

@Injectable({
  providedIn: 'root'
})
export class CompleteConversionApiService {

  constructor(private httpClient: HttpClient) {
  }

  convert(completeConversionCreation: CompleteConversionCreation) {
    return this.httpClient.post('complete-conversion', completeConversionCreation);
  }

  load() {
    return this.httpClient.get<CompleteConversion[]>('complete-conversion/list');
  }

  delete(id: number) {
    return this.httpClient.delete('complete-conversion/' + id);
  }

  restart(id: number) {
    return this.httpClient.post('complete-conversion/job/' + id, {});
  }

  kill(id: number) {
    return this.httpClient.post('complete-conversion/kill/' + id, {});
  }
}
