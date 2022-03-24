import { ImageItemPreviewHttpResponse } from "@sharedModule/custom-types";
import { TypeOfMomentHttpResponse } from "./type-of-moment-http-response";

export type MomentProposalHttpResponse = Readonly<{
    username?: string;
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
    type_of_moment?: TypeOfMomentHttpResponse;
    cost?: string;
}>
