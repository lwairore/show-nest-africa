import { ImageItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";

export type MomentProposalFormatHttpResponse = Readonly<{
    poster: ImageItemPreviewFormatHttpResponse;
    nameOfMoment: string;
}>
