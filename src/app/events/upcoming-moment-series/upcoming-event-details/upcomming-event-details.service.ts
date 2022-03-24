import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retryWithBackoff } from '@sharedModule/operators';
import {
  constructMediaSrc,
  convertItemToString
} from '@sharedModule/utilities';
import { formatShowcaseItemWithPhoto } from '@sharedModule/utilities/format-showcase-item-with-photo.util';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  MomentProposalFormatHttpResponse,
  MomentProposalHttpResponse,
  TrailerFormatHttpResponse,
  UpcommingEventDetailFormatHttpResponse,
  UpcommingEventDetailHttpResponse
} from './custom-types';

@Injectable()
export class UpcommingEventDetailsService {

  constructor(
    private _httpClient: HttpClient,
  ) { }


  retrieveUpcommingEventDetails$(momentID: string) {
    const API = (environment.baseURL +
      environment.moments.retrieveUpcommingEventDetails())
      .replace(':momentID', momentID);

    return this._httpClient.get<UpcommingEventDetailHttpResponse>(
      API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_PROPOSAL = this._formatProposal(
            details.proposal);

          const TRAILER = details.trailer;
          const FORMATTED_TRAILER: TrailerFormatHttpResponse = {
            title: convertItemToString(TRAILER?.title),
            video: {
              thumbnail: formatShowcaseItemWithPhoto(TRAILER?.video?.thumbnail),
              src: constructMediaSrc(TRAILER?.video?.video),
              description: convertItemToString(TRAILER?.video?.description, true),
              recordingDate: convertItemToString(TRAILER?.video?.recording_date),
              videoLocation: convertItemToString(TRAILER?.video?.video_location)
            },
          }

          const FORMATTED_DETAILS: UpcommingEventDetailFormatHttpResponse = {
            proposal: FORMATTED_PROPOSAL,
            trailer: FORMATTED_TRAILER,
            callToAction: convertItemToString(details.call_to_action),
            startsOn: convertItemToString(details.starts_on),
            description: convertItemToString(details.description, true),
            venue: convertItemToString(details.venue),
          };

          return FORMATTED_DETAILS;
        }));
  }

  private _formatProposal(details: MomentProposalHttpResponse) {
    const FORMATTED_PROPOSAL: MomentProposalFormatHttpResponse = {
      poster: formatShowcaseItemWithPhoto(
        details.poster),
      nameOfMoment: convertItemToString(
        details.name_of_moment),
    };

    return FORMATTED_PROPOSAL;
  }
}
