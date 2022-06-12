import { VideoItemPreviewFormatHttpResponse, VideoItemPreviewHttpResponse } from "@sharedModule/custom-types";
import { constructMediaSrc } from "./construct-media-src.util";
import {isObjectEmpty} from './is-object-empty.util';
import {formatShowcaseItemWithPhoto} from './format-showcase-item-with-photo.util';


export function formatShowcaseItemWithVideo(
    detail?: VideoItemPreviewHttpResponse) {
      if (isObjectEmpty(detail)) {
        return undefined;
      }

      const FORMATTED_DETAIL: VideoItemPreviewFormatHttpResponse = {
        thumbnail: formatShowcaseItemWithPhoto(detail?.thumbnail),
        src: constructMediaSrc(detail?.video),
      };

      return FORMATTED_DETAIL;
}
