import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import * as Immutable from 'immutable';
import { Router, ActivatedRoute } from '@angular/router';
import { ShareTicketService } from './services';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { convertItemToNumeric, isANumber, convertItemToString, stringIsEmpty, getBoolean } from '@sharedModule/utilities';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ParseNamePipe } from '@sharedModule/pipes/parse-name.pipe';


@Component({
  selector: 'snap-manage-access',
  templateUrl: './manage-access.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ParseNamePipe,
  ]
})
export class ManageAccessComponent implements OnInit, AfterViewInit, OnDestroy {
  private _routeParams: Immutable.Map<string, number> = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  private _listWatchPartyMemberSubscription: Subscription | undefined;

  private _removeWatchPartyMemberSubscription: Subscription | undefined;

  purchasedTickets = Immutable.fromJS({});

  paginationDetailsForMembers = Immutable.Map({
    next: 0
  });

  watchPartyMembers = Immutable.fromJS([]);

  loadingWatchPartyMembers = false;

  readonly STREAM_BUDDY_REMOVAL_CONFIRMATION_BASE_MODAL_ID = 'confirmYouWantToRemoveThisMember__';

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _shareTicketService: ShareTicketService,
    private _loadingScreenService: LoadingScreenService,
    private _parseNamePipe: ParseNamePipe,
  ) { }

  ngOnInit() {
    this._extractRouteParams();
  }

  ngAfterViewInit() {
    this._loadRequiredDetails();
  }

  ngOnDestroy() {
    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();

    this._unsubscribeListWatchPartyMemberSubscription();

    this._unsubscribeRemoveWatchPartyMemberSubscription();
  }

  private _parseName(name: any) {
    return this._parseNamePipe
      .transform(name);
  }

  private _unsubscribeRemoveWatchPartyMemberSubscription() {
    if (this._removeWatchPartyMemberSubscription instanceof Subscription) {
      this._removeWatchPartyMemberSubscription.unsubscribe();
    }
  }

  private _unsubscribeListWatchPartyMemberSubscription() {
    if (this._listWatchPartyMemberSubscription instanceof Subscription) {
      this._listWatchPartyMemberSubscription.unsubscribe();
    }
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

  private _extractRouteParams() {
    this._routeParamsSubscription = this._activatedRoute
      .parent?.parent?.parent?.params
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

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  navigateToPurchasedMomentDetails() {
    this._router.navigate(
      [
        '..'
      ], {
      relativeTo: this._activatedRoute.parent
        ?.parent
    }
    )
  }

  private _loadRequiredDetails() {
    this._startLoading();

    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    const FETCH_PAGE_NUMBER = 1;

    const WATCH_PARTY_MEMBER$ = this._listWatchPartyMember$(
      FETCH_PAGE_NUMBER)

    const DETAIL$ = this._shareTicketService
      .retrieveShareTicketDetail$(
        MOMENT_ID)
      .pipe(
        tap(details => {
          this.purchasedTickets = Immutable.fromJS(details);
        }));

    this._loadRequiredDetailsSubscription = forkJoin([
      DETAIL$, WATCH_PARTY_MEMBER$,
    ]).subscribe(_ => {
      if (!this.purchasedTickets.isEmpty()) {
        this._manuallyTriggerChangeDetection();
      }

      this._stopLoading();
    }, (err) => console.error(err));
  }

  loadMoreWatchPartyMember() {
    let FETCH_PAGE_NUMBER = convertItemToNumeric(
      this.paginationDetailsForMembers.get('next'));

    if (!isANumber(FETCH_PAGE_NUMBER)) {
      return;
    }

    if (FETCH_PAGE_NUMBER === 0) {
      FETCH_PAGE_NUMBER = 1;
    }

    if (!this.loadingWatchPartyMembers) {
      this.loadingWatchPartyMembers = true;

      this._manuallyTriggerChangeDetection();
    }

    this._listWatchPartyMemberSubscription = this._listWatchPartyMember$(
      FETCH_PAGE_NUMBER)
      .subscribe(_ => { }, (err => {
        console.error(err)
      }));
  }

  private _listWatchPartyMember$(
    pageNumber: number) {
    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    const MEMBER$ = this._shareTicketService
      .listWatchPartyMember$(MOMENT_ID,
        convertItemToString(pageNumber))
      .pipe(
        tap(details => {
          if (Array.isArray(details.results) && details.results.length > 0) {
            this.paginationDetailsForMembers = this.paginationDetailsForMembers
              .set('next', convertItemToNumeric(
                details.next));

            const newVal = Immutable.fromJS(details.results);

            this.watchPartyMembers = Immutable.mergeDeep(
              this.watchPartyMembers, newVal);

            this.loadingWatchPartyMembers = false;

            if (!newVal.isEmpty()) {
              this._manuallyTriggerChangeDetection();
            }
          }
          else {
            this._manuallyTriggerChangeDetection();
          }
        })
      )

    return MEMBER$;
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  trackWatchPartyMember(index: number, memberDetails: any) {
    const memberID = memberDetails.get('memberID', undefined);

    return memberID;
  };

  removeWatchPartyMember(loopIndex: number) {
    const isCurrentlyRemoving = this.watchPartyMembers.getIn([
      loopIndex, 'removing'
    ]);
    if (getBoolean(isCurrentlyRemoving)) {
      console.warn(`Preventing potential duplicate remove request!`);

      return;
    }

    let ORDER_ITEM_ID = '';

    let TICKET_ID = '';

    let MEMBER_ID = '';

    this.watchPartyMembers = this.watchPartyMembers.map((item, index) => {
      if (Immutable.isMap(item)) {
        if (index === loopIndex) {
          let item1 = item;

          ORDER_ITEM_ID = convertItemToString(
            item.get('orderItemID'));

          TICKET_ID = convertItemToString(
            item.getIn(['ticket', 'id']));

          MEMBER_ID = convertItemToString(
            item.get('memberID'));

          item1 = item1.set('removing', true);
          item1 = item1.set('error', {
            occured: false,
            title: '',
            description: ''
          });

          item1 = item1.set('removed', {
            removed: false,
            title: '',
            description: '',
          })

          item = item1;
        }
      }

      return item;
    });

    const MOMENT_ID = convertItemToString(
      this._routeParams.get('momentID'));

    this._removeWatchPartyMemberSubscription = this._shareTicketService
      .removeWatchPartyMember$(
        MOMENT_ID, ORDER_ITEM_ID, TICKET_ID, MEMBER_ID)
      .subscribe((details: any) => {

        const memberFullName = convertItemToString(
          this.watchPartyMembers.getIn([
            loopIndex, 'fullName'
          ]));

        let successTitle = this._parseName(memberFullName).name;

        successTitle += ' successfully removed.';


        let successDescription = memberFullName;
        successDescription += ' successfully removed from streaming ';
        successDescription += this.purchasedTickets.get('nameOfMoment');


        const successObject = {
          removed: true,
          title: successTitle,
          description: successDescription,
        }

        this.watchPartyMembers = this.watchPartyMembers
          .map((item, index) => {
            if (Immutable.isMap(item)) {
              if (index === loopIndex) {
                let item1 = item;

                item1 = item1.set('removing',
                  false);

                item1 = item1.set(
                  'removed', successObject);

                item = item1;
              }
            }

            return item;
          });

        this._manuallyTriggerChangeDetection();



      }, (err) => {
        console.error({ err });

        const errorObject = {
          occured: true,
          title: 'Something Went Wrong, Please Try Again',
          description: 'We\'re sorry, but something went wrong. Please try again.'
        }

        if (err instanceof HttpErrorResponse) {
          const backend_error = err.error;

          switch (err.status) {
            case 400:
              const errorTitle = convertItemToString(
                backend_error.title);
              if (!stringIsEmpty(errorTitle)) {
                errorObject.title = errorTitle;
              }

              const errorDescription = convertItemToString(
                backend_error.description);
              if (!stringIsEmpty(errorDescription)) {
                errorObject.description = errorDescription;
              }

              break;

            default:
              break;
          }
        }

        console.log({ errorObject });

        this.watchPartyMembers = this.watchPartyMembers
          .map((item, index) => {
            if (Immutable.isMap(item)) {
              if (index === loopIndex) {
                let item1 = item;

                item1 = item1.set('removing',
                  false);

                item1 = item1.set(
                  'error', errorObject);

                item = item1;
              }
            }

            return item;
          });

        this._manuallyTriggerChangeDetection();
      });
  }
}
