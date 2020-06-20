import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolSistemaRoutingModule } from './rol-sistema-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolSistemaComponent } from './rol-sistema.component';


@NgModule({
  declarations: [RolSistemaComponent],
  imports: [
    CommonModule,
    RolSistemaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    HttpClientModule,
    SharedPipesModule,
    NgxUpperCaseDirectiveModule,
    DirectivesModule
  ]
})
export class RolSistemaModule { }
