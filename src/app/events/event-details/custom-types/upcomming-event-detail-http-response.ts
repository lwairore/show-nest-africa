import { TrailerHttpResponse } from "./trailer-http-response"
import { ImageItemPreviewHttpResponse } from "@sharedModule/custom-types";
import { TicketDetailHttpResponse } from "./ticket-detail-http-response";

export type UpcommingEventDetailHttpResponse = Readonly<{
    poster?: ImageItemPreviewHttpResponse;
    name_of_moment?: string;
    starts_on?: string;
    description?: string;
    venue?: string;
    trailer?: Readonly<TrailerHttpResponse>;
    public_name?: string;
    ticket_details?: ReadonlyArray<TicketDetailHttpResponse>;
    replay?: number;
    paid?: boolean;
    event_is?: string;
}>
