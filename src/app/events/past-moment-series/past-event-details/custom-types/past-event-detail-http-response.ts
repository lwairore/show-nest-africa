import { EventSponsorHttpResponse } from "./event-sponsor-http-response";
import { MomentProposalHttpResponse } from "./moment-proposal-http-response";
import { PostEventUpdateHttpResponse } from "./post-event-update-http-response";
import { SocialMediaLinkHttpResponse } from "./social-media-link-http-response";
import { SpeakerHttpResponse } from "./speaker-http-response";

export type PastEventDetailHttpResponse = Readonly<{
    description?: string;
    starts_on?: string;
    ends_on?: string;
    venue?: string;
    speakers?: ReadonlyArray<SpeakerHttpResponse>;
    social_media_links?: ReadonlyArray<SocialMediaLinkHttpResponse>;
    proposal?: Readonly<MomentProposalHttpResponse>;
    sponsors?: ReadonlyArray<EventSponsorHttpResponse>;
    post_event_update?: PostEventUpdateHttpResponse;
}>
