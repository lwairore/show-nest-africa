import { Pipe, PipeTransform } from '@angular/core';
import { convertItemToString, stringIsEmpty } from '@sharedModule/utilities';

@Pipe({
  name: 'formatUrl'
})
export class FormatUrlPipe implements PipeTransform {
  STOP_CHARS = [' ', '/', '&'];

  transform(value: any, shortenToAbout = 50): unknown {
    const URL_TO_STRING = convertItemToString(value);

    if (stringIsEmpty(URL_TO_STRING)) {
      return '';
    }

    return this.shortUrl(URL_TO_STRING, shortenToAbout);
  }

  shortUrl(url: string, shortenToAbout: number) {
    const chunkLength = (shortenToAbout / 2);

    url = url.replace('http://', '').replace('https://', '');

    if (url.length <= shortenToAbout) { return url; }

    const startChunk = this.shortString(url, chunkLength, false);
    const endChunk = this.shortString(url, chunkLength, true);
    return startChunk + '...' + endChunk;
  }

  shortString(stringValue: string, shortenToAbout: number, reverse: boolean) {
    const acceptableShortness = shortenToAbout * 0.80; // When to start looking for stop characters

    stringValue = reverse ? stringValue.split('').reverse().join('') : stringValue;

    let shortString = '';

    for (var i = 0; i < shortenToAbout - 1; i++) {
      shortString += stringValue[i];

      if (i >= acceptableShortness && this.STOP_CHARS.indexOf(stringValue[i]) >= 0) {
        break;
      }
    }

    if (reverse) {
      return shortString.split('').reverse().join('');
    }

    return shortString;
  }
}
