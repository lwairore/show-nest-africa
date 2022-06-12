import { AdditionalFeesFormatHttpResponse } from './additional-fees-format-http-response';
import { TicketFormatHttpResponse } from './ticket-format-http-response';

export type PurchaseFormatHttpResponse = Readonly<{
    paid: boolean;
    additionalFees?: ReadonlyArray<AdditionalFeesFormatHttpResponse>;
    tickets?: ReadonlyArray<TicketFormatHttpResponse>;
    updatedOn: string;
}>
