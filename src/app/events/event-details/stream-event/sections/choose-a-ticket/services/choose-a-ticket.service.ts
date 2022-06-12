import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TicketHttpResponse, TicketFormatHttpResponse } from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import { convertItemToNumeric, isANumber, isObjectEmpty, convertItemToString } from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class ChooseATicketService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  selectTicket$(momentID: string, formData: FormData) {
    const API = (environment.baseURL +
      environment.streamEvent.selectTicket())
      .replace(':momentID', momentID);

    return this._httpClient.post(API, formData)
      .pipe(
        retryWithBackoff(1000, 5),
      )
  }

  listPurchasedTicket$(momentID: string) {
    const API = (environment.baseURL +
      environment.streamEvent.listPurchasedTicket())
      .replace(':momentID', momentID);

    return this._httpClient.get<ReadonlyArray<TicketHttpResponse>>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS = details.map(detail => {
            const DETAIL_ID = convertItemToNumeric(detail.id);
            if (!isANumber(DETAIL_ID)) {
              return;
            }

            const FORMATTED_DETAIL: TicketFormatHttpResponse = {
              name: convertItemToString(detail.ticket_name),
              id: DETAIL_ID
            };

            return FORMATTED_DETAIL;
          }).filter(detail => !isObjectEmpty(detail));

          return FORMATTED_DETAILS;
        }));
  }
}
