import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioSistemaComponent } from './usuario-sistema.component';


const routes: Routes = [
  { path: '', component: UsuarioSistemaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioSistemaRoutingModule { }
