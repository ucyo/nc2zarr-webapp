import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonWorkflowCreateComponent } from './json-workflow-create.component';

describe('JsonWorkflowCreateComponent', () => {
  let component: JsonWorkflowCreateComponent;
  let fixture: ComponentFixture<JsonWorkflowCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonWorkflowCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonWorkflowCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
