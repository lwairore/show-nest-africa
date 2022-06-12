import { ImageItemPreviewFormatHttpResponse } from "./image-item-preview-format-http-response";

export type VideoItemPreviewFormatHttpResponse = Readonly<{
    src: string;
    thumbnail?: ImageItemPreviewFormatHttpResponse;
}>
