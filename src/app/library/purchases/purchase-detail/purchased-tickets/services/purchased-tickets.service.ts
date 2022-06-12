import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  PurchaseFormatHttpResponse,
  AdditionalFeesFormatHttpResponse,
  TicketFormatHttpResponse,
  MomentDetailHttpResponse,
  MomentDetailFormatHttpResponse
} from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import {
  convertItemToNumeric,
  convertItemToString,
  isANumber,
  whichValueShouldIUse,
  getBoolean,
  ExpectedType,
  isObjectEmpty,
  formatShowcaseItemWithPhoto
} from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class PurchasedTicketsService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  listPurchasedTickets$(momentID: string) {
    const API = (environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.listPurchasedTickets())
      .replace(':momentID', momentID);

    return this._httpClient.get<MomentDetailHttpResponse>(
      API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_PURCHASES = details.purchases?.map(purchase => {
            const FORMATTED_FEES = purchase.additional_fees?.map(fee => {
              const FORMATTED_FEE: AdditionalFeesFormatHttpResponse = {
                fee: convertItemToNumeric(fee.fee),
                feeName: convertItemToString(fee.fee_name),
              };

              return FORMATTED_FEE;
            })

            const FORMATTED_TICKETS = purchase.tickets?.map(ticket => {
              const TICKET_ID = convertItemToNumeric(ticket.id);

              if (!isANumber(TICKET_ID)) {
                return null;
              }

              const FORMATTED_TICKET: TicketFormatHttpResponse = {
                name: convertItemToString(ticket.ticket_name),
                cost: convertItemToNumeric(ticket.ticket_cost),
                quantity: whichValueShouldIUse(ticket.quantity, undefined, ExpectedType.NUMBER),
                subtotal: whichValueShouldIUse(ticket.subtotal, undefined, ExpectedType.NUMBER),
                canStream: getBoolean(ticket.can_stream_online),
                totalWatchPartyMembers: whichValueShouldIUse(ticket.total_watch_party_members,
                  0, ExpectedType.NUMBER),
                id: TICKET_ID,
              };

              return FORMATTED_TICKET;
            }).filter(ticket => !isObjectEmpty(ticket));

            const FORMATTED_PURCHASE: PurchaseFormatHttpResponse = {
              paid: getBoolean(purchase.paid),
              additionalFees: FORMATTED_FEES,
              tickets: whichValueShouldIUse(
                FORMATTED_TICKETS,
                Array(),
                ExpectedType.ARRAY),
              updatedOn: convertItemToString(purchase.updated),
            }

            return FORMATTED_PURCHASE;
          });

          const FORMATTED_DETAILS: MomentDetailFormatHttpResponse = {
            nameOfMoment: convertItemToString(details.name_of_moment),
            poster: formatShowcaseItemWithPhoto(details.poster),
            purchases: FORMATTED_PURCHASES,
          }

          return FORMATTED_DETAILS;
        }));
  }
}
