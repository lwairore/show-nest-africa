import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as Immutable from 'immutable';
import { Subscription, of } from 'rxjs';
import { constructInputFieldIdentification, REGEX_REPLACE_WITH, fieldValueHasBeenUpdated, stringIsEmpty, convertItemToString, getFormGroupOrFormArrayTotalNumberOfInvalidFields } from '@sharedModule/utilities';
import { MinCharacterNotGenuinelyAchievedValidator } from '@sharedModule/validators';
import { ErrornoteComponent } from '@sharedModule/components/errornote/errornote.component';
import { ScrollService, AuthenticationService } from '@sharedModule/services';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { HasBeenTakenHttpResponse } from '@sharedModule/custom-types';
import { SafePipeDomSanitizerTypes } from '@sharedModule/consts';
import { UserProfileService } from './services';
import { BreadcrumbComponent } from '@sharedModule/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'snap-profile-info',
  templateUrl: './profile-info.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  profileFormGroup: FormGroup | undefined;

  submitted = false;

  profileDetails = Immutable.Map({});

  genderChoices = Immutable.fromJS([]);

  private _retrieveProfileDetailSubscription: Subscription | undefined;

  @ViewChild(BreadcrumbComponent, { read: BreadcrumbComponent })
  private _breadcrumbCmpElRef: ElementRef | undefined;

  @ViewChild(ErrornoteComponent, { read: ErrornoteComponent })
  private _errornoteCmp: ErrornoteComponent | undefined;

  PROFILE_PARAM = ProfileParam;

  private _emailFieldValueChangesSubscription: Subscription | undefined;

  private _usernameFieldValueChangesSubscription: Subscription | undefined;

  private _phoneNumberFieldValueChangesSubscription: Subscription | undefined;

  private _unlisteners: Function[] | undefined;

  objectURLS = Immutable.fromJS([]);

  SafePipeDomSanitizerTypes = SafePipeDomSanitizerTypes;

  constructor(
    private _authenticationService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private _userProfileService: UserProfileService,
    private _scrollService: ScrollService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _loadingScreenService: LoadingScreenService,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit() {
    this._initializeProfileFormGroup();
  }

  ngAfterViewInit() {
    this._setBreadcrumbDetails();

    this._retrieveProfileDetail();
  }

  ngOnDestroy() {
    this._unbindEventHandlers();

    this._unsubscribeRetrieveProfileDetailSubscription();

    this._unsubscribeUsernameFieldValueChangesSubscription();

    this._unsubscribePhoneNumberFieldValueChangesSubscription();

    this._unsubscribeEmailFieldValueChangesSubscription();
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

  private _unbindEventHandlers() {
    this._unlisteners?.forEach(
      unlistener => unlistener());
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _resetErrornote() {
    if (this._errornoteCmp instanceof ErrornoteComponent) {
      this._errornoteCmp.resetTotalInvalidControlsAndErrorMessage();
    }
  }

  private _resetFormGroupFields() {
    const FIELDS = this.PROFILE_PARAM.constructFields();

    for (const FIELD of FIELDS) {
      this.profileFormGroup
        ?.get(FIELD.formControlName)?.reset();
    }
  }

  private _unsubscribeRetrieveProfileDetailSubscription() {
    if (this._retrieveProfileDetailSubscription instanceof Subscription) {
      this._retrieveProfileDetailSubscription.unsubscribe();
    }
  }

  private _unsubscribeUsernameFieldValueChangesSubscription() {
    if (this._usernameFieldValueChangesSubscription instanceof Subscription) {
      this._usernameFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _unsubscribePhoneNumberFieldValueChangesSubscription() {
    if (this._phoneNumberFieldValueChangesSubscription instanceof Subscription) {
      this._phoneNumberFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _unsubscribeEmailFieldValueChangesSubscription() {
    if (this._emailFieldValueChangesSubscription instanceof Subscription) {
      this._emailFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _initializeProfileFormGroup() {
    this.profileFormGroup = this._formBuilder.group({
      [this.PROFILE_PARAM.FIRST_NAME.formControlName]: [
        this.PROFILE_PARAM.FIRST_NAME.defaultValue,
        this.PROFILE_PARAM.FIRST_NAME.validators],

      [this.PROFILE_PARAM.LAST_NAME.formControlName]: [
        this.PROFILE_PARAM.LAST_NAME.defaultValue,
        this.PROFILE_PARAM.LAST_NAME.validators],

      [this.PROFILE_PARAM.AVATAR.formControlName]: [
        this.PROFILE_PARAM.AVATAR.defaultValue,
        this.PROFILE_PARAM.AVATAR.validators],

      [this.PROFILE_PARAM.USERNAME.formControlName]: [
        this.PROFILE_PARAM.USERNAME.defaultValue,
        this.PROFILE_PARAM.USERNAME.validators],

      [this.PROFILE_PARAM.EMAIL.formControlName]: [
        this.PROFILE_PARAM.EMAIL.defaultValue,
        this.PROFILE_PARAM.EMAIL.validators],

      [this.PROFILE_PARAM.PHONE_NUMBER.formControlName]: [
        this.PROFILE_PARAM.PHONE_NUMBER.defaultValue,
        this.PROFILE_PARAM.PHONE_NUMBER.validators],

      [this.PROFILE_PARAM.DATE_OF_BIRTH.formControlName]: [
        this.PROFILE_PARAM.DATE_OF_BIRTH.defaultValue,
        this.PROFILE_PARAM.DATE_OF_BIRTH.validators],

      [this.PROFILE_PARAM.BIO.formControlName]: [
        this.PROFILE_PARAM.BIO.defaultValue,
        this.PROFILE_PARAM.BIO.validators],

      [this.PROFILE_PARAM.GENDER.formControlName]: [
        this.PROFILE_PARAM.GENDER.defaultValue,
        this.PROFILE_PARAM.GENDER.validators],
    }, { updateOn: 'blur' });

    this.automaticallyCleanUpEmailField();

    this.automaticallyCleanUpUsernameField();

    this.automaticallyCleanUpPhoneNumberField();
  }

  automaticallyCleanUpEmailField() {
    this._emailFieldValueChangesSubscription = this.profileFormGroup
      ?.get(
        this.PROFILE_PARAM.EMAIL.formControlName
      )
      ?.valueChanges
      ?.pipe(
        distinctUntilChanged()
      )
      ?.subscribe(value => {
        const exp = new RegExp('\\s+', 'g');

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '');

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE, false)) {
          this.profileFormGroup?.get(
            this.PROFILE_PARAM.EMAIL.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }

  automaticallyCleanUpUsernameField() {
    this._usernameFieldValueChangesSubscription = this.profileFormGroup
      ?.get(
        this.PROFILE_PARAM.USERNAME.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        const exp = /[^\w.@+-]/;

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '')

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE)) {
          this.profileFormGroup?.get(
            this.PROFILE_PARAM.USERNAME.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }

  automaticallyCleanUpPhoneNumberField() {
    this._phoneNumberFieldValueChangesSubscription = this.profileFormGroup
      ?.get(
        this.PROFILE_PARAM.PHONE_NUMBER.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        const exp = /\D/g;

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '')

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE)) {
          this.profileFormGroup?.get(
            this.PROFILE_PARAM.PHONE_NUMBER.formControlName
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

  private _retrieveProfileDetail() {
    this._startLoading();

    this._retrieveProfileDetailSubscription = this._userProfileService
      .retrieveProfileDetail$()
      .subscribe(details => {
        const AVATAR = details.avatar;
        const AVATAR_DEFAULT_VALUE = this.PROFILE_PARAM.AVATAR
          .defaultValue;
        if (!stringIsEmpty(AVATAR?.src)) {
          if (fieldValueHasBeenUpdated(AVATAR_DEFAULT_VALUE, AVATAR?.src)) {
            this.profileFormGroup
              ?.get(
                this.PROFILE_PARAM.AVATAR.formControlName)
              ?.setValue(details.avatar);
          }
        }
        this.profileDetails = this.profileDetails
          .set(
            this.PROFILE_PARAM.AVATAR.temporaryStoreKey,
            details.avatar);


        const GENDER_DEFAULT_VALUE = this.PROFILE_PARAM.GENDER.defaultValue;
        let SELECTED_GENDER = GENDER_DEFAULT_VALUE;
        this.genderChoices = Immutable.fromJS(details.genderChoices);

        details.genderChoices?.forEach(choice => {
          const choiceIsSelected = choice.selected;

          if (choiceIsSelected) {
            const VALUE = convertItemToString(
              choice.value);

            if (fieldValueHasBeenUpdated(GENDER_DEFAULT_VALUE, VALUE)) {
              this.profileFormGroup
                ?.get(
                  this.PROFILE_PARAM.GENDER.formControlName)
                ?.setValue(VALUE);

              SELECTED_GENDER = VALUE;
            }
          }
        });
        this.profileDetails = this.profileDetails
          .set(
            this.PROFILE_PARAM.GENDER.temporaryStoreKey,
            SELECTED_GENDER);

        const LAST_NAME = details.lastName;
        const LAST_NAME_DEFAULT_VALUE = this.PROFILE_PARAM.LAST_NAME.defaultValue;
        if (fieldValueHasBeenUpdated(LAST_NAME_DEFAULT_VALUE, LAST_NAME)) {
          this.profileFormGroup
            ?.get(
              this.PROFILE_PARAM.LAST_NAME.formControlName)
            ?.setValue(LAST_NAME);
        }
        this.profileDetails = this.profileDetails
          .set(
            this.PROFILE_PARAM.LAST_NAME.temporaryStoreKey,
            LAST_NAME);

        const FIRST_NAME = details.firstName;
        const FIRST_NAME_DEFAULT_VALUE = this.PROFILE_PARAM.FIRST_NAME.defaultValue;
        if (fieldValueHasBeenUpdated(FIRST_NAME_DEFAULT_VALUE, FIRST_NAME)) {
          this.profileFormGroup
            ?.get(
              this.PROFILE_PARAM.FIRST_NAME.formControlName)
            ?.setValue(FIRST_NAME);
        }
        this.profileDetails = this.profileDetails
          .set(
            this.PROFILE_PARAM.FIRST_NAME.temporaryStoreKey,
            FIRST_NAME);

        const BIO = details.bio;
        const BIO_DEFAULT_VALUE = this.PROFILE_PARAM.BIO.defaultValue;
        if (fieldValueHasBeenUpdated(BIO_DEFAULT_VALUE, BIO)) {
          this.profileFormGroup
            ?.get(
              this.PROFILE_PARAM.BIO.formControlName)
            ?.setValue(BIO);
        }
        this.profileDetails = this.profileDetails
          .set(
            this.PROFILE_PARAM.BIO.temporaryStoreKey,
            BIO);

        const DATE_OF_BIRTH = details.dateOfBirth;
        const DATE_OF_BIRTH_DEFAULT_VALUE = this.PROFILE_PARAM.DATE_OF_BIRTH.defaultValue;
        if (fieldValueHasBeenUpdated(DATE_OF_BIRTH_DEFAULT_VALUE, DATE_OF_BIRTH)) {
          this.profileFormGroup
            ?.get(
              this.PROFILE_PARAM.DATE_OF_BIRTH.formControlName)
            ?.setValue(DATE_OF_BIRTH);
        }
        this.profileDetails = this.profileDetails
          .set(
            this.PROFILE_PARAM.DATE_OF_BIRTH.temporaryStoreKey,
            DATE_OF_BIRTH);

        const PHONE_NUMBER = details.phoneNumber;
        const PHONE_NUMBER_DEFAULT_VALUE = this.PROFILE_PARAM.PHONE_NUMBER.defaultValue;
        if (fieldValueHasBeenUpdated(PHONE_NUMBER_DEFAULT_VALUE, PHONE_NUMBER)) {
          this.profileFormGroup
            ?.get(
              this.PROFILE_PARAM.PHONE_NUMBER.formControlName)
            ?.setValue(PHONE_NUMBER);
        }
        this.profileDetails = this.profileDetails
          .set(
            this.PROFILE_PARAM.PHONE_NUMBER.temporaryStoreKey,
            PHONE_NUMBER);

        const EMAIL = details.email;
        const EMAIL_DEFAULT_VALUE = this.PROFILE_PARAM.EMAIL.defaultValue;
        if (fieldValueHasBeenUpdated(EMAIL_DEFAULT_VALUE, EMAIL)) {
          this.profileFormGroup
            ?.get(
              this.PROFILE_PARAM.EMAIL.formControlName)
            ?.setValue(EMAIL);
        }
        this.profileDetails = this.profileDetails
          .set(
            this.PROFILE_PARAM.EMAIL.temporaryStoreKey,
            EMAIL);

        const USERNAME = details.username;
        const USERNAME_DEFAULT_VALUE = this.PROFILE_PARAM.USERNAME.defaultValue;
        if (fieldValueHasBeenUpdated(USERNAME_DEFAULT_VALUE, USERNAME)) {
          this.profileFormGroup
            ?.get(
              this.PROFILE_PARAM.USERNAME.formControlName)
            ?.setValue(USERNAME);
        }
        this.profileDetails = this.profileDetails
          .set(
            this.PROFILE_PARAM.USERNAME.temporaryStoreKey,
            USERNAME);

        this._backToTop();

        this._stopLoading();

        this._manuallyTriggerChangeDetection();
      }, (err) => {
        console.error(err);
      });
  }

  checkIfEmailHasBeenTaken = (email: string): Promise<boolean> => {
    email = convertItemToString(email);

    const checkIfEmailHasBeenTaken$ = this._authenticationService
      .checkIfEmailHasBeenTaken$(
        email.trim())
      .pipe(
        mergeMap(
          (details: HasBeenTakenHttpResponse) => {
            if (details.exists) {
              return of(details);
            }
            else {
              return of(details);
            }
          }));

    return checkIfEmailHasBeenTaken$.toPromise()
      .then(response => {
        return !response.exists;
      }, error => {
        return true;
      });
  }

  checkIfUsernameHasBeenTaken = (username: any): Promise<boolean> => {
    username = convertItemToString(username);

    const checkIfUsernameHasBeenTaken$ = this._authenticationService
      .checkIfUsernameHasBeenTaken$(username.trim())
      .pipe(
        mergeMap(
          (details: HasBeenTakenHttpResponse) => {
            if (details.exists) {
              return of(details);
            }
            else {
              return of(details);
            }
          }));

    return checkIfUsernameHasBeenTaken$.toPromise()
      .then(response => {
        return !response.exists;
      }, error => {
        return true;
      });
  }

  checkIfPhoneNumberHasBeenTaken = (phoneNumber: any): Promise<boolean> => {
    phoneNumber = convertItemToString(phoneNumber);

    const checkIfPhoneNumberHasBeenTaken$ = this._authenticationService
      .checkIfPhoneNumberHasBeenTaken$(phoneNumber.trim())
      .pipe(
        mergeMap(
          (details: HasBeenTakenHttpResponse) => {
            if (details.exists) {
              return of(details);
            }
            else {
              return of(details);
            }
          }));

    return checkIfPhoneNumberHasBeenTaken$.toPromise()
      .then(response => {
        return !response.exists;
      }, error => {
        return true;
      });
  }

  private _onClick(event: any) {
    event.stopPropagation();
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

  private _prepareNewPhotoFileList(files: FileList) {
    this._resetErrornote();

    this._revokeObjectURLS();

    const file = files.item(0);

    if (!(file instanceof File)) { return; }

    const mimeType = file.type;
    if (mimeType.match(/image\/*/) === null) {
      // Only images are supported
      this._backToTop();

      this._showErrorNote(undefined, 'Only images are supported');

      return;
    }

    const objectURL = window.URL.createObjectURL(file);

    const NEW_VAL = Immutable.fromJS(objectURL);

    this.objectURLS = Immutable.mergeDeep(
      this.objectURLS, NEW_VAL);

    this.profileFormGroup
      ?.get(
        this.PROFILE_PARAM.AVATAR.formControlName)
      ?.setValue(file);

    this._manuallyTriggerChangeDetection();
  }

  private _changePhotoBrowseHandler(event: any) {
    this._prepareNewPhotoFileList(event.target.files);
  }

  editAvatarTrigger() {
    this._unbindEventHandlers();

    const changeAvatarInput = this._renderer2
      .createElement('input');

    this._renderer2.setAttribute(changeAvatarInput, 'type', 'file');
    this._renderer2.setAttribute(changeAvatarInput, 'accept', 'image/*');

    this._unlisteners = [
      this._renderer2
        .listen(
          changeAvatarInput, 'click', (event) => this._onClick(event)),

      this._renderer2
        .listen(
          changeAvatarInput, 'change', (event) =>
          this._changePhotoBrowseHandler(event))
    ]

    changeAvatarInput.click();
  }

  onSubmit = (formGroupForProfile: FormGroup): Promise<any> => {
    this._resetErrornote();

    this.submitted = true;

    let updateHasOccured = false;

    // stop here if form is invalid
    if (formGroupForProfile.invalid) {
      const totalInvalidFormControls = getFormGroupOrFormArrayTotalNumberOfInvalidFields(
        formGroupForProfile);

      this._showErrorNote(totalInvalidFormControls);

      this._backToTop();

      return Promise.resolve('Form is invalid. Aborting');
    }

    const recordUpdateHasOccured = () => {
      if (!updateHasOccured) {
        updateHasOccured = true;
      }
    }

    const updatedDetailsFormData = new FormData();

    const currentBio = convertItemToString(
      formGroupForProfile?.get(
        this.PROFILE_PARAM.BIO.formControlName)?.value);
    const previousBio = convertItemToString(
      this.profileDetails.get(
        this.PROFILE_PARAM.BIO.temporaryStoreKey));
    if (fieldValueHasBeenUpdated(previousBio, currentBio)) {
      updatedDetailsFormData.append(
        this.PROFILE_PARAM.BIO.permanentStoreKey,
        currentBio);

      recordUpdateHasOccured();
    }

    const currentFirstName = convertItemToString(
      formGroupForProfile?.get(
        this.PROFILE_PARAM.FIRST_NAME.formControlName)?.value);
    const previousFirstName = convertItemToString(
      this.profileDetails.get(
        this.PROFILE_PARAM.FIRST_NAME.temporaryStoreKey));
    if (fieldValueHasBeenUpdated(previousFirstName, currentFirstName)) {
      updatedDetailsFormData.append(
        this.PROFILE_PARAM.FIRST_NAME.permanentStoreKey,
        currentFirstName);

      recordUpdateHasOccured();
    }

    const currentLastName = convertItemToString(
      formGroupForProfile?.get(
        this.PROFILE_PARAM.LAST_NAME.formControlName)?.value);
    const previousLastName = convertItemToString(
      this.profileDetails.get(
        this.PROFILE_PARAM.LAST_NAME.temporaryStoreKey));
    if (fieldValueHasBeenUpdated(previousLastName, currentLastName)) {
      updatedDetailsFormData.append(
        this.PROFILE_PARAM.LAST_NAME.permanentStoreKey,
        currentLastName);

      recordUpdateHasOccured();
    }

    const currentUsername = convertItemToString(
      formGroupForProfile?.get(
        this.PROFILE_PARAM.USERNAME.formControlName)?.value);
    const previousUsername = convertItemToString(
      this.profileDetails.get(
        this.PROFILE_PARAM.USERNAME.temporaryStoreKey));
    if (fieldValueHasBeenUpdated(previousUsername, currentUsername)) {
      updatedDetailsFormData.append(
        this.PROFILE_PARAM.USERNAME.permanentStoreKey,
        currentUsername);

      recordUpdateHasOccured();
    }

    const currentGender = convertItemToString(
      formGroupForProfile?.get(
        this.PROFILE_PARAM.GENDER.formControlName)?.value);
    const previousGender = convertItemToString(
      this.profileDetails.get(
        this.PROFILE_PARAM.GENDER.temporaryStoreKey));
    if (fieldValueHasBeenUpdated(previousGender, currentGender)) {
      updatedDetailsFormData.append(
        this.PROFILE_PARAM.GENDER.permanentStoreKey,
        currentGender);

      recordUpdateHasOccured();
    }

    const currentEmail = convertItemToString(
      formGroupForProfile?.get(
        this.PROFILE_PARAM.EMAIL.formControlName)?.value);
    const previousEmail = convertItemToString(
      this.profileDetails.get(
        this.PROFILE_PARAM.EMAIL.temporaryStoreKey));
    if (fieldValueHasBeenUpdated(previousEmail, currentEmail)) {
      updatedDetailsFormData.append(
        this.PROFILE_PARAM.EMAIL.permanentStoreKey,
        currentEmail);

      recordUpdateHasOccured();
    }

    const currentPhoneNumber = convertItemToString(
      formGroupForProfile?.get(
        this.PROFILE_PARAM.PHONE_NUMBER.formControlName)?.value);
    const previousPhoneNumber = convertItemToString(
      this.profileDetails.get(
        this.PROFILE_PARAM.PHONE_NUMBER.temporaryStoreKey));
    if (fieldValueHasBeenUpdated(previousPhoneNumber, currentPhoneNumber)) {
      updatedDetailsFormData.append(
        this.PROFILE_PARAM.PHONE_NUMBER.permanentStoreKey,
        currentPhoneNumber);

      recordUpdateHasOccured();
    }

    const currentDateOfBirth = convertItemToString(
      formGroupForProfile?.get(
        this.PROFILE_PARAM.DATE_OF_BIRTH.formControlName)?.value);
    const previousDateOfBirth = convertItemToString(
      this.profileDetails.get(
        this.PROFILE_PARAM.DATE_OF_BIRTH.temporaryStoreKey));
    if (fieldValueHasBeenUpdated(previousDateOfBirth, currentDateOfBirth)) {
      updatedDetailsFormData.append(
        this.PROFILE_PARAM.DATE_OF_BIRTH.permanentStoreKey,
        currentDateOfBirth);

      recordUpdateHasOccured();
    }

    const currentAvatar = formGroupForProfile
      ?.get(
        this.PROFILE_PARAM.AVATAR.formControlName)
      ?.value;
    if (currentAvatar instanceof File) {
      updatedDetailsFormData.append(
        this.PROFILE_PARAM.AVATAR.permanentStoreKey,
        currentAvatar);

      recordUpdateHasOccured();
    }

    if (!updateHasOccured) {
      return Promise.resolve('Disregarding update command. Aborting');
    }

    const savePromise = this._userProfileService
      .updateProfileDetail$(updatedDetailsFormData)
      .toPromise();

    savePromise
      .then(_ => {
        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.AVATAR.permanentStoreKey
        )) {
          formGroupForProfile
            ?.get(
              this.PROFILE_PARAM.AVATAR.formControlName)
            ?.reset();
        }

        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.BIO.formControlName)) {
          this.profileDetails = this.profileDetails
            .set(
              this.PROFILE_PARAM.BIO.temporaryStoreKey,
              currentBio);
        }

        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.FIRST_NAME.formControlName)) {
          this.profileDetails = this.profileDetails
            .set(
              this.PROFILE_PARAM.FIRST_NAME.temporaryStoreKey,
              currentFirstName);
        }

        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.LAST_NAME.formControlName)) {
          this.profileDetails = this.profileDetails
            .set(
              this.PROFILE_PARAM.LAST_NAME.temporaryStoreKey,
              currentLastName);
        }

        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.BIO.formControlName)) {
          this.profileDetails = this.profileDetails
            .set(
              this.PROFILE_PARAM.BIO.temporaryStoreKey,
              currentBio);
        }

        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.EMAIL.formControlName)) {
          this.profileDetails = this.profileDetails
            .set(
              this.PROFILE_PARAM.EMAIL.temporaryStoreKey,
              currentEmail);
        }

        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.DATE_OF_BIRTH.formControlName)) {
          this.profileDetails = this.profileDetails
            .set(
              this.PROFILE_PARAM.DATE_OF_BIRTH.temporaryStoreKey,
              currentDateOfBirth);
        }

        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.PHONE_NUMBER.formControlName)) {
          this.profileDetails = this.profileDetails
            .set(
              this.PROFILE_PARAM.PHONE_NUMBER.temporaryStoreKey,
              currentPhoneNumber);
        }

        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.GENDER.formControlName)) {
          this.profileDetails = this.profileDetails
            .set(
              this.PROFILE_PARAM.GENDER.temporaryStoreKey,
              currentGender);
        }

        if (updatedDetailsFormData.has(
          this.PROFILE_PARAM.USERNAME.formControlName)) {
          this.profileDetails = this.profileDetails
            .set(
              this.PROFILE_PARAM.USERNAME.temporaryStoreKey,
              currentUsername);
        }

      }, (err) => console.error(err));

    return savePromise;
  }


}

class ProfileParam {
  public static readonly NAME_OF_FORM_GROUP = 'profileFormGroup';

  public static readonly AVATAR = {
    formControlName: 'avatar',
    temporaryStoreKey: 'avatar',
    permanentStoreKey: 'avatar',
    validators: null,
    defaultValue: '',
    isRequired: false,
    slug: constructInputFieldIdentification,
    errors: null,
  }

  public static readonly GENDER = {
    formControlName: 'gender',
    temporaryStoreKey: 'gender',
    permanentStoreKey: 'gender',
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'Gender',
    defaultValue: '',
    isRequired: true,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Select your gender.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your gender correctly?',
      maxLengthPrefixErrorMessage: 'That gender is too long. You need to shortern it.',
      minLengthPrefixErrorMessage: 'That gender is too short. You need to lengthen it.'
    },
  };

  public static readonly DATE_OF_BIRTH = {
    formControlName: 'dateOfBirth',
    temporaryStoreKey: 'dateOfBirth',
    permanentStoreKey: 'dateOfBirth',
    isRequired: true,
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'When were you born?',
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide your date of birth.',
    }
  };

  public static readonly BIO = {
    formControlName: 'bio',
    temporaryStoreKey: 'bio',
    permanentStoreKey: 'bio',
    validators: Validators.compose([
      Validators.maxLength(5000),
    ]),
    label: 'About me?',
    defaultValue: '',
    isRequired: false,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      maxLengthPrefixErrorMessage: 'That short description about you is too long. You need to shortern it.',
    },
  };

  public static readonly FIRST_NAME = {
    formControlName: 'firstName',
    temporaryStoreKey: 'firstName',
    permanentStoreKey: 'firstName',
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'First name',
    defaultValue: '',
    isRequired: true,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide first name.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your first name correctly?',
      maxLengthPrefixErrorMessage: 'That first name is too long. You need to shortern it.',
      minLengthPrefixErrorMessage: 'That first name is too short. You need to lengthen it.'
    },
  };

  public static readonly LAST_NAME = {
    formControlName: 'lastName',
    temporaryStoreKey: 'lastName',
    permanentStoreKey: 'lastName',
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'Last name',
    defaultValue: '',
    placeholder: '',
    isRequired: true,
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide last name.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your last name correctly?',
      maxLengthPrefixErrorMessage: 'That last name is too long. You need to shortern it.',
      minLengthPrefixErrorMessage: 'That last name is too short. You need to lengthen it.'
    },
  };

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
    label: 'Username to use',
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide username.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your username correctly?',
      maxLengthPrefixErrorMessage: 'That username is too long. You need to shortern it.',
      minLengthPrefixErrorMessage: 'That username is too short. You need to lengthen it.',
      fieldValueAlreadyTaken: 'That username is already taken.',
      usernameHasBeenTakenErrorMessage: 'That username is already taken.',
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
    label: 'Email address',
    defaultValue: '',
    isRequired: true,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide email address.',
      emailErrorMessage: 'Are you sure you entered your email correctly?',
      fieldValueAlreadyTaken: 'That email is already taken.',
      emailHasBeenTakenErrorMessage: 'That email is already taken.',
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
    label: 'Phone number',
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide phone number.',
      pattern: `Are you sure you entered the phone properly?`,
      maxlength: `Phone number should not exceed 20 chars long.`,
      fieldValueAlreadyTaken: 'That phone number is already taken.',
      phoneNumberHasBeenTakenErrorMessage: 'That phone number is already taken.',
    }
  };

  public static constructFields() {
    const fields = [
      {
        formControlName: this.PHONE_NUMBER.formControlName,
        temporaryStoreKey: this.PHONE_NUMBER.temporaryStoreKey,
        permanentStoreKey: this.PHONE_NUMBER.permanentStoreKey,
      },
      {
        formControlName: this.DATE_OF_BIRTH.formControlName,
        temporaryStoreKey: this.DATE_OF_BIRTH.temporaryStoreKey,
        permanentStoreKey: this.DATE_OF_BIRTH.permanentStoreKey,
      },
      {
        formControlName: this.BIO.formControlName,
        temporaryStoreKey: this.BIO.temporaryStoreKey,
        permanentStoreKey: this.BIO.permanentStoreKey
      },
      {
        formControlName: this.FIRST_NAME.formControlName,
        temporaryStoreKey: this.FIRST_NAME.temporaryStoreKey,
        permanentStoreKey: this.FIRST_NAME.permanentStoreKey
      },
      {
        formControlName: this.LAST_NAME.formControlName,
        temporaryStoreKey: this.LAST_NAME.temporaryStoreKey,
        permanentStoreKey: this.LAST_NAME.permanentStoreKey
      },
      {
        formControlName: this.AVATAR.formControlName,
        temporaryStoreKey: this.AVATAR.temporaryStoreKey,
        permanentStoreKey: this.AVATAR.permanentStoreKey
      },
      {
        formControlName: this.EMAIL.formControlName,
        temporaryStoreKey: this.EMAIL.temporaryStoreKey,
        permanentStoreKey: this.EMAIL.permanentStoreKey,
      },
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
    ];

    return fields;
  }
}

