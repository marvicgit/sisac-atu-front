import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCombo'
})
export class FilterComboPipe implements PipeTransform {

  transform(value: any[], id: string, q: string) {
    
    if (!q || q === '') {
        return value;
    }
    return value.filter(item => -1 < item[id].toLowerCase().indexOf(q.toLowerCase()));
}

}
