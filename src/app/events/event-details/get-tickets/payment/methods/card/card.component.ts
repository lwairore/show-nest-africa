import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { convertItemToString } from '@sharedModule/utilities';
import * as Immutable from 'immutable';
import { Subscription } from 'rxjs';
import * as braintree from 'braintree-web';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';
import {
  BraintreePaymentGatewayService
} from '../../../services';


@Component({
  selector: 'snap-card',
  templateUrl: './card.component.html',
  styles: [
    ` .br-tree-container {
      background: var(--black-color);
      border: 1px solid var(--black-color);
      color: var(--white-color);
      width: 100%;
      float: left;
      font-size: 16px;
      padding: 0 15px;
      height: 54px;
      line-height: 54px;
      outline: none;
      -webkit-border-radius: 0px;
      -moz-border-radius: 0px;
      border-radius: 0px;
      transition: all 0.5s ease-in-out;
      transition: all 0.5s ease-in-out;
      -moz-transition: all 0.5s ease-in-out;
      -ms-transition: all 0.5s ease-in-out;
      -o-transition: all 0.5s ease-in-out;
      -webkit-transition: all 0.5s ease-in-out;
  }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit, AfterViewInit, OnDestroy {
  private _getClientTokenSubscription: Subscription | undefined;

  private _handleBraintreePaymentSubscription: Subscription | undefined;

  braintreeConfigs = Immutable.Map({});

  clientInstance: any;

  hostedFieldsInstance: any;

  @ViewChild('submitElRef', { read: ElementRef })
  private _submitElRef: ElementRef | undefined;

  @ViewChild('genLoadMoreButtonEl', { read: ElementRef })
  private _genLoadMoreButtonElRef: ElementRef | undefined;

  @Output() formSubmitted = new EventEmitter<string>();

  constructor(
    private _renderer2: Renderer2,
    private _loadingScreenService: LoadingScreenService,
    private _braintreeService: BraintreePaymentGatewayService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._startLoading();

    this._getClientToken();
  }

  ngOnDestroy() {
    this._unsubscribeGetClientTokenSubscription();

    this._unsubscribeHandleBraintreePaymentSubscription();
  }

  hideProcessingPaymentBtn() {
    if (this._genLoadMoreButtonElRef instanceof ElementRef) {
      this._renderer2.setStyle(
        this._genLoadMoreButtonElRef.nativeElement, 'display', 'none');
    }

    this._showSubmitBtnCta();
  }

  private _showSubmitBtnCta() {
    if (this._submitElRef instanceof ElementRef) {
      this._renderer2.setStyle(
        this._submitElRef.nativeElement, 'display', 'block');
    }
  }

  showProcessingPaymentBtn() {
    if (this._genLoadMoreButtonElRef instanceof ElementRef) {
      this._renderer2.setStyle(
        this._genLoadMoreButtonElRef.nativeElement, 'display', 'block');
    }

    this._hideSubmitBtnCta();
  }

  private _hideSubmitBtnCta() {
    if (this._submitElRef instanceof ElementRef) {
      this._renderer2.setStyle(
        this._submitElRef.nativeElement, 'display', 'none');
    }
  }

  private _emitEventFormSubmitted(nonce: string) {
    this.formSubmitted.emit(nonce);
  }

  updateSubmitBtnCta(value: string) {
    if (this._submitElRef instanceof ElementRef) {
      this._renderer2.setProperty(
        this._submitElRef.nativeElement, 'value', value);
    }
  }

  private _unsubscribeHandleBraintreePaymentSubscription() {
    if (this._handleBraintreePaymentSubscription instanceof Subscription) {
      this._handleBraintreePaymentSubscription.unsubscribe();
    }
  }

  private _unsubscribeGetClientTokenSubscription() {
    if (this._getClientTokenSubscription instanceof Subscription) {
      this._getClientTokenSubscription.unsubscribe();
    }
  }

  private _getClientToken() {
    this._getClientTokenSubscription = this._braintreeService
      .getClientToken$().subscribe(details => {
        this.braintreeConfigs = this.braintreeConfigs.set('token', details.token);
        this._initalizeBrainTree();
      })
  }

  private _initalizeBrainTree() {
    const authorization = this.braintreeConfigs.get('token');

    braintree.client.create({
      authorization: <string>authorization
    }).then((clientInstance: any) => {
      this.clientInstance = clientInstance;

      this.createHostedFields();
    });
  }


  createHostedFields() {
    braintree.hostedFields.create({
      client: this.clientInstance,
      styles: {
        'input': {
          'color': '#ffffff',
          'font-size': '16px',
          'line-height': '54px'
        },
        ':focus': {
          'color': '#ffffff',
          'border': '1px solid #e50916'
        },
        '.valid': {
          'color': '#28a745',
        },
        '.invalid': {
          'color': '#e50916',
        }
      },
      fields: {
        cardholderName: {
          selector: '#cc-name',
          placeholder: 'Name as it appears on your card'
        },
        number: {
          selector: '#cc-number',
          placeholder: '4111 1111 1111 1111'
        },
        cvv: {
          selector: '#cc-cvv',
          placeholder: '123'
        },
        expirationDate: {
          selector: '#cc-expiration',
          placeholder: 'MM/YYYY'
        },
      }
    }).then((hostedFieldsInstance: any) => {
      this.hostedFieldsInstance = hostedFieldsInstance;

      this._stopLoading();
    });
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  tokenize() {
    this.showProcessingPaymentBtn();

    this.hostedFieldsInstance.tokenize()
      .then((payload: any) => {
        // submit payload.nonce to the server from here

        this._emitEventFormSubmitted(payload.nonce);
      }).catch((error: any) => {
        console.error(error);
        // perform custom validation here or log errors

        this.hideProcessingPaymentBtn();
      });
  }
}
