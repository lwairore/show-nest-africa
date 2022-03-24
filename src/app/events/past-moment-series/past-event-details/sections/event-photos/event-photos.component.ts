import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { convertItemToNumeric, convertItemToString, isANumber } from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { forkJoin, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PastEventDetailsService } from '../../past-event-details.service';

@Component({
  selector: 'snap-event-photos',
  templateUrl: './event-photos.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventPhotosComponent implements OnInit, AfterViewInit, OnDestroy {
  photos = Immutable.fromJS([]);

  private _routeParams = Immutable.Map({});

  paginationDetailsForPhotos = Immutable.Map({
    next: 0,
  });

  private _routeParamsSubscription: Subscription | undefined;

  private _listPhotosSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  loadingDetails = false;

  hasNoPhotos = false;

  breadcrumbDetails = Immutable.fromJS({});

  MODAL_ID_FOR_FULL_CAPTION = 'eventPhotos__readFullCaption';

  selectedPhotoDetails = Immutable.fromJS({});

  constructor(
    private _eventDetailsService: PastEventDetailsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._extractRouteParams();
  }

  ngAfterViewInit(): void {
    this._loadRequiredDetails();
  }

  ngOnDestroy(): void {
    this._unsubscribeListPhotosSubscription();

    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();
  }

  viewFullPhotoCaption(loopIndex: number) {
    const CAPTION = this.photos
      .getIn([loopIndex, 'alt']);

    console.log({ CAPTION });

    this.selectedPhotoDetails = Immutable.fromJS(
      {
        'caption': CAPTION
      });
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

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _extractRouteParams() {
    this._routeParamsSubscription = this._activatedRoute?.params
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

  private _unsubscribeListPhotosSubscription() {
    if (this._listPhotosSubscription instanceof Subscription) {
      this._listPhotosSubscription.unsubscribe();
    }
  }

  private _listEventPhotos$(momentID: number, pageNumber: number) {
    return this._eventDetailsService
      .listEventPhotos$(
        convertItemToString(
          momentID), convertItemToString(pageNumber))
      .pipe(
        tap(details => {
          if (Array.isArray(details.results) && details.results.length > 0) {
            this.paginationDetailsForPhotos = this.paginationDetailsForPhotos
              .set('next', convertItemToNumeric(
                details.next));

            const newVal = Immutable.fromJS(details.results);

            this.photos = Immutable.mergeDeep(
              this.photos, newVal);

            console.log({ newVal })

            if (!newVal.isEmpty()) {
              this.loadingDetails = false;

              this._manuallyTriggerChangeDetection();
            }
          }
          else {
            this.hasNoPhotos = true;

            this._manuallyTriggerChangeDetection();
          }
        })
      )
  }

  private _loadRequiredDetails() {
    const MOMENT_ID = convertItemToNumeric(
      this._routeParams.get('momentID'));
    if (!isANumber(MOMENT_ID)) {
      return;
    }

    const FETCH_PAGE_NUMBER = 1

    const LIST_PHOTOS$ = this._listEventPhotos$(
      MOMENT_ID, (FETCH_PAGE_NUMBER));

    const RETRIEVE_MOMENT_DETAILS$ = this._eventDetailsService
      .retrieveMomentDetailsForBreadcrumb$(MOMENT_ID)
      .pipe(
        tap(details => {
          this.breadcrumbDetails = Immutable.fromJS(details);
        }));

    this._loadRequiredDetailsSubscription = forkJoin([
      LIST_PHOTOS$,
      RETRIEVE_MOMENT_DETAILS$
    ]).subscribe(_ => { }, (err => console.error(err)))
  }

  listPhotos() {
    const MOMENT_ID = convertItemToNumeric(
      this._routeParams.get('momentID'));
    if (!isANumber(MOMENT_ID)) {
      return;
    }

    let FETCH_PAGE_NUMBER = convertItemToNumeric(
      this.paginationDetailsForPhotos.get('next'));

    if (!isANumber(FETCH_PAGE_NUMBER)) {
      return;
    }

    if (FETCH_PAGE_NUMBER === 0) {
      FETCH_PAGE_NUMBER = 1;
    }

    if (!this.loadingDetails) {
      this.loadingDetails = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listPhotosSubscription = this._listEventPhotos$(
      MOMENT_ID, FETCH_PAGE_NUMBER
    ).subscribe(_ => { }, (err => {
      console.error(err);
    }));
  }
}
