import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as Immutable from 'immutable';
import { Subscription, forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchasedTicketsService } from './services';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { convertItemToNumeric, isANumber, convertItemToString } from '@sharedModule/utilities';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'snap-purchased-tickets',
  templateUrl: './purchased-tickets.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasedTicketsComponent implements OnInit, AfterViewInit, OnDestroy {
  private _routeParams: Immutable.Map<string, number> = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  purchasedTickets = Immutable.fromJS({});

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _purchasedTicketsService: PurchasedTicketsService,
    private _loadingScreenService: LoadingScreenService,
  ) { }

  ngOnInit() {
    this._extractRouteParams();
  }

  ngAfterViewInit() {
    this._loadRequiredDetails();
  }

  ngOnDestroy() {
    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();
  }

  navigateToEventDetails() {
    const MOMENT_ID = this._routeParams.get('momentID');

    this._router.navigate(
      [
        'moments',
        MOMENT_ID,
        'details'
      ]);
  }

  private _unsubscribeLoadRequiredDetailsSubscription() {
    if (this._loadRequiredDetailsSubscription instanceof Subscription) {
      this._loadRequiredDetailsSubscription.unsubscribe();
    }
  }

  private _unsubscribeRouteParamsSubscription() {
    if (this._routeParamsSubscription instanceof Subscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }

  private _extractRouteParams() {
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

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _loadRequiredDetails() {
    this._startLoading();

    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    const TICKET_DETAIL$ = this._purchasedTicketsService
      .listPurchasedTickets$(
        MOMENT_ID)
      .pipe(
        tap(details => {
          this.purchasedTickets = Immutable.fromJS(details);
        }));

    this._loadRequiredDetailsSubscription = forkJoin([
      TICKET_DETAIL$,
    ]).subscribe(_ => {
      if (!this.purchasedTickets.isEmpty()) {
        this._manuallyTriggerChangeDetection();
      }

      this._stopLoading();
    }, (err) => {
      console.error(err);

      this._stopLoading();
    });
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

}
