import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { TokenInterceptor } from './shared/interceptors/token-interceptor';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { LoginService } from './login/login.service';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    // { provide: APP_BASE_HREF, useValue: '/sisac/' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
