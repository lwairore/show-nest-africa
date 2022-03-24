import { Pipe, PipeTransform } from '@angular/core';
import { generateFakeObjectArray } from '@sharedModule/utilities/generate-fake-objects.util';

@Pipe({
  name: 'generateFakeObjects'
})
export class GenerateFakeObjectsPipe implements PipeTransform {

  transform(value: number) {
    return generateFakeObjectArray(value);
  }

}
