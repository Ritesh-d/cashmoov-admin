import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
 
 import { CreateRolePermission } from './createrolepermission/createrolepermission.component';
import { ViewRolePermission } from './viewrolepermission/viewrolepermission.component';
import { SearchRolePermission } from './searchrolepermission/searchrolepermission.component';
import { EditRolePermissionComponent } from './editrolepermission/editrolepermission.component';
 const routes: Routes = [
    { path: '', component: SearchRolePermission, pathMatch: "full" },
    { path: 'add', component: CreateRolePermission },
    { path: 'view/:id', component: ViewRolePermission },
    { path: 'edit/:id', component: EditRolePermissionComponent },
    
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class RolePermissionRoutingModule{}