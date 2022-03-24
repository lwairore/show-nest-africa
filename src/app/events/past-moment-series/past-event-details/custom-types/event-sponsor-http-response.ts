import { ImageItemPreviewHttpResponse } from "@sharedModule/custom-types";
import { SocialMediaLinkHttpResponse } from "./social-media-link-http-response";

export type EventSponsorHttpResponse = Readonly<{
    social_media_links?: ReadonlyArray<SocialMediaLinkHttpResponse>;
    logo?: ImageItemPreviewHttpResponse;
    name_of_sponsor?: string;
}>
