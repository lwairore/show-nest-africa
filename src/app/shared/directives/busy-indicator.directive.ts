import { Directive, HostBinding } from '@angular/core';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[snapBusyIndicator]'
})
export class BusyIndicatorDirective {
  private get validating(): boolean {
    return this.formControlName.control != null && this.formControlName.control.pending;
  }

  @HostBinding('style.borderWidth') get controlBorderWidth():
    string { return this.validating ? '3px' : ''; }
  @HostBinding('style.borderColor') get controlBorderColor():
    string { return this.validating ? 'gray' : ''; }


  constructor(private formControlName: FormControlName) { }

}
