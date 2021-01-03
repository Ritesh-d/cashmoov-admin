import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangepasswordNewComponent } from './changepasswordcomponent/changepassword.component';
  
 
const routes: Routes = [
   
     { path: 'password', component: ChangepasswordNewComponent, pathMatch: "full" },
    
 
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ChangePasswordRoutingModule{}