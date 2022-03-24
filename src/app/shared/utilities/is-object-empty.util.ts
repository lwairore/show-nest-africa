import { memoize } from "lodash-es";

export const isObjectEmpty = memoize(
    (obj: any) => {
        // !obj 👈 null and undefined check
        if (!obj) { return true };

        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false;
            }
        }

        return JSON.stringify(obj) === JSON.stringify({});
    });
