import { ImageItemPreviewHttpResponse } from '@sharedModule/custom-types';
import { StreamDetailHttpResponse } from './stream-detail-http-response';
import { ReplayDetailsHttpResponse } from './replay-details-http-response';
import { BackendCheckupHttpResponse } from './backend-checkup-http-response';

export type MomentStreamHttpResponse = Readonly<{
  name_of_moment?: string;
  stream_details?: StreamDetailHttpResponse;
  poster?: ImageItemPreviewHttpResponse;
  starts_on?: string;
  event_is?: string;
  replay_details?: ReplayDetailsHttpResponse;
  stream_ended_on?: string;
  control_details?: BackendCheckupHttpResponse
}>;
