import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNivel1'
})
export class FilterNivel1Pipe implements PipeTransform {

  transform(value: any[], prop1: string, prop2: string, q: string) {
    
    if (!q || q === '') {
        return value;
    }
    return value.filter(item => -1 < item[prop1].toLowerCase().indexOf(q.toLowerCase()) ||
                                -1 < item[prop2].toLowerCase().indexOf(q.toLowerCase()));
}

}
