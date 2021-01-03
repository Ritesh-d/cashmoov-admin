
import { FormGroup } from '@angular/forms';
 
export class ChangePasswordValidator {
    static validate(changePasswordFormGroup: FormGroup) {
        let newPassword = changePasswordFormGroup.controls.newPassword.value;
        let confirmPassword = changePasswordFormGroup.controls.confirmPassword.value;
        
        if (newPassword.length <= 0) {
            return null;
        }

        if (confirmPassword.length <= 0) {
            return null;
        }
 
        if (confirmPassword !== newPassword) {
            return {
                doesMatchPassword: true
            };
        }
 
        return null;
 
    }
}