import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MinCharacterNotGenuinelyAchievedValidator {
    static minCharacterNotGenuinelyAchieved(minCharacters: number = 2): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const controlValue: string = control.value;
            if (!controlValue && !control.touched)
                // if control is empty return no error
                return null;
            // const regexExpression = new RegExp(`/[a-z,.'-]{${minCharacters},}/`, 'i');
            // const regexExpression = new RegExp(`/[a-z]/`, 'gi');
            // console.log(regexExpression.test(controlValue))
            let valid: boolean;
            try {
                valid = control.value.trim().length >= minCharacters;
            } catch (TypeError) {
                valid = false;
            }


            return valid ? null : { minCharacterNotGenuinelyAchieved: true }
        }
    }
}
