export const fieldValueHasBeenUpdated = (previousValue: any, currentValue: any, trim = true) => {
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
