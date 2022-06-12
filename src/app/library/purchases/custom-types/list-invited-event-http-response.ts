import { ImageItemPreviewHttpResponse } from '@sharedModule/custom-types';

export type ListInvitedEventHttpResponse = Readonly<{
    poster?: ImageItemPreviewHttpResponse;
    name_of_moment?: string;
    id?: number;
}>
