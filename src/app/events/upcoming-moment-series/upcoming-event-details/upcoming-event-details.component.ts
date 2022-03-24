import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollService } from '@sharedModule/services';
import {
  convertItemToNumeric,
  convertItemToString,
  isANumber
} from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import {
  TrailerFormatHttpResponse
} from './custom-types';
import { CompellingEventDescriptionComponent } from './sections/compelling-event-description/compelling-event-description.component';
import { TrailerComponent } from './sections/trailer/trailer.component';
import { UpcommingEventDetailsService } from './upcomming-event-details.service';

@Component({
  selector: 'snap-upcoming-event-details',
  templateUrl: './upcoming-event-details.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingEventDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  postMeta = Immutable.fromJS({});

  widgetDetails = Immutable.fromJS({});

  socialMediaLinks = Immutable.fromJS([]);

  private _routeParams = Immutable.Map({});

  _retrieveUpcommingEventDetailSubscription: Subscription | undefined;

  private _routeParamsSubscription: Subscription | undefined;

  @ViewChild(CompellingEventDescriptionComponent)
  private _compellingEventDescriptionCmp: CompellingEventDescriptionComponent | undefined;

  @ViewChild(TrailerComponent)
  private _trailerCmp: TrailerComponent | undefined;

  loadingDetails = false;

  constructor(
    private _eventDetailsService: UpcommingEventDetailsService,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this._extractRouteParams();
  }

  ngAfterViewInit(): void {
    this._retrieveUpcommingEventDetails();
  }

  ngOnDestroy(): void {
    this._unsubscribeRetrieveUpcommingEventDetailSubscription();

    this._unsubscribeRouteParamsSubscription();
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }

  private _unsubscribeRouteParamsSubscription() {
    if (this._routeParamsSubscription instanceof Subscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }

  private _extractRouteParams() {
    this._routeParamsSubscription = this._activatedRoute.params
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

  private _unsubscribeRetrieveUpcommingEventDetailSubscription() {
    if (this._retrieveUpcommingEventDetailSubscription instanceof Subscription) {
      this._retrieveUpcommingEventDetailSubscription.unsubscribe();
    }
  }

  private _retrieveUpcommingEventDetails() {
    const MOMENT_ID = this._routeParams.get('momentID');

    if (!isANumber(MOMENT_ID)) {
      return;
    }

    this._retrieveUpcommingEventDetailSubscription = this._eventDetailsService
      .retrieveUpcommingEventDetails$(
        convertItemToString(MOMENT_ID))
      .subscribe(details => {
        this.postMeta = Immutable.fromJS({
          poster: details.proposal.poster,
          callToAction: details.callToAction,
          startsOn: details.startsOn,
          nameOfMoment: details.proposal.nameOfMoment
        });

        this.widgetDetails = Immutable.fromJS({
          venue: details.venue,
          startsOn: details.startsOn,
        });

        this._setEventDescription(details.description);

        this._setEventTrailer(details.trailer);

        this._manuallyTriggerChangeDetection();

        this._backToTop();
      }, err => console.error(err));
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _setEventTrailer(details?: TrailerFormatHttpResponse) {
    if ((this._trailerCmp instanceof TrailerComponent) && details) {
      this._trailerCmp.setEventTrailer(details);
    }
  }

  private _setEventDescription(eventDescription: string) {
    if (this._compellingEventDescriptionCmp instanceof CompellingEventDescriptionComponent) {
      this._compellingEventDescriptionCmp.setEventDescription(eventDescription);
    }
  }

}
