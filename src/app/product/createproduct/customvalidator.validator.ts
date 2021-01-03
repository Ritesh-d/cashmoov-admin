import { FormGroup, AbstractControl } from "@angular/forms";

 export function CompareMatch(
  sendingCountry: string,
  receivingCountry: string,
  remitAgent:string,
  payingAgent:string,
  remitBranch:string,
  payingBranch:string
 
) {
 
  return (formGroup: FormGroup) => {
            const controlCountry = formGroup.controls[sendingCountry];
            const matchingControlCountry = formGroup.controls[receivingCountry];
            const controlAgent = formGroup.controls[remitAgent];
            const matchingControlAgent = formGroup.controls[payingAgent];
            const controlBranch = formGroup.controls[remitBranch];
            const matchingControlBranch = formGroup.controls[payingBranch];

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
    
  };
}