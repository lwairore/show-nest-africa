import { memoize } from "lodash-es";
import { convertItemToString } from "./convert-item-to-string.util";

const EMPTY_STRING_REG = /^\s*$/;

export const stringIsEmpty = memoize(
    (text: any) => {
        const convertedTextToString = convertItemToString(text);

        return EMPTY_STRING_REG.test(convertedTextToString);
    })