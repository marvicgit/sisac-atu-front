import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecuperarRoutingModule } from './recuperar-routing.module';
import { RecuperarComponent } from './recuperar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [RecuperarComponent],
  imports: [
    CommonModule,
    RecuperarRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RecuperarModule { }
