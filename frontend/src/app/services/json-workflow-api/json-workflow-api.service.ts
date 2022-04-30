import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JsonWorkflow} from '../../shared/models/json-workflow.model';

@Injectable({
  providedIn: 'root'
})
export class JsonWorkflowApiService {

  constructor(private httpClient: HttpClient) {
  }

  convert(name: string, input: string[], output: string) {
    return this.httpClient.post('json-workflow', {
      name: name,
      input: input,
      output: output
    });
  }

  loadWorkflows() {
    return this.httpClient.get<JsonWorkflow[]>('json-workflow/list');
  }

  delete(id: number) {
    return this.httpClient.delete('json-workflow/' + id);
  }
}
