import { ImageItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";

export type SpeakerFormatHttpResponse = Readonly<{
    image?: ImageItemPreviewFormatHttpResponse;
    fullName: string;
}>
