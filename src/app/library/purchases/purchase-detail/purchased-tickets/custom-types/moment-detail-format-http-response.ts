import { ImageItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';
import { PurchaseFormatHttpResponse } from './purchase-format-http-response';

export type MomentDetailFormatHttpResponse = Readonly<{
    nameOfMoment: string;
    poster?: ImageItemPreviewFormatHttpResponse;
    purchases?: ReadonlyArray<PurchaseFormatHttpResponse>;
}>
