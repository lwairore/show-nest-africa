import { Directive, Input, ElementRef, Renderer2, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[snapDynamicallySetHeightUsingScrollHeight]'
})
export class DynamicallySetHeightUsingScrollHeightDirective implements OnInit {
  @Input() maximumHeight = 200; // based on pixel

  @Input() minHeight = 43; // based on pixel

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.adjustHeight();
  }

  @HostListener('input', ['$event.target'])
  @HostListener('cut', ['$event.target'])
  @HostListener('paste', ['$event.target'])
  @HostListener('change', ['$event.target'])

  adjustHeight() {
    const element = this.el.nativeElement;

    this.renderer.setStyle(element, 'height',
      `${this.minHeight}px`);

    this.renderer.setStyle(element, 'height',
      `${element.scrollHeight}px`);

    if (element.scrollHeight <= this.maximumHeight) {
      this.renderer.setStyle(element, 'overflow-y',
        'hidden');

      delete element.style.maxHeight
    } else {
      this.renderer.setStyle(element, 'overflow-y',
        'scroll');

      this.renderer.setStyle(element, 'max-height',
        `${this.maximumHeight}px`);

    }
  }
}
