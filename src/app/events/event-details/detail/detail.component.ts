import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { convertItemToNumeric, convertItemToString, stringIsEmpty } from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { ScrollService } from '@sharedModule/services';
import { DetailService } from './services';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { TrailerComponent } from './sections/trailer/trailer.component';
import { HighlightsComponent } from './sections/highlights/highlights.component';
import { TrailerHttpResponse } from '../custom-types';
import { VideoItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';

@Component({
  selector: 'snap-detail',
  templateUrl: './detail.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private _activatedRouteParamSubscription: Subscription | undefined;

  private _retrieveEventDetailSubscription: Subscription | undefined;

  private _routeParams = Immutable.Map({});

  eventDetails = Immutable.fromJS({});

  @ViewChild(HighlightsComponent)
  private _highlightsCmp: HighlightsComponent | undefined;

  @ViewChild(TrailerComponent)
  private _trailerCmp: TrailerComponent | undefined;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _detailService: DetailService,
    private _loadingScreenService: LoadingScreenService,
    private _scrollService: ScrollService,
  ) { }

  ngOnInit() {
    this._extractRouteParams();
  }

  ngAfterViewInit() {
    this._retrieveEventDetail();
  }

  ngOnDestroy() {
    this._unsubscribeActivatedRouteParamSubscription();

    this._unsubscribeRetrieveEventDetailSubscription();
  }

  private _unsubscribeRetrieveEventDetailSubscription() {
    if (this._retrieveEventDetailSubscription instanceof Subscription) {
      this._retrieveEventDetailSubscription.unsubscribe();
    }
  }

  private _setHighlights(
    nameOfMoment: string, video: VideoItemPreviewFormatHttpResponse) {
    if (this._highlightsCmp instanceof HighlightsComponent) {
      this._highlightsCmp.setEventHighlights(
        nameOfMoment, video);
    }
  }

  private _setEventTrailer(
    nameOfMoment: string, video: VideoItemPreviewFormatHttpResponse) {
    if (this._trailerCmp instanceof TrailerComponent) {
      this._trailerCmp.setEventTrailer(
        nameOfMoment, video);
    }
  }

  private _unsubscribeActivatedRouteParamSubscription() {
    if (this._activatedRouteParamSubscription instanceof Subscription) {
      this._activatedRouteParamSubscription.unsubscribe();
    }
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _extractRouteParams() {
    this._activatedRouteParamSubscription = this._activatedRoute
      .params.subscribe(params => {
        const MOMENT_ID = convertItemToNumeric(
          params?.momentID);

        this._routeParams = this._routeParams.set(
          'momentID', MOMENT_ID);
      })
  }

  get MOMENT_ID() {
    const momentID = convertItemToString(
      this._routeParams.get('momentID'));

    return momentID;
  }

  private _retrieveEventDetail() {
    this._startLoading();

    const MOMENT_ID = this.MOMENT_ID;

    this._retrieveEventDetailSubscription = this._detailService
      .retrieveEventDetail$(MOMENT_ID)
      .subscribe(details => {
        this.eventDetails = Immutable.fromJS(details);

        const eventTrailer = details.eventTrailer;

        const nameOfMoment = details.nameOfMoment;

        if (eventTrailer && !stringIsEmpty(eventTrailer?.src)) {
          this._setEventTrailer(
            nameOfMoment, eventTrailer);
        }

        const highlights = details.highlights;
        if (highlights && !stringIsEmpty(highlights?.src)) {
          this._setHighlights(
            nameOfMoment, highlights);
        }

        this._stopLoading();

        this._manuallyTriggerChangeDetection();
      }, (err) => {
        console.error(err);
      });
  }

}
