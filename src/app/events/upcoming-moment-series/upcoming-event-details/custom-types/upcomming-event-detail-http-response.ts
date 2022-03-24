import { TrailerHttpResponse } from "./trailer-http-response"
import { MomentProposalHttpResponse } from "./moment-proposal-http-response"

export type UpcommingEventDetailHttpResponse = Readonly<{
    proposal: MomentProposalHttpResponse;
    call_to_action?: string;
    starts_on?: string;
    description?: string;
    venue?: string;
    trailer?: Readonly<TrailerHttpResponse>;
}>
