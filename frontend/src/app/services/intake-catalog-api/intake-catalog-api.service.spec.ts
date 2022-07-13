import { TestBed } from '@angular/core/testing';

import { IntakeCatalogApiService } from './intake-catalog-api.service';

describe('IntakeCatalogApiService', () => {
  let service: IntakeCatalogApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntakeCatalogApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
