import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constructInputFieldIdentification, convertItemToString, fieldValueHasBeenUpdated, REGEX_REPLACE_WITH, stringIsEmpty } from '@sharedModule/utilities';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'snap-m-pesa',
  templateUrl: './m-pesa.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MPesaComponent implements OnInit, OnDestroy {
  @ViewChild('submitElRef', { read: ElementRef })
  private _submitElRef: ElementRef | undefined;

  mpesaFormGroup: FormGroup | undefined;

  MPESA_PARAM = MpesaParam;

  private _phoneNumberFieldValueChangesSubscription: Subscription | undefined;

  submitted = false;

  @Output() formSubmitted = new EventEmitter<string>();

  constructor(
    private _renderer2: Renderer2,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this._initializeMpesaFormGroup();
  }

  ngOnDestroy() {
    this._unsubscribePhoneNumberFieldValueChangesSubscription();
  }

  private _unsubscribePhoneNumberFieldValueChangesSubscription() {
    if (this._phoneNumberFieldValueChangesSubscription instanceof Subscription) {
      this._phoneNumberFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _initializeMpesaFormGroup() {
    this.mpesaFormGroup = this._formBuilder
      .group({
        [this.MPESA_PARAM.PHONE_NUMBER.formControlName]: [
          this.MPESA_PARAM.PHONE_NUMBER.defaultValue,
          this.MPESA_PARAM.PHONE_NUMBER.validators],
      });

    this._automaticallyCleanUpPhoneNumberField();
  }

  private _automaticallyCleanUpPhoneNumberField() {
    this._phoneNumberFieldValueChangesSubscription = this.mpesaFormGroup
      ?.get(
        this.MPESA_PARAM.PHONE_NUMBER.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        const exp = /\D/g;

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '')

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE)) {
          this.mpesaFormGroup?.get(
            this.MPESA_PARAM.PHONE_NUMBER.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }

  updateSubmitBtnCta(value: string) {
    if (this._submitElRef instanceof ElementRef) {
      this._renderer2.setProperty(
        this._submitElRef.nativeElement, 'value', value);
    }
  }

  submit() {
    if (
      !(this.mpesaFormGroup instanceof FormGroup)) {
      return;
    }

    if (this.mpesaFormGroup?.invalid) {
      return;
    }

    const phoneNumber = convertItemToString(
      this.mpesaFormGroup
        .get(this.MPESA_PARAM.PHONE_NUMBER.formControlName)
        ?.value);

    if (stringIsEmpty(phoneNumber)) {
      return;
    }

    this._emitEventFormSubmitted(phoneNumber);
  }

  private _emitEventFormSubmitted(phoneNumber: string) {
    this.formSubmitted.emit(phoneNumber);
  }
}

class MpesaParam {
  public static readonly NAME_OF_FORM_GROUP = 'mpesaFormGroup';

  public static readonly PHONE_NUMBER = {
    formControlName: 'phoneNumber',
    temporaryStoreKey: 'phoneNumber',
    permanentStoreKey: 'phoneNumber',
    isRequired: true,
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern(/^[+\d()./N,*;#]{1,20}$/)
    ]),
    label: 'Enter Safaricom M-PESA registered Mobile Number',
    defaultValue: '',
    placeholder: 'Enter phone number',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide phone number.',
      pattern: `Are you sure you entered the phone properly?`,
      maxlength: `Phone number should not exceed 20 chars long.`,
    }
  };

  public static constructFields() {
    const fields = [
      {
        formControlName: this.PHONE_NUMBER.formControlName,
        temporaryStoreKey: this.PHONE_NUMBER.temporaryStoreKey,
        permanentStoreKey: this.PHONE_NUMBER.permanentStoreKey
      },
    ];

    return fields;
  }
}