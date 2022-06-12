import { ImageItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";
import { TicketDetailFormatHttpResponse } from "../../custom-types";
import { ReplayDetailsFormatHttpResponse } from './replay-details-format-http-response';

export type GetTicketMomentDetailFormatHttpResponse = Readonly<{
    nameOfMoment: string;
    poster: Readonly<ImageItemPreviewFormatHttpResponse>;
    ticketDetails: ReadonlyArray<TicketDetailFormatHttpResponse>;
    startsOn: string;
    eventIs: string;
    replayDetails: ReplayDetailsFormatHttpResponse
}>
