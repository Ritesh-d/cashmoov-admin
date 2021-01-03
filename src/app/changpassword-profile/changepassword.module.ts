import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
 
import { ComponentsModule } from '../component/component.module';
import { SharedModule } from '../shared-module/shared-module.module';
 
import { ChangepasswordNewComponent } from "./changepasswordcomponent/changepassword.component";
 
  
import { ChangePasswordRoutingModule } from './changepassword-routing.module';
      @NgModule({
      declarations: [
        ChangepasswordNewComponent
         
         
      ],
 
    imports: [
      CommonModule,
      NgbModule.forRoot(),
      FormsModule,
      ReactiveFormsModule,
      TranslateModule,
      ComponentsModule,
      SharedModule,
      DataTablesModule,
      NgbModule,
      ChangePasswordRoutingModule,
    ],
    providers:[
       
     ]
  })
export class ChangePasswordModule{
  constructor()
  {
    console.log('ChangePasswordModule');
     }

}
 