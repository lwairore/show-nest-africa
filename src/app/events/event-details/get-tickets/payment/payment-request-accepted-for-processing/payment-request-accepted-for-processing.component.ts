import {
  ChangeDetectionStrategy, Renderer2,
  ChangeDetectorRef, Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, NgZone
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import * as Immutable from 'immutable';
import { Subscription } from "rxjs";
import { FormatPhoneNumberPipe } from '@sharedModule/pipes/format-phone-number.pipe';
import { ScrollService } from '@sharedModule/services';
import { LipaNaMPesaOnlineService, BraintreePaymentGatewayService } from '../../services';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { convertItemToNumeric, convertItemToString, getBoolean, isANumber, isObjectEmpty, stringIsEmpty } from '@sharedModule/utilities';


@Component({
  selector: 'snap-payment-request-accepted-for-processing',
  templateUrl: './payment-request-accepted-for-processing.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormatPhoneNumberPipe,
    LoadingScreenService,
  ]
})
export class PaymentRequestAcceptedForProcessingComponent implements OnInit, AfterViewInit, OnDestroy {
  private _routeParams = Immutable.Map({});

  private _queryStatusOfALipaNaMPesaOnlinePaymentSubscription: Subscription | undefined;

  private _queryStatusOfPaymentSubscription: Subscription | undefined;

  private _routeParamsSubscription: Subscription | undefined;

  private _retrievePaymentRequestInfoSubscription: Subscription | undefined;

  private _optionalParameterSubscription: Subscription | undefined;


  paymentRequestInfo = Immutable.Map({
    visualClueFaIcon: '',
    statusHeading: '',
    statusDescription: '',
    statusCTA: '',
    displayAsError: false
  });

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _scrollService: ScrollService,
    private _lipaNaMPesaOnlineService: LipaNaMPesaOnlineService,
    private _loadingScreenService: LoadingScreenService,
    private _renderer2: Renderer2,
    private _formatPhoneNumberPipe: FormatPhoneNumberPipe,
    private _braintreeService: BraintreePaymentGatewayService,
  ) { }

  ngOnInit() {
    this._extractRouteParams();
  }

  ngAfterViewInit() {
    if (this._routeParams.get('probablyPaidBy') === 'mpesa') {
      this.retrievePaymentRequestInfo();
    }
    else {
      this._checkPaymentStatus();
    }
  }

  ngOnDestroy() {
    this._unsubscribeRetrievePaymentRequestInfoSubscription();

    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeQueryStatusOfALipaNaMPesaOnlinePaymentSubscription();

    this._unsubscribeQueryStatusOfPaymentSubscription();

    this._unsubscribeOptionalParameterSubscription();
  }

  private _unsubscribeQueryStatusOfPaymentSubscription() {
    if (this._queryStatusOfPaymentSubscription instanceof Subscription) {
      this._queryStatusOfPaymentSubscription.unsubscribe();
    }
  }

  private _unsubscribeOptionalParameterSubscription() {
    if (this._optionalParameterSubscription instanceof Subscription) {
      this._optionalParameterSubscription.unsubscribe();
    }
  }

  private formatPhoneNumber(value: string) {
    return this._formatPhoneNumberPipe.transform(value);
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  queryPaymentStatus() {
    if (this._routeParams.get('probablyPaidBy') === 'mpesa') {
      this._checkMPesaPaymentStatus();
    }
    else {
      this._checkPaymentStatus();
    }
  }

  private _checkMPesaPaymentStatus() {
    this._startLoading();

    const MOMENT_ID = this._routeParams.get('momentID');

    this._queryStatusOfALipaNaMPesaOnlinePaymentSubscription = this._lipaNaMPesaOnlineService
      .queryStatusOfALipaNaMPesaOnlinePayment$(
        '1', '3', '5')
      .subscribe(details => {
        const successMessage = {
          title: details.title as string,
          description: details.description as string,
          action: '',
        }

        if (details.paid) {
          successMessage.action = 'goTo__eventDetails'
        } else {
          successMessage.action = 'check__paymentStatus'
        }

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'visualClueFaIcon', 'fa-check-circle');

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'action', successMessage.action);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusHeading', successMessage.title);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusDescription', successMessage.description);

        this._stopLoading();

        this._manuallyTriggerChangeDetection();
      }, (err: HttpErrorResponse) => {
        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'visualClueFaIcon', 'fa-times-circle');

        const errorMessage = {
          title: err.error?.title,
          description: err.error?.description,
          action: 'check__paymentStatus',
        }

        if (stringIsEmpty(errorMessage.title)) {
          errorMessage.title = 'Something Went Wrong, Please Try Again';
        }

        if (stringIsEmpty(errorMessage.description)) {
          errorMessage.description = 'We\'re sorry, but something went wrong. Please try again.';
        }

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusDescription', errorMessage.description);


        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusHeading', errorMessage.title);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'action', errorMessage.action);

        this._stopLoading();

        this._manuallyTriggerChangeDetection();
      });
  }

  private _checkPaymentStatus() {
    this._startLoading();

    const MOMENT_ID = this._routeParams.get('momentID');

    if (!isANumber(MOMENT_ID)) {
      this._stopLoading();

      return;
    }

    this._queryStatusOfPaymentSubscription = this._braintreeService
      .queryStatusOfPayment$(
        convertItemToString(MOMENT_ID), '3', '4')
      .subscribe(details => {
        const successMessage = {
          title: details.title as string,
          description: details.description as string,
          action: '',
        }

        if (details.paid) {
          successMessage.action = 'goTo__eventDetails'
        } else {
          successMessage.action = 'check__paymentStatus'
        }

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'visualClueFaIcon', 'fa-check-circle');

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusHeading', successMessage.title);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusDescription', successMessage.description);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'action', successMessage.action);

        this._stopLoading();

        this._manuallyTriggerChangeDetection();
      }, (err: HttpErrorResponse) => {
        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'visualClueFaIcon', 'fa-times-circle');

        const errorMessage = {
          title: err.error?.title,
          description: err.error?.description,
          action: '',
        }

        switch (err.status) {
          case 404:
            errorMessage.action = 'purchase__tickets'
            break;
          case 0:
            errorMessage.action = 'try__again';
            break;
          default:
            errorMessage.action = 'try__again';
            break;
        }

        if (stringIsEmpty(errorMessage.title)) {
          errorMessage.title = 'Something Went Wrong, Please Try Again';
        }

        if (stringIsEmpty(errorMessage.description)) {
          errorMessage.description = 'We\'re sorry, but something went wrong. Please try again.';
        }

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusDescription', errorMessage.description);


        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusHeading', errorMessage.title);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'action', errorMessage.action);

        this._stopLoading();

        this._manuallyTriggerChangeDetection();
      });
  }

  navigateToGoToEventDetails() {
    this._router.navigate(['../..'], { relativeTo: this._activatedRoute });
  }

  navigateToGetTickets() {
    this._router.navigate(['..'], { relativeTo: this._activatedRoute });
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private retrievePaymentRequestInfo() {
    this._startLoading();

    const MOMENT_ID = this._routeParams.get('momentID');

    if (!isANumber(MOMENT_ID)) {
      return;
    }

    this._retrievePaymentRequestInfoSubscription = this._lipaNaMPesaOnlineService
      .retrievePaymentRequestInfo$(
        '2', '3', '1')
      .subscribe(details => {
        const successMessage = {
          title: 'Almost done',
          description: `We have sent payment request to <strong>${this.formatPhoneNumber(details.stkPushSentTo)}</strong>`,
          action: 'check__paymentStatus',
        };
        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'visualClueFaIcon', 'fa-check-circle');

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusHeading', successMessage.title);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusDescription', successMessage.description);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'action', successMessage.action);

        this._stopLoading();

        this._manuallyTriggerChangeDetection();

      }, (err: HttpErrorResponse) => {
        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'visualClueFaIcon', 'fa-times-circle');

        const errorMessage = {
          title: err.error?.title,
          description: err.error?.description,
          action: 'check__paymentStatus',
        }

        if (stringIsEmpty(errorMessage.title)) {
          errorMessage.title = 'Something Went Wrong, Please Try Again';
        }

        if (stringIsEmpty(errorMessage.description)) {
          errorMessage.description = 'We\'re sorry, but something went wrong. Please try again.';
        }

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusHeading', errorMessage.title);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'statusDescription', errorMessage.description);

        this.paymentRequestInfo = this.paymentRequestInfo.set(
          'action', errorMessage.action);

        this._stopLoading();

        this._manuallyTriggerChangeDetection();
      });
  }


  private _unsubscribeQueryStatusOfALipaNaMPesaOnlinePaymentSubscription() {
    if (this._queryStatusOfALipaNaMPesaOnlinePaymentSubscription instanceof Subscription) {
      this._queryStatusOfALipaNaMPesaOnlinePaymentSubscription.unsubscribe();
    }
  }

  private _unsubscribeRetrievePaymentRequestInfoSubscription() {
    if (this._retrievePaymentRequestInfoSubscription instanceof Subscription) {
      this._retrievePaymentRequestInfoSubscription.unsubscribe();
    }
  }

  private _unsubscribeRouteParamsSubscription() {
    if (this._routeParamsSubscription instanceof Subscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }

  private _extractOptionalParameters() {
    this._optionalParameterSubscription = this._activatedRoute.params
      .subscribe(params => {
        this._routeParams = this._routeParams
          .set('probablyPaidBy', params.probablyPaidBy);
      });
  }

  private _extractRouteParams() {
    this._extractOptionalParameters();

    this._routeParamsSubscription = this._activatedRoute
      .parent?.params
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
}
