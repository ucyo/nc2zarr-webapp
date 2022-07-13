import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeCatalogCreateComponent } from './intake-catalog-create.component';

describe('IntakeCatalogCreateComponent', () => {
  let component: IntakeCatalogCreateComponent;
  let fixture: ComponentFixture<IntakeCatalogCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakeCatalogCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeCatalogCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
