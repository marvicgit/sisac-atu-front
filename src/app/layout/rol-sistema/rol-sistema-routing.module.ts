import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolSistemaComponent } from './rol-sistema.component';


const routes: Routes = [
  { path: '', component: RolSistemaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolSistemaRoutingModule { }
