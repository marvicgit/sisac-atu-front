import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string): any {
    let url = `${environment.HOST_URL}/usuarios/downloadFile/` + img;
    if (!img) {
      return 'assets/images/default-foto.png';
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }
    return url;
  }

}
