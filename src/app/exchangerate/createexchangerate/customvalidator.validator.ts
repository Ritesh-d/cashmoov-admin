import { FormGroup, AbstractControl } from "@angular/forms";

 export function CompareMatch(
  sendingCountry: string,
  receivingCountry: string,
  remitAgent:string,
  payingAgent:string,
  remitBranch:string,
  payingBranch:string,
  remitInstitute:string,
  payingInstitute:string,
  sendingCurrency:string,
  receivingCurrency:string
 
) {
 
  return (formGroup: FormGroup) => {
            const controlCountry = formGroup.controls[sendingCountry];
            const matchingControlCountry = formGroup.controls[receivingCountry];
            const controlAgent = formGroup.controls[remitAgent];
            const matchingControlAgent = formGroup.controls[payingAgent];
            const controlBranch = formGroup.controls[remitBranch];
            const matchingControlBranch = formGroup.controls[payingBranch];
            const controlInstitute = formGroup.controls[remitInstitute];
            const matchingControlInstitute = formGroup.controls[payingInstitute];
            const controlCurrency = formGroup.controls[sendingCurrency];
            const matchingControlCurrency = formGroup.controls[receivingCurrency];
         

            // if (matchingControlCountry.errors && !matchingControlCountry.errors.mustMatch) {
            //     if (matchingControlAgent.errors && !matchingControlAgent.errors.mustMatch) {
            //         if (matchingControlBranch.errors && !matchingControlBranch.errors.mustMatch) {
            //             return;
            //         }
            //     }
            
            // }
     
            if(!matchingControlCountry.value){
                    matchingControlCountry.setErrors({ required: true });
                }
            else if (controlCountry.value == matchingControlCountry.value) {
                matchingControlCountry.setErrors({ mustMatch: true });
            } else {
                matchingControlCountry.setErrors(null);
            }
    
            if(!matchingControlAgent.value){
                matchingControlAgent.setErrors({ required: true });
            }
            else if (controlAgent.value == matchingControlAgent.value) {
                matchingControlAgent.setErrors({ mustMatch: true });
            } else {
                matchingControlAgent.setErrors(null);
            }
   
  
            if(!matchingControlBranch.value){
                matchingControlBranch.setErrors({ required: true });
            }
            else if (controlBranch.value == matchingControlBranch.value) {
                matchingControlBranch.setErrors({ mustMatch: true });
            } else {
                matchingControlBranch.setErrors(null);
            }

            if(!matchingControlInstitute.value){
                matchingControlInstitute.setErrors({ required: true });
            }
            else if (controlInstitute.value == matchingControlInstitute.value) {
                matchingControlInstitute.setErrors({ mustMatch: true });
            } else {
                matchingControlInstitute.setErrors(null);
            }

            if(!matchingControlCurrency.value){
                matchingControlCurrency.setErrors({ required: true });
            }
            else if (controlCurrency.value == matchingControlCurrency.value) {
                matchingControlCurrency.setErrors({ mustMatch: true });
            } else {
                matchingControlCurrency.setErrors(null);
            }

        
        


    
  };
}