export type TicketFormatHttpResponse = Readonly<{
    name: string;
    cost?: number;
    quantity?: number;
    subtotal?: number;
    canStream: boolean;
    id: number;
    totalWatchPartyMembers?: number;
}>
