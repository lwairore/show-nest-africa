import { ImageItemPreviewHttpResponse } from '@sharedModule/custom-types';

export type ShareTicketDetailHttpResponse = Readonly<{
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
}>
