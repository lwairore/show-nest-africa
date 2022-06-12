import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as Immutable from 'immutable';
import { Subscription, forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchasedMomentDetailService } from './services/purchased-moment-detail.service';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { convertItemToNumeric, isANumber, convertItemToString } from '@sharedModule/utilities';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'snap-purchased-moment-detail',
  templateUrl: './purchased-moment-detail.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasedMomentDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private _routeParams: Immutable.Map<string, number> = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  momentDetails = Immutable.fromJS({});


  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _purchasedMomentDetailService: PurchasedMomentDetailService,
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

  navigateBackToPurchases() {
    this._router.navigate([
      '../..',
    ], { relativeTo: this._activatedRoute.parent?.parent });
  }

  navigateToWatchEvent() {
    const MOMENT_ID = this._routeParams.get('momentID');

    this._router.navigate(
      [
        'moments',
        MOMENT_ID,
        'details', 'stream'
      ]
    )
  }

  navigateToEventDetails() {
    const MOMENT_ID = this._routeParams.get('momentID');

    this._router.navigate(
      [
        '/moments',
        MOMENT_ID,
        'details'
      ]);
  }

  navigateToGetTickets() {
    const MOMENT_ID = this._routeParams.get('momentID');

    this._router.navigate(
      [
        '/moments',
        MOMENT_ID,
        'details', 'get-tickets'
      ]
    )
  }

  private _loadRequiredDetails() {
    this._startLoading();

    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    const TICKET_DETAIL$ = this._purchasedMomentDetailService
      .retrievePurchasedMomentDetail$(
        MOMENT_ID)
      .pipe(
        tap(details => {
          this.momentDetails = Immutable.fromJS(details);
        }));

    this._loadRequiredDetailsSubscription = forkJoin([
      TICKET_DETAIL$,
    ]).subscribe(_ => {
      if (!this.momentDetails.isEmpty()) {
        this._manuallyTriggerChangeDetection();
      }

      this._stopLoading();
    }, (err) => console.error(err));
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }
}
