import { ImageItemPreviewHttpResponse } from "./image-item-preview-http-response";

export type UpcommingEventHttpResponse = Readonly<{
    starts_on?: string;
    id?: number;
    username?: string;
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
}>
