import { ImageItemPreviewHttpResponse, VideoItemPreviewHttpResponse } from "@sharedModule/custom-types";

export type PastEventDetailHttpResponse = Readonly<{
    description?: string;
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
    replay?: number;
    highlights?: VideoItemPreviewHttpResponse;
    event_is?: string;
    call_to_action?: string;
    sales_ends_in?: string;
    paid?: boolean;
}>
