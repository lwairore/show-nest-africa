import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, ScrollService } from '@sharedModule/services';
import { convertItemToNumeric, convertItemToString, isANumber } from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { forkJoin, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'snap-upcoming-moment-main',
  templateUrl: './upcoming-moment-main.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingMomentMainComponent implements OnInit, AfterViewInit, OnDestroy {
  upcommingEvents = Immutable.fromJS([]);

  paginationDetailsForUpcommingEvent = Immutable.Map({
    next: 0,
  });

  private _listUpcommingEventSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  loadingUpcommingEvents = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _eventService: EventService,
    private _scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._loadRequiredDetails();
  }

  ngOnDestroy(): void {
    this._unsubscribeListUpcommingEventSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();
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

  private _loadRequiredDetails() {
    const FETCH_PAGE_NUMBER = 1

    const LIST_TESTIMONIAL$ = this._listUpcommingEvent$(
      FETCH_PAGE_NUMBER);

    this._loadRequiredDetailsSubscription = forkJoin([
      LIST_TESTIMONIAL$,
    ]).subscribe(_ => {
      this._backToTop();
    }, (err => console.error(err)))
  }

  listUpcommingEvent() {
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
