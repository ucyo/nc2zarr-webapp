import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JsonWorkflow} from '../../shared/models/json-workflow.model';
import {JsonWorkflowCreation} from '../../shared/models/json-workflow-creation.model';

@Injectable({
  providedIn: 'root'
})
export class JsonWorkflowApiService {

  constructor(private httpClient: HttpClient) {
  }

  convert(jsonWorkflowCreation: JsonWorkflowCreation) {
    return this.httpClient.post('json-workflow', jsonWorkflowCreation);
  }

  loadWorkflows() {
    return this.httpClient.get<JsonWorkflow[]>('json-workflow/list');
  }

  delete(id: number) {
    return this.httpClient.delete('json-workflow/' + id);
  }

  restart(id: number) {
    return this.httpClient.post('json-workflow/job/' + id, {});
  }

  kill(id: number) {
    return this.httpClient.post('json-workflow/kill/' + id, {});
  }
}
