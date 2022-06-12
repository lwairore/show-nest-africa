import { ImageItemPreviewHttpResponse } from '@sharedModule/custom-types';

export type UserProfileHttpResponse =Readonly< {
    avatar?: ImageItemPreviewHttpResponse;
    full_name?: string;
}>
