import { TestBed } from '@angular/core/testing';

import { CompleteConversionApiService } from './complete-conversion-api.service';

describe('CompleteConversionApiService', () => {
  let service: CompleteConversionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompleteConversionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
