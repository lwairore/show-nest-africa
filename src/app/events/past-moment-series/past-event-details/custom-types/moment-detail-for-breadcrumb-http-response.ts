import { ImageItemPreviewHttpResponse } from "@sharedModule/custom-types";

export type MomentDetailForBreadcrumbHttpResponse = Readonly<{
    poster?: ImageItemPreviewHttpResponse;
    name_of_moment?: string;
}>
