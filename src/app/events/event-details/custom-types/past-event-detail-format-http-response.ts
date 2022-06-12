import {
  ImageItemPreviewFormatHttpResponse,
  VideoItemPreviewFormatHttpResponse
} from "@sharedModule/custom-types";

export type PastEventDetailFormatHttpResponse = Readonly<{
  description: string;
  nameOfMoment: string;
  eventIs: string;
  poster: ImageItemPreviewFormatHttpResponse;
  callToAction: string;
  salesEndsIn: string;
  paid: boolean;
  replay?: number;
  highlights?: VideoItemPreviewFormatHttpResponse;
}>
