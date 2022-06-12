import { VideoItemPreviewHttpResponse } from '@sharedModule/custom-types';
import { YoutubeLiveStreamHttpResponse } from './youtube-live-stream-http-response';

export type StreamDetailHttpResponse = Readonly<{
    can_stream?: boolean;
    local_live_stream?: VideoItemPreviewHttpResponse;
    youtube_live_stream?: YoutubeLiveStreamHttpResponse;
}>
