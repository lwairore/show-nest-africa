import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CannotContainSpaceValidator {
    static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        try {
            if ((control.value as string).indexOf(' ') >= 0) {
                return { cannotContainSpace: true };
            }
        } catch (TypeError) {
            return null;
        }
        return null;
    }
}
