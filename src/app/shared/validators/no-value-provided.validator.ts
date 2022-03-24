import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class NoValueProvidedValidator {
    static noValueProvided(control: AbstractControl): ValidationErrors | null {
        try {
            if ((control.value as string).trim().length === 0) {
                return { noValueProvided: true };
            }
        } catch (TypeError) {
            return null;
        }
        return null;
    }
    // static noValueProvided(minLength: number=0): ValidatorFn {
    //     return (control: AbstractControl): { [key: string]: any } => {
    //         if (!control.value)
    //             // if control is empty return no error
    //             return null;
    //         // test the value of the control against the regexp supplied
    //         let valid: boolean;
    //         try {
    //             valid = control.value.trim().length === 0 && control.value.trim().length >= minLength;
    //         } catch (TypeError) {
    //             valid = false;
    //         }
    //         // if true, return no error (no error), else return error passed in the second parameter
    //         return valid ? null : { noValueProvided: true };
    //     };
    // }

    static minLengthNotAcheived(minLength: number = 1): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any }|null => {
            if (!control.value) {
                // if control is empty return no error
                return null;
            }
            // test the value of the control against the regexp supplied
            let valid: boolean;
            try {
                valid = control.value.trim().length >= minLength;
            } catch (TypeError) {
                valid = false;
            }
            // if true, return no error (no error), else return error passed in the second parameter
            return valid ? null : { minLengthNotAcheived: true };
        };
    }
}

