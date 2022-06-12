import { ImageItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';
import { StreamCtaFormatHttpResponse } from './stream-cta-format-http-response';
import { ReplayDetailFormatHttpResponse } from './replay-detail-format-http-response';

export type MomentDetailFormatHttpResponse = Readonly<{
    eventIs: string;
    nameOfMoment: string;
    startsOn: string;
    poster?: ImageItemPreviewFormatHttpResponse;
    canPurchaseTickets: boolean;
    canStreamOnline: boolean;
    streamCta: StreamCtaFormatHttpResponse;
    replayDetails: ReplayDetailFormatHttpResponse;
    streamEndedOn: string;
}>
