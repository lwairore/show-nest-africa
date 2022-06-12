import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as Immutable from 'immutable';
import { Subscription, forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { AddMemberService } from '../services';
import { convertItemToNumeric, isANumber, convertItemToString } from '@sharedModule/utilities';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'snap-select-purchased-ticket',
  templateUrl: './select-purchased-ticket.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPurchasedTicketComponent implements OnInit, AfterViewInit, OnDestroy {
  private _routeParams: Immutable.Map<string, number> = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  private _listPurchasedTicketsSubscription: Subscription | undefined;

  orderItemDetails = Immutable.fromJS([]);

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _addMemberService: AddMemberService,
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

    this._unsubscribeListPurchasedTicketsSubscription();
  }

  private _unsubscribeListPurchasedTicketsSubscription() {
    if (this._listPurchasedTicketsSubscription instanceof Subscription) {
      this._listPurchasedTicketsSubscription.unsubscribe();
    }
  }

  navigateBackToWatchPartyDetails() {
    this._router.navigate(
      ['.'], {
      relativeTo: this._activatedRoute
        .parent?.parent
    }
    )
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

    const LIST_PURCHASED_TICKETS$ = this._addMemberService
      .listPurchasedTicketForSelectTicket$(
        MOMENT_ID)
      .pipe(
        tap(details => {
          this.orderItemDetails = Immutable.fromJS(details);
        }));

    this._loadRequiredDetailsSubscription = forkJoin([
      LIST_PURCHASED_TICKETS$,
    ]).subscribe(_ => {
      if (!this.orderItemDetails.isEmpty()) {
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
