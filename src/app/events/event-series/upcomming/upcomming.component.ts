import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as Immutable from 'immutable';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, ScrollService } from '@sharedModule/services';
import { convertItemToString, convertItemToNumeric, isANumber } from '@sharedModule/utilities';
import { tap } from 'rxjs/operators';
import { BreadcrumbComponent } from '@sharedModule/components/breadcrumb/breadcrumb.component';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';

@Component({
  selector: 'snap-upcomming',
  templateUrl: './upcomming.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcommingComponent implements OnInit, AfterViewInit, OnDestroy {
  upcommingEvents = Immutable.fromJS([]);

  paginationDetailsForUpcommingEvent = Immutable.Map({
    next: 0,
  });

  private _listUpcommingEventSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  loadingUpcommingEvents = false;

  @ViewChild(BreadcrumbComponent, { read: BreadcrumbComponent })
  private _breadcrumbCmpElRef: ElementRef | undefined;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _eventService: EventService,
    private _router: Router,
    private _scrollService: ScrollService,
    private _loadingScreenService: LoadingScreenService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._setBreadcrumbDetails();
    
    this._loadRequiredDetails();
  }

  ngOnDestroy() {
    this._unsubscribeListUpcommingEventSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();
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

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }

  private _unsubscribeLoadRequiredDetailsSubscription() {
    if (this._loadRequiredDetailsSubscription instanceof Subscription) {
      this._loadRequiredDetailsSubscription.unsubscribe();
    }
  }

  navigateToMomentDetail(momentID: string | number) {
    this._router.navigate(['./', momentID, 'details'], { relativeTo: this._activatedRoute })
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }


  private _unsubscribeListUpcommingEventSubscription() {
    if (this._listUpcommingEventSubscription instanceof Subscription) {
      this._listUpcommingEventSubscription.unsubscribe();
    }
  }

  private _listUpcommingEvent$(pageNumber: number) {
    return this._eventService
      .listUpcommingEvent$(
        convertItemToString(pageNumber))
      .pipe(
        tap(details => {
          if (Array.isArray(details.results) && details.results.length > 0) {
            this.paginationDetailsForUpcommingEvent = this.paginationDetailsForUpcommingEvent
              .set('next', convertItemToNumeric(
                details.next));

            const newVal = Immutable.fromJS(details.results);

            this.upcommingEvents = Immutable.mergeDeep(
              this.upcommingEvents, newVal);

            if (!newVal.isEmpty()) {
              this.loadingUpcommingEvents = false;

              this._manuallyTriggerChangeDetection();
            }
          }
          else {
            this._manuallyTriggerChangeDetection();
          }
        })
      )
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _loadRequiredDetails() {
    this._startLoading();

    const FETCH_PAGE_NUMBER = 1

    const LIST_TESTIMONIAL$ = this._listUpcommingEvent$(
      FETCH_PAGE_NUMBER);

    this._loadRequiredDetailsSubscription = forkJoin([
      LIST_TESTIMONIAL$,
    ]).subscribe(_ => {
      this._backToTop();

      this._stopLoading();
    }, (err => console.error(err)))
  }

  loadMoreUpcommingEvent() {
    let FETCH_PAGE_NUMBER = convertItemToNumeric(
      this.paginationDetailsForUpcommingEvent.get('next'));

    if (!isANumber(FETCH_PAGE_NUMBER)) {
      return;
    }

    if (FETCH_PAGE_NUMBER === 0) {
      FETCH_PAGE_NUMBER = 1;
    }

    if (!this.loadingUpcommingEvents) {
      this.loadingUpcommingEvents = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listUpcommingEventSubscription = this._listUpcommingEvent$(
      FETCH_PAGE_NUMBER)
      .subscribe(_ => { }, (err => {
        console.error(err)
      }));
  }

}
