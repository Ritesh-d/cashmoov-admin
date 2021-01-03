import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemConfigurationRoutes } from './system-configuration.routing';
import { SystemConfigurationService } from './service/system-configuration.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../component/component.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchSystemConfigurationComponent } from './search-system-configuration/search-system-configuration.component';
import { DialogoverviewexampledialogComponent } from './dialogoverviewexampledialog/dialogoverviewexampledialog.component';


@NgModule({
  imports: [
     CommonModule,
    RouterModule.forChild(SystemConfigurationRoutes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ComponentsModule,
    SharedModule,
    DataTablesModule,
    NgbModule,
 
  ],
  declarations: [SearchSystemConfigurationComponent, DialogoverviewexampledialogComponent],
  providers:[
    SystemConfigurationService 
  ]
})
export class SystemConfigurationModule { }
