import { ProposalHttpResponse } from "./proposal-http-response";

export type PastEventHttpResponse = Readonly<{
    ends_on?: string;
    id?: number;
    proposal?: ProposalHttpResponse;
}>
