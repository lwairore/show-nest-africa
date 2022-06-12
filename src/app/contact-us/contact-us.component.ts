import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import * as Immutable from 'immutable';
import { ScrollService } from '@sharedModule/services';
import { ContactUsService } from './services';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { tap } from 'rxjs/operators';
import { convertItemToString } from '@sharedModule/utilities';
import { SafePipeDomSanitizerTypes } from '@sharedModule/consts';
import { BreadcrumbComponent } from '@sharedModule/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'snap-contact-us',
  templateUrl: './contact-us.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactUsComponent implements OnInit, AfterViewInit, OnDestroy {
  private _loadRequiredDetailsSubscription: Subscription | undefined;

  locationDetails = Immutable.fromJS({});

  phoneNumbers = Immutable.fromJS([]);

  mails = Immutable.fromJS([]);

  readonly TRUST_RESOURCE_URL_SAFE_PIPE_KEY = SafePipeDomSanitizerTypes.RESOURCE_URL;

  @ViewChild(BreadcrumbComponent, { read: BreadcrumbComponent })
  private _breadcrumbCmpElRef: ElementRef | undefined;

  constructor(
    private _contactUsService: ContactUsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _loadingScreenService: LoadingScreenService,
    private _scrollService: ScrollService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._setBreadcrumbDetails();

    this._loadRequiredDetails();
  }

  ngOnDestroy() {
    this._unsubscribeLoadRequiredDetailsSubscription();
  }

  private _unsubscribeLoadRequiredDetailsSubscription() {
    if (this._loadRequiredDetailsSubscription instanceof Subscription) {
      this._loadRequiredDetailsSubscription.unsubscribe();
    }
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _setBreadcrumbDetails() {
    const breadcrumbDetails = Immutable.fromJS({
      poster: {
        src: 'assets/images/background/asset-25.jpeg'
      },
    });

    if (this._breadcrumbCmpElRef instanceof BreadcrumbComponent) {
      this._breadcrumbCmpElRef.breadcrumbDetails = breadcrumbDetails;

      if (!this._breadcrumbCmpElRef.breadcrumbDetails.isEmpty()) {
        this._breadcrumbCmpElRef.manuallyTriggerChangeDetection();
      }
    }
  }

  // get mapQueryset() {
  //   const api = 'https://maps.google.com/maps?width=100%25&amp;height=550&amp;hl=en&amp;q=+:mapQueryset&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed'
  //   const location = convertItemToString(
  //     this.locationDetails.get('location', ''))
  //     .replace(/\s/g, '%20');

  //   console.log(`api.replace(
  //       ':mapQueryset', location);`);
  //   console.log(api.replace(
  //     ':mapQueryset', location));

  //   return api.replace(
  //     ':mapQueryset', location);
  // }

  trackByEmailAddress(index: number, emailAddress: any) {
    return emailAddress?.get('emailAddress');
  }

  trackByPhoneNumber(index: number, phoneNumber: any) {
    return phoneNumber?.get('phoneNumber');
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }

  private _loadRequiredDetails() {
    this._startLoading();

    const OUR_LOCATION$ = this._contactUsService
      .retrieveOurLocation$()
      .pipe(
        tap(details => {
          this.locationDetails = Immutable.fromJS(details);
        }));

    const PHONE_NUMBERS$ = this._contactUsService
      .listPhoneContactInfo$()
      .pipe(
        tap(details => {
          this.phoneNumbers = Immutable.fromJS(details);
        }));

    const MAIL$ = this._contactUsService
      .listMailContactInfo$()
      .pipe(
        tap(details => {
          this.mails = Immutable.fromJS(details)
        }));

    this._loadRequiredDetailsSubscription = forkJoin(
      [
        OUR_LOCATION$, PHONE_NUMBERS$, MAIL$
      ]).subscribe(_ => {
        this._stopLoading();

        this._manuallyTriggerChangeDetection();
      }, (err) => console.error(err))
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }
}
