import { ImageItemPreviewFormatHttpResponse } from "@sharedModule/custom-types";
import { SocialMediaLinkFormatHttpResponse } from "./social-media-link-format-http-response";

export type EventSponsorFormatHttpResponse = Readonly<{
    socialMediaLinks: ReadonlyArray<SocialMediaLinkFormatHttpResponse>;
    logo: ImageItemPreviewFormatHttpResponse;
    nameOfSponsor: string;
}>
