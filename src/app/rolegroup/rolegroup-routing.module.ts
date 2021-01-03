import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
 
import { RoleGroup } from './rolegroup.component';
import { CreateRoleGroup } from './createrolegroup/createrolegroup.component';
import { ViewRoleGroup } from './viewrolegroup/viewrolegroup.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
const routes: Routes = [
    { path: '', component: RoleGroup, pathMatch: "full" },
    { path: 'add', component: CreateRoleGroup },
    { path: 'edit/:id', component: CreateRoleGroup },
    { path: 'permission/:id', component: RolePermissionComponent }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class RoleGroupRoutingModule{}