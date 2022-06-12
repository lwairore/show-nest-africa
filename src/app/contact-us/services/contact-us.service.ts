import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OurLocationHttpResponse, MailContactInfoHttpResponse, MailContactInfoFormatHttpResponse, PhoneContactInfoHttpResponse, PhoneContactInfoFormatHttpResponse } from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import { convertItemToString } from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  retrieveOurLocation$() {
    const API = (environment.baseURL
      + environment.contactUs.retrieveOurLocation());

    return this._httpClient.get<OurLocationHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5));
  }

  listMailContactInfo$() {
    const API = (environment.baseURL
      + environment.contactUs.listMailContactInfo());

    return this._httpClient.get<ReadonlyArray<MailContactInfoHttpResponse>>(
      API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS = details.map(detail => {
            const FORMATTED_DETAIL: MailContactInfoFormatHttpResponse = {
              emailAddress: convertItemToString(detail.email_address),
            }

            return FORMATTED_DETAIL;
          });

          return FORMATTED_DETAILS;
        })
      )
  }


  listPhoneContactInfo$() {
    const API = (environment.baseURL
      + environment.contactUs.listPhoneContactInfo());

    return this._httpClient.get<ReadonlyArray<PhoneContactInfoHttpResponse>>(
      API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS = details.map(detail => {
            const FORMATTED_DETAIL: PhoneContactInfoFormatHttpResponse = {
              phoneNumber: convertItemToString(detail.phone_number),
            }

            return FORMATTED_DETAIL;
          });

          return FORMATTED_DETAILS;
        }));
  }
}
