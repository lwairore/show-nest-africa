import { AbstractControl, FormArray, FormGroup } from "@angular/forms";

export const getFormGroupOrFormArrayTotalNumberOfInvalidFields =
    (group: FormGroup | FormArray): number => {
        let invalidFieldCount = 0;

        ; (function countInvalidFormControls(group: FormGroup | FormArray) {
            Object.keys(group.controls).forEach((key: any) => {
                const abstractControl = (<AbstractControl[]>group.controls)[key];

                if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
                    countInvalidFormControls(abstractControl);
                } else {
                    if (abstractControl.invalid) {
                        invalidFieldCount++;
                    }

                }
            });
        })(group);
        return invalidFieldCount;
    }
