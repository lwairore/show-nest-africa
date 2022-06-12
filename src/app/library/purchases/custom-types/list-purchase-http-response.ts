import { ImageItemPreviewHttpResponse } from '@sharedModule/custom-types';

export type ListPurchaseHttpResponse = Readonly<{
    id?: number;
    total_tickets?: number;
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
}>
