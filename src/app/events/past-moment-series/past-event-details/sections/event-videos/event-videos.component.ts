import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { convertItemToNumeric, convertItemToString, isANumber } from '@sharedModule/utilities';
import { VgApiService } from '@videogular/ngx-videogular/core';
import * as Immutable from 'immutable';
import { forkJoin, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PastEventDetailsService } from '../../past-event-details.service';

@Component({
  selector: 'snap-event-videos',
  templateUrl: './event-videos.component.html',
  styles: [
    `.videogular-container {
      width: 100%;
      height: 320px;
      margin: auto;
      overflow: hidden;
  }

  @media (min-width: 1200px) {
      .videogular-container {
          width: 100%;
          height: 658.125px;
      }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
      .videogular-container {
          width: 100%;
          height: 528.75px;
      }
  }

  @media (min-width: 768px) and (max-width: 991px) {
      .videogular-container {
          width: 100%;
          height: 409.5px;
      }
  }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventVideosComponent implements OnInit, AfterViewInit, OnDestroy {
  videos = Immutable.fromJS([]);

  private _routeParams = Immutable.Map({});

  paginationDetailsForVideos = Immutable.Map({
    next: 0,
  });

  private _routeParamsSubscription: Subscription | undefined;

  private _listVideosSubscription: Subscription | undefined;

  private _getDefaultMediaSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  loadingDetails = false;

  hasNoVideos = false;

  breadcrumbDetails = Immutable.fromJS({});

  MODAL_ID_FOR_FULL_CAPTION = 'eventVideos__readFullCaption';

  selectedVideoDetails = Immutable.fromJS({});

  storeApis: Array<VgApiService> = [];

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
    this._unsubscribeListVideosSubscription();

    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();

    this._unsubscribeGetDefaultMediaSubscription();
  }

  private _unsubscribeGetDefaultMediaSubscription() {
    if (this._getDefaultMediaSubscription instanceof Subscription) {
      this._getDefaultMediaSubscription.unsubscribe();
    }
  }

  viewFullVideoDescription(loopIndex: number) {
    const DESCRIPTION = this.videos
      .getIn([loopIndex, 'description']);

    console.log({ DESCRIPTION });

    this.selectedVideoDetails = Immutable.fromJS(
      {
        'description': DESCRIPTION
      });
  }

  onPlayerReady(api: VgApiService, loopIndex: number) {
    this.storeApis.push(api);

    this._getDefaultMediaSubscription = api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(succ => {
          this.handlePlayers(loopIndex)
        });
      }
    );
  }

  pauseAllPlayers() {
    this.storeApis.forEach((api, index) => {
      api.pause();
    });
  }

  handlePlayers(loopIndex: number) {
    this.storeApis.forEach((api, index) => {
      if (index != loopIndex) {
        api.pause()
      }
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

  private _unsubscribeListVideosSubscription() {
    if (this._listVideosSubscription instanceof Subscription) {
      this._listVideosSubscription.unsubscribe();
    }
  }

  private _listEventVideos$(momentID: number, pageNumber: number) {
    return this._eventDetailsService
      .listEventVideos$(
        convertItemToString(
          momentID), convertItemToString(pageNumber))
      .pipe(
        tap(details => {
          if (Array.isArray(details.results) && details.results.length > 0) {
            this.paginationDetailsForVideos = this.paginationDetailsForVideos
              .set('next', convertItemToNumeric(
                details.next));

            const newVal = Immutable.fromJS(details.results);

            this.videos = Immutable.mergeDeep(
              this.videos, newVal);

            console.log({ newVal })

            if (!newVal.isEmpty()) {
              this.loadingDetails = false;

              this._manuallyTriggerChangeDetection();
            }
          }
          else {
            this.hasNoVideos = true;

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

    const LIST_PHOTOS$ = this._listEventVideos$(
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

  listVideos() {
    const MOMENT_ID = convertItemToNumeric(
      this._routeParams.get('momentID'));
    if (!isANumber(MOMENT_ID)) {
      return;
    }

    let FETCH_PAGE_NUMBER = convertItemToNumeric(
      this.paginationDetailsForVideos.get('next'));

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

    this._listVideosSubscription = this._listEventVideos$(
      MOMENT_ID, FETCH_PAGE_NUMBER
    ).subscribe(_ => { }, (err => {
      console.error(err);
    }));
  }
}
