import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {PivInterceptorService} from './interceptor/piv-interceptor.service';
import {BootstrappingService} from './services/bootstrapping.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, RouterModule, HttpClientModule],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS,useClass: PivInterceptorService,multi: true},
    {
      provide: APP_INITIALIZER,
      useFactory: (bootstrappingService: BootstrappingService) =>
        () => bootstrappingService.initApp(),
      deps: [BootstrappingService],
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
