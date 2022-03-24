import { ImageItemPreviewHttpResponse } from "@sharedModule/custom-types";

export type SpeakerHttpResponse = Readonly<{
    image?: ImageItemPreviewHttpResponse;
    full_name?: string;
}>
