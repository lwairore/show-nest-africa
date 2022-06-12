import { CurrencyPipe, DecimalPipe, DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import { ModalFullscreenComponent } from '@libsModule/modal-fullscreen/modal-fullscreen.component';
import { ScrollService } from '@sharedModule/services';
import { convertItemToNumeric, convertItemToString, getBoolean, isANumber, isObjectEmpty, stringIsEmpty, whichValueShouldIUse } from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { forkJoin, Subscription } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import {
  BraintreePaymentGatewayService,
  GetTicketsService,
  LipaNaMPesaOnlineService
} from '../services';
import { CardComponent } from './methods/card/card.component';
import { MPesaComponent } from './methods/m-pesa/m-pesa.component';

@Component({
  selector: 'snap-payment',
  templateUrl: './payment.component.html',
  styles: [
    `form, form>ul>li {
background: var(--black-color);
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurrencyPipe,
    DecimalPipe,
  ]
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  private _routeParams = Immutable.Map({});

  private _routeParamsSubscription: Subscription | undefined;

  private _loadRequiredDetailsSubscription: Subscription | undefined;

  momentDetail = Immutable.fromJS({});

  paymentMethods = Immutable.fromJS([]);

  additionalFees = Immutable.fromJS([]);

  readonly MPESA_CHOICE_SLUG = 'mpesa';

  readonly DEBIT_OR_CREDIT_CARD = 'debit_or_credit_card';

  paymentMethodFormGroup: FormGroup | undefined;

  private _methodFieldValueChangesSubscription: Subscription | undefined;

  private _ticketsFormArrayValueChangesSubscription: Subscription | undefined;

  private _createOrderLipaNaMPesaSubscription: Subscription | undefined;

  private _createOrderCardSubscription: Subscription | undefined;


  optsToPayWith = '';

  @ViewChild('subTotalElRef', { read: ElementRef })
  private _subTotalElRef: ElementRef | undefined;

  @ViewChild('totalElRef', { read: ElementRef })
  private _totalElRef: ElementRef | undefined;

  @ViewChild('totalTicketQuantitiesElRef', { read: ElementRef })
  private _totalTicketQuantitiesElRef: ElementRef | undefined;

  @ViewChild(MPesaComponent, { read: MPesaComponent, static: false })
  private _mpesaCmp: MPesaComponent | undefined;

  @ViewChild(CardComponent, { read: CardComponent, static: false })
  private _cardCmp: CardComponent | undefined;

  @ViewChild('paymentResponseModalEl', { read: ModalFullscreenComponent })
  private _paymentResponseModalFullscrenCmp: ModalFullscreenComponent | undefined;

  private _totalCostOfAdditionalFees = 0;

  readonly PAYMENT_RESPONSE_MODAL_ID = 'paymentResponse';

  readonly TICKET_BENEFIT_BASE_MODAL_ID = 'ticketBenefit__';

  private _totalCost = 0;

  thereAreNoMoreTickets = false;

  private _submitInProgress = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _getTicketService: GetTicketsService,
    private _formBuilder: FormBuilder,
    private _scrollService: ScrollService,
    private _renderer2: Renderer2,
    private _currencyPipe: CurrencyPipe,
    private _decimalPipe: DecimalPipe,
    private _lipaNaMPesaOnlineService: LipaNaMPesaOnlineService,
    private _loadingScreenService: LoadingScreenService,
    private _braintreeService: BraintreePaymentGatewayService,
  ) { }

  ngOnInit() {
    this._extractRouteParams();

    this._initializePaymentMethodFormGroup();
  }

  ngAfterViewInit() {
    // this._triggerModal();

    this._loadRequiredDetails();
  }

  ngOnDestroy() {
    this._unsubscribeRouteParamsSubscription();

    this._unsubscribeLoadRequiredDetailsSubscription();

    this._unsubscribeMethodFieldValueChangesSubscription();

    this._unsubscribeTicketsFormArrayValueChangesSubscription();

    this._unsubscribeCreateOrderLipaNaMPesaSubscription();
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _unsubscribeCreateOrderLipaNaMPesaSubscription() {
    if (this._createOrderLipaNaMPesaSubscription instanceof Subscription) {
      this._createOrderLipaNaMPesaSubscription.unsubscribe();
    }
  }

  private _unsubscribeCreateOrderCardSubscription() {
    if (this._createOrderCardSubscription instanceof Subscription) {
      this._createOrderCardSubscription.unsubscribe();
    }
  }

  private _formatDigitToCurrency(digit: number) {
    return this._currencyPipe.transform(
      digit, 'KES', 'symbol', '.2-2');
  }

  private _formatDecimal(digit: string) {
    return this._decimalPipe.transform(
      digit, '1.0-0')
  }

  private _unsubscribeTicketsFormArrayValueChangesSubscription() {
    if (this._ticketsFormArrayValueChangesSubscription instanceof Subscription) {
      this._ticketsFormArrayValueChangesSubscription.unsubscribe();
    }
  }

  private _unsubscribeMethodFieldValueChangesSubscription() {
    if (this._methodFieldValueChangesSubscription instanceof Subscription) {
      this._methodFieldValueChangesSubscription.unsubscribe();
    }
  }

  private _initializePaymentMethodFormGroup() {
    this.paymentMethodFormGroup = this._formBuilder.group({
      method: [
        '', Validators.required,
      ],
      tickets: this._formBuilder.array([]),
    });

    this._setupMethodFieldValueChanges();

    this._setupTicketsFormArrayValueChanges();
  }

  private _handlePurchaseCTA(totalTicketQuantities: number) {
    let purchaseCTA = ``;

    if (totalTicketQuantities > 0 && this._totalCost > 0) {
      purchaseCTA += `Buy ${totalTicketQuantities} `;
      purchaseCTA += `Ticket`;

      if (totalTicketQuantities > 1) {
        purchaseCTA += `s`;
      }

      purchaseCTA += ` for `;
      purchaseCTA += `${this._formatDigitToCurrency(this._totalCost)}`

      this._updatePurchaseCTA(purchaseCTA);
    } else if (totalTicketQuantities > 0) {
      purchaseCTA += `Buy ${totalTicketQuantities}`;
      purchaseCTA += `Ticket`;
      if (totalTicketQuantities > 1) {
        purchaseCTA += `s`;
      }
    } else {
      purchaseCTA += `Buy Tickets`;
    }

    this._updatePurchaseCTA(purchaseCTA.slice(0, 33));
  }

  lipaNaMpesaPaymentCredentialsSubmitted(phoneNumber: string) {
    if (this._submitInProgress) {
      return;
    }

    this._parseAmountAndQuantity(
      this.ticketsFormArray?.value);

    this._startLoading();

    if (!isANumber(phoneNumber)) {
      this._stopLoading();

      this._submitInProgress = false;

      return;
    }

    const MOMENT_ID = this._routeParams.get('momentID');

    if (!isANumber(MOMENT_ID)) {
      this._stopLoading();

      this._submitInProgress = false;

      return;
    }

    const formData = new FormData();

    formData.append(
      'momentID', convertItemToString(MOMENT_ID));

    formData.append(
      'phoneNumber', phoneNumber);

    const ticketsDetails = this.ticketsFormArray
      .controls.map((detail, loopIndex) => {
        if (!getBoolean(detail.get('ticket')?.value)) {
          return null;
        }

        const ticketDetail = this.momentDetail
          .getIn(['ticketDetails', loopIndex, 'id']);

        if (!isANumber(ticketDetail)) {
          return null;
        }

        const FORMATTED_DETAIL = {
          quantity: detail.get('quantity')?.value,
          ticketDetail: ticketDetail,
        };

        return FORMATTED_DETAIL;
      }).filter(item => !isObjectEmpty(item));

    if (ticketsDetails.length < 1) {
      this._stopLoading();

      this._submitInProgress = false;

      return;
    }

    formData.append('tickets',
      JSON.stringify(ticketsDetails));

    this._createOrderLipaNaMPesaSubscription = this._lipaNaMPesaOnlineService
      .lipaNaMPesaStkPush$(formData)
      .subscribe((details: any) => {
        this._stopLoading();

        this._submitInProgress = false;

        const order_item_id = convertItemToNumeric(
          details?.order_item_id);
        const request_record_id = convertItemToNumeric(
          details?.request_record_id);

        this._router.navigate([
          'check-transcation-status',
          'mpesa',
          order_item_id,
          request_record_id
        ], { relativeTo: this._activatedRoute });
      }, (err) => {
        this._submitInProgress = false;
        this._stopLoading();

        const errorMessage = {
          title: '',
          description: ''
        }

        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 503:
              errorMessage.title = convertItemToString(err.error?.title);
              errorMessage.description = convertItemToString(err.error?.description);
              break;
            case 500:
              errorMessage.title = 'Something Went Wrong, Please Try Again';
              errorMessage.description = 'We\'re sorry, but something went wrong. Please try again.';
              break;
            case 400:
              errorMessage.title = 'Invalid input fields';

              errorMessage.description =
                '<p>'
                + 'Some payment input fields are invalid. '
                + 'Cannot process your payment. '
                + 'The following are the issues:'
                + '</p>';

              if (Array.isArray(err.error) && err.error.length > 0) {
                errorMessage.description += '<dl>';

                for (const ITEM of err.error) {
                  const ticket_detail = convertItemToString(
                    ITEM.ticket_detail);

                  if (!stringIsEmpty(ticket_detail)) {

                    errorMessage.description += '<dt>' +
                      'Something Went Wrong, Please Refresh the page'
                      + '</dt>';

                    errorMessage.description += '<dd>' + ticket_detail + '</dd>';
                  }
                  else {
                    const nameOfTicket = convertItemToString(
                      ITEM.name_of_ticket);

                    if (!stringIsEmpty(nameOfTicket)) {
                      errorMessage.description += '<dt>' + nameOfTicket + '</dt>';
                    }

                    const errorDetails = convertItemToString(
                      ITEM.details);
                    if (!stringIsEmpty(errorDetails)) {
                      errorMessage.description += '<dd>' + errorDetails + '</dd>';
                    }
                  }
                }

                errorMessage.description += '</dl>';
              } else {
                errorMessage.description += '<dl>';
                errorMessage.description += '<dt>' + err.error.title + '</dt>';
                errorMessage.description += '<dd>' + err.error.description + '</dd>';
                errorMessage.description += '</dl>';
              }

              break;

            default:
              break;
          }
        } else {
          errorMessage.title = 'Something Went Wrong, Please Try Again';
          errorMessage.description = 'We\'re sorry, but something went wrong. Please try again.';
        }

        this._setModalTitle(
          errorMessage.title);

        this._setModalBody(errorMessage.description);

        this._triggerModal();
      });
  }

  navigateToEventDetails() {
    this._router.navigate(['..'], { relativeTo: this._activatedRoute.parent?.parent });
  }

  paymentNonceSubmitted(nonce: string) {
    if (this._submitInProgress) {
      this._cardCmp?.hideProcessingPaymentBtn();

      return;
    }

    this._parseAmountAndQuantity(
      this.ticketsFormArray?.value);

    this._startLoading();

    if (stringIsEmpty(nonce)) {
      this._cardCmp?.hideProcessingPaymentBtn();

      this._stopLoading();

      this._submitInProgress = false;

      return;
    }

    const MOMENT_ID = this._routeParams.get('momentID');

    if (!isANumber(MOMENT_ID)) {
      this._cardCmp?.hideProcessingPaymentBtn();

      this._stopLoading();

      this._submitInProgress = false;

      return;
    }

    const formData = new FormData();

    formData.append(
      'momentID', convertItemToString(MOMENT_ID));

    formData.append(
      'nonceFromTheClient', nonce);

    const ticketsDetails = this.ticketsFormArray
      .controls.map((detail, loopIndex) => {
        if (!getBoolean(detail.get('ticket')?.value)) {
          return null;
        }

        const ticketDetail = this.momentDetail
          .getIn(['ticketDetails', loopIndex, 'id']);

        if (!isANumber(ticketDetail)) {
          return null;
        }

        const FORMATTED_DETAIL = {
          quantity: detail.get('quantity')?.value,
          ticketDetail: ticketDetail,
        };

        return FORMATTED_DETAIL;
      }).filter(item => !isObjectEmpty(item));

    if (ticketsDetails.length < 1) {
      this._cardCmp?.hideProcessingPaymentBtn();

      this._stopLoading();

      this._submitInProgress = false;

      return;
    }

    formData.append('tickets',
      JSON.stringify(ticketsDetails));

    this._createOrderCardSubscription = this._braintreeService
      .handleBraintreePayment$(formData)
      .subscribe((details: any) => {
        this._cardCmp?.hideProcessingPaymentBtn();

        this._submitInProgress = false;

        this._stopLoading();

        const order_item_id = convertItemToNumeric(
          details?.order_item_id);
        const transaction_id = convertItemToNumeric(
          details?.transaction_id);

        this._router.navigate([
          'check-transcation-status',
          'card',
          order_item_id,
          transaction_id
        ], { relativeTo: this._activatedRoute });
      }, (err) => {
        this._cardCmp?.hideProcessingPaymentBtn();

        this._submitInProgress = false;

        this._stopLoading();

        const errorMessage = {
          title: whichValueShouldIUse(err.error?.title, 'Your payment has not been processed'),
          description: whichValueShouldIUse(err.error?.description, 'There was a problem processing your payment.')
        }

        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 500:
              errorMessage.title = 'Something Went Wrong, Please Try Again';
              errorMessage.description = 'We\'re sorry, but something went wrong. Please try again.';
              break;
            case 400:
              if (Array.isArray(err.error) && err.error.length > 0) {
                errorMessage.title = 'Invalid input fields';

                errorMessage.description =
                  '<p>'
                  + 'Some payment input fields are invalid. '
                  + 'Cannot process your payment. '
                  + 'The following are the issues:'
                  + '</p>';

                errorMessage.description += '<dl>';

                for (const ITEM of err.error) {
                  const nameOfTicket = convertItemToString(
                    ITEM.name_of_ticket);

                  if (!stringIsEmpty(nameOfTicket)) {
                    errorMessage.description += '<dt>' + nameOfTicket + '</dt>';
                  }

                  const errorDetails = convertItemToString(
                    ITEM.details);
                  if (!stringIsEmpty(errorDetails)) {
                    errorMessage.description += '<dd>' + errorDetails + '</dd>';
                  }
                }

                errorMessage.description += '</dl>';
              }
              break;

            default:
              break;
          }
        } else {
          errorMessage.title = 'Something Went Wrong, Please Try Again';
          errorMessage.description = 'We\'re sorry, but something went wrong. Please try again.';
        }

        this._setModalTitle(
          errorMessage.title);

        this._setModalBody(errorMessage.description);

        this._triggerModal();
      });
  }

  private _triggerModal() {
    if (this._paymentResponseModalFullscrenCmp instanceof ModalFullscreenComponent) {
      this._paymentResponseModalFullscrenCmp.manuallyTriggerModal();
    }
  }

  private _setModalBody(value: string) {
    if (this._paymentResponseModalFullscrenCmp instanceof ModalFullscreenComponent) {
      this._paymentResponseModalFullscrenCmp.setModalBody(value);
    }
  }

  private _setModalTitle(value: string) {
    if (this._paymentResponseModalFullscrenCmp instanceof ModalFullscreenComponent) {
      this._paymentResponseModalFullscrenCmp.setModalTitle(value);
    }
  }

  private _updatePurchaseCTA(value: string) {
    if (this._mpesaCmp instanceof MPesaComponent) {
      this._mpesaCmp.updateSubmitBtnCta(value);
    }

    if (this._cardCmp instanceof CardComponent) {
      this._cardCmp.updateSubmitBtnCta(value);
    }
  }

  private _setupTicketsFormArrayValueChanges() {
    this._ticketsFormArrayValueChangesSubscription = this.ticketsFormArray?.valueChanges
      ?.pipe(distinctUntilChanged())
      ?.subscribe(values => {
        this._parseAmountAndQuantity(values);
      });
  }

  get ticketsFormArray() {
    return this.paymentMethodFormGroup
      ?.get('tickets') as FormArray;
  }

  private _addTicketDetails(id: number) {
    const newTicketFormGroup = this._formBuilder.group({
      ticket: [false, Validators.required],
      quantity: [1, Validators.compose([
        Validators.min(1),
        Validators.pattern(/^\d+$/)
      ])],
      id: [{
        value: id,
        disabled: true
      }, Validators.required]
    });

    this.ticketsFormArray.push(
      newTicketFormGroup);
  }

  private _setupMethodFieldValueChanges() {
    this._methodFieldValueChangesSubscription = this.paymentMethodFormGroup
      ?.get('method')
      ?.valueChanges
      ?.pipe(
        distinctUntilChanged())
      ?.subscribe(value => {
        this.optsToPayWith = value;
      })
  }

  private _backToTop() {
    this._scrollService.animatedScrollToTop();
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
        console.log({ params });
        const MOMENT_ID = convertItemToNumeric(
          params['momentID']);

        if (!isANumber(MOMENT_ID)) {
          return;
        }

        this._routeParams = this._routeParams.set(
          'momentID', MOMENT_ID);

      });
  }

  private _loadRequiredDetails() {
    this._startLoading();

    const MOMENT_ID = this._routeParams.get('momentID');

    const MOMENT_DETAIL$ = this._getTicketService
      .getTicketMomentDetail$(
        convertItemToString(MOMENT_ID))
      .pipe(tap(details => {


        this.momentDetail = Immutable.fromJS(details);

        const ticketDetails = details.ticketDetails;
        if (Array.isArray(ticketDetails) && ticketDetails.length > 0) {
          for (const item of ticketDetails) {
            if (isANumber(item.id)) {
              this._addTicketDetails(item.id as number)
            }
            else {
              continue
            }
          }
        } else {
          this.thereAreNoMoreTickets = true;
        }
      }));

    const LIST_ADDITIONAL_FEE$ = this._getTicketService
      .listAdditionalFee$()
      .pipe(
        tap(details => {
          this.additionalFees = Immutable.fromJS(details);

          this._totalCostOfAdditionalFees = details.reduce((sum, item) => {
            if (!isANumber(item.fee)) {
              return 0;
            }

            return sum + convertItemToNumeric(item.fee);
          }, 0)
        })
      )

    const LIST_PAYMENT_METHODS$ = this._getTicketService
      .listPaymentMethod$()
      .pipe(
        tap(details => {
          this.paymentMethods = Immutable.fromJS(details);
        })
      );

    this._loadRequiredDetailsSubscription = forkJoin([
      MOMENT_DETAIL$,
      LIST_PAYMENT_METHODS$,
      LIST_ADDITIONAL_FEE$,
    ]).subscribe(_ => {
      if (!this.momentDetail.isEmpty() || !this.paymentMethods.isEmpty()) {
        this._manuallyTriggerChangeDetection();
      }

      this._stopLoading();
    }, (err) => console.error(err));
  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private _parseAmountAndQuantity(
    values: Array<{
      ticket: boolean, quantity: number
    }>
  ) {
    this._totalCost = 0;

    let totalTicketQuantities = 0;

    if (Array.isArray(values) && values.length > 0) {
      let subTotal = 0;

      values.forEach((item, loopIndex) => {
        if (item.ticket && isANumber(item.quantity)) {
          const formattedQuantity = convertItemToNumeric(
            item.quantity)
          totalTicketQuantities += formattedQuantity;

          const itemCost = this.momentDetail.getIn(['ticketDetails', loopIndex, 'cost']) as number;
          if (isANumber(itemCost)) {
            const cost = formattedQuantity * itemCost;

            subTotal += cost;
          }

        }

      });

      if (subTotal > 0) {
        if (this._subTotalElRef instanceof ElementRef) {
          this._renderer2.setProperty(
            this._subTotalElRef.nativeElement,
            'textContent',
            this._formatDigitToCurrency(
              convertItemToNumeric(subTotal)));
        }

        if (this._totalElRef instanceof ElementRef) {
          const totalPlusAdditionalFees = this._totalCostOfAdditionalFees + subTotal;

          this._totalCost = totalPlusAdditionalFees;

          this._renderer2.setProperty(
            this._totalElRef.nativeElement,
            'textContent',
            this._formatDigitToCurrency(
              convertItemToNumeric(totalPlusAdditionalFees)
            ));
        }
      } else {
        if (this._subTotalElRef instanceof ElementRef) {
          this._renderer2.setProperty(
            this._subTotalElRef.nativeElement,
            'textContent',
            '-');
        }

        if (this._totalElRef instanceof ElementRef) {
          this._renderer2.setProperty(
            this._totalElRef.nativeElement,
            'textContent',
            '-');
        }
      }

    }
    else {
      if (this._subTotalElRef instanceof ElementRef) {
        this._renderer2.setProperty(
          this._subTotalElRef.nativeElement,
          'textContent',
          '-');
      }

      if (this._totalElRef instanceof ElementRef) {
        this._renderer2.setProperty(
          this._totalElRef.nativeElement,
          'textContent',
          '-');
      }
    }

    if (this._totalTicketQuantitiesElRef instanceof ElementRef) {
      this._renderer2.setProperty(
        this._totalTicketQuantitiesElRef.nativeElement,
        'textContent',
        totalTicketQuantities > 0 ?
          this._formatDecimal(
            convertItemToNumeric(totalTicketQuantities)) : '-');
    }

    this._handlePurchaseCTA(totalTicketQuantities);
  }
}
