import {NgModule} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterModule, Routes} from '@angular/router';
import {JsonWorkflowComponent} from './views/json-workflow/json-workflow.component';
import {CompleteConversionComponent} from './views/complete-conversion/complete-conversion.component';
import {IntakeCatalogComponent} from './views/intake-catalog/intake-catalog.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/json-workflow',
    pathMatch: 'full',
  },
  {
    path: 'json-workflow',
    pathMatch: 'full',
    component: JsonWorkflowComponent,
  },
  {
    path: 'complete-conversion',
    pathMatch: 'full',
    component: CompleteConversionComponent,
  },
  {
    path: 'intake-catalog',
    pathMatch: 'full',
    component: IntakeCatalogComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

    this.router.events.subscribe(event => {

      if (!(event instanceof NavigationEnd)) {
        return;
      }

      let route = this.activatedRoute;

      while (route.firstChild) {
        route = route.firstChild;
      }

      if (route.outlet !== 'primary') {
        return;
      }
    });
  }
}
