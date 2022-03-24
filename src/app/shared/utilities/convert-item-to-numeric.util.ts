import { memoize } from "lodash-es";
import { convertItemToString } from "./convert-item-to-string.util";
import { isANumber } from "./is-a-number.util";

export const convertItemToNumeric = memoize(
    (item: any) => {
        if (!isANumber(item)) {
            return item;
        }

        if (typeof (item) === 'number') {
            /**
             * Use '*' 1
             * Generally one of the fastest options, behaves like the + unary operator, so it does not perform conversion to an integer if the number is a float.
             * 
             * '10,000' '*' 1 //NaN
             * '10.000' '*' 1 //10
             * '10.00' '*' 1 //10
             * '10.20' '*' 1 //10.2
             * '10.81' '*' 1 //10.81
             * '10000' '*' 1 //10000

             *  '*' 1 is the winner performance-wise 10x faster than other alternatives.
            * https://flaviocopes.com/how-to-convert-string-to-number-javascript/
             */
            return item * 1;
        } else {
            item = convertItemToString(item);

            return +item;
        }
    });
