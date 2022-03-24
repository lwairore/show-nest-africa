import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retryWithBackoff } from '@sharedModule/operators';
import { convertItemToNumeric, convertItemToString, isANumber, isObjectEmpty } from '@sharedModule/utilities';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BasicProfileDetailFormatHttpResponse, BasicProfileDetailHttpResponse, TypeOfTicketHttpResponse } from './custom-types';

@Injectable({
  providedIn: 'root'
})
export class SubmitEventService {

  constructor(
    private _httpClient: HttpClient,) { }

  submitMoment$(momentDetails: FormData) {
    const API = environment.baseURL
      + environment.moments.rootURL
      + environment.moments.submitMoment
        .submitMoment();

    return this._httpClient.post(API, momentDetails)
      .pipe(retryWithBackoff(1000, 5));
  }

  listTypeOfTicket$() {
    const API = environment.baseURL
      + environment.moments.rootURL
      + environment.moments.submitMoment.listTypeOfTicket();

    return this._httpClient.get<Array<TypeOfTicketHttpResponse>>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS = details.map(detail => {
            const DETAIL_ID = convertItemToNumeric(detail.id);

            if (!isANumber(DETAIL_ID)) {
              return null;
            }

            const FORMATTED_DETAIL: TypeOfTicketHttpResponse = {
              id: DETAIL_ID,
              title: convertItemToString(detail.title),
              description: convertItemToString(detail.description),
            }

            return FORMATTED_DETAIL;
          }).filter(item => !isObjectEmpty(item));

          return FORMATTED_DETAILS;
        }))

  }

  retrieveUserDetailsDetails$() {
    const API = environment.baseURL
      + environment.moments.rootURL
      + environment.moments.submitMoment.retrieveProfileDetails();

    return this._httpClient.get<BasicProfileDetailHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS: BasicProfileDetailFormatHttpResponse = {
            phoneNumber: convertItemToString(details.phone_number),
            username: convertItemToString(details.user?.username),
            email: convertItemToString(details.user?.email),
          };

          return FORMATTED_DETAILS;
        })
      )
  }
}
