import { ImageItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";

export type MomentDetailForBreadcrumbFormatHttpResponse = Readonly<{
    poster: ImageItemPreviewFormatHttpResponse;
    nameOfMoment: string;
}>
