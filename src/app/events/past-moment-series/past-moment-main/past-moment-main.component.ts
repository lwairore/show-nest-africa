import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, ScrollService } from '@sharedModule/services';
import { convertItemToNumeric, convertItemToString, isANumber } from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { forkJoin, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'snap-past-moment-main',
  templateUrl: './past-moment-main.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PastMomentMainComponent implements OnInit, AfterViewInit, OnDestroy {
  pastEvents = Immutable.fromJS([]);

  paginationDetailsForPastEvent = Immutable.Map({
    next: 0,
  });

  private _listPastEventSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  loadingPastEvents = false;

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
    this._unsubscribeListPastEventSubscription();

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


  private _unsubscribeListPastEventSubscription() {
    if (this._listPastEventSubscription instanceof Subscription) {
      this._listPastEventSubscription.unsubscribe();
    }
  }

  private _listPastEvent$(pageNumber: number) {
    return this._eventService
      .listPastEvent$(
        convertItemToString(pageNumber))
      .pipe(
        tap(details => {
          if (Array.isArray(details.results) && details.results.length > 0) {
            this.paginationDetailsForPastEvent = this.paginationDetailsForPastEvent
              .set('next', convertItemToNumeric(
                details.next));

            const newVal = Immutable.fromJS(details.results);

            this.pastEvents = Immutable.mergeDeep(
              this.pastEvents, newVal);

            if (!newVal.isEmpty()) {
              this.loadingPastEvents = false;

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

    const LIST_TESTIMONIAL$ = this._listPastEvent$(
      FETCH_PAGE_NUMBER);

    this._loadRequiredDetailsSubscription = forkJoin([
      LIST_TESTIMONIAL$,
    ]).subscribe(_ => {
      this._backToTop();
    }, (err => console.error(err)))
  }

  listPastEvent() {
    let FETCH_PAGE_NUMBER = convertItemToNumeric(
      this.paginationDetailsForPastEvent.get('next'));

    if (!isANumber(FETCH_PAGE_NUMBER)) {
      return;
    }

    if (FETCH_PAGE_NUMBER === 0) {
      FETCH_PAGE_NUMBER = 1;
    }

    if (!this.loadingPastEvents) {
      this.loadingPastEvents = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listPastEventSubscription = this._listPastEvent$(
      FETCH_PAGE_NUMBER)
      .subscribe(_ => { }, (err => {
        console.error(err)
      }));
  }

}
