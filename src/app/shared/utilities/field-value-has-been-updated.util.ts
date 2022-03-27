import { memoize } from "lodash-es";


export const fieldValueHasBeenUpdated = (previousValue: any, currentValue: any, trim = true) => {
    console.log({ previousValue });

    console.log({ currentValue });
    if (trim) {
        if (typeof (previousValue) === 'string') {
            previousValue = previousValue.trim();
        }

        if (typeof (currentValue) === 'string') {
            currentValue = currentValue.trim();
        }
    }

    return previousValue !== currentValue;
}