import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrornoteComponent } from '@sharedModule/components/errornote/errornote.component';
import { HasBeenTakenHttpResponse } from '@sharedModule/custom-types';
import { AuthenticationService, ScrollService } from '@sharedModule/services';
import { SeoService } from '@sharedModule/services/seo.service';
import { constructInputFieldIdentification, convertItemToString, fieldValueHasBeenUpdated, getFormGroupOrFormArrayTotalNumberOfInvalidFields, REGEX_REPLACE_WITH } from '@sharedModule/utilities';
import { MinCharacterNotGenuinelyAchievedValidator } from '@sharedModule/validators';
import * as Immutable from 'immutable';
import { SeoSocialShareService } from 'ngx-seo';
import { of } from 'rxjs';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'snap-register',
  templateUrl: './register.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  signUpFormGroup: FormGroup | undefined;

  submitted = false;

  showPassword = false;

  emailFieldValueChangesSubscription: Subscription | undefined;

  usernameFieldValueChangesSubscription: Subscription | undefined;

  phoneNumberFieldValueChangesSubscription: Subscription | undefined;

  private _retrieveSignUpSEODetailsSubscription: Subscription | undefined;

  private _activatedRouteSubscription: Subscription | undefined;

  private _errornoteRef: ComponentRef<ErrornoteComponent> | undefined;

  @ViewChild('errornoteContainer', { read: ViewContainerRef })
  private _errornoteContainer: ViewContainerRef | undefined;

  REGISTER_PARAM = RegisterParam;

  routeParams = Immutable.Map({});

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _seoService: SeoService,
    private _seoSocialShareService: SeoSocialShareService,
    private _location: Location,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _scrollService: ScrollService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._retrieveParams();

    this._initializeSignUpFormGroup();
  }

  ngAfterViewInit(): void {
    this._retrieveSignUpSEODetails();
  }

  ngOnDestroy(): void {
    this._unsubscribeEmailFieldValueChangesSubscription();

    this._unsubscribeUsernameFieldValueChangesSubscription();

    this._unsubscribePhoneNumberFieldValueChangesSubscription();

    this._unsubscribeRetrieveSignUpSEODetailsSubscription();

    this._unsubscribeActivateRouteSubscription();
  }

  private _unsubscribeActivateRouteSubscription() {
    if (this._activatedRouteSubscription instanceof Subscription) {
      this._activatedRouteSubscription.unsubscribe();
    }
  }

  private _unsubscribeRetrieveSignUpSEODetailsSubscription() {
    if (this._retrieveSignUpSEODetailsSubscription instanceof Subscription) {
      this._retrieveSignUpSEODetailsSubscription.unsubscribe();
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

  private _retrieveParams() {
    this._activatedRouteSubscription = this._activatedRoute.queryParams
      .subscribe(params => {
        console.log({ params });

        if (params.hasOwnProperty('returnUrl')) {
          this.routeParams = this.routeParams.set('returnUrl',
            params.returnUrl);
        }
        if (params.hasOwnProperty('reason')) {
          this.routeParams = this.routeParams.set('reason',
            params.reason);
        }
        if (params.hasOwnProperty('authenticationPrompt')) {
          this.routeParams = this.routeParams.set('authenticationPrompt',
            params.authenticationPrompt);
        }
        if (params.hasOwnProperty('q')) {
          this.routeParams = this.routeParams.set('q',
            params.q);
        }
      });
  }

  automaticallyCleanUpEmailField(): void {
    this.emailFieldValueChangesSubscription = this.signUpFormGroup
      ?.get(
        this.REGISTER_PARAM.EMAIL.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        console.log({ value })
        const exp = new RegExp('\\s+', 'g');

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '');

        console.log({ CLEANED_VALUE })

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE, false)) {
          this.signUpFormGroup?.get(
            this.REGISTER_PARAM.EMAIL.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }

  automaticallyCleanUpUsernameField(): void {
    this.usernameFieldValueChangesSubscription = this.signUpFormGroup
      ?.get(
        this.REGISTER_PARAM.USERNAME.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        const exp = /[^\w.@+-]/;

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '')

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE)) {
          this.signUpFormGroup?.get(
            this.REGISTER_PARAM.USERNAME.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }

  automaticallyCleanUpPhoneNumberField(): void {
    this.phoneNumberFieldValueChangesSubscription = this.signUpFormGroup
      ?.get(
        this.REGISTER_PARAM.PHONE_NUMBER.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        const exp = /\D/g;

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '')

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE)) {
          this.signUpFormGroup?.get(
            this.REGISTER_PARAM.PHONE_NUMBER.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }


  private _showErrorNote = (totalInvalidFormControls: number) => {
    if (!this._errornoteRef) {
      const factory = this._componentFactoryResolver.resolveComponentFactory(ErrornoteComponent);
      this._errornoteRef = this._errornoteContainer?.createComponent(factory);
    }

    if (this._errornoteRef instanceof ComponentRef) {
      this._errornoteRef.instance.totalInvalidFormControls = totalInvalidFormControls;
      this._errornoteRef.injector.get(ChangeDetectorRef).detectChanges();
    }
  }

  private _retrieveSignUpSEODetails() {
    this._retrieveSignUpSEODetailsSubscription = this._seoService
      .retrieveSignUpSEODetails$()
      .subscribe(details => {
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
      }, err => console.error(err));
  }

  private _initializeSignUpFormGroup() {
    this.signUpFormGroup = this._formBuilder.group({
      [this.REGISTER_PARAM.FIRST_NAME.formControlName]: [
        this.REGISTER_PARAM.FIRST_NAME.defaultValue,
        this.REGISTER_PARAM.FIRST_NAME.validators],

      [this.REGISTER_PARAM.LAST_NAME.formControlName]: [
        this.REGISTER_PARAM.LAST_NAME.defaultValue, this.REGISTER_PARAM.LAST_NAME.validators],

      [this.REGISTER_PARAM.USERNAME.formControlName]: [
        this.REGISTER_PARAM.USERNAME.defaultValue, this.REGISTER_PARAM.USERNAME.validators],

      [this.REGISTER_PARAM.EMAIL.formControlName]: [
        this.REGISTER_PARAM.EMAIL.defaultValue,
        this.REGISTER_PARAM.EMAIL.validators],

      [this.REGISTER_PARAM.PHONE_NUMBER.formControlName]: [
        this.REGISTER_PARAM.PHONE_NUMBER.defaultValue,
        this.REGISTER_PARAM.PHONE_NUMBER.validators],

      [this.REGISTER_PARAM.PASSWORD.formControlName]: [
        this.REGISTER_PARAM.PASSWORD.defaultValue,
        this.REGISTER_PARAM.PASSWORD.validators],
    }, { updateOn: 'blur' });

    this.automaticallyCleanUpEmailField();

    this.automaticallyCleanUpUsernameField();

    this.automaticallyCleanUpPhoneNumberField();
  }

  checkIfEmailHasBeenTaken = (email: string): Promise<boolean> => {
    email = convertItemToString(email);
    console.log({ email })

    const checkIfEmailHasBeenTaken$ = this._authenticationService
      .checkIfEmailHasBeenTaken$(email.trim())
      .pipe(
        mergeMap(
          (details: HasBeenTakenHttpResponse) => {
            console.log('details')
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
            console.log('details')
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
            console.log('details')
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

  private _resetFormGroupFields() {
    const FIELDS = this.REGISTER_PARAM.constructFields();

    for (const FIELD of FIELDS) {
      this.signUpFormGroup
        ?.get(FIELD.formControlName)?.reset();
    }
  }

  onSubmit = (formGroupForSignup: FormGroup): Promise<any> => {
    this.submitted = true;

    // stop here if form is invalid
    if (formGroupForSignup.invalid) {
      const totalInvalidFormControls = getFormGroupOrFormArrayTotalNumberOfInvalidFields(
        formGroupForSignup);

      this._showErrorNote(totalInvalidFormControls);

      this._scrollService.scrollToPosition(0, 0);

      return Promise.resolve('Form is invalid. Aborting');
    }

    const newUserDetailsFormData = new FormData();

    const firstName = convertItemToString(
      formGroupForSignup?.get(
        this.REGISTER_PARAM.FIRST_NAME.formControlName)?.value)?.trim();
    newUserDetailsFormData.append(
      this.REGISTER_PARAM.FIRST_NAME.formControlName, firstName);

    const lastName = convertItemToString(
      formGroupForSignup?.get(
        this.REGISTER_PARAM.LAST_NAME.formControlName)?.value)?.trim();
    newUserDetailsFormData.append(
      this.REGISTER_PARAM.LAST_NAME.formControlName, lastName);

    const username = convertItemToString(
      formGroupForSignup?.get(
        this.REGISTER_PARAM.USERNAME.formControlName)?.value)?.trim();
    newUserDetailsFormData.append(
      this.REGISTER_PARAM.USERNAME.formControlName, username);

    const email = convertItemToString(
      formGroupForSignup?.get(
        this.REGISTER_PARAM.EMAIL.formControlName)?.value)?.trim();
    newUserDetailsFormData.append(
      this.REGISTER_PARAM.EMAIL.formControlName, email);

    const phoneNumber = convertItemToString(
      formGroupForSignup?.get(
        this.REGISTER_PARAM.PHONE_NUMBER.formControlName)?.value)?.trim();
    newUserDetailsFormData.append(
      this.REGISTER_PARAM.PHONE_NUMBER.formControlName, phoneNumber);

    const password = convertItemToString(
      formGroupForSignup?.get(
        this.REGISTER_PARAM.PASSWORD.formControlName)?.value)?.trim();
    newUserDetailsFormData.append(
      this.REGISTER_PARAM.PASSWORD.formControlName, password);

    const savePromise = this._authenticationService
      .signUp(newUserDetailsFormData).toPromise();

    savePromise.then(
      _ => {
        this._resetFormGroupFields();

        this.submitted = false;

        if (this.routeParams.get('returnUrl')) {
          this._router.navigate([this.routeParams.get('returnUrl')], {
            queryParams: {
              [this.routeParams.get('q') ? 'q' : '']: this.routeParams.get('q')
            }
          });
        }
        else {
          this._router.navigate(['/']);
        }
      },
      (err) => {
        console.error(err);
        this.submitted = false;
        const totalInvalidFormControls = getFormGroupOrFormArrayTotalNumberOfInvalidFields(
          formGroupForSignup);
        this._showErrorNote(totalInvalidFormControls);

        this._scrollService.scrollToPosition(0, 0);
      }
    );
    return savePromise;
  }

}

class RegisterParam {
  public static readonly NAME_OF_FORM_GROUP = 'signUpFormGroup';

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
    label: 'What is your first name?',
    defaultValue: '',
    isRequired: true,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide first name.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your first name correctly?',
      maxLengthPrefixErrorMessage: 'That first name is too long. You need to shortern that first name.',
      minLengthPrefixErrorMessage: 'That first name is too short. You need to lengthen that first name.'
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
    label: 'What is your last name?',
    defaultValue: '',
    placeholder: '',
    isRequired: true,
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide last name.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your last name correctly?',
      maxLengthPrefixErrorMessage: 'That last name is too long. You need to shortern that last name.',
      minLengthPrefixErrorMessage: 'That last name is too short. You need to lengthen that last name.'
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
    label: 'What username would like to use?',
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide username.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your username correctly?',
      maxLengthPrefixErrorMessage: 'That username is too long. You need to shortern that username.',
      minLengthPrefixErrorMessage: 'That username is too short. You need to lengthen that username.',
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
    label: 'What is your email address?',
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
    label: 'What is your phone number?',
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

  public static readonly PASSWORD = {
    formControlName: 'password',
    temporaryStoreKey: 'password',
    permanentStoreKey: 'password',
    validators: Validators.compose([
      Validators.required,
      Validators.minLength(1),
    ]),
    label: 'What password would you like to use?',
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
        formControlName: this.FIRST_NAME.formControlName,
        temporaryStoreKey: this.FIRST_NAME.temporaryStoreKey,
        permanentStoreKey: this.FIRST_NAME.permanentStoreKey,
      },
      {
        formControlName: this.LAST_NAME.formControlName,
        temporaryStoreKey: this.LAST_NAME.temporaryStoreKey,
        permanentStoreKey: this.LAST_NAME.permanentStoreKey
      },
      {
        formControlName: this.USERNAME.formControlName,
        temporaryStoreKey: this.USERNAME.temporaryStoreKey,
        permanentStoreKey: this.USERNAME.permanentStoreKey
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
        formControlName: this.PASSWORD.formControlName,
        temporaryStoreKey: this.PASSWORD.temporaryStoreKey,
        permanentStoreKey: this.PASSWORD.permanentStoreKey
      },
    ];

    return fields;
  }
}

