import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { constructInputFieldIdentification, getFormGroupOrFormArrayTotalNumberOfInvalidFields, convertItemToString } from '@sharedModule/utilities';
import { ErrornoteComponent } from '@sharedModule/components/errornote/errornote.component';
import { ScrollService } from '@sharedModule/services';
import { ChangePasswordService } from './services';
import { BreadcrumbComponent } from '@sharedModule/components/breadcrumb/breadcrumb.component';
import * as Immutable from 'immutable';

@Component({
  selector: 'snap-change-password',
  templateUrl: './change-password.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
  changePasswordFormGroup: FormGroup | undefined;

  submitted = false;

  showPassword = false;

  displayingSection = 'changePassword';

  CHANGE_PASSWORD_PARAM = ChangePasswordParam;

  @ViewChild(BreadcrumbComponent, { read: BreadcrumbComponent })
  private _breadcrumbCmpElRef: ElementRef | undefined;

  @ViewChild(ErrornoteComponent, { read: ErrornoteComponent })
  private _errornoteCmp: ErrornoteComponent | undefined;

  constructor(
    private _formBuilder: FormBuilder,
    private _scrollService: ScrollService,
    private _changePasswordService: ChangePasswordService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this._initializeChangePasswordFormGroup();
  }

  ngAfterViewInit() {
    this._setBreadcrumbDetails();
  }

  private _setBreadcrumbDetails() {
    const breadcrumbDetails = Immutable.fromJS({
      poster: {
        src: 'assets/images/background/asset-25.jpeg'
      },
    });

    if (this._breadcrumbCmpElRef instanceof BreadcrumbComponent) {
      this._breadcrumbCmpElRef.breadcrumbDetails = breadcrumbDetails;

      if (!this._breadcrumbCmpElRef.breadcrumbDetails.isEmpty()) {
        this._breadcrumbCmpElRef.manuallyTriggerChangeDetection();
      }
    }
  }

  private _initializeChangePasswordFormGroup() {
    this.changePasswordFormGroup = this._formBuilder.group({
      [this.CHANGE_PASSWORD_PARAM.NEW_PASSWORD.formControlName]: [
        this.CHANGE_PASSWORD_PARAM.NEW_PASSWORD.defaultValue,
        this.CHANGE_PASSWORD_PARAM.NEW_PASSWORD.validators],

    }, { updateOn: 'blur' });
  }

  setToSection(section: string) {
    this.displayingSection = section;
  }

  private _resetErrornote() {
    if (this._errornoteCmp instanceof ErrornoteComponent) {
      this._errornoteCmp.resetTotalInvalidControlsAndErrorMessage();
    }
  }

  private _showErrorNote(totalInvalidFormControls: number | undefined, errorMessage = '') {
    if (!(this._errornoteCmp instanceof ErrornoteComponent)) { return; }

    this._errornoteCmp.showErrorNote(totalInvalidFormControls, errorMessage);
    this._errornoteCmp.manuallyTriggerChangeDetection();
  }

  private _resetFormGroupFields() {
    const FIELDS = this.CHANGE_PASSWORD_PARAM.constructFields();

    for (const FIELD of FIELDS) {
      this.changePasswordFormGroup
        ?.get(FIELD.formControlName)?.reset();
    }
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }

  onSubmit = (formGroup: FormGroup) => {
    if (this.displayingSection !== 'changePassword') {
      this.setToSection('changePassword');
    }

    this.submitted = true;

    this._resetErrornote();

    if (formGroup.invalid) {
      const totalInvalidFormControls = getFormGroupOrFormArrayTotalNumberOfInvalidFields(
        formGroup);

      this._showErrorNote(totalInvalidFormControls);

      this._backToTop();

      return Promise.resolve('Form is invalid. Aborting');
    }

    const formData = new FormData();

    const newPassword = convertItemToString(
      formGroup.get(
        this.CHANGE_PASSWORD_PARAM.NEW_PASSWORD.formControlName)?.value);
    formData.append(
      this.CHANGE_PASSWORD_PARAM.NEW_PASSWORD.permanentStoreKey,
      newPassword);

    const savePromise = this._changePasswordService
      .changePassword$(formData)
      .toPromise();

    savePromise.then(
      _ => {
        this.submitted = false;

        this.setToSection('passwordUpdatedSuccessfully');

        this._resetFormGroupFields();

        this._backToTop();

        this._manuallyTriggerChangeDetection();
      }
    )

    return savePromise;
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }
}

class ChangePasswordParam {
  public static readonly NAME_OF_FORM_GROUP = 'changePasswordFormGroup';

  public static readonly NEW_PASSWORD = {
    formControlName: 'newPassword',
    temporaryStoreKey: 'newPassword',
    permanentStoreKey: 'newPassword',
    validators: Validators.compose([
      Validators.required,
      Validators.minLength(1),
    ]),
    label: 'New password',
    isRequired: true,
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide a password for your account.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered password correctly?',
      minLengthPrefixErrorMessage: 'That password is too short. You need to lengthen it.'
    }
  };

  public static constructFields() {
    const fields = [
      {
        formControlName: this.NEW_PASSWORD.formControlName,
        temporaryStoreKey: this.NEW_PASSWORD.temporaryStoreKey,
        permanentStoreKey: this.NEW_PASSWORD.permanentStoreKey,
      },
    ];

    return fields;
  }
}