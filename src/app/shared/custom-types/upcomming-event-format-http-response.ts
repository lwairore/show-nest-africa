import { ProposalFormatHttpResponse } from "./proposal-format-http-response";

export type UpcommingEventFormatHttpResponse = Readonly<{
    startsOn: string;
    id: number;
    proposal: ProposalFormatHttpResponse;
}>
