import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[snapClickStopPropagation]'
})
export class ClickStopPropagationDirective {
  @HostListener("click", ["$event"])
  public onClick(event: any) {
    event.stopPropagation();
  }

  constructor() { }

}
