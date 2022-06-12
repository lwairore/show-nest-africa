import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  constructMediaSrc,
  convertItemToString,
  ExpectedType,
  isANumber,
  isObjectEmpty,
  getBoolean,
  formatShowcaseItemWithVideo,
  whichValueShouldIUse,
  stringIsEmpty,
  formatShowcaseItemWithPhoto
} from '@sharedModule/utilities';
import { environment } from 'src/environments/environment';
import {
  PastEventDetailFormatHttpResponse,
  PastEventDetailHttpResponse,
  TicketDetailFormatHttpResponse,
  TrailerFormatHttpResponse,
  UpcommingEventDetailFormatHttpResponse,
  UpcommingEventDetailHttpResponse
} from './custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EventDetailsService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  retrieveEventDetails$(momentID: string) {
    const API = (environment.baseURL +
      environment.moments.retrieveEventDetails())
      .replace(':momentID', momentID);

    return this._httpClient.get<PastEventDetailHttpResponse | UpcommingEventDetailHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const event_is = convertItemToString(details.event_is);

          if (stringIsEmpty(event_is)) {
            throw Error('Conflict occured.')
          }

          if (event_is === 'past') {
            return this._formatPastEventDetails(details);
          } else if (event_is === 'upcomming') {
            return this._formatUpcommingDetails(details);
          }

          throw Error('Conflict occured.');
        })
      )
  }

  private _formatUpcommingDetails(details: UpcommingEventDetailHttpResponse) {
    const TRAILER = details.trailer;
    const FORMATTED_TRAILER: TrailerFormatHttpResponse = {
      title: convertItemToString(TRAILER?.title),
      video: formatShowcaseItemWithVideo(TRAILER?.video),
    }

    const FORMATTED_TICKET_DETAILS = whichValueShouldIUse(details.ticket_details?.map(item => {
      const FORMATTED_ITEM: TicketDetailFormatHttpResponse = {
        nameOfTicket: convertItemToString(item.name_of_ticket),
        benefits: convertItemToString(item.benefits, true),
        cost: whichValueShouldIUse(item.cost, 0, ExpectedType.NUMBER)
      };

      return FORMATTED_ITEM
    }), Array(), ExpectedType.ARRAY);

    const FORMATTED_DETAILS: UpcommingEventDetailFormatHttpResponse = {
      poster: formatShowcaseItemWithPhoto(
        details.poster),
      nameOfMoment: convertItemToString(
        details.name_of_moment),
      trailer: FORMATTED_TRAILER,
      startsOn: convertItemToString(details.starts_on),
      description: convertItemToString(details.description, true),
      venue: convertItemToString(details.venue),
      publicName: convertItemToString(details.public_name),
      ticketDetails: FORMATTED_TICKET_DETAILS,
      replay: whichValueShouldIUse(details.replay, 0, ExpectedType.NUMBER),
      eventIs: convertItemToString(details.event_is),
      paid: getBoolean(details.paid),
    };

    console.log({ FORMATTED_DETAILS })

    return FORMATTED_DETAILS;
  }

  private _formatPastEventDetails(details: PastEventDetailHttpResponse) {
    const FORMATTED_DETAILS: PastEventDetailFormatHttpResponse = {
      poster: formatShowcaseItemWithPhoto(
        details?.poster),
      nameOfMoment: convertItemToString(
        details?.name_of_moment),
      salesEndsIn: convertItemToString(details?.sales_ends_in),
      description: convertItemToString(details.description, true),
      replay: whichValueShouldIUse(details.replay, undefined, ExpectedType.NUMBER),
      highlights: formatShowcaseItemWithVideo(details.highlights),
      eventIs: convertItemToString(details.event_is),
      callToAction: convertItemToString(details.call_to_action),
      paid: getBoolean(details.paid),
    };

    return FORMATTED_DETAILS;
  }
}
