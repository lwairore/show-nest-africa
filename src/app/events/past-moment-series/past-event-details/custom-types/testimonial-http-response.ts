import { ImageItemPreviewHttpResponse, VideoItemPreviewHttpResponse } from "@sharedModule/custom-types";

export type TestimonialHttpResponse = Readonly<{
    commented_by?: string;
    author_image?: ImageItemPreviewHttpResponse;
    position?: string;
    video_comment?: VideoItemPreviewHttpResponse;
    review?: string;
}>
