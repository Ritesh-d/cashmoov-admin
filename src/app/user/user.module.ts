import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateuserComponent } from './createuser/createuser.component';
import { UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';
import { UserComponent} from './user.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { viewModalComponent } from './view-modal/viewmodal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { UserComponentList } from './searchlistuser/user.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ UserComponent,CreateuserComponent,ViewuserComponent,viewModalComponent,UserComponentList],
    entryComponents: [viewModalComponent],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      UserRoutingModule,
      DataTablesModule,
      CalendarModule,
      TranslateModule,
      NgbModule.forRoot()
    ],
    providers: [
      UserService
    ]
  })
export class UserModule{}