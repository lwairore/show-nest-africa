import { memoize } from "lodash-es";
import { environment } from "src/environments/environment";
import { convertItemToString } from "./convert-item-to-string.util";
import { stringIsEmpty } from "./string-is-empty.util";

export const constructMediaSrc = memoize((src: any) => {
    if (stringIsEmpty(src)) { return ''; }

    const convertSrcToString = convertItemToString(src);

    const newSrc = (environment.production)
        ? convertSrcToString : `${environment.imageBaseURL}${convertSrcToString}`;

    return newSrc;
});
