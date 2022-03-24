import { memoize } from "lodash-es";
import { stringIsEmpty } from "./string-is-empty.util";

export const REGEX_REPLACE_WITH = memoize((searchValue: RegExp, value: string, replaceWith = '') => {
    if (stringIsEmpty(value)) { return value; }
    
    if (searchValue.test(value)) {
        const CLEANED_VALUE = value.replace(searchValue, replaceWith);

        return CLEANED_VALUE;
    }

    return value;
});
