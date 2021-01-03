import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRolePermission } from './createrolepermission/createrolepermission.component';
import { RolePermissionRoutingModule } from './rolepermission-routing.module';
import { RolePermissionService } from './rolepermission.service';

import { ViewRolePermission } from './viewrolepermission/viewrolepermission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { CreateRolePermissionService } from './createrolepermission/createrolepermission.service';
import { AddRolePermissionService } from './createrolepermission/addroles/addroles.service';
import { AddRolePermission } from './createrolepermission/addroles/addroles.component';
import { SearchRolePermission } from './searchrolepermission/searchrolepermission.component';
import { DataTablesModule } from 'angular-datatables';
import { EditRolePermissionComponent } from './editrolepermission/editrolepermission.component';
 
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'angular-calendar';
import { SharedModule } from '../shared-module/shared-module.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [ CreateRolePermission,ViewRolePermission,AddRolePermission,SearchRolePermission,EditRolePermissionComponent],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RolePermissionRoutingModule,
      DataTablesModule,
      TranslateModule,
      DataTablesModule,
      SharedModule,
      CalendarModule,
    
       NgbModule.forRoot()

    ],
    providers: [
      RolePermissionService,
      
      AddRolePermissionService
     ]
  })
export class RolePermissionModule{}