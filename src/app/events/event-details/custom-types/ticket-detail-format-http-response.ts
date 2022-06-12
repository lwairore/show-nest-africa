export type TicketDetailFormatHttpResponse = Readonly<{
    cost: string;
    id?: number;
    nameOfTicket: string;
    benefits: string;
    canStreamOnline?: boolean;
}>
