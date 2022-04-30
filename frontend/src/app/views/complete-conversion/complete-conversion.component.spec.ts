import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteConversionComponent } from './complete-conversion.component';

describe('CompleteConversionComponent', () => {
  let component: CompleteConversionComponent;
  let fixture: ComponentFixture<CompleteConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteConversionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
