import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {StartPageComponent} from './views/start-page/start-page.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {JsonWorkflowComponent} from './views/json-workflow/json-workflow.component';
import {CompleteConversionComponent} from './views/complete-conversion/complete-conversion.component';
import {APIInterceptor} from './services/api-interceptor/api-interceptor';
import {TreeviewModule} from '@filipve1994/ngx-treeview';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StartPageComponent,
    JsonWorkflowComponent,
    CompleteConversionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      positionClass: 'toast-bottom-left',
      maxOpened: 1,
      autoDismiss: true
    }),
    FormsModule,
    NgbModule,
    TreeviewModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
