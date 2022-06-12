import { ImageItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';

export type ShareTicketDetailFormatHttpResponse = Readonly<{
    nameOfMoment: string;
    poster?: ImageItemPreviewFormatHttpResponse;
}>
