import { ImageItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';

export type UserProfileFormatHttpResponse = Readonly<{
    avatar?: ImageItemPreviewFormatHttpResponse;
    fullName: string;
}>
