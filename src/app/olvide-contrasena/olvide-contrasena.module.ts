import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OlvideContrasenaRoutingModule } from './olvide-contrasena-routing.module';
import { FormsModule } from '@angular/forms';
import { OlvideContrasenaComponent } from './olvide-contrasena.component';


@NgModule({
  declarations: [OlvideContrasenaComponent],
  imports: [
    CommonModule,
    OlvideContrasenaRoutingModule,
    FormsModule
  ]
})
export class OlvideContrasenaModule { }
