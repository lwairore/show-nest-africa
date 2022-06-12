import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'snap-recover-password',
  templateUrl: './recover-password.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoverPasswordComponent implements OnInit {
  // recoverPasswordFormGroup = this._formBuilder.group({});

  constructor(
  ) { }

  ngOnInit() {
  }

}
