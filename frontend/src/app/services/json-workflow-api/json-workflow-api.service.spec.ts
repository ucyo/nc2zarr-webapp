import { TestBed } from '@angular/core/testing';

import { JsonWorkflowApiService } from './json-workflow-api.service';

describe('JsonWorkflowApiService', () => {
  let service: JsonWorkflowApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonWorkflowApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
