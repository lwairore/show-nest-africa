import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralSingular'
})
export class PluralSingularPipe implements PipeTransform {

  transform(number: number, singularText: string, pluralText: string = null): string {
    let pluralWord = pluralText ? pluralText : `${singularText}s`;
    return number > 1 ? `${number} ${pluralWord}` : `${number} ${singularText}`;
  }

}
