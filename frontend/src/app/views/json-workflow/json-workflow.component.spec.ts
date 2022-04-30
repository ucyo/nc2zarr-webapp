import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonWorkflowComponent } from './json-workflow.component';

describe('JsonWorkflowComponent', () => {
  let component: JsonWorkflowComponent;
  let fixture: ComponentFixture<JsonWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
