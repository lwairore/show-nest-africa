import { ImageItemPreviewFormatHttpResponse, ImageItemPreviewHttpResponse } from "@sharedModule/custom-types";
import { constructMediaSrc } from "./construct-media-src.util";
import { convertItemToString } from "./convert-item-to-string.util";

export function formatShowcaseItemWithPhoto(
    photo?: ImageItemPreviewHttpResponse, replaceAllLineBreaks = false) {
    const formattedPhoto: ImageItemPreviewFormatHttpResponse = {
        alt: convertItemToString(photo?.caption, replaceAllLineBreaks),
        src: constructMediaSrc(photo?.image),
    }

    return formattedPhoto;
}
