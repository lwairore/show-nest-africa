import { ImageItemPreviewHttpResponse } from "@sharedModule/custom-types";

export type MomentProposalHttpResponse = Readonly<{
    poster?: ImageItemPreviewHttpResponse;
    name_of_moment?: string;
}>
