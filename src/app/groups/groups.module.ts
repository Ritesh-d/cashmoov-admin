import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared-module.module';
import { GroupsComponent } from './groups.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CreateGroupService } from './create-group/create-group.service';
import { GroupsService } from './groups.service';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [GroupsComponent, CreateGroupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GroupsRoutingModule,
    DataTablesModule,
    TranslateModule,
    NgbModule.forRoot()
  ],
  providers: [
    CreateGroupService,
    GroupsService
  ]
})
export class GroupsModule { }