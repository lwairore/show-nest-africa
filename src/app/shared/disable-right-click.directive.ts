import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[snapDisableRightClick]'
})
export class DisableRightClickDirective {
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }

  constructor() { }

}
