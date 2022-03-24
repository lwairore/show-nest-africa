import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, HostBinding, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: 'a[href]'
})
export class ExternalLinkDirective implements OnChanges {
  @HostBinding('attr.rel') relAttr = '';
  @HostBinding('attr.target') targetAttr = '';
  @HostBinding('attr.href') hrefAttr = '';

  @Input() href = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private elementRef: ElementRef) { }

  ngOnChanges() {
    this.hrefAttr = this.href;

    if (this.isLinkExternal()) {
      this.relAttr = 'noopener';
      this.targetAttr = '_blank';
    }
  }

  private isLinkExternal() {
    return isPlatformBrowser(this.platformId) && !this.elementRef.nativeElement.hostname.includes(location.hostname);
  }

}
