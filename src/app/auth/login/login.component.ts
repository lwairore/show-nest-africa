import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrornoteComponent } from '@sharedModule/components/errornote/errornote.component';
import { AuthenticationService, ScrollService } from '@sharedModule/services';
import { SeoService } from '@sharedModule/services/seo.service';
import { constructInputFieldIdentification, convertItemToString, fieldValueHasBeenUpdated, getFormGroupOrFormArrayTotalNumberOfInvalidFields, REGEX_REPLACE_WITH } from '@sharedModule/utilities';
import { MinCharacterNotGenuinelyAchievedValidator } from '@sharedModule/validators';
import * as Immutable from 'immutable';
import { SeoSocialShareService } from 'ngx-seo';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'snap-login',
  templateUrl: './login.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  signInFormGroup: FormGroup | undefined;

  submitted = false;

  showPassword = false;

  private _errornoteRef: ComponentRef<ErrornoteComponent> | undefined;

  @ViewChild('errornoteContainer', { read: ViewContainerRef })
  private _errornoteContainer: ViewContainerRef | undefined;

  private _activatedRouteSubscription: Subscription | undefined;

  private _retrieveSignInSEODetailsSubscription: Subscription | undefined;

  private _identityFieldValueChangesSubscription: Subscription | undefined;

  routeParams = Immutable.Map({});

  SIGN_IN_PARAM = SignInParam;

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
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._retrieveParams();

    this._initializeSignInFormGroup();
  }

  ngAfterViewInit(): void {
    this._retrieveSignInSEODetails();
  }

  ngOnDestroy(): void {
    this._unsubscribeRetrieveSignInSEODetailsSubscription();

    this._unsubscribeActivateRouteSubscription();

    this._unsubscribeIdentityFieldValueChangesSubscription();
  }

  private _unsubscribeIdentityFieldValueChangesSubscription() {
    if (this._identityFieldValueChangesSubscription instanceof Subscription) {
      this._identityFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _unsubscribeActivateRouteSubscription() {
    if (this._activatedRouteSubscription instanceof Subscription) {
      this._activatedRouteSubscription.unsubscribe();
    }
  }

  private _unsubscribeRetrieveSignInSEODetailsSubscription() {
    if (this._retrieveSignInSEODetailsSubscription instanceof Subscription) {
      this._retrieveSignInSEODetailsSubscription.unsubscribe();
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


  automaticallyCleanIdentityField(): void {
    this._identityFieldValueChangesSubscription = this.signInFormGroup
      ?.get(
        this.SIGN_IN_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName
      )
      ?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(value => {
        console.log({ value })
        const exp = new RegExp('\\s+', 'g');

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '');

        console.log({ CLEANED_VALUE })

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE, false)) {
          this.signInFormGroup?.get(
            this.SIGN_IN_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName
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

  private _retrieveSignInSEODetails() {
    this._retrieveSignInSEODetailsSubscription = this._seoService
      .retrieveSignInSEODetails$()
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

  private _initializeSignInFormGroup() {
    this.signInFormGroup = this._formBuilder.group({
      [this.SIGN_IN_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName]: [
        this.SIGN_IN_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.defaultValue,
        this.SIGN_IN_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.validators],

      [this.SIGN_IN_PARAM.PASSWORD.formControlName]: [
        this.SIGN_IN_PARAM.PASSWORD.defaultValue, this.SIGN_IN_PARAM.PASSWORD.validators],
    }, { updateOn: 'blur' });

    this.automaticallyCleanIdentityField();
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _resetFormGroupFields() {
    const FIELDS = this.SIGN_IN_PARAM.constructFields();

    for (const FIELD of FIELDS) {
      this.signInFormGroup
        ?.get(FIELD.formControlName)?.reset();
    }
  }

  onSubmit = (formGroupForSignIn: FormGroup): Promise<any> => {
    this.submitted = true;

    // stop here if form is invalid
    if (formGroupForSignIn.invalid) {
      const totalInvalidFormControls = getFormGroupOrFormArrayTotalNumberOfInvalidFields(
        formGroupForSignIn);

      this._showErrorNote(totalInvalidFormControls);

      this._scrollService.scrollToPosition(0, 0);

      return Promise.resolve('Form is invalid. Aborting');
    }

    const userDetailsFormData = new FormData();

    const identity = convertItemToString(
      formGroupForSignIn?.get(
        this.SIGN_IN_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName)?.value)?.trim();
    userDetailsFormData.append(
      this.SIGN_IN_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName, identity);

    const password = convertItemToString(
      formGroupForSignIn?.get(
        this.SIGN_IN_PARAM.PASSWORD.formControlName)?.value)?.trim();
    userDetailsFormData.append(
      this.SIGN_IN_PARAM.PASSWORD.formControlName, password);

    const savePromise = this._authenticationService
      .login(userDetailsFormData).toPromise();

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

        this.signInFormGroup?.get(
          this.SIGN_IN_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName)
          ?.setErrors({
            incorrectCredentials: true,
          });

        this.signInFormGroup?.get(
          this.SIGN_IN_PARAM.PASSWORD.formControlName)
          ?.setErrors({
            incorrectCredentials: true,
          });

        console.log(this.signInFormGroup?.get(
          this.SIGN_IN_PARAM.PASSWORD.formControlName))

        this._manuallyTriggerChangeDetection();

        this._scrollService.scrollToPosition(0, 0);
      }
    );
    return savePromise;
  }

}

class SignInParam {
  public static readonly NAME_OF_FORM_GROUP = 'signInFormGroup';

  public static readonly USERNAME_OR_EMAIL_PHONE_NUMBER = {
    formControlName: 'usernameOrEmailOrPhoneNumber',
    temporaryStoreKey: 'usernameOrEmailOrPhoneNumber',
    permanentStoreKey: 'usernameOrEmailOrPhoneNumber',
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'Enter either your username, phone number or email',
    defaultValue: '',
    isRequired: true,
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      incorrectCredentials: 'Wrong sign-in credentials.',
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide either your username, email or phone number.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered your either your username, email or phone number correctly?',
      maxLengthPrefixErrorMessage: 'That either your username, email or phone number is too long. You need to shortern that either your username, email or phone number.',
      minLengthPrefixErrorMessage: 'That either your username, email or phone number is too short. You need to lengthen that either your username, email or phone number.'
    },
  };

  public static readonly PASSWORD = {
    formControlName: 'password',
    temporaryStoreKey: 'password',
    permanentStoreKey: 'password',
    validators: Validators.compose([
      Validators.required,
    ]),
    label: 'Enter your password',
    isRequired: true,
    defaultValue: '',
    placeholder: '',
    slug: constructInputFieldIdentification,
    errors: {
      incorrectCredentials: 'Wrong sign-in credentials.',
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide the password for your account.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered the password correctly?',
    }
  };

  public static constructFields() {
    const fields = [
      {
        formControlName: this.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName,
        temporaryStoreKey: this.USERNAME_OR_EMAIL_PHONE_NUMBER.temporaryStoreKey,
        permanentStoreKey: this.USERNAME_OR_EMAIL_PHONE_NUMBER.permanentStoreKey,
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
