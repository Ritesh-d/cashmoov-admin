import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
 
 

import { TransactionreversalRoutingModule } from './transactionreversal-routing.module';

import { ListComponent } from './list/list.component';
import { TransactionreversalService } from './transactionreversal.service';
 
@NgModule({
    declarations: [ListComponent],
    entryComponents: [ ListComponent ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      TransactionreversalRoutingModule,
      DataTablesModule,
      CalendarModule,
      TranslateModule,  
      
      NgbModule.forRoot()
    ],
    providers: [
      TransactionreversalService
    ]
  })
export class TransactionreversalModule{} 