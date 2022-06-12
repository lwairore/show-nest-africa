import { ImageItemPreviewFormatHttpResponse, VideoItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';
import { TicketFormatHttpResponse } from './ticket-format-http-response';

export type DetailFormatHttpResponse = Readonly<{
    nameOfMoment: string;
    poster?: ImageItemPreviewFormatHttpResponse;
    description: string;
    eventTrailer?: VideoItemPreviewFormatHttpResponse;
    canGetATicket: boolean;
    eventIs: string;
    venue: string;
    replayEndedOn: string;
    endedOn: string;
    replayIsAvailableFor: string;
    startsOn: string;
    canPurchaseReplay: boolean;
    salesEndsOn: string;
    highlights?: VideoItemPreviewFormatHttpResponse;
    tickets: ReadonlyArray<TicketFormatHttpResponse>;
}>
