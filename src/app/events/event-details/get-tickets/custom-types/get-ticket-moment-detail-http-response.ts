import { ImageItemPreviewHttpResponse } from "@sharedModule/custom-types";
import { TicketDetailHttpResponse } from "../../custom-types";
import { ReplayDetailsHttpResponse } from './replay-details-http-response';

export type GetTicketMomentDetailHttpResponse = Readonly<{
    name_of_moment?: string;
    poster: Readonly<ImageItemPreviewHttpResponse>;
    ticket_details?: ReadonlyArray<TicketDetailHttpResponse>;
    starts_on?: string;
    event_is?: string;
    replay_details?: ReplayDetailsHttpResponse;
}>
