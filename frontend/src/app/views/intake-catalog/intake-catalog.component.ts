import {Component, OnInit} from '@angular/core';
import {IntakeCatalogCreate} from '../../shared/models/intake-catalog/intake-catalog.create.model';

@Component({
  selector: 'app-intake-catalog',
  templateUrl: './intake-catalog.component.html',
  styleUrls: ['./intake-catalog.component.scss']
})
export class IntakeCatalogComponent implements OnInit {

  intakeCatalogCreate: IntakeCatalogCreate;

  constructor() {
  }

  ngOnInit(): void {
  }

}
