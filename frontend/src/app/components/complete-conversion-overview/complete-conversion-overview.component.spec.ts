import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteConversionOverviewComponent } from './complete-conversion-overview.component';

describe('CompleteConversionOverviewComponent', () => {
  let component: CompleteConversionOverviewComponent;
  let fixture: ComponentFixture<CompleteConversionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteConversionOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteConversionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
