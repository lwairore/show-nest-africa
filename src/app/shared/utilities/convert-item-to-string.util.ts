import { memoize } from "lodash-es";

export const convertItemToString = memoize(
    (item: any, replaceAllLineBreaks = false) => {
        let newString: string | undefined;

        if ([undefined, null].includes(item)) {
            newString = '';
        } else {
            try {
                newString = `${item}`;
            } catch (AttributeError) {
                newString = '';
            }
        }

        if (replaceAllLineBreaks) {
            newString = newString
                .replace(/(\r\n|\r|\n)/g, '<br>')
                .replace(/\t/g, ' ');
        }

        return newString;
    });
