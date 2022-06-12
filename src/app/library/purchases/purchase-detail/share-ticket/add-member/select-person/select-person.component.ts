import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrornoteComponent } from '@sharedModule/components/errornote/errornote.component';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { convertItemToNumeric, isANumber, constructInputFieldIdentification, REGEX_REPLACE_WITH, fieldValueHasBeenUpdated, getFormGroupOrFormArrayTotalNumberOfInvalidFields, convertItemToString, getBoolean, stringIsEmpty } from '@sharedModule/utilities';
import { MinCharacterNotGenuinelyAchievedValidator } from '@sharedModule/validators';
import { distinctUntilChanged } from 'rxjs/operators';
import { AddMemberService } from '../services';
import { TitleCasePipe } from '@angular/common';
import { ModalFullscreenComponent } from '@libsModule/modal-fullscreen/modal-fullscreen.component';

@Component({
  selector: 'snap-select-person',
  templateUrl: './select-person.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TitleCasePipe,
  ]
})
export class SelectPersonComponent implements OnInit, AfterViewInit, OnDestroy {
  selectPersonFormGroup: FormGroup | undefined;

  submitted = false;

  addingPerson = false;

  @ViewChild(ErrornoteComponent, { read: ErrornoteComponent })
  private _errornoteCmp: ErrornoteComponent | undefined;

  private _routeParams: Immutable.Map<string, number> = Immutable.Map({});

  private _momentIDRouteParamSubscription: Subscription | undefined;

  private _ticketIDRouteParamSubscription: Subscription | undefined;

  private _addAnotherMemberSubscription: Subscription | undefined;

  private _identityFieldValueChangesSubscription: Subscription | undefined;

  @ViewChild('addStreamBuddyResponseModalEl', { read: ModalFullscreenComponent })
  private _addStreamBuddyResponseModalFullscrenCmp: ModalFullscreenComponent | undefined;

  SELECT_PERSON_PARAM = SelectPersonParam;

  ADD_STREAM_BUDDY_RESPONSE_MODAL_ID = 'addStreamBuddy';

  memberAddedSuccessfully = Immutable.Map({
    isSuccess: false,
    fullName: ''
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _addMemberService: AddMemberService,
    private _titleCasePipe: TitleCasePipe,
  ) { }

  ngOnInit() {
    this._extractRouteParams();

    this._initializeSignInFormGroup();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this._unsubscribeMomentIDRouteParamSubscription();

    this._unsubscribeTicketIDRouteParamSubscription();

    this._unsubscribeIdentityFieldValueChangesSubscription();

    this._unsubscribeAddAnotherMemberSubscription();
  }

  private _unsubscribeAddAnotherMemberSubscription() {
    if (this._addAnotherMemberSubscription instanceof Subscription) {
      this._addAnotherMemberSubscription.unsubscribe();
    }
  }

  addAnotherBuddy() {
    this._resetMemberAddedSuccessfully();

    this._manuallyTriggerChangeDetection();
  }

  chooseAnotherTicket() {
    this._router.navigate([
      'purchased-ticket'
    ], {
      relativeTo: this._activatedRoute
        .parent
    })
  }

  navigateToPurchaseEventDetail() {
    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    this._router.navigate([
      '/library',
      'purchases',
      MOMENT_ID,
      'details',
      'ticket-details'
    ]);
  }

  private _resetMemberAddedSuccessfully() {
    this.memberAddedSuccessfully = Immutable.Map({
      isSuccess: false,
      fullName: ''
    });
  }

  private _toTitle(value: string) {
    return this._titleCasePipe
      .transform(value);
  }

  private _unsubscribeIdentityFieldValueChangesSubscription() {
    if (this._identityFieldValueChangesSubscription instanceof Subscription) {
      this._identityFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _unsubscribeMomentIDRouteParamSubscription() {
    if (this._momentIDRouteParamSubscription instanceof Subscription) {
      this._momentIDRouteParamSubscription.unsubscribe();
    }
  }

  private _unsubscribeTicketIDRouteParamSubscription() {
    if (this._ticketIDRouteParamSubscription instanceof Subscription) {
      this._ticketIDRouteParamSubscription.unsubscribe();
    }
  }

  private _extractRouteParams() {
    this._ticketIDRouteParamSubscription = this._activatedRoute
      .params.subscribe(params => {
        const TICKET_ID = convertItemToNumeric(
          params['ticketID']);


        this._routeParams = this._routeParams.set(
          'ticketID', TICKET_ID);

        const ORDER_ID = convertItemToNumeric(
          params['orderItemID']);


        this._routeParams = this._routeParams.set(
          'orderItemID', ORDER_ID);
      });

    this._momentIDRouteParamSubscription = this._activatedRoute
      .parent?.parent?.parent?.parent?.params
      .subscribe(params => {
        const MOMENT_ID = convertItemToNumeric(
          params['momentID']);

        if (!isANumber(MOMENT_ID)) {
          return;
        }

        this._routeParams = this._routeParams.set(
          'momentID', MOMENT_ID);
      });
  }

  private _automaticallyCleanIdentityField() {
    this._identityFieldValueChangesSubscription = this.selectPersonFormGroup
      ?.get(
        this.SELECT_PERSON_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName
      )
      ?.valueChanges
      ?.pipe(
        distinctUntilChanged())
      ?.subscribe(value => {
        const exp = new RegExp('\\s+', 'g');

        const CLEANED_VALUE = REGEX_REPLACE_WITH(exp, value, '');

        if (fieldValueHasBeenUpdated(value, CLEANED_VALUE, false)) {
          this.selectPersonFormGroup?.get(
            this.SELECT_PERSON_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName
          )?.setValue(
            CLEANED_VALUE, {
            onlySelf: true
          });
        }
      });
  }

  private _resetFormGroupFields() {
    const FIELDS = this.SELECT_PERSON_PARAM.constructFields();

    for (const FIELD of FIELDS) {
      this.selectPersonFormGroup
        ?.get(FIELD.formControlName)?.reset();
    }
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _initializeSignInFormGroup() {
    this.selectPersonFormGroup = this._formBuilder.group({
      [this.SELECT_PERSON_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName]: [
        this.SELECT_PERSON_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.defaultValue,
        this.SELECT_PERSON_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.validators],
    }, { updateOn: 'blur' });

    this._automaticallyCleanIdentityField();
  }

  private _showErrorNote(totalInvalidFormControls: number | undefined, errorMessage = '') {
    if (!(this._errornoteCmp instanceof ErrornoteComponent)) { return; }

    this._errornoteCmp.showErrorNote(totalInvalidFormControls, errorMessage);
    this._errornoteCmp.manuallyTriggerChangeDetection();
  }


  onSubmit() {
    if (this.addingPerson) {
      return;
    }

    this.submitted = true;

    if (this.selectPersonFormGroup?.invalid) {
      const totalInvalidFormControls = getFormGroupOrFormArrayTotalNumberOfInvalidFields(
        this.selectPersonFormGroup);

      this._showErrorNote(totalInvalidFormControls);

      console.warn('Form is invalid. Aborting')

      return;
    }


    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    this.addingPerson = true;

    const selectPersonFormData = new FormData();

    const identity = convertItemToString(
      this.selectPersonFormGroup?.get(
        this.SELECT_PERSON_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName)?.value)?.trim();
    selectPersonFormData.append(
      this.SELECT_PERSON_PARAM.USERNAME_OR_EMAIL_PHONE_NUMBER.permanentStoreKey, identity);

    const TICKET_ID = convertItemToString(
      this._routeParams.get('ticketID'));
    selectPersonFormData.append('ticket', TICKET_ID);


    const ORDER_ID = convertItemToString(
      this._routeParams.get('orderItemID'));
    selectPersonFormData.append('orderItem', ORDER_ID);

    this._addAnotherMemberSubscription = this._addMemberService
      .addStreamBuddy$(MOMENT_ID, selectPersonFormData)
      .subscribe((details: any) => {
        this.addingPerson = false;

        this._resetFormGroupFields();

        this.submitted = false;

        this.memberAddedSuccessfully = this.memberAddedSuccessfully
          .set('isSuccess', true);

        this.memberAddedSuccessfully = this.memberAddedSuccessfully
          .set('fullName', details.full_name);

        this._manuallyTriggerChangeDetection();
      }, (err) => {
        console.error(err);

        this.submitted = false;

        const errorMessage = {
          title: 'Something Went Wrong, Please Try Again',
          description: 'We\'re sorry, but something went wrong. Please try again.'
        }

        const backend_error = err.error;

        switch (err.status) {
          case 400:
            if (getBoolean(backend_error.already_added)) {
              errorMessage.title = 'Already a member.';
              const full_name = convertItemToString(backend_error.full_name);

              if (stringIsEmpty(full_name)) {
                errorMessage.description = '<strong>';
                errorMessage.description += full_name;
                errorMessage.description += ' </strong>';
                errorMessage.description += 'has already been added.';
              }
              else {
                errorMessage.description = 'Member has already been added.';
              }

            }
            else {
              if (!stringIsEmpty(backend_error.title)) {
                errorMessage.title = backend_error.title;
              }

              if (!stringIsEmpty(backend_error.description)) {
                errorMessage.description = backend_error.description;
              }
            }

            break;

          default:
            break;
        }

        this._setModalTitle(
          errorMessage.title);

        this._setModalBody(errorMessage.description);

        this._triggerModal();

        this.addingPerson = false;

        this._manuallyTriggerChangeDetection();
      });
  }

  private _triggerModal() {
    if (this._addStreamBuddyResponseModalFullscrenCmp instanceof ModalFullscreenComponent) {
      this._addStreamBuddyResponseModalFullscrenCmp
        .manuallyTriggerModal();
    }
  }

  private _setModalBody(value: string) {
    if (this._addStreamBuddyResponseModalFullscrenCmp instanceof ModalFullscreenComponent) {
      this._addStreamBuddyResponseModalFullscrenCmp
        .setModalBody(value);
    }
  }

  private _setModalTitle(value: string) {
    if (this._addStreamBuddyResponseModalFullscrenCmp instanceof ModalFullscreenComponent) {
      this._addStreamBuddyResponseModalFullscrenCmp
        .setModalTitle(value);
    }
  }
}

class SelectPersonParam {
  public static readonly NAME_OF_FORM_GROUP = 'selectPersonFormGroup';

  public static readonly USERNAME_OR_EMAIL_PHONE_NUMBER = {
    formControlName: 'usernameOrEmailOrPhoneNumber',
    temporaryStoreKey: 'usernameOrEmailOrPhoneNumber',
    permanentStoreKey: 'add',
    validators: Validators.compose([
      Validators.required,
      Validators.maxLength(250),
      MinCharacterNotGenuinelyAchievedValidator
        .minCharacterNotGenuinelyAchieved(1)
    ]),
    label: 'Enter either your username, phone number or email',
    defaultValue: '',
    isRequired: true,
    placeholder: 'Enter the person\'s username or phone number or email address here.',
    slug: constructInputFieldIdentification,
    errors: {
      incorrectCredentials: 'Account not found.',
      requiredOrNullOrNoValueProvidedErrorMessage: 'Provide either their username, email or phone number.',
      minCharacterNotGenuinelyAchievedErrorMessage: 'Are you sure you entered their either their username, email or phone number correctly?',
      maxLengthPrefixErrorMessage: 'That either their username, email or phone number is too long. You need to shortern that either their username, email or phone number.',
      minLengthPrefixErrorMessage: 'That either their username, email or phone number is too short. You need to lengthen that either their username, email or phone number.'
    },
  };

  public static constructFields() {
    const fields = [
      {
        formControlName: this.USERNAME_OR_EMAIL_PHONE_NUMBER.formControlName,
        temporaryStoreKey: this.USERNAME_OR_EMAIL_PHONE_NUMBER.temporaryStoreKey,
        permanentStoreKey: this.USERNAME_OR_EMAIL_PHONE_NUMBER.permanentStoreKey,
      },
    ];

    return fields;
  }
}
