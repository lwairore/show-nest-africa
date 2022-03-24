import { TrailerFormatHttpResponse } from "./trailer-format-http-response";
import { MomentProposalFormatHttpResponse } from "./moment-proposal-format-http-response";

export type UpcommingEventDetailFormatHttpResponse = Readonly<{
    proposal: MomentProposalFormatHttpResponse;
    callToAction: string;
    startsOn: string;
    description: string;
    venue: string;
    trailer?: Readonly<TrailerFormatHttpResponse>;
}>
