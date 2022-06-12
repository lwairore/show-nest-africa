import { ImageItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';

export type ListInvitedEventFormatHttpResponse =Readonly< {
    poster?: ImageItemPreviewFormatHttpResponse;
    nameOfMoment: string;
    id: number;
}>
