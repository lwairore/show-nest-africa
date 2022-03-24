import { ImageItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";
import { EventSponsorFormatHttpResponse } from "./event-sponsor-format-http-response";
import { TypeOfMomentFormatHttpResponse } from "./type-of-moment-format-http-response";

export type MomentProposalFormatHttpResponse = Readonly<{
    username: string;
    nameOfMoment: string;
    poster: ImageItemPreviewFormatHttpResponse;
    typeOfMoment: TypeOfMomentFormatHttpResponse;
    cost: number;
}>
