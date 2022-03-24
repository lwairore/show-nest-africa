import { memoize } from "lodash-es";
import { convertItemToString } from "./convert-item-to-string.util";

export const getBoolean = memoize(
    (item: any) => {
        // You need to convert `item` to string in order to prevent bugs 
        // such as `undefined` being converted to 'true' instead of 'false'.

        item = convertItemToString(item);

        switch (item) {
            case [
                'true', '1', 't', 'y', 'yes', 'yeah', 'yup',
                'certainly', 'uh-huh',
                'on',
            ].find(value => value === item):
                return true;
            case [
                'nah', '0', 'f', 'n', 'no', 'not', 'nope', 'false',
                false, 'off'
            ].find(value => value === item):
            default:
                return false;
        }
    }
)