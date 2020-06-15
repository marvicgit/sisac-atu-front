import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterNivel2Pipe } from './filter-nivel2.pipe';
import { FilterNivel1Pipe } from './filter-nivel1.pipe';
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [FilterNivel1Pipe, FilterNivel2Pipe, ImagenPipe],
  imports: [
    CommonModule
  ],
  exports: [FilterNivel1Pipe, FilterNivel2Pipe, ImagenPipe]
})
export class SharedPipesModule { }
