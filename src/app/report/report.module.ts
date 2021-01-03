import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportService } from './report.service';

import { RouterModule, Routes } from '@angular/router';
import { ViewDataReportComponent } from './view-data/view-data.component';
import { AgentAgeingReportComponent } from './agent-ageing/agent-ageing.component';
import { TransactionDetailReportComponent } from './transaction-detail/transaction-detail.component';
import { TransactionSummaryReportComponent } from './transaction-summary/transaction-summary.component';
import { CommissionDetailReportComponent } from './commission-detail/commission-detail.component';
import { AgentBalanceReportComponent } from './agent-balance/agent-balance.component';
import { ControlAccountReportComponent } from './control-account/control-account.component';
import { RegistrationReportComponent } from './registration-report/registration-report.component';
import { SubscriberAgeingReportComponent } from './subscriber-ageing/subscriber-ageing.component';
import { HierarchyTransactionReportComponent } from './hierarchy-transaction/hierarchy-transaction.component';

const routes: Routes = [
  {
    path: 'agent-ageing',
    component: AgentAgeingReportComponent
  },
  {
    path: 'transaction-summary',
    component: TransactionSummaryReportComponent
  },
  {
    path: 'transaction-detail',
    component: TransactionDetailReportComponent,
  },
  {
    path: 'commission-detail',
    component: CommissionDetailReportComponent,
  },
  {
    path: 'agent-balance',
    component: AgentBalanceReportComponent,
  },
  {
    path: 'control-account',
    component: ControlAccountReportComponent,
  },
  {
    path: 'registration-report',
    component: RegistrationReportComponent,
  },
  {
    path: 'subscriber-ageing',
    component: SubscriberAgeingReportComponent,
  },
  {
    path: 'hierarchy-transaction',
    component: HierarchyTransactionReportComponent,
  },
  {
    path: 'view-data',
    component: ViewDataReportComponent
  },
  {
    path: '**',
    redirectTo: 'agent-ageing'
  }
];

@NgModule({
  declarations: [
    AgentAgeingReportComponent,
    TransactionSummaryReportComponent,
    TransactionDetailReportComponent,
    CommissionDetailReportComponent,
    AgentBalanceReportComponent,
    ControlAccountReportComponent,
    RegistrationReportComponent,
    SubscriberAgeingReportComponent,
    HierarchyTransactionReportComponent,
    ViewDataReportComponent
  ],
  entryComponents: [AgentAgeingReportComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    CalendarModule,
    TranslateModule,
    NgxPaginationModule,
    NgbModule.forRoot()
  ],
  providers: [
    ReportService
  ]
})
export class ReportModule { }