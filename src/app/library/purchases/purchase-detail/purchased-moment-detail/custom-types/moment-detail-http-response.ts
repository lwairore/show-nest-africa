import { ImageItemPreviewHttpResponse } from '@sharedModule/custom-types';
import { StreamCtaHttpResponse } from './stream-cta-http-response';
import { ReplayDetailHttpResponse } from './replay-detail-http-response';

export type MomentDetailHttpResponse = Readonly<{
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
    event_is?: 'upcomming' | 'past' | 'ongoing' | undefined;
    starts_on?: string;
    can_purchase_tickets?: boolean;
    can_stream_online?: boolean;
    stream_cta?: StreamCtaHttpResponse;
    replay_details?: ReplayDetailHttpResponse;
    stream_ended_on?: string;
}>
