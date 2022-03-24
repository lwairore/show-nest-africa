import { Pipe, PipeTransform } from '@angular/core';
import { convertItemToString } from '@sharedModule/utilities';

@Pipe({
  name: 'intToRGB'
})
export class IntToRGBPipe implements PipeTransform {

  transform(value: any) {
    value = convertItemToString(value);

    return this.intToRGB(
      this.hashCode(value));
  }

  private hashCode(value: string) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  private intToRGB(i: number) {
    let c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }


}
