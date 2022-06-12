import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPhoneNumber'
})
export class FormatPhoneNumberPipe implements PipeTransform {

  transform(value: string) {
    let cleaned = ('' + value).replace(/\D/g, '');

    //Check if the input is of correct
    const match = cleaned.match(/^(254|)?(\d{3})(\d{3})(\d*)$/);

    if (match) {
      //Remove the matched extension code
      //Change this to format for any country code.
      const intlCode = (match[1] ? '+254 ' : '');
      
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }

    return value;
  }

}
