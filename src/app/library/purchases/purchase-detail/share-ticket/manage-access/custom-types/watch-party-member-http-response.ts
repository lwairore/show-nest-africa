export type WatchPartyMemberHttpResponse = Readonly<{
    active?: boolean;
    member_id?: number;
    full_name?: string;
    ticket: {
        ticket_name?: string;
        id: number;
    };
    order_item_id?: number;
}>
