import { VideoItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";

export type TrailerFormatHttpResponse = Readonly<{
    title: string;
    video?: VideoItemPreviewFormatHttpResponse;
}>
