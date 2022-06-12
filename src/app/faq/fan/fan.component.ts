import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { isANumber, convertItemToNumeric, convertItemToString } from '@sharedModule/utilities';
import { forkJoin, Subscription } from 'rxjs';
import * as Immutable from 'immutable';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { FaqService } from '../services';
import { ScrollService } from '@sharedModule/services';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'snap-fan',
  templateUrl: './fan.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FanComponent implements OnInit, AfterViewInit, OnDestroy {
  private _listFaqSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  paginationDetailsForFaqs = Immutable.Map({
    next: 0,
  });

  faqs = Immutable.fromJS([]);

  loadingFaqs = false;

  constructor(
    private _loadingScreenService: LoadingScreenService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _faqService: FaqService,
    private _scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this._loadRequiredDetails();
  }

  ngOnDestroy() {
    this._unsubscribeListFaqSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _unsubscribeLoadRequiredDetailsSubscription() {
    if (this._loadRequiredDetailsSubscription instanceof Subscription) {
      this._loadRequiredDetailsSubscription.unsubscribe();
    }
  }

  trackByFaq(index: number, faq: any) {
    return faq?.get('question');
  }

  private _unsubscribeListFaqSubscription() {
    if (this._listFaqSubscription instanceof Subscription) {
      this._listFaqSubscription.unsubscribe();
    }
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
  }


  private _listFaq$(pageNumber: number) {
    const pageNumberAsString = convertItemToString(
      pageNumber);

    const LIST_FAQ$ = this._faqService
      .listFaqForFan$(pageNumberAsString)
      .pipe(
        tap(details => {
          if (Array.isArray(details.results) && details.results.length > 0) {
            this.paginationDetailsForFaqs = this.paginationDetailsForFaqs
              .set(
                'next', convertItemToNumeric(
                  details.next));

            const newVal = Immutable.fromJS(details.results);

            this.faqs = Immutable.mergeDeep(
              this.faqs, newVal);

            if (!newVal.isEmpty()) {
              this.loadingFaqs = false;

              this._manuallyTriggerChangeDetection();
            }
          }
          else {
            this._manuallyTriggerChangeDetection();
          }
        }));

    return LIST_FAQ$;
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _loadRequiredDetails() {
    this._startLoading();

    const FETCH_PAGE_NUMBER = 1

    const LIST_FAQ$ = this._listFaq$(
      FETCH_PAGE_NUMBER);

    this._loadRequiredDetailsSubscription = forkJoin([
      LIST_FAQ$,
    ]).subscribe(() => {
      this._stopLoading();

      this._backToTop();
    }, ((err: any) => console.error(err)))
  }

  loadMoreFaq() {
    let FETCH_PAGE_NUMBER = convertItemToNumeric(
      this.paginationDetailsForFaqs.get('next'));

    if (!isANumber(FETCH_PAGE_NUMBER)) {
      return;
    }

    if (FETCH_PAGE_NUMBER === 0) {
      FETCH_PAGE_NUMBER = 1;
    }

    if (!this.loadingFaqs) {
      this.loadingFaqs = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listFaqSubscription = this._listFaq$(
      FETCH_PAGE_NUMBER)
      .subscribe(_ => { }, (err) => {
        console.error(err);

        this.loadingFaqs = false;
      });
  }

}
