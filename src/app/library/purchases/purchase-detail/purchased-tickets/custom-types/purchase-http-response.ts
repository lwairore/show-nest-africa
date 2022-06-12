import { AdditionalFeesHttpResponse } from './additional-fees-http-response';
import { TicketHttpResponse } from './ticket-http-response';

export type PurchaseHttpResponse = Readonly<{
    paid?: boolean;
    additional_fees?: ReadonlyArray<AdditionalFeesHttpResponse>;
    tickets?: ReadonlyArray<TicketHttpResponse>;
    updated?: string;
}>
