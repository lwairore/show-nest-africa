import { EventSponsorFormatHttpResponse } from "./event-sponsor-format-http-response";
import { MomentProposalFormatHttpResponse } from "./moment-proposal-format-http-response";
import { PostEventUpdateFormatHttpResponse } from "./post-event-update-format-http-response";
import { SocialMediaLinkFormatHttpResponse } from "./social-media-link-format-http-response";
import { SpeakerFormatHttpResponse } from "./speaker-format-http-response";

export type PastEventDetailFormatHttpResponse = Readonly<{
    description: string;
    startsOn: string;
    endsOn: string;
    venue: string;
    speakers: ReadonlyArray<SpeakerFormatHttpResponse>;
    socialMediaLinks: ReadonlyArray<SocialMediaLinkFormatHttpResponse>;
    proposal: Readonly<MomentProposalFormatHttpResponse>;
    sponsors: ReadonlyArray<EventSponsorFormatHttpResponse>;
    postEventUpdate?: PostEventUpdateFormatHttpResponse;
}>
