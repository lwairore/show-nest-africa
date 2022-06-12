import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  PurchasedTicketHttpResponse,
  PurchasedTicketFormatHttpResponse,
  OrderItemDetailHttpResponse,
  OrderItemDetailFormatHttpResponse
} from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import {
  convertItemToString,
  whichValueShouldIUse,
  ExpectedType,
  getBoolean,
  convertItemToNumeric,
  isANumber,
  isObjectEmpty
} from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class AddMemberService {

  constructor(
    private _httpClient: HttpClient,
  ) { }


  addStreamBuddy$(momentID: string, details: FormData) {
    const API = (environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.addStreamBuddy())
      .replace(':momentID', momentID);

    return this._httpClient.post(
      API, details)
      .pipe(
        retryWithBackoff(1000, 5))
  }

  listPurchasedTicketForSelectTicket$(momentID: string) {
    const API = (environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.listPurchasedTicketForSelectTicket())
      .replace(':momentID', momentID);

    return this._httpClient
      .get<ReadonlyArray<OrderItemDetailHttpResponse>>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS = details.map(detail => {
            const DETAIL_ID = convertItemToNumeric(detail.id);
            if (!isANumber(DETAIL_ID)) {
              return undefined;
            }

            const FORMATTED_TICKETS = detail.tickets
              ?.map(ticket => {
                const TICKET_ID = convertItemToNumeric(ticket.id);
                if (!isANumber(TICKET_ID)) {
                  return undefined;
                }

                const formattedDetail: PurchasedTicketFormatHttpResponse = {
                  name: convertItemToString(ticket.ticket_name),
                  id: TICKET_ID,
                  quantity: whichValueShouldIUse(ticket.quantity, 0, ExpectedType.NUMBER),
                  canStreamOnline: getBoolean(ticket.can_stream_online),
                  totalWatchPartyMembers: whichValueShouldIUse(ticket.total_watch_party_members, 0, ExpectedType.NUMBER),
                }

                return formattedDetail;
              }).filter(ticket => !isObjectEmpty(ticket));

            const FORMATTED_DETAIL: OrderItemDetailFormatHttpResponse = {
              id: DETAIL_ID,
              tickets: whichValueShouldIUse(FORMATTED_TICKETS, Array, ExpectedType.ARRAY),
            };

            return FORMATTED_DETAIL;
          });

          return FORMATTED_DETAILS;
        })
      );
  }
}
