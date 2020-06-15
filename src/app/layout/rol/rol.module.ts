import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolRoutingModule } from './rol-routing.module';
import { RolComponent } from './rol.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';


@NgModule({
  declarations: [RolComponent],
  imports: [
    CommonModule,
    RolRoutingModule,
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
export class RolModule { }
