import { ImageItemPreviewHttpResponse } from "./image-item-preview-http-response";

export type VideoItemPreviewHttpResponse = Readonly<{
    video?: string;
    description?: string;
    recording_date?: string;
    video_location?: string;
    thumbnail?: ImageItemPreviewHttpResponse;
}>
