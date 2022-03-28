import { ImageItemPreviewHttpResponse } from "./image-item-preview-http-response";

export type PastEventHttpResponse = Readonly<{
    ends_on?: string;
    id?: number;
    username?: string;
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
}>
