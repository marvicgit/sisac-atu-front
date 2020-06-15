import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuncionalidadComponent } from './funcionalidad.component';


const routes: Routes = [
  { path: '', component: FuncionalidadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionalidadRoutingModule { }
