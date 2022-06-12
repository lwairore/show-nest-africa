import { ImageItemPreviewHttpResponse } from '@sharedModule/custom-types';
import { PurchaseHttpResponse } from './purchase-http-response';

export type MomentDetailHttpResponse=Readonly< {
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
    purchases?: ReadonlyArray<PurchaseHttpResponse>;
}>
