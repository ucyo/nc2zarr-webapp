import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonWorkflowOverviewComponent } from './json-workflow-overview.component';

describe('JsonWorkflowOverviewComponent', () => {
  let component: JsonWorkflowOverviewComponent;
  let fixture: ComponentFixture<JsonWorkflowOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonWorkflowOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonWorkflowOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
