import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CambiarContrasenaRoutingModule } from './cambiar-contrasena-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CambiarContrasenaComponent } from './cambiar-contrasena.component';


@NgModule({
  declarations: [CambiarContrasenaComponent],
  imports: [
    CommonModule,
    CambiarContrasenaRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CambiarContrasenaModule { }
