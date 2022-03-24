import { ImageItemPreviewFormatHttpResponse, VideoItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";

export type TestimonialFormatHttpResponse = Readonly<{
    commentedBy: string;
    authorImage: ImageItemPreviewFormatHttpResponse;
    position: string;
    review: string;
    videoComment?: VideoItemPreviewFormatHttpResponse;
}>
