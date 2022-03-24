import { Pipe, PipeTransform } from '@angular/core';
import { stringIsEmpty } from './utilities';

@Pipe({
  name: 'pluralSingular'
})
export class PluralSingularPipe implements PipeTransform {

  transform(number: number, singularText: string, pluralText = ''): string {
    let pluralWord = stringIsEmpty(pluralText) ? `${singularText}s` : pluralText;

    return number > 1 ? `${number} ${pluralWord}` : `${number} ${singularText}`;
  }

}
