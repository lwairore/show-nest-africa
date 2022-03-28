import { ImageItemPreviewFormatHttpResponse } from "./image-item-preview-format-http-response";

export type PastEventFormatHttpResponse = Readonly<{
    endsOn: string;
    id: number;
    username: string;
    nameOfMoment: string;
    poster: ImageItemPreviewFormatHttpResponse;
}>
