import { ImageItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";

export type ProposalFormatHttpResponse = Readonly<{
    username: string;
    nameOfMoment: string;
    poster: ImageItemPreviewFormatHttpResponse;
}>
