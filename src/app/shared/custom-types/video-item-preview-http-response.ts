import { ImageItemPreviewHttpResponse } from "./image-item-preview-http-response";

export type VideoItemPreviewHttpResponse = Readonly<{
    video?: string;
    thumbnail?: ImageItemPreviewHttpResponse;
}>
