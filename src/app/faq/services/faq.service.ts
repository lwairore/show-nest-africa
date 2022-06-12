import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { isANumber, convertItemToString, whichValueShouldIUse, ExpectedType } from '@sharedModule/utilities';
import { PaginatedItemHttpResponse } from '@sharedModule/custom-types';
import { FaqHttpResponse } from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  listFaqForFan$(pageNumber?: string) {
    const API = environment.baseURL
      + environment.faq.listFaqForFan();

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        <string>pageNumber);
    }
    return this._httpClient
      .get<PaginatedItemHttpResponse<FaqHttpResponse>>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_FAQ = details.results
            ?.map(detail => {

              const FORMATTED_DETAIL: FaqHttpResponse = {
                question: convertItemToString(detail?.question),
                answer: convertItemToString(detail.answer, true),
              };

              console.log({ FORMATTED_DETAIL });

              return FORMATTED_DETAIL;
            });

          const FORMATTED_DETAILS: PaginatedItemHttpResponse<FaqHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: whichValueShouldIUse(FORMATTED_FAQ, Array(), ExpectedType.ARRAY)
          }

          return FORMATTED_DETAILS;
        }));

  }

  listFaqForCreator$(pageNumber?: string) {
    const API = environment.baseURL
      + environment.faq.listFaqForCreator();

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        <string>pageNumber);
    }
    return this._httpClient
      .get<PaginatedItemHttpResponse<FaqHttpResponse>>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_FAQ = details.results
            ?.map(detail => {

              const FORMATTED_DETAIL: FaqHttpResponse = {
                question: convertItemToString(detail?.question),
                answer: convertItemToString(detail.answer, true),
              };

              console.log({ FORMATTED_DETAIL });

              return FORMATTED_DETAIL;
            });

          const FORMATTED_DETAILS: PaginatedItemHttpResponse<FaqHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: whichValueShouldIUse(FORMATTED_FAQ, Array(), ExpectedType.ARRAY)
          }

          return FORMATTED_DETAILS;
        }));

  }
}
