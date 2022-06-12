import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retryWithBackoff } from '@sharedModule/operators';
import { convertItemToString, ExpectedType, whichValueShouldIUse, isANumber, isObjectEmpty, convertItemToNumeric, formatShowcaseItemWithPhoto, getBoolean } from '@sharedModule/utilities';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TicketDetailFormatHttpResponse } from '../../custom-types';
import {
  AdditionalFeeHttpResponse,
  GetTicketMomentDetailFormatHttpResponse,
  GetTicketMomentDetailHttpResponse,
  PaymentMethodHttpResponse
} from '../custom-types';

@Injectable({
  providedIn: 'root'
})
export class GetTicketsService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  listAdditionalFee$() {
    const API = environment.baseURL +
      environment.orders.listAdditionalFee();


    return this._httpClient.get<ReadonlyArray<AdditionalFeeHttpResponse>>(API)
      .pipe(retryWithBackoff(1000, 5));
  }

  listPaymentMethod$() {
    const API = environment.baseURL +
      environment.orders.listPaymentMethods();


    return this._httpClient.get<ReadonlyArray<PaymentMethodHttpResponse>>(API)
      .pipe(retryWithBackoff(1000, 5));
  }

  getTicketMomentDetail$(momentID: string) {
    const API = (environment.baseURL +
      environment.orders.getTicketsMomentDetails())
      .replace(':momentID', momentID);

    return this._httpClient.get<GetTicketMomentDetailHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_TICKET_DETAILS = whichValueShouldIUse(
            details?.ticket_details?.map(item => {
              const TICKET_ID = convertItemToNumeric(
                item.id);

              if (!isANumber(TICKET_ID)) {
                return undefined;
              }

              const FORMATTED_ITEM: TicketDetailFormatHttpResponse = {
                cost: whichValueShouldIUse(item.cost, 0, ExpectedType.NUMBER),
                id: TICKET_ID,
                nameOfTicket: convertItemToString(item.name_of_ticket),
                benefits: convertItemToString(item.benefits, true),
                canStreamOnline: getBoolean(item.can_stream_online),
              };

              return FORMATTED_ITEM;
            }).filter(item => !isObjectEmpty(item)), Array(), ExpectedType.ARRAY);

          const FORMATTED_DETAILS: GetTicketMomentDetailFormatHttpResponse = {
            nameOfMoment: convertItemToString(details.name_of_moment),
            poster: formatShowcaseItemWithPhoto(details.poster),
            ticketDetails: FORMATTED_TICKET_DETAILS,
            eventIs: convertItemToString(details.event_is),
            startsOn: convertItemToString(details.starts_on),
            replayDetails: {
              salesIs: convertItemToString(details.replay_details?.sales_is),
              salesStartsOn: convertItemToString(details.replay_details?.sales_starts_on),
              salesEndsOn: convertItemToString(details.replay_details?.sales_ends_on),
              replayIs: convertItemToString(details.replay_details?.replay_is),
              replayEndsOn: convertItemToString(details.replay_details?.replay_ends_on),
            },
          };

          return FORMATTED_DETAILS;
        })
      )
  }
}
