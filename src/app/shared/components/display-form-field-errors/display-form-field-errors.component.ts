import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'snap-display-form-field-errors',
  templateUrl: './display-form-field-errors.component.html',
  styles: []
})
export class DisplayFormFieldErrorsComponent implements OnInit {
  @Input() formGroupElement: FormGroup | undefined = undefined;
  @Input() submitted: boolean | undefined;
  @Input() requiredOrNullOrNoValueProvidedErrorMessage: string | undefined;
  @Input() minCharacterNotGenuinelyAchievedErrorMessage: string | undefined;
  @Input() maxLengthPrefixErrorMessage: string | undefined;
  @Input() minLengthPrefixErrorMessage: string | undefined;
  @Input() associationDoesNotExistErrorMessage: string | undefined;
  @Input() doesNotExistErrorMessage: string | undefined;
  @Input() maxErrorMessage: string | undefined;
  @Input() maxValueErrorMessage: string | undefined;
  @Input() invalidErrorMessage: string | undefined;
  @Input() minErrorMessage: string | undefined;
  @Input() minValueErrorMessage: string | undefined;
  @Input() emailErrorMessage: string | undefined;
  @Input() incorrectPasswordErrorMessage: string | undefined;
  @Input() invalidSelectFieldErrorMessage: string | undefined;
  @Input() cannotContainSpaceErrorMessage: string | undefined;
  @Input() patternErrorMessage: string | undefined;
  @Input() emailHasBeenTakenErrorMessage: string | undefined;
  @Input() phoneNumberHasBeenTakenErrorMessage: string | undefined;
  @Input() usernameHasBeenTakenErrorMessage: string | undefined;
  @Input() incorrectCredentialsErrorMessage: string | undefined;

  constructor() { }

  ngOnInit() {
  }

}
