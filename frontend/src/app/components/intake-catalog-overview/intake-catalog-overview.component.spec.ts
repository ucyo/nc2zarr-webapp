import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeCatalogOverviewComponent } from './intake-catalog-overview.component';

describe('IntakeCatalogOverviewComponent', () => {
  let component: IntakeCatalogOverviewComponent;
  let fixture: ComponentFixture<IntakeCatalogOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakeCatalogOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeCatalogOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
