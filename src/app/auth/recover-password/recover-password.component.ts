import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'snap-recover-password',
  templateUrl: './recover-password.component.html',
  styles: [
  ]
})
export class RecoverPasswordComponent implements OnInit {
  recoverPasswordFormGroup = this._formBuilder.group({});

  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

}
