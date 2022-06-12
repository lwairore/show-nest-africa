import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ScrollService } from '@sharedModule/services';
import { BraintreePaymentGatewayService } from '../../services';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { convertItemToString, getBoolean, stringIsEmpty, convertItemToNumeric } from '@sharedModule/utilities';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'snap-card-transaction-status',
  templateUrl: './card-transaction-status.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTransactionStatusComponent implements OnInit, AfterViewInit, OnDestroy {
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

  private _queryStatusPaymentSubscription: Subscription | undefined;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _scrollService: ScrollService,
    private _braintreeService: BraintreePaymentGatewayService,
    private _loadingScreenService: LoadingScreenService,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit() {
    this._extractRouteParams();
  }

  ngAfterViewInit() {
    this.checkPaymentStatus();
  }

  ngOnDestroy() {
    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeRouteMomentIDParamsSubscription();

    this._unsubscribeQueryStatusPaymentSubscription();
  }

  private _unsubscribeQueryStatusPaymentSubscription() {
    if (this._queryStatusPaymentSubscription instanceof Subscription) {
      this._queryStatusPaymentSubscription.unsubscribe();
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

  navigateToGetTickets() {
    this._router.navigate(['..'], {
      relativeTo: this._activatedRoute
        ?.parent?.parent
    });
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

        const TRANSCATION_ID = convertItemToNumeric(
          params['transactionID']);

        this._routeParams = this._routeParams.set(
          'transactionID', TRANSCATION_ID);

      });
  }

  get momentID() {
    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    return MOMENT_ID;
  }

  get orderItemID() {
    const ORDER_ITEM_ID = convertItemToString(
      this._routeParams.get('orderItemID'));

    return ORDER_ITEM_ID;
  }

  get transactionID() {
    const TRANSACTION_ID = convertItemToString(
      this._routeParams.get('transactionID'));

    return TRANSACTION_ID;
  }

  checkPaymentStatus() {
    this._startLoading();

    const MOMENT_ID = this.momentID;

    const ORDER_ITEM_ID = this.orderItemID;

    const TRANSACTION_ID = this.transactionID;

    this._queryStatusPaymentSubscription = this._braintreeService
      .queryStatusOfPayment$(
        MOMENT_ID, ORDER_ITEM_ID, TRANSACTION_ID)
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
}
