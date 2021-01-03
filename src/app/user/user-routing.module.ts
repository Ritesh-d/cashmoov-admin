import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
 
import { UserComponent } from './user.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { RoleGuard } from '../guards/role.guard';
const routes: Routes = [
    { path: '', component: UserComponent, pathMatch: "full" },
    { path: 'add',  component: CreateuserComponent },
    // { path: 'view/:code', component: ViewuserComponent },
    // { path: 'edit/:code', component: CreateuserComponent }
    // { path: 'view', component: ViewuserComponent },
    { path: 'edit',  component: CreateuserComponent }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class UserRoutingModule{}