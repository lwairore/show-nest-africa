import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ScrollService } from '@sharedModule/services';
import { LipaNaMPesaOnlineService } from '../../services';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { FormatPhoneNumberPipe } from '@sharedModule/pipes/format-phone-number.pipe';
import { convertItemToNumeric, isANumber, convertItemToString, stringIsEmpty, getBoolean } from '@sharedModule/utilities';
import { Subscription } from 'rxjs';
import * as Immutable from 'immutable';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'snap-mpesa-transaction-status',
  templateUrl: './mpesa-transaction-status.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormatPhoneNumberPipe,
  ]
})
export class MpesaTransactionStatusComponent implements OnInit, AfterViewInit, OnDestroy {
  private _routeParams = Immutable.Map({});

  paymentRequestInfo = Immutable.Map({
    visualClueFaIcon: '',
    statusHeading: '',
    statusDescription: '',
    statusCTA: '',
    displayAsError: false
  });

  private _routeParamsSubscription: Subscription | undefined;

  private _routeMomentIDParamsSubscription: Subscription | undefined;

  private _retrievePaymentRequestInfoSubscription: Subscription | undefined;

  private _queryStatusPaymentSubscription: Subscription | undefined;


  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _lipaNaMPesaOnlineService: LipaNaMPesaOnlineService,
    private _loadingScreenService: LoadingScreenService,
    private _formatPhoneNumberPipe: FormatPhoneNumberPipe,
  ) { }

  ngOnInit() {
    this._extractRouteParams();
  }

  ngAfterViewInit() {
    this.retrievePaymentRequestInfo();
  }

  ngOnDestroy() {
    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeRouteMomentIDParamsSubscription();

    this._unsubscribeRetrievePaymentRequestInfoSubscription();

    this._unsubscribeQueryStatusPaymentSubscription();
  }

  private _unsubscribeQueryStatusPaymentSubscription() {
    if (this._queryStatusPaymentSubscription instanceof Subscription) {
      this._queryStatusPaymentSubscription.unsubscribe();
    }
  }

  private _unsubscribeRetrievePaymentRequestInfoSubscription() {
    if (this._retrievePaymentRequestInfoSubscription instanceof Subscription) {
      this._retrievePaymentRequestInfoSubscription.unsubscribe();
    }
  }

  private _unsubscribeRouteMomentIDParamsSubscription() {
    if (this._routeMomentIDParamsSubscription instanceof Subscription) {
      this._routeMomentIDParamsSubscription.unsubscribe();
    }
  }

  private _unsubscribeRouteParamsSubscription() {
    if (this._routeParamsSubscription instanceof Subscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _formatPhoneNumber(value: string) {
    return this._formatPhoneNumberPipe
      .transform(value);
  }

  private retrievePaymentRequestInfo() {
    this._startLoading();

    const MOMENT_ID = this.momentID;

    const ORDER_ITEM_ID = this.orderItemID;

    const REQUEST_RECORD_ID = this.requestRecordID;


    this._retrievePaymentRequestInfoSubscription = this._lipaNaMPesaOnlineService
      .retrievePaymentRequestInfo$(
        MOMENT_ID, ORDER_ITEM_ID, REQUEST_RECORD_ID)
      .subscribe(details => {
        const successMessage = {
          title: 'Almost done',
          description: `We have sent payment request to <strong>${this._formatPhoneNumber(details.stkPushSentTo)}</strong>`,
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

  checkMPesaPaymentStatus() {
    this._startLoading();

    const MOMENT_ID = this.momentID;

    const ORDER_ITEM_ID = this.orderItemID;

    const REQUEST_RECORD_ID = this.requestRecordID;

    this._queryStatusPaymentSubscription = this._lipaNaMPesaOnlineService
      .queryStatusOfALipaNaMPesaOnlinePayment$(
        MOMENT_ID, ORDER_ITEM_ID, REQUEST_RECORD_ID)
      .subscribe(details => {
        const successMessage = {
          title: convertItemToString(details.title),
          description: convertItemToString(details.description),
          action: convertItemToString(details.action),
          paid: getBoolean(details.paid)
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
          title: convertItemToString(err.error.title),
          description: convertItemToString(err.error.description),
          action: convertItemToString(err.error.action),
          paid: getBoolean(err.error.paid)
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

  get momentID() {
    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    return MOMENT_ID;
  }

  navigateToGetTickets() {
    this._router.navigate(['..'], {
      relativeTo: this._activatedRoute
        ?.parent?.parent
    });
  }

  private _extractRouteParams() {
    this._routeMomentIDParamsSubscription = this._activatedRoute
    .parent?.parent?.parent?.parent?.parent?.params
      .subscribe(params => {
        const MOMENT_ID = convertItemToNumeric(
          params['momentID']);

        this._routeParams = this._routeParams.set(
          'momentID', MOMENT_ID);
      })

    this._routeParamsSubscription = this._activatedRoute
      .params
      .subscribe(params => {
        const ORDER_ITEM_ID = convertItemToNumeric(
          params['orderItemID']);

        this._routeParams = this._routeParams.set(
          'orderItemID', ORDER_ITEM_ID);

        const REQUEST_RECORD_ID = convertItemToNumeric(
          params['requestRecordID']);

        this._routeParams = this._routeParams.set(
          'requestRecordID', REQUEST_RECORD_ID);

      });
  }

  get orderItemID() {
    const ORDER_ITEM_ID = convertItemToString(
      this._routeParams.get('orderItemID'));

    return ORDER_ITEM_ID;
  }

  get requestRecordID() {
    const REQUEST_RECORD_ID = convertItemToString(
      this._routeParams.get('requestRecordID'));

    return REQUEST_RECORD_ID;
  }
}
