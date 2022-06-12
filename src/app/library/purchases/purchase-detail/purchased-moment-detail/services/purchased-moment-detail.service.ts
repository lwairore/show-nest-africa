import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MomentDetailHttpResponse, MomentDetailFormatHttpResponse } from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import { convertItemToString, getBoolean, formatShowcaseItemWithPhoto } from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class PurchasedMomentDetailService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  retrievePurchasedMomentDetail$(momentID: string) {
    const API = (environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.retrievePurchasedMomentDetail())
      .replace(':momentID', momentID);

    return this._httpClient.get<MomentDetailHttpResponse>(
      API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS: MomentDetailFormatHttpResponse = {
            nameOfMoment: convertItemToString(details.name_of_moment),
            poster: formatShowcaseItemWithPhoto(details.poster),
            eventIs: convertItemToString(details.event_is),
            startsOn: convertItemToString(details.starts_on),
            canPurchaseTickets: getBoolean(details.can_purchase_tickets),
            canStreamOnline: getBoolean(details.can_stream_online),
            streamEndedOn: convertItemToString(details.stream_ended_on),
            streamCta: {
              textContent: convertItemToString(details.stream_cta?.text_content),
              show: getBoolean(details.stream_cta?.show),
            },
            replayDetails: {
              replay: convertItemToString(details.replay_details?.replay),
              salesEndsOn: convertItemToString(details.replay_details?.sales_ends_on),
            }
          }

          return FORMATTED_DETAILS;
        }));
  }
}
