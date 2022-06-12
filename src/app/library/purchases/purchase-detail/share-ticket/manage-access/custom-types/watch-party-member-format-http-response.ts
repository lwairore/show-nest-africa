export type WatchPartyMemberFormatHttpResponse = Readonly<{
    active: boolean;
    memberID: number;
    fullName: string;
    ticket: {
        name: string;
        id: number;
    };
    orderItemID: number;
}>
