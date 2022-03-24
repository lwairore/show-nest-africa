import { ImageItemPreviewHttpResponse } from "@sharedModule/custom-types";

export type ProposalHttpResponse = Readonly<{
    username?: string;
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
}>
