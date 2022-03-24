import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { SafePipeDomSanitizerTypes } from '@sharedModule/consts';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) { }
  public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case SafePipeDomSanitizerTypes.HTML: return this.sanitizer.bypassSecurityTrustHtml(value);

      case SafePipeDomSanitizerTypes.STYLE: return this.sanitizer.bypassSecurityTrustStyle(value);

      case SafePipeDomSanitizerTypes.SCRIPT: return this.sanitizer.bypassSecurityTrustScript(value);

      case SafePipeDomSanitizerTypes.URL: return this.sanitizer.bypassSecurityTrustUrl(value);

      case SafePipeDomSanitizerTypes.RESOURCE_URL: return this.sanitizer.bypassSecurityTrustResourceUrl(value);

      default: throw new Error(`Invalid safe type specified: ${type}`);

    }

  }

}
