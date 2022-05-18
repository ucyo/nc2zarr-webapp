import {LOCALE_ID, NgModule} from '@angular/core';
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
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {JsonWorkflowOverviewComponent} from './components/json-workflow-overview/json-workflow-overview.component';
import {JsonWorkflowCreateComponent} from './components/json-workflow-create/json-workflow-create.component';
import {TruncatePipe} from './pipes/truncate-pipe/truncate.pipe';
import { CompleteConversionCreateComponent } from './components/complete-conversion-create/complete-conversion-create.component';
import { CompleteConversionOverviewComponent } from './components/complete-conversion-overview/complete-conversion-overview.component';

registerLocaleData(localeDe, localeDeExtra);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StartPageComponent,
    JsonWorkflowComponent,
    CompleteConversionComponent,
    JsonWorkflowOverviewComponent,
    JsonWorkflowCreateComponent,
    TruncatePipe,
    CompleteConversionCreateComponent,
    CompleteConversionOverviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
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
    }, {
      provide: LOCALE_ID,
      useValue: 'de'
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
