import { memoize } from "lodash-es";
import { convertItemToNumeric } from "./convert-item-to-numeric.util";
import { convertItemToString } from "./convert-item-to-string.util";
import { getBoolean } from "./get-boolean.util";
import { isANumber } from "./is-a-number.util";
import { stringIsEmpty } from "./string-is-empty.util";

export const whichValueShouldIUse = (essentialValue: any, backUpValue: any, expectedType?: ExpectedType) => {
    switch (expectedType) {
        case ExpectedType.STRING:
            return stringIsEmpty(essentialValue) ? backUpValue :
                convertItemToString(essentialValue);
        case ExpectedType.NUMBER:
            return isANumber(essentialValue) ?
                convertItemToNumeric(essentialValue) : backUpValue;
        case ExpectedType.BOOLEAN:
            return getBoolean(essentialValue);
        case ExpectedType.ARRAY:
            return Array.isArray(essentialValue) ? essentialValue : backUpValue;
        default:
            return stringIsEmpty(essentialValue) ? backUpValue :
                convertItemToString(essentialValue);
    }
}

export enum ExpectedType {
    STRING = 'string',
    BOOLEAN = 'boolean',
    NUMBER = 'number',
    ARRAY = 'array',
}