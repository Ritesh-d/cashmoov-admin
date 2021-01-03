import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CreateRoleGroup } from './createrolegroup/createrolegroup.component';
import { RoleGroupRoutingModule } from './rolegroup-routing.module';
import { RoleGroup } from './rolegroup.component';
import { ViewRoleGroup } from './viewrolegroup/viewrolegroup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { PermissionService } from './role-permission/permission.service';
import { SharedModule } from '../shared-module/shared-module.module';

import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [RoleGroup, CreateRoleGroup, ViewRoleGroup, RolePermissionComponent],
  entryComponents: [ViewRoleGroup],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RoleGroupRoutingModule,
    DataTablesModule,
    SharedModule,
    CalendarModule,
    TranslateModule,
    NgbModule.forRoot()
  ],
  providers: [
    PermissionService,
    DatePipe
  ]
})
export class RoleGroupModule { }