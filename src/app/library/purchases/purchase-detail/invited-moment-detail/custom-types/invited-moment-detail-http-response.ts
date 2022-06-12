import { ImageItemPreviewHttpResponse } from '@sharedModule/custom-types';
import { ReplayDetailsHttpResponse } from './replay-details-http-response';
import { StreamCtaHttpResponse } from './stream-cta-http-response';

export type InvitedMomentDetailHttpResponse = Readonly<{
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
    starts_on?: string;
    event_is?: string;
    replay_details?: ReplayDetailsHttpResponse;
    stream_cta?: StreamCtaHttpResponse;
    stream_ended_on?: string;
}>
