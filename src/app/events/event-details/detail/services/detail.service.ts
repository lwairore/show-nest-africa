import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  DetailHttpResponse,
  DetailFormatHttpResponse,
  TicketFormatHttpResponse
} from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import {
  convertItemToString,
  formatShowcaseItemWithPhoto,
  formatShowcaseItemWithVideo,
  getBoolean,
  convertItemToNumeric,
  whichValueShouldIUse,
  ExpectedType
} from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  retrieveEventDetail$(momentID: string) {
    const API = (environment.baseURL +
      environment.moments.retrieveEventDetails())
      .replace(':momentID', momentID);

    return this._httpClient.get<DetailHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_TICKETS = details.tickets?.map(ticket => {
            const FORMATTED_TICKET: TicketFormatHttpResponse = {
              nameOfTicket: convertItemToString(ticket.name_of_ticket),
              cost: convertItemToString(ticket.cost),
            };

            return FORMATTED_TICKET;
          });

          const FORMATTED_DETAILS: DetailFormatHttpResponse = {
            nameOfMoment: convertItemToString(details.name_of_moment),
            poster: formatShowcaseItemWithPhoto(details.poster),
            venue: convertItemToString(details.venue),
            description: convertItemToString(details.description, true),
            eventTrailer: formatShowcaseItemWithVideo(details.event_trailer),
            canGetATicket: getBoolean(details.can_get_a_ticket),
            eventIs: convertItemToNumeric(details.event_is),
            replayEndedOn: convertItemToString(details.replay_ended_on),
            endedOn: convertItemToString(details.ended_on),
            replayIsAvailableFor: convertItemToString(details.replay_is_available_for),
            startsOn: convertItemToString(details.starts_on),
            highlights: formatShowcaseItemWithVideo(details.highlights),
            salesEndsOn: convertItemToString(details.sales_ends_on),
            canPurchaseReplay: getBoolean(details.can_purchase_replay),
            tickets: whichValueShouldIUse(FORMATTED_TICKETS, Array(),
              ExpectedType.ARRAY),
          };

          return FORMATTED_DETAILS;
        })
      )
  }
}
