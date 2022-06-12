import { ImageItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';
import { StreamDetailFormatHttpResponse } from './stream-detail-format-http-response';
import { ReplayDetailsFormatHttpResponse } from './replay-details-format-http-response';
import { BackendCheckupFormatHttpResponse } from './backend-checkup-format-http-response';

export type MomentStreamFormatHttpResponse = Readonly<{
  nameOfMoment: string;
  poster?: ImageItemPreviewFormatHttpResponse;
  startsOn: string;
  eventIs: string;
  streamDetails?: StreamDetailFormatHttpResponse;
  replayDetails?: ReplayDetailsFormatHttpResponse;
  streamEndedOn: string;
  controlDetails: BackendCheckupFormatHttpResponse
}>;
