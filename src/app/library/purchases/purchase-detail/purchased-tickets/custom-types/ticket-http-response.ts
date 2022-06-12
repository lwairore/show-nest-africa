export type TicketHttpResponse = Readonly<{
    ticket_name?: string;
    ticket_cost?: string;
    quantity?: number;
    subtotal?: number;
    can_stream_online?: boolean;
    id?: number;
    total_watch_party_members?: number;
}>
