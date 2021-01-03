import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { WallettransferRoutingModule } from './routing.module';
 import { WallettransferService } from './wallettransfer.service';
import { CreatetransferComponent } from './createtransfer/createtransfer.component';
  import { SharedModule } from '../shared-module/shared-module.module'; 
 
@NgModule({ 
    declarations: [  CreatetransferComponent], 
    imports: [
      CommonModule,
      FormsModule,
      SharedModule,
      ReactiveFormsModule,DataTablesModule,
      WallettransferRoutingModule, 
      TranslateModule,NgxPaginationModule,      
      NgbModule.forRoot()
    ],
    providers: [
      WallettransferService
    ]
  })

export class WallettransferModule { }
