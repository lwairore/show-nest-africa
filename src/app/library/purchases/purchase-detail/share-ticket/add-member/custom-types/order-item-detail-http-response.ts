import { PurchasedTicketHttpResponse } from './purchased-ticket-http-response';

export type OrderItemDetailHttpResponse = Readonly<{
    id?: number;
    tickets?: ReadonlyArray<PurchasedTicketHttpResponse>;
}>
