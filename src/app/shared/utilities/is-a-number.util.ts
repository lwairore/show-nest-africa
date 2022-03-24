import { memoize } from "lodash-es";
import { convertItemToString } from "./convert-item-to-string.util";

const NUMBER_REGEX = /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/;

export const isANumber = memoize(
    (item: any) => {
        item = convertItemToString(item);

        return NUMBER_REGEX.test(item);
    });
