import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollService } from '@sharedModule/services';
import { convertItemToNumeric, convertItemToString, isANumber } from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import { EventSchedhuleDetail, EventSponsorFormatHttpResponse, SocialMediaLinkFormatHttpResponse, SpeakerFormatHttpResponse } from './custom-types';
import { PastEventDetailsService } from './past-event-details.service';
import { CompellingEventDescriptionComponent } from './sections/compelling-event-description/compelling-event-description.component';
import { EventSchedulesDateAndTimeComponent } from './sections/event-schedules-date-and-time/event-schedules-date-and-time.component';
import { SocialMediaLinksComponent } from './sections/social-media-links/social-media-links.component';
import { SpeakersComponent } from './sections/speakers/speakers.component';
import { SponsorLogosComponent } from './sections/sponsor-logos/sponsor-logos.component';
import { VenueLocationOrAddressesComponent } from './sections/venue-location-or-addresses/venue-location-or-addresses.component';

@Component({
  selector: 'snap-past-events-details',
  templateUrl: './past-events-details.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PastEventsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  postMeta = Immutable.fromJS({});

  widgetDetails = Immutable.fromJS({});

  private _routeParams = Immutable.Map({});

  _retrievePastEventDetailSubscription: Subscription | undefined;

  private _routeParamsSubscription: Subscription | undefined;

  loadingDetails = false;

  @ViewChild(CompellingEventDescriptionComponent)
  private _compellingEventDescriptionCmp: CompellingEventDescriptionComponent | undefined;

  @ViewChild(EventSchedulesDateAndTimeComponent)
  private _eventSchedulesCmp: EventSchedulesDateAndTimeComponent | undefined;

  @ViewChild(VenueLocationOrAddressesComponent)
  private _venueCmp: VenueLocationOrAddressesComponent | undefined;

  @ViewChild(SocialMediaLinksComponent)
  private _socialMediaLinksCmp: SocialMediaLinksComponent | undefined;

  @ViewChild(SpeakersComponent)
  private _speakersCmp: SpeakersComponent | undefined;

  @ViewChild(SponsorLogosComponent)
  private _sponsorsCmp: SponsorLogosComponent | undefined;


  constructor(
    private _eventDetailsService: PastEventDetailsService,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this._extractRouteParams();
  }

  ngAfterViewInit(): void {
    this._retrievePastEventDetails();
  }

  ngOnDestroy(): void {
    this._unsubscribeRetrievePastEventDetailSubscription();

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

  private _unsubscribeRetrievePastEventDetailSubscription() {
    if (this._retrievePastEventDetailSubscription instanceof Subscription) {
      this._retrievePastEventDetailSubscription.unsubscribe();
    }
  }

  private _retrievePastEventDetails() {
    const MOMENT_ID = this._routeParams.get('momentID');

    if (!isANumber(MOMENT_ID)) {
      return;
    }

    this._retrievePastEventDetailSubscription = this._eventDetailsService
      .retrievePastEventDetails$(
        convertItemToString(MOMENT_ID))
      .subscribe(details => {
        this.postMeta = Immutable.fromJS({
          poster: details.proposal.poster,
          username: details.proposal.username,
          endsOn: details.endsOn,
          nameOfMoment: details.proposal.nameOfMoment,
          typeOfMoment: details.proposal.typeOfMoment,
          totalTestimonials: details.postEventUpdate?.totalTestimonials,
          totalPhotoGallery: details.postEventUpdate?.totalPhotoGallery,
          totalVideoGallery: details.postEventUpdate?.totalVideoGallery,
        });

        this.widgetDetails = Immutable.fromJS({
          endsOn: details.endsOn,
          venue: details.venue,
          startsOn: details.startsOn,
          cost: details.proposal.cost,
        });

        this._setVenueDetails(details.venue);

        this._setEventDescription(details.description);

        this._setSponsors(details.sponsors);

        this._setSpeakers(details.speakers);

        this._setSocialMediaLinks(details.socialMediaLinks);

        const EVENT_SCHEDHULE_DETAILS: EventSchedhuleDetail = {
          startsOn: details.startsOn,
          endsOn: details.endsOn,
        }
        this._setEventSchedhuleDetails(EVENT_SCHEDHULE_DETAILS);

        this._manuallyTriggerChangeDetection();

        this._backToTop();
      }, (err) => console.error(err));
  }

  private _setSponsors(contactInfos: ReadonlyArray<EventSponsorFormatHttpResponse>) {
    if (this._sponsorsCmp instanceof SponsorLogosComponent) {
      this._sponsorsCmp.setSponsors(contactInfos);
    }
  }

  private _setSpeakers(speakers: ReadonlyArray<SpeakerFormatHttpResponse>) {
    if (this._speakersCmp instanceof SpeakersComponent) {
      this._speakersCmp.setSpeakers(speakers);
    }
  }

  private _setSocialMediaLinks(details: ReadonlyArray<SocialMediaLinkFormatHttpResponse>) {
    if (this._socialMediaLinksCmp instanceof SocialMediaLinksComponent) {
      this._socialMediaLinksCmp.setSocialMediaLinks(details);
    }
  }

  private _setVenueDetails(details: string) {
    if (this._venueCmp instanceof VenueLocationOrAddressesComponent) {
      this._venueCmp.setVenueDetails(details);
    }
  }

  private _setEventSchedhuleDetails(details: EventSchedhuleDetail) {
    if (this._eventSchedulesCmp instanceof EventSchedulesDateAndTimeComponent) {
      this._eventSchedulesCmp.setEventSchedhuleDetails(details);
    }
  }

  private _setEventDescription(eventDescription: string) {
    if (this._compellingEventDescriptionCmp instanceof CompellingEventDescriptionComponent) {
      this._compellingEventDescriptionCmp.setEventDescription(eventDescription);
    }
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

}
