import { ProposalFormatHttpResponse } from "./proposal-format-http-response";

export type PastEventFormatHttpResponse = Readonly<{
    endsOn: string;
    id: number;
    proposal: ProposalFormatHttpResponse;
}>
