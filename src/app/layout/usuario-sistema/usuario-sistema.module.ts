import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioSistemaRoutingModule } from './usuario-sistema-routing.module';
import { UsuarioSistemaComponent } from './usuario-sistema.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';


@NgModule({
  declarations: [UsuarioSistemaComponent],
  imports: [
    CommonModule,
    UsuarioSistemaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxUpperCaseDirectiveModule,
    SharedPipesModule,
    DirectivesModule
  ]
})
export class UsuarioSistemaModule { }
