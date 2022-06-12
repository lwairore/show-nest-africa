import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retryWithBackoff } from '@sharedModule/operators';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import {
  PaymentRequestInfoHttpResponse,
  PaymentRequestInfoFormatHttpResponse,
  PaymentStatusHttpResponse
} from '../custom-types';
import { convertItemToString, getBoolean } from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class LipaNaMPesaOnlineService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  queryStatusOfALipaNaMPesaOnlinePayment$(
    momentID: string, orderItemID: string, requestRecordID: string
  ) {
    const API = (environment.baseURL
      + environment.mpesa.rootURL
      + environment.mpesa.queryLipaNaMPesaOnlineStkPush
        .query())
      .replace(':momentID', momentID)
      .replace(':orderItemID', orderItemID)
      .replace(':requestRecordID', requestRecordID);

    return this._httpClient
      .get<PaymentStatusHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5))
  }

  retrievePaymentRequestInfo$(
    momentID: string, orderItemID: string,
    requestRecordID: string) {
    const API = (environment.baseURL
      + environment.mpesa.rootURL
      + environment.mpesa.queryLipaNaMPesaOnlineStkPush
        .paymentRequestInfo())
      .replace(':momentID', momentID)
      .replace(':orderItemID', orderItemID)
      .replace(':requestRecordID', requestRecordID);

    return this._httpClient
      .get<PaymentRequestInfoHttpResponse>(
        API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const formattedDetails: PaymentRequestInfoFormatHttpResponse = {
            stkPushSentTo: convertItemToString(details.stk_push_sent_to)
          };

          return formattedDetails;
        })
      );
  }

  lipaNaMPesaStkPush$(formData: FormData) {
    const API = environment.baseURL
      + environment.mpesa.lipaNaMPesaOnlineStkPush();

    return this._httpClient
      .post(API, formData)
      .pipe(
        retryWithBackoff(1000, 5));
  }
}
