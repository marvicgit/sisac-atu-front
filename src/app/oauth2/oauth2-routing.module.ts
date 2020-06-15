import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedirectComponent } from './redirect/redirect.component';
import { Oauth2Component } from './oauth2.component';


const routes: Routes = [
  {
    path: '',
    component: Oauth2Component,
    children: [
        { path: 'redirect', component: RedirectComponent }
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Oauth2RoutingModule { }
