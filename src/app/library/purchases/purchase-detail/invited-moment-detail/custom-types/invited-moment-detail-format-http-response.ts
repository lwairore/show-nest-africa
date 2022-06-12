import { ImageItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';
import { ReplayDetailsFormatHttpResponse } from './replay-details-format-http-response';
import { StreamCtaFormatHttpResponse } from './stream-cta-format-http-response';

export type InvitedMomentDetailFormatHttpResponse = Readonly<{
    nameOfMoment: string;
    poster?: ImageItemPreviewFormatHttpResponse;
    startsOn: string;
    eventIs: string;
    replayDetails?: ReplayDetailsFormatHttpResponse;
    streamCta?: StreamCtaFormatHttpResponse;
    streamEndedOn: string;
}>
