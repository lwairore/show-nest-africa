import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrornoteComponent } from '@sharedModule/components/errornote/errornote.component';
import { SafePipeDomSanitizerTypes } from '@sharedModule/consts';
import { ScrollService } from '@sharedModule/services';
import { SeoService } from '@sharedModule/services/seo.service';
import { constructInputFieldIdentification, convertItemToString, fieldValueHasBeenUpdated, getFormGroupOrFormArrayTotalNumberOfInvalidFields, REGEX_REPLACE_WITH, stringIsEmpty } from '@sharedModule/utilities';
import { MinCharacterNotGenuinelyAchievedValidator } from '@sharedModule/validators';
import * as Immutable from 'immutable';
import { SeoSocialShareService } from 'ngx-seo';
import { forkJoin, Subscription } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SubmitEventService } from './submit-event.service';

@Component({
  selector: 'snap-submit-event',
  templateUrl: './submit-event.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitEventComponent implements OnInit, AfterViewInit, OnDestroy {
  submitEventFormGroup: FormGroup | undefined;

  submitted = false;

  profileDetails = Immutable.fromJS({});

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  SUBMIT_EVENT_PARAM = SubmitEventParam;

  @ViewChild(ErrornoteComponent, { read: ErrornoteComponent })
  private _errornoteCmp: ErrornoteComponent | undefined;

  emailFieldValueChangesSubscription: Subscription | undefined;

  publicNameFieldValueChangesSubscription: Subscription | undefined;

  phoneNumberFieldValueChangesSubscription: Subscription | undefined;

  objectURLS = Immutable.fromJS([]);

  SafePipeDomSanitizerTypes = SafePipeDomSanitizerTypes;

  momentSubmittedSuccessfully = false;

  constructor(
    private _seoService: SeoService,
    private _submitEvent: SubmitEventService,
    private _scrollService: ScrollService,
    private _seoSocialShareService: SeoSocialShareService,
    private _location: Location,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  ngOnInit(): void {
    this._initializeSubmitEventFormGroup();
  }

  ngAfterViewInit(): void {
    this._loadRequiredDetails();
  }

  ngOnDestroy(): void {
    this._revokeObjectURLS();

    this._unsubscribeLoadRequiredDetailsSubscription();

    this._unsubscribeEmailFieldValueChangesSubscription();

    this._unsubscribeUsernameFieldValueChangesSubscription();

    this._unsubscribePhoneNumberFieldValueChangesSubscription();
  }

  private _revokeObjectURLS() {
    if (!this.objectURLS.isEmpty()) {
      for (const item of this.objectURLS) {
        const ITEM_URL = convertItemToString(
          item);

        if (stringIsEmpty(ITEM_URL)) {
          continue;
        }

        window.URL.revokeObjectURL(ITEM_URL);
      }
    }

    this.objectURLS = Immutable.fromJS([]);
  }

  private _unsubscribeUsernameFieldValueChangesSubscription() {
    if (this.publicNameFieldValueChangesSubscription instanceof Subscription) {
      this.publicNameFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _unsubscribePhoneNumberFieldValueChangesSubscription() {
    if (this.phoneNumberFieldValueChangesSubscription instanceof Subscription) {
      this.phoneNumberFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _unsubscribeEmailFieldValueChangesSubscription() {
    if (this.emailFieldValueChangesSubscription instanceof Subscription) {
      this.emailFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _unsubscribeLoadRequiredDetailsSubscription() {
    if (this._loadRequiredDetailsSubscription instanceof Subscription) {
      this._loadRequiredDetailsSubscription.unsubscribe();
    }
  }

  private _loadRequiredDetails() {
    const SEO_DETAIL$ = this._seoService
      .retrieveSubmitMomentSEODetails$()
      .pipe(
        tap(details => {
          this._seoSocialShareService.setData({
            title: details.title,
            keywords: details.keywords,
            description: details.description,
            image: details.image.src,
            imageAuxData: {
              width: details.image.width,
              height: details.image.height,
              secureUrl: details.image.src,
              alt: details.image.alt,
            },
            type: details.type,
            author: details.author,
            section: details.section,
            published: details.published,
            modified: details.modified,
            url: `${environment.hostURL}${this._location.path()}`,
          })
        }));

    const PROFILE_DETAIL$ = this._submitEvent
      .retrieveUserDetailsDetails$()
      .pipe(
        tap(details => {
          this.profileDetails = Immutable.fromJS(details);

          this._prepopulateProfileFields();
        }));

    this._loadRequiredDetailsSubscription = forkJoin([
      SEO_DETAIL$, PROFILE_DETAIL$,
    ])
      .subscribe(_ => {
        if (!this.profileDetails.isEmpty()) {
          this._manuallyTriggerChangeDetection();
        }

      }, err => console.error(err));
  }

  private _prepopulateProfileFields() {
    const PUBLIC_NAME = convertItemToString(
      this.profileDetails.get('username'));

    if (fieldValueHasBeenUpdated(
      this.SUBMIT_EVENT_PARAM.PUBLIC_NAME.defaultValue,
      PUBLIC_NAME)) {
      this.submitEventFormGroup?.get(
        this.SUBMIT_EVENT_PARAM.PUBLIC_NAME.formControlName)
        ?.setValue(PUBLIC_NAME);
    }

    const EMAIL = convertItemToString(
      this.profileDetails.get('email'));

    if (fieldValueHasBeenUpdated(
      this.SUBMIT_EVENT_PARAM.EMAIL.defaultValue,
      EMAIL)) {
      this.submitEventFormGroup?.get(
        this.SUBMIT_EVENT_PARAM.EMAIL.formControlName)
        ?.setValue(
          EMAIL);
    }

    const PHONE_NUMBER = this.profileDetails.get('phoneNumber');
    if (fieldValueHasBeenUpdated(
      this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.defaultValue,
      PHONE_NUMBER)) {
      this.submitEventFormGroup?.get(
        this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.formControlName)
        ?.setValue(PHONE_NUMBER);
    }
  }

  private _initializeSubmitEventFormGroup() {
    this.submitEventFormGroup = this._formBuilder.group({
      [this.SUBMIT_EVENT_PARAM.NAME_OF_EVENT.formControlName]: [
        this.SUBMIT_EVENT_PARAM.NAME_OF_EVENT.defaultValue,
        this.SUBMIT_EVENT_PARAM.NAME_OF_EVENT.validators],

      [this.SUBMIT_EVENT_PARAM.INSTAGRAM_USERNAME.formControlName]: [
        this.SUBMIT_EVENT_PARAM.INSTAGRAM_USERNAME.defaultValue,
        this.SUBMIT_EVENT_PARAM.INSTAGRAM_USERNAME.validators],

      [this.SUBMIT_EVENT_PARAM.PUBLIC_NAME.formControlName]: [
        this.SUBMIT_EVENT_PARAM.PUBLIC_NAME.defaultValue, this.SUBMIT_EVENT_PARAM.PUBLIC_NAME.validators],

      [this.SUBMIT_EVENT_PARAM.EMAIL.formControlName]: [
        this.SUBMIT_EVENT_PARAM.EMAIL.defaultValue,
        this.SUBMIT_EVENT_PARAM.EMAIL.validators],

      [this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.formControlName]: [
        this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.defaultValue,
        this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.validators],

      [this.SUBMIT_EVENT_PARAM.POSTER.formControlName]: [
        this.SUBMIT_EVENT_PARAM.POSTER.defaultValue,
        this.SUBMIT_EVENT_PARAM.POSTER.validators],
    }, { updateOn: 'blur' });

    this.automaticallyCleanUpEmailField();

    this.automaticallyCleanUpUsernameField();

    this.automaticallyCleanUpPhoneNumberField();
  }

  trackByForTypeOfTicket(index: number, moment: any) {
    return moment.get('id');
  }

  automaticallyCleanUpEmailField(): void {
    this.emailFieldValueChangesSubscription = this.submitEventFormGroup
      ?.get(
        this.SUBMIT_EVENT_PARAM.EMAIL.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        console.log({ value })
        const exp = new RegExp('\\s+', 'g');

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '');

        console.log({ CLEANED_VALUE })

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE, false)) {
          this.submitEventFormGroup?.get(
            this.SUBMIT_EVENT_PARAM.EMAIL.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }

  automaticallyCleanUpUsernameField(): void {
    this.emailFieldValueChangesSubscription = this.submitEventFormGroup
      ?.get(
        this.SUBMIT_EVENT_PARAM.PUBLIC_NAME.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        const exp = /[^\w.@+-]/;

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '')

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE)) {
          this.submitEventFormGroup?.get(
            this.SUBMIT_EVENT_PARAM.PUBLIC_NAME.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }

  automaticallyCleanUpPhoneNumberField(): void {
    this.phoneNumberFieldValueChangesSubscription = this.submitEventFormGroup
      ?.get(
        this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        const exp = /\D/g;

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '')

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE)) {
          this.submitEventFormGroup?.get(
            this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }

  private _showErrorNote(totalInvalidFormControls: number | undefined, errorMessage = '') {
    if (!(this._errornoteCmp instanceof ErrornoteComponent)) { return; }

    this._errornoteCmp.showErrorNote(totalInvalidFormControls, errorMessage);
    this._errornoteCmp.manuallyTriggerChangeDetection();
  }


  fileBrowseHandler(event: any) {
    console.log("event")
    console.log(event.target.files)
    this._prepareFilesList(event.target.files);
  }

  private _resetErrornote() {
    if (this._errornoteCmp instanceof ErrornoteComponent) {
      this._errornoteCmp.resetTotalInvalidControlsAndErrorMessage();
    }
  }

  private _prepareFilesList(files: FileList) {
    this._resetErrornote();

    this._revokeObjectURLS();

    const file = files.item(0);

    if (!(file instanceof File)) { return; }

    const mimeType = file.type;
    if (mimeType.match(/image\/*/) === null) {
      // Only images are supported
      this._scrollService.scrollToPosition(0, 0);
      this._showErrorNote(undefined, 'Only images are supported');
      return;
    }

    const objectURL = window.URL.createObjectURL(file);

    const NEW_VAL = Immutable.fromJS(objectURL);

    this.objectURLS = Immutable.mergeDeep(
      this.objectURLS, NEW_VAL);

    console.log({ NEW_VAL })

    console.log("this.objectURLS")
    console.log(this.objectURLS)

    this.submitEventFormGroup?.get(
      this.SUBMIT_EVENT_PARAM.POSTER.formControlName)
      ?.setValue(file);
  }

  private _resetFormGroupFields() {
    const FIELDS = this.SUBMIT_EVENT_PARAM.constructFields();

    for (const FIELD of FIELDS) {
      this.submitEventFormGroup
        ?.get(FIELD.formControlName)?.reset();
    }
  }

  addAnotherMoment() {
    this.momentSubmittedSuccessfully = false;

    this._initializeSubmitEventFormGroup();

    this._prepopulateProfileFields();
  }

  onSubmit = (formGroupForEvent: FormGroup): Promise<any> => {
    this.submitted = true;

    // stop here if form is invalid
    if (formGroupForEvent.invalid) {
      const totalInvalidFormControls = getFormGroupOrFormArrayTotalNumberOfInvalidFields(
        formGroupForEvent);

      console.log({ totalInvalidFormControls })

      this._showErrorNote(totalInvalidFormControls);

      this._scrollService.scrollToPosition(0, 0);

      return Promise.resolve('Form is invalid. Aborting');
    }

    const newMomentDetailsFormData = new FormData();

    const nameOfMoment = convertItemToString(
      formGroupForEvent?.get(
        this.SUBMIT_EVENT_PARAM.NAME_OF_EVENT.formControlName)?.value)?.trim();
    newMomentDetailsFormData.append(
      this.SUBMIT_EVENT_PARAM.NAME_OF_EVENT.formControlName, nameOfMoment);

    const instagramUsername = convertItemToString(
      formGroupForEvent?.get(
        this.SUBMIT_EVENT_PARAM.INSTAGRAM_USERNAME.formControlName)?.value)?.trim();
    newMomentDetailsFormData.append(
      this.SUBMIT_EVENT_PARAM.INSTAGRAM_USERNAME.formControlName, instagramUsername);

    const publicName = convertItemToString(
      formGroupForEvent?.get(
        this.SUBMIT_EVENT_PARAM.PUBLIC_NAME.formControlName)?.value)?.trim();
    newMomentDetailsFormData.append(
      this.SUBMIT_EVENT_PARAM.PUBLIC_NAME.formControlName, publicName);

    const email = convertItemToString(
      formGroupForEvent?.get(
        this.SUBMIT_EVENT_PARAM.EMAIL.formControlName)?.value)?.trim();
    newMomentDetailsFormData.append(
      this.SUBMIT_EVENT_PARAM.EMAIL.formControlName, email);

    const phoneNumber = convertItemToString(
      formGroupForEvent?.get(
        this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.formControlName)?.value)?.trim();
    newMomentDetailsFormData.append(
      this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.formControlName, phoneNumber);

    const poster = formGroupForEvent?.get(
      this.SUBMIT_EVENT_PARAM.POSTER.formControlName)?.value;
    newMomentDetailsFormData.append(
      this.SUBMIT_EVENT_PARAM.POSTER.formControlName, poster);

    const savePromise = this._submitEvent
      .submitMoment$(newMomentDetailsFormData).toPromise();

    savePromise.then(
      _ => {
        this._resetFormGroupFields();

        this._revokeObjectURLS();

        this.submitted = false;

        this.momentSubmittedSuccessfully = true;

        this._manuallyTriggerChangeDetection();
      },
      (err) => {
        console.error(err);
        this.submitted = false;
        const totalInvalidFormControls = getFormGroupOrFormArrayTotalNumberOfInvalidFields(
          formGroupForEvent);
        this._showErrorNote(totalInvalidFormControls);

        this._scrollService.scrollToPosition(0, 0);

        this._manuallyTriggerChangeDetection();
      }
    );
    return savePromise;
  }
}

class SubmitEventParam {
  public static readonly NAME_OF_FORM_GROUP = 'submitEventFormGroup';

  public static readonly PUBLIC_NAME = {
    formControlName: 'publicName',
    temporaryStoreKey: 'publicName',
    permanentStoreKey: 'publicName',
    isRequired: true,
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'What name do fans know you by?',
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide public name.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your public name correctly?',
      maxLengthPrefixErrorMessage: 'That public name is too long. You need to shortern that public name.',
      minLengthPrefixErrorMessage: 'That public name is too short. You need to lengthen that public name.',
    },
  };

  public static readonly EMAIL = {
    formControlName: 'email',
    temporaryStoreKey: 'email',
    permanentStoreKey: 'email',
    validators: Validators.compose([
      Validators.required,
      Validators.email,
    ]),
    label: 'What is your email address?',
    defaultValue: '',
    isRequired: true,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide email address.',
      emailErrorMessage: 'Are you sure you entered your email correctly?',
    }
  };

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
    label: 'What is your phone number?',
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide phone number.',
      pattern: `Are you sure you entered the phone properly?`,
      maxlength: `Phone number should not exceed 20 chars long.`,
    }
  };

  public static readonly NAME_OF_EVENT = {
    formControlName: 'nameOfMoment',
    temporaryStoreKey: 'nameOfMoment',
    permanentStoreKey: 'nameOfMoment',
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'What is the name of the event?',
    defaultValue: '',
    isRequired: true,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide name of event.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your name of event correctly?',
      maxLengthPrefixErrorMessage: 'That name of event is too long. You need to shortern that name of event.',
      minLengthPrefixErrorMessage: 'That name of event is too short. You need to lengthen that name of event.'
    },
  };

  public static readonly INSTAGRAM_USERNAME = {
    formControlName: 'instagramUsername',
    temporaryStoreKey: 'instagramUsername',
    permanentStoreKey: 'instagramUsername',
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'What is your instagram username?',
    defaultValue: '',
    isRequired: true,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide instagram username .',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your instagram username  correctly?',
      maxLengthPrefixErrorMessage: 'That instagram username  is too long. You need to shortern that instagram username .',
      minLengthPrefixErrorMessage: 'That instagram username  is too short. You need to lengthen that instagram username .'
    },
  };

  static readonly POSTER = {
    formControlName: 'poster',
    temporaryStoreKey: 'poster',
    permanentStoreKey: 'poster',
    validators: null,
    defaultValue: '',
    isRequired: false,
    slug: constructInputFieldIdentification,
    errors: null,
  };


  public static constructFields() {
    const fields = [
      {
        formControlName: this.PUBLIC_NAME.formControlName,
        temporaryStoreKey: this.PUBLIC_NAME.temporaryStoreKey,
        permanentStoreKey: this.PUBLIC_NAME.permanentStoreKey,
      },
      {
        formControlName: this.EMAIL.formControlName,
        temporaryStoreKey: this.EMAIL.temporaryStoreKey,
        permanentStoreKey: this.EMAIL.permanentStoreKey
      },
      {
        formControlName: this.PHONE_NUMBER.formControlName,
        temporaryStoreKey: this.PHONE_NUMBER.temporaryStoreKey,
        permanentStoreKey: this.PHONE_NUMBER.permanentStoreKey
      },
      {
        formControlName: this.NAME_OF_EVENT.formControlName,
        temporaryStoreKey: this.NAME_OF_EVENT.temporaryStoreKey,
        permanentStoreKey: this.NAME_OF_EVENT.permanentStoreKey
      },
      {
        formControlName: this.POSTER.formControlName,
        temporaryStoreKey: this.POSTER.temporaryStoreKey,
        permanentStoreKey: this.POSTER.permanentStoreKey
      },
    ];

    return fields;
  }
}
