import { Component, OnInit, ChangeDetectionStrategy, Input, AfterViewInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { ChooseATicketService } from './services';
import { convertItemToString, getBoolean } from '@sharedModule/utilities';

@Component({
  selector: 'snap-choose-a-ticket',
  templateUrl: './choose-a-ticket.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseATicketComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() momentID!: number;

  purchasedTickets = Immutable.fromJS([]);

  private _listPurchasedTicketSubscription: Subscription | undefined;

  private _selectTicketSubscription: Subscription | undefined;

  @Output() selectedTicket = new EventEmitter<boolean>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _loadingScreenService: LoadingScreenService,
    private _chooseATicketService: ChooseATicketService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._listPurchasedTicket();
  }

  ngOnDestroy() {
    this._unsubscribeListPurchasedTicketSubscription();

    this._unsubscribeSelectTicketSubscription();
  }

  private _unsubscribeSelectTicketSubscription() {
    if (this._selectTicketSubscription instanceof Subscription) {
      this._selectTicketSubscription.unsubscribe();
    }
  }

  private _unsubscribeListPurchasedTicketSubscription() {
    if (this._listPurchasedTicketSubscription instanceof Subscription) {
      this._listPurchasedTicketSubscription.unsubscribe();
    }
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _listPurchasedTicket() {
    this._startLoading();

    const MOMENT_ID = convertItemToString(
      this.momentID);

    this._listPurchasedTicketSubscription = this._chooseATicketService
      .listPurchasedTicket$(MOMENT_ID)
      .subscribe(details => {
        this.purchasedTickets = Immutable.fromJS(details);

        if (!this.purchasedTickets.isEmpty()) {
          this._manuallyTriggerChangeDetection();
        }

        this._stopLoading();
      })
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  trackByPurchasedTicket(index: number, ticket: any) {
    return ticket?.get('id');
  }

  selectTicket(loopIndex: number) {
    const isCurrentSelecting = this.purchasedTickets
      .getIn([
        loopIndex, 'selecting'
      ]);

    if (getBoolean(isCurrentSelecting)) {
      console.warn(`Preventing potential duplicate select request!`);

      return;
    }

    let TICKET_ID = '';

    this.purchasedTickets = this.purchasedTickets
      .map((item, index) => {
        if (Immutable.isMap(item)) {
          if (index === loopIndex) {
            let item1 = item;

            TICKET_ID = convertItemToString(
              item.get('id'));

            item1 = item1.set('selecting', true);

            item = item1;
          }
        }

        return item;
      });

    const MOMENT_ID = convertItemToString(
      this.momentID);

    const formData = new FormData();
    formData.append('ticket', TICKET_ID);

    this._selectTicketSubscription = this._chooseATicketService
      .selectTicket$(MOMENT_ID, formData)
      .subscribe(details => {
        this._reportTicketSelected();
      });

  }

  private _reportTicketSelected() {
    this.selectedTicket.emit(true);
  }
}
