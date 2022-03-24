import { VideoItemPreviewHttpResponse } from "@sharedModule/custom-types";

export type TrailerHttpResponse = Readonly<{
    title?: string;
    video?: VideoItemPreviewHttpResponse;
}>
