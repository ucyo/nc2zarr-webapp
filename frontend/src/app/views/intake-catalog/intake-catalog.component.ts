import {Component, Input, OnInit} from '@angular/core';
import {IntakeCatalog} from '../../shared/models/intake-catalog.model';

@Component({
  selector: 'app-intake-catalog',
  templateUrl: './intake-catalog.component.html',
  styleUrls: ['./intake-catalog.component.scss']
})
export class IntakeCatalogComponent implements OnInit {

  currentIntakeCatalog: IntakeCatalog;

  constructor() { }

  ngOnInit(): void {
  }

}
