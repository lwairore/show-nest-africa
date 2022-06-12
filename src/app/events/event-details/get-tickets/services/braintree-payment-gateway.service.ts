import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retryWithBackoff } from '@sharedModule/operators';
import { environment } from 'src/environments/environment';
import { ClientToken, PaymentStatusHttpResponse } from '../custom-types';
import { map } from 'rxjs/operators';
import { convertItemToString, getBoolean } from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class BraintreePaymentGatewayService {

  constructor(private _httpClient: HttpClient) { }

  queryStatusOfPayment$(momentID: string, orderItemID: string, transactionID: string) {
    const API = (environment.baseURL
      + environment.braintreePaymentGateway.queryPaymentStatus())
      .replace(':momentID', momentID)
      .replace(':orderItemID', orderItemID)
      .replace(':transactionID', transactionID);

    return this._httpClient
      .get<PaymentStatusHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
      )
  }

  getClientToken$() {
    const API = environment.baseURL +
      environment.braintreePaymentGateway
        .generateClientToken();

    return this._httpClient.get<ClientToken>(API)
      .pipe(
        retryWithBackoff(1000, 5),
      )
  }

  handleBraintreePayment$(details: FormData) {
    const API = environment.baseURL +
      environment.braintreePaymentGateway.checkoutWithPayment();

    return this._httpClient.post(API,
      details
    ).pipe(retryWithBackoff(1000, 5));
  }
}
