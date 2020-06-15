import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNivel2'
})
export class FilterNivel2Pipe implements PipeTransform {

  transform(value: any[], prop1: string, prop2: string, prop3: string, q: string) {
    
    if (!q || q === '') {
        return value;
    }
    return value.filter(item => -1 < item[prop1][prop2].toLowerCase().indexOf(q.toLowerCase()) ||
                                -1 < item[prop3].toLowerCase().indexOf(q.toLowerCase()));
}

}
