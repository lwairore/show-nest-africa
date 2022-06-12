import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InvitedMomentDetailHttpResponse, InvitedMomentDetailFormatHttpResponse, ReplayDetailsFormatHttpResponse } from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import { convertItemToString, getBoolean, formatShowcaseItemWithPhoto } from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class InvitedMomentDetailService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  retrieveInvitedMomentDetail$(momentID: string) {
    const API = (environment.baseURL
      + environment.library.rootURL
      + environment.library.purchases.retrieveInvitedMomentDetail())
      .replace(':momentID', momentID);

    return this._httpClient.get<InvitedMomentDetailHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS: InvitedMomentDetailFormatHttpResponse = {
            nameOfMoment: convertItemToString(details.name_of_moment),
            poster: formatShowcaseItemWithPhoto(details.poster),
            startsOn: convertItemToString(details.starts_on),
            eventIs: convertItemToString(details.event_is),
            streamEndedOn: convertItemToString(details.stream_ended_on),
            replayDetails: {
              playsOn: convertItemToString(details.replay_details?.plays_on),
              replayIs: convertItemToString(details.replay_details?.replay_is),
              streamEndedOn: convertItemToString(details.replay_details?.stream_ended_on),
            },
            streamCta: {
              show: getBoolean(details.stream_cta?.show),
              textContent: convertItemToString(details.stream_cta?.text_content),
            }
          };

          return FORMATTED_DETAILS;
        }));
  }
}
