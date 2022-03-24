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

  typeOfTicket = Immutable.fromJS([]);

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  SUBMIT_EVENT_PARAM = SubmitEventParam;

  @ViewChild(ErrornoteComponent, { read: ErrornoteComponent })
  private _errornoteCmp: ErrornoteComponent | undefined;

  emailFieldValueChangesSubscription: Subscription | undefined;

  usernameFieldValueChangesSubscription: Subscription | undefined;

  phoneNumberFieldValueChangesSubscription: Subscription | undefined;

  costFieldValueChangesSubscription: Subscription | undefined;

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

    this._unsubscribeCostFieldValueChangesSubscription();

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

  private _unsubscribeCostFieldValueChangesSubscription() {
    if (this.costFieldValueChangesSubscription instanceof Subscription) {
      this.costFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _unsubscribeUsernameFieldValueChangesSubscription() {
    if (this.usernameFieldValueChangesSubscription instanceof Subscription) {
      this.usernameFieldValueChangesSubscription.unsubscribe();
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

    const TYPE_OF_TICKET$ = this._submitEvent
      .listTypeOfTicket$()
      .pipe(tap(details => {
        this.typeOfTicket = Immutable.fromJS(details);
      }))

    this._loadRequiredDetailsSubscription = forkJoin([
      SEO_DETAIL$, PROFILE_DETAIL$, TYPE_OF_TICKET$,
    ])
      .subscribe(_ => {
        if (!this.profileDetails.isEmpty()) {
          this._manuallyTriggerChangeDetection();
        }

      }, err => console.error(err));
  }

  private _prepopulateProfileFields() {
    const USERNAME = convertItemToString(
      this.profileDetails.get('username'));

    if (fieldValueHasBeenUpdated(
      this.SUBMIT_EVENT_PARAM.USERNAME.defaultValue,
      USERNAME)) {
      this.submitEventFormGroup?.get(
        this.SUBMIT_EVENT_PARAM.USERNAME.formControlName)
        ?.setValue(USERNAME);
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

      [this.SUBMIT_EVENT_PARAM.TYPE_OF_TICKET.formControlName]: [
        this.SUBMIT_EVENT_PARAM.TYPE_OF_TICKET.defaultValue, this.SUBMIT_EVENT_PARAM.TYPE_OF_TICKET.validators],

      [this.SUBMIT_EVENT_PARAM.USERNAME.formControlName]: [
        this.SUBMIT_EVENT_PARAM.USERNAME.defaultValue, this.SUBMIT_EVENT_PARAM.USERNAME.validators],

      [this.SUBMIT_EVENT_PARAM.EMAIL.formControlName]: [
        this.SUBMIT_EVENT_PARAM.EMAIL.defaultValue,
        this.SUBMIT_EVENT_PARAM.EMAIL.validators],

      [this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.formControlName]: [
        this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.defaultValue,
        this.SUBMIT_EVENT_PARAM.PHONE_NUMBER.validators],

      [this.SUBMIT_EVENT_PARAM.COST.formControlName]: [
        this.SUBMIT_EVENT_PARAM.COST.defaultValue,
        this.SUBMIT_EVENT_PARAM.COST.validators],

      [this.SUBMIT_EVENT_PARAM.POSTER.formControlName]: [
        this.SUBMIT_EVENT_PARAM.POSTER.defaultValue,
        this.SUBMIT_EVENT_PARAM.POSTER.validators],
    }, { updateOn: 'blur' });

    this.automaticallyCleanUpEmailField();

    this.automaticallyCleanUpCostField();

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
        this.SUBMIT_EVENT_PARAM.USERNAME.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        const exp = /[^\w.@+-]/;

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '')

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE)) {
          this.submitEventFormGroup?.get(
            this.SUBMIT_EVENT_PARAM.USERNAME.formControlName
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

  automaticallyCleanUpCostField(): void {
    this.costFieldValueChangesSubscription = this.submitEventFormGroup
      ?.get(
        this.SUBMIT_EVENT_PARAM.COST.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        const exp = /\D/g;

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '')

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE)) {
          this.submitEventFormGroup?.get(
            this.SUBMIT_EVENT_PARAM.COST.formControlName
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

    const typeOfTicket = convertItemToString(
      formGroupForEvent?.get(
        this.SUBMIT_EVENT_PARAM.TYPE_OF_TICKET.formControlName)?.value)?.trim();
    newMomentDetailsFormData.append(
      this.SUBMIT_EVENT_PARAM.TYPE_OF_TICKET.formControlName, typeOfTicket);

    const username = convertItemToString(
      formGroupForEvent?.get(
        this.SUBMIT_EVENT_PARAM.USERNAME.formControlName)?.value)?.trim();
    newMomentDetailsFormData.append(
      this.SUBMIT_EVENT_PARAM.USERNAME.formControlName, username);

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

    const cost = convertItemToString(
      formGroupForEvent?.get(
        this.SUBMIT_EVENT_PARAM.COST.formControlName)?.value)?.trim();
    newMomentDetailsFormData.append(
      this.SUBMIT_EVENT_PARAM.COST.formControlName, cost);

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

  public static readonly USERNAME = {
    formControlName: 'username',
    temporaryStoreKey: 'username',
    permanentStoreKey: 'username',
    isRequired: true,
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'What username would like to use?',
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide username.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your username correctly?',
      maxLengthPrefixErrorMessage: 'That username is too long. You need to shortern that username.',
      minLengthPrefixErrorMessage: 'That username is too short. You need to lengthen that username.',
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

  public static readonly TYPE_OF_TICKET = {
    formControlName: 'typeOfTicket',
    temporaryStoreKey: 'typeOfTicket',
    permanentStoreKey: 'typeOfTicket',
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'What is the type of the ticket?',
    defaultValue: '',
    isRequired: true,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide type of ticket.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your type of ticket correctly?',
      maxLengthPrefixErrorMessage: 'That type of ticket is too long. You need to shortern that type of ticket.',
      minLengthPrefixErrorMessage: 'That type of ticket is too short. You need to lengthen that type of ticket.'
    },
  };

  public static readonly COST = {
    formControlName: 'cost',
    temporaryStoreKey: 'cost',
    permanentStoreKey: 'cost',
    isRequired: true,
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern(/^[+\d()./N,*;#]{1,20}$/)
    ]),
    label: 'What is the cost per ticket (KES)?',
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide cost per ticket.',
      pattern: `Are you sure you entered the phone properly?`,
      maxlength: `That cost is too high.`,
    }
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
        formControlName: this.USERNAME.formControlName,
        temporaryStoreKey: this.USERNAME.temporaryStoreKey,
        permanentStoreKey: this.USERNAME.permanentStoreKey,
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
        formControlName: this.TYPE_OF_TICKET.formControlName,
        temporaryStoreKey: this.TYPE_OF_TICKET.temporaryStoreKey,
        permanentStoreKey: this.TYPE_OF_TICKET.permanentStoreKey
      },
      {
        formControlName: this.COST.formControlName,
        temporaryStoreKey: this.COST.temporaryStoreKey,
        permanentStoreKey: this.COST.permanentStoreKey
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
