import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteConversionCreateComponent } from './complete-conversion-create.component';

describe('CompleteConversionCreateComponent', () => {
  let component: CompleteConversionCreateComponent;
  let fixture: ComponentFixture<CompleteConversionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteConversionCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteConversionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
