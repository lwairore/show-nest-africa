export type PurchasedTicketHttpResponse = Readonly<{
    ticket_name?: string;
    quantity?: number;
    can_stream_online?: boolean;
    total_watch_party_members?: number;
    id?: number;
}>
