import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { InvitedMomentDetailService } from './services';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { convertItemToNumeric, convertItemToString } from '@sharedModule/utilities';

@Component({
  selector: 'snap-invited-moment-detail',
  templateUrl: './invited-moment-detail.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitedMomentDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private _routeParams: Immutable.Map<string, number> = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  private _retrieveInvitedMomentSubscription: Subscription | undefined;

  momentDetails = Immutable.fromJS({});

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _invitedMomentDetailService: InvitedMomentDetailService,
    private _loadingScreenService: LoadingScreenService,
  ) { }

  ngOnInit() {
    this._extractRouteParams();
  }

  ngAfterViewInit() {
    this._retrieveInvitedMomentDetail();
  }

  ngOnDestroy() {
    this._unsubscribeRetrieveInvitedMomentSubscription();

    this._unsubscribeRouteParamsSubscription();
  }

  private _unsubscribeRouteParamsSubscription() {
    if (this._routeParamsSubscription instanceof Subscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }

  private _unsubscribeRetrieveInvitedMomentSubscription() {
    if (this._retrieveInvitedMomentSubscription instanceof Subscription) {
      this._retrieveInvitedMomentSubscription.unsubscribe();
    }
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

  private _extractRouteParams() {
    this._routeParamsSubscription = this._activatedRoute
      ?.parent?.params
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

  private _retrieveInvitedMomentDetail() {
    this._startLoading();

    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    this._retrieveInvitedMomentSubscription = this._invitedMomentDetailService
      .retrieveInvitedMomentDetail$(MOMENT_ID)
      .subscribe(details => {
        this.momentDetails = Immutable.fromJS(details);

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
