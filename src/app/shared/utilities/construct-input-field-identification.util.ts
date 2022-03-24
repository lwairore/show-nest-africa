import { memoize } from "lodash-es";
import { convertItemToString } from "./convert-item-to-string.util";
import { getBoolean } from "./get-boolean.util";
import { stringIsEmpty } from "./string-is-empty.util";

const FORM_GROUP_DEPTH_INDICATOR = '__';

const SLUG_ENDPOINT = '-';

const DATALIST_KEYWORD = 'Datalist';

const DATALIST_SUFFIX = SLUG_ENDPOINT + DATALIST_KEYWORD;



export const constructInputFieldIdentification = (nameOfFormGroup: string, formControlName: string, opts?: {
    isDatalist?: boolean,
    value?: any
}) => {

    let slug = nameOfFormGroup + FORM_GROUP_DEPTH_INDICATOR + formControlName;

    if (!stringIsEmpty(opts?.value)) {
        slug += SLUG_ENDPOINT + convertItemToString(opts?.value);
    }

    if (getBoolean(opts?.isDatalist)) {
        slug += DATALIST_SUFFIX;
    }

    return slug;
}
