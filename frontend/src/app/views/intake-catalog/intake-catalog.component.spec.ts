import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeCatalogComponent } from './intake-catalog.component';

describe('IntakeCatalogComponent', () => {
  let component: IntakeCatalogComponent;
  let fixture: ComponentFixture<IntakeCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakeCatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
