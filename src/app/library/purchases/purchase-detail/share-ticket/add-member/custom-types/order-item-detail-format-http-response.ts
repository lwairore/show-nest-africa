import { PurchasedTicketFormatHttpResponse } from './purchased-ticket-format-http-response';

export type OrderItemDetailFormatHttpResponse = Readonly<{
    id: number;
    tickets: ReadonlyArray<PurchasedTicketFormatHttpResponse>;
}>
