import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ShareTicketDetailHttpResponse, ShareTicketDetailFormatHttpResponse, WatchPartyMemberHttpResponse, WatchPartyMemberFormatHttpResponse } from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import { convertItemToString, isANumber, convertItemToNumeric, getBoolean, isObjectEmpty, whichValueShouldIUse, ExpectedType, formatShowcaseItemWithPhoto } from '@sharedModule/utilities';
import { PaginatedItemHttpResponse } from '@sharedModule/custom-types';

@Injectable({
  providedIn: 'root'
})
export class ShareTicketService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  removeWatchPartyMember$(
    momentID: string, orderItemID: string, ticketID: string,
    memberID: string) {
    const API = (environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.removeWatchPartyMember())
      .replace(':momentID', momentID)
      .replace(':orderItemID', orderItemID)
      .replace(':ticketID', ticketID)
      .replace(':memberID', memberID);

    return this._httpClient.delete(API)
      .pipe(
        retryWithBackoff(1000, 5))
  }

  listWatchPartyMember$(momentID: string, pageNumber?: string) {
    const API = (environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.listWatchPartyMember())
      .replace(':momentID', momentID);

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        convertItemToString(pageNumber));
    }

    return this._httpClient
      .get<PaginatedItemHttpResponse<WatchPartyMemberHttpResponse>>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_MEMBERS = details.results
            ?.map(detail => {
              const MEMBER_ID = convertItemToNumeric(detail.member_id);
              if (!isANumber(MEMBER_ID)) {
                return;
              }

              const ORDER_ITEM_ID = convertItemToNumeric(detail.order_item_id);
              if (!isANumber(ORDER_ITEM_ID)) {
                return;
              }

              const TICKET_ID = convertItemToNumeric(detail.ticket?.id);
              if (!isANumber(TICKET_ID)) {
                return;
              }

              const FORMATTED_DETAIL: WatchPartyMemberFormatHttpResponse = {
                active: getBoolean(detail.active),
                memberID: MEMBER_ID,
                fullName: convertItemToString(detail.full_name),
                ticket: {
                  name: convertItemToString(detail.ticket?.ticket_name),
                  id: TICKET_ID
                },
                orderItemID: ORDER_ITEM_ID,
              };

              return FORMATTED_DETAIL;
            }).filter(detail => !isObjectEmpty(detail));


          const FORMATTED_DETAILS: PaginatedItemHttpResponse<WatchPartyMemberFormatHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: whichValueShouldIUse(FORMATTED_MEMBERS, Array(), ExpectedType.ARRAY)
          }

          return FORMATTED_DETAILS;
        })
      );

  }

  retrieveShareTicketDetail$(momentID: string) {
    const API = (environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.retrieveShareTicketDetail())
      .replace(':momentID', momentID);

    return this._httpClient.get<ShareTicketDetailHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS: ShareTicketDetailFormatHttpResponse = {
            nameOfMoment: convertItemToString(details.name_of_moment),
            poster: formatShowcaseItemWithPhoto(details.poster),
          }

          return FORMATTED_DETAILS;
        }));
  }
}
