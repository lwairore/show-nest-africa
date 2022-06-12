import { TrailerFormatHttpResponse } from "./trailer-format-http-response";
import { ImageItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";
import { TicketDetailFormatHttpResponse } from "./ticket-detail-format-http-response";

export type UpcommingEventDetailFormatHttpResponse = Readonly<{
    poster: ImageItemPreviewFormatHttpResponse;
    nameOfMoment: string;
    startsOn: string;
    description: string;
    venue: string;
    trailer?: Readonly<TrailerFormatHttpResponse>;
    publicName: string;
    ticketDetails: ReadonlyArray<TicketDetailFormatHttpResponse>;
    replay: number;
    eventIs: string;
    paid: boolean;
}>
