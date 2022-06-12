import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { isANumber, convertItemToNumeric, whichValueShouldIUse, ExpectedType, isObjectEmpty, convertItemToString, formatShowcaseItemWithPhoto } from '@sharedModule/utilities';
import { ListPurchaseHttpResponse, ListPurchaseFormatHttpResponse, ListInvitedEventHttpResponse, ListInvitedEventFormatHttpResponse } from './custom-types';
import { PaginatedItemHttpResponse } from '@sharedModule/custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  listInvitedEvent$(pageNumber?: string) {
    const API = environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.listInvitedEvent();

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        <string>pageNumber);
    }

    return this._httpClient
      .get<PaginatedItemHttpResponse<ListInvitedEventHttpResponse>>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_MOMENTS = details.results?.map(detail => {
            const DETAIL_ID = convertItemToNumeric(detail.id);
            if (!isANumber(DETAIL_ID)) {
              return null;
            }

            const FORMATTED_DETAIL: ListInvitedEventFormatHttpResponse = {
              id: DETAIL_ID,
              nameOfMoment: convertItemToString(detail?.name_of_moment),
              poster: formatShowcaseItemWithPhoto(detail.poster),
            };

            return FORMATTED_DETAIL;
          }).filter(detail => !isObjectEmpty(detail)) ?? null;

          const FORMATTED_DETAILS: PaginatedItemHttpResponse<ListInvitedEventFormatHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: whichValueShouldIUse(FORMATTED_MOMENTS, Array(), ExpectedType.ARRAY)
          }

          return FORMATTED_DETAILS;
        }));
  }

  listPurchase$(
    pageNumber?: string
  ) {
    const API = environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.listPurchase();

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        <string>pageNumber);
    }

    return this._httpClient
      .get<PaginatedItemHttpResponse<ListPurchaseHttpResponse>>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_MOMENTS = details.results?.map(detail => {
            const DETAIL_ID = convertItemToNumeric(detail.id);
            if (!isANumber(DETAIL_ID)) {
              return null;
            }

            const FORMATTED_DETAIL: ListPurchaseFormatHttpResponse = {
              id: DETAIL_ID,
              nameOfMoment: convertItemToString(detail?.name_of_moment),
              poster: formatShowcaseItemWithPhoto(detail.poster),
              totalTickets: whichValueShouldIUse(
                detail.total_tickets, 0, ExpectedType.NUMBER)
            };

            return FORMATTED_DETAIL;
          }).filter(detail => !isObjectEmpty(detail)) ?? null;

          const FORMATTED_DETAILS: PaginatedItemHttpResponse<ListPurchaseFormatHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: whichValueShouldIUse(FORMATTED_MOMENTS, Array(), ExpectedType.ARRAY)
          }

          return FORMATTED_DETAILS;
        }));
  }
}
