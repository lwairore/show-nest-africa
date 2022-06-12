import { ImageItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';

export type ListPurchaseFormatHttpResponse = Readonly<{
    id: number;
    totalTickets: number;
    nameOfMoment: string;
    poster?: ImageItemPreviewFormatHttpResponse;
}>
