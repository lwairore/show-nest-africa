import {ProposalHttpResponse} from "./proposal-http-response";

export type UpcommingEventHttpResponse = Readonly<{
    starts_on?: string;
    id?:number;
    proposal?: ProposalHttpResponse;
}>
