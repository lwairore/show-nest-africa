import { Directive, Input } from '@angular/core';
import { FormControl, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { convertItemToString } from '@sharedModule/utilities';
import { of } from 'rxjs';

@Directive({
  selector: '[snapHasBeenTaken][formControlName]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: HasBeenTakenDirective, multi: true
  }]
})
export class HasBeenTakenDirective {
  @Input() snapHasBeenTaken!: string;
  @Input() validateFunction!: (value: string) => Promise<boolean>;

  constructor() { }

  validate(control: FormControl): { [key: string]: any } {
    const value = convertItemToString(control.value);

    console.log({value})

    if (control.touched || !control.pristine) {
      return this.validateFunction(value).then((result: boolean) => {
        if (result) {
          return null;
        }
        else {
          const error: any = [];
          error[this.snapHasBeenTaken] = true;
          return error;
        }
      });
    }
    return of(null);

  }


}
