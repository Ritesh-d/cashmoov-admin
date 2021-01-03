
import { FormGroup } from '@angular/forms';
 
export class ChangePasswordValidator {
    doesMatchPassword :boolean = false;
    static validate(changePasswordFormGroup: FormGroup) {
        let newPassword = changePasswordFormGroup.controls.newPassword.value;
        let confirmPassword = changePasswordFormGroup.controls.confirmPassword.value;
        
        if (newPassword.length <= 0) {
            return false;
        }
        else if (confirmPassword.length <= 0) {
            return false;
        }
        else if (confirmPassword !== newPassword) {
           /*  return {
                doesMatchPassword: true
            };  */
            return true;
        }
        return null;
 
    }
}