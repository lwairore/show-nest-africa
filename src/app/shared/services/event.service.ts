import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PaginatedItemHttpResponse,
  PastEventFormatHttpResponse,
  PastEventHttpResponse,
  UpcommingEventFormatHttpResponse,
  UpcommingEventHttpResponse
} from '@sharedModule/custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import {
  convertItemToNumeric,
  convertItemToString,
  ExpectedType,
  isANumber,
  isObjectEmpty,
  whichValueShouldIUse,
  formatShowcaseItemWithPhoto,
  getBoolean
} from '@sharedModule/utilities';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private _httpClient: HttpClient, ) { }

  listUpcommingEvent$(pageNumber?: string) {
    const API = environment.baseURL +
      environment.moments.listUpcommingEvent();

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        convertItemToString(pageNumber));
    }

    return this._httpClient
      .get<PaginatedItemHttpResponse<UpcommingEventHttpResponse>>(API, { params })
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_MOMENTS = details.results?.map(detail => {
            const DETAIL_ID = convertItemToNumeric(detail.id);
            if (!isANumber(DETAIL_ID)) {
              return null;
            }

            const FORMATTED_DETAIL: UpcommingEventFormatHttpResponse = {
              startsOn: convertItemToString(detail.starts_on),
              id: DETAIL_ID,
              username: convertItemToString(detail?.username),
              nameOfMoment: convertItemToString(detail?.name_of_moment),
              poster: formatShowcaseItemWithPhoto(detail.poster),
            };

            return FORMATTED_DETAIL;
          }).filter(detail => !isObjectEmpty(detail)) ?? null;

          const FORMATTED_DETAILS: PaginatedItemHttpResponse<UpcommingEventFormatHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: whichValueShouldIUse(FORMATTED_MOMENTS, Array(), ExpectedType.ARRAY)
          }

          return FORMATTED_DETAILS;
        })
      );
  }

  listPastEvent$(pageNumber?: string) {
    const API = environment.baseURL +
      environment.moments.listPastEvent();

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        convertItemToString(pageNumber));
    }

    return this._httpClient.get<PaginatedItemHttpResponse<PastEventHttpResponse>>(API,
      { params })
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_MOMENTS = details.results?.map(detail => {
            const DETAIL_ID = convertItemToNumeric(detail.id);
            if (!isANumber(DETAIL_ID)) {
              return null;
            }

            const FORMATTED_DETAIL: PastEventFormatHttpResponse = {
              endsOn: convertItemToString(detail.ends_on),
              id: DETAIL_ID,
              username: convertItemToString(detail?.username),
              nameOfMoment: convertItemToString(detail?.name_of_moment),
              poster: formatShowcaseItemWithPhoto(detail.poster),
              canPurchaseReplay: getBoolean(detail.can_purchase_replay),
              higlightsIsAvailable: getBoolean(detail.higlights_is_available),
            };

            return FORMATTED_DETAIL;
          }).filter(detail => !isObjectEmpty(detail));

          const FORMATTED_DETAILS: PaginatedItemHttpResponse<PastEventFormatHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: whichValueShouldIUse(FORMATTED_MOMENTS, Array(), ExpectedType.ARRAY)
          }

          return FORMATTED_DETAILS;
        })
      );
  }
}
