import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Oauth2RoutingModule } from './oauth2-routing.module';
import { Oauth2Component } from './oauth2.component';
import { RedirectComponent } from './redirect/redirect.component';


@NgModule({
  declarations: [Oauth2Component, RedirectComponent],
  imports: [
    CommonModule,
    Oauth2RoutingModule
  ]
})
export class Oauth2Module { }
