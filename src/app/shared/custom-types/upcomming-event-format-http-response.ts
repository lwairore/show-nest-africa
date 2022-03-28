import { ImageItemPreviewFormatHttpResponse } from "./image-item-preview-format-http-response";

export type UpcommingEventFormatHttpResponse = Readonly<{
    startsOn: string;
    id: number;
    username: string;
    nameOfMoment: string;
    poster: ImageItemPreviewFormatHttpResponse;
}>
