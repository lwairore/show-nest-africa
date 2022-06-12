import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BreadcrumbComponent } from '@sharedModule/components/breadcrumb/breadcrumb.component';
import { Subscription, forkJoin } from 'rxjs';
import * as Immutable from 'immutable';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { PurchasesService } from '../purchases.service';
import { ScrollService } from '@sharedModule/services';
import { convertItemToString, convertItemToNumeric, isANumber } from '@sharedModule/utilities';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'snap-list-purchase',
  templateUrl: './list-purchase.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListPurchaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(BreadcrumbComponent, { read: BreadcrumbComponent })
  private _breadcrumbCmpElRef: ElementRef | undefined;

  private _listPurchaseSubscription: Subscription | undefined;

  private _listInvitedEventSubscription: Subscription | undefined;

  paginationDetailsForPurchases = Immutable.Map({
    next: 0,
  });

  paginationDetailsForInvitedEvent = Immutable.Map({
    next: 0
  });

  purchases = Immutable.fromJS([]);

  invitedEvents = Immutable.fromJS([]);

  loadingPurchases = false;

  loadingInvitedEvents = false;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  constructor(
    private _purchasesService: PurchasesService,
    private _loadingScreenService: LoadingScreenService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _scrollService: ScrollService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscribeListPurchaseSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();

    this._unsubscribeListInvitedEventSubscription();
  }

  ngAfterViewInit() {
    this._setBreadcrumbDetails();

    this._loadRequiredDetails();
  }

  navigateToInvitedMomentDetail(momentID: number) {
    this._router.navigate([
      momentID,
      'details',
      'ticket-details',
      'invited-moment'
    ], { relativeTo: this._activatedRoute });
  }

  navigateToMomentDetail(momentID: number) {
    this._router.navigate([
      momentID,
      'details',
      'ticket-details'
    ], { relativeTo: this._activatedRoute });
  }

  private _unsubscribeListInvitedEventSubscription() {
    if (this._listInvitedEventSubscription instanceof Subscription) {
      this._listInvitedEventSubscription.unsubscribe();
    }
  }

  private _unsubscribeLoadRequiredDetailsSubscription() {
    if (this._loadRequiredDetailsSubscription instanceof Subscription) {
      this._loadRequiredDetailsSubscription.unsubscribe();
    }
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

  private _unsubscribeListPurchaseSubscription() {
    if (this._listPurchaseSubscription instanceof Subscription) {
      this._listPurchaseSubscription.unsubscribe();
    }
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

  private _loadRequiredDetails() {
    const FETCH_PAGE_NUMBER = 1

    const LIST_PURCHASED$ = this._listPurchase$(
      FETCH_PAGE_NUMBER);

    const LIST_INVITED_EVENT$ = this._listInvitedEvent$(
      FETCH_PAGE_NUMBER);

    this._loadRequiredDetailsSubscription = forkJoin([
      LIST_PURCHASED$, LIST_INVITED_EVENT$,
    ]).subscribe(() => {
      this._backToTop();
    }, ((err: any) => console.error(err)))
  }

  private _listInvitedEvent$(pageNumber: number) {
    const pageNumberAsString = convertItemToString(pageNumber);

    const LIST_INVITED_EVENT$ = this._purchasesService
      .listInvitedEvent$(pageNumberAsString)
      .pipe(
        tap(details => {
          if (Array.isArray(details.results) && details.results.length > 0) {
            this.paginationDetailsForInvitedEvent = this.paginationDetailsForInvitedEvent
              .set(
                'next', convertItemToNumeric(
                  details.next));

            const newVal = Immutable.fromJS(details.results);

            this.invitedEvents = Immutable.mergeDeep(
              this.invitedEvents, newVal);

            if (!newVal.isEmpty()) {
              this.loadingInvitedEvents = false;

              this._manuallyTriggerChangeDetection();
            }
          }
          else {
            this._manuallyTriggerChangeDetection();
          }
        }));

    return LIST_INVITED_EVENT$;
  }


  private _listPurchase$(pageNumber: number) {
    const pageNumberAsString = convertItemToString(pageNumber);

    const LIST_PURCHASE$ = this._purchasesService
      .listPurchase$(pageNumberAsString)
      .pipe(
        tap(details => {
          if (Array.isArray(details.results) && details.results.length > 0) {
            this.paginationDetailsForPurchases = this.paginationDetailsForPurchases
              .set(
                'next', convertItemToNumeric(
                  details.next));

            const newVal = Immutable.fromJS(details.results);

            this.purchases = Immutable.mergeDeep(
              this.purchases, newVal);

            if (!newVal.isEmpty()) {
              this.loadingPurchases = false;

              this._manuallyTriggerChangeDetection();
            }
          }
          else {
            this._manuallyTriggerChangeDetection();
          }
        }));

    return LIST_PURCHASE$;
  }

  loadMorePurchase() {
    let FETCH_PAGE_NUMBER = convertItemToNumeric(
      this.paginationDetailsForPurchases.get('next'));

    if (!isANumber(FETCH_PAGE_NUMBER)) {
      return;
    }

    if (FETCH_PAGE_NUMBER === 0) {
      FETCH_PAGE_NUMBER = 1;
    }

    if (!this.loadingPurchases) {
      this.loadingPurchases = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listPurchaseSubscription = this._listPurchase$(
      FETCH_PAGE_NUMBER)
      .subscribe(_ => { }, (err) => {
        console.error(err);

        this.loadingPurchases = false;
      });
  }

  loadMoreInvitedEvent() {
    let FETCH_PAGE_NUMBER = convertItemToNumeric(
      this.paginationDetailsForInvitedEvent.get('next'));

    if (!isANumber(FETCH_PAGE_NUMBER)) {
      return;
    }

    if (FETCH_PAGE_NUMBER === 0) {
      FETCH_PAGE_NUMBER = 1;
    }

    if (!this.loadingInvitedEvents) {
      this.loadingInvitedEvents = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listPurchaseSubscription = this._listPurchase$(
      FETCH_PAGE_NUMBER)
      .subscribe(_ => { }, (err) => {
        console.error(err);

        this.loadingInvitedEvents = false;
      });
  }

}
