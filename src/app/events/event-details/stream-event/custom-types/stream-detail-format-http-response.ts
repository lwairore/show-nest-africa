import { VideoItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';
import { YoutubeLiveStreamFormatHttpResponse } from './youtube-live-stream-format-http-response';

export type StreamDetailFormatHttpResponse = Readonly<{
    canStream: boolean;
    localLiveStream?: VideoItemPreviewFormatHttpResponse;
    youtubeLiveStream?: YoutubeLiveStreamFormatHttpResponse;
}>
