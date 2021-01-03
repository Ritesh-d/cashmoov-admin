import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WalletOwnerComponent } from './wallet-owner.component';
import { WalletOwnerRoutingModule } from './wallet-owner-routing.module';
import { EmployerService } from './employer.service';
import { AddWalletOwnerComponent } from './add-wallet-owner/add-wallet-owner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressComponent } from './add-wallet-owner/address/address.component';
import { AddWalletOwnerService } from './add-wallet-owner/add-wallet-owner-service';
import { AddressService } from './add-wallet-owner/address/address.service';
import { BasicInfoService } from './add-wallet-owner/basic-info/basic-info.service';
import { BasicInfoComponent } from './add-wallet-owner/basic-info/basic-info.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared-module/shared-module.module';
import { BankDetailsComponent } from './add-wallet-owner/bank-details/bank-details.component';
import { BankDetailsService } from './add-wallet-owner/bank-details/bank-details.service';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewWalletOwnerComponent } from './view-wallet-owner/view-wallet-owner.component';
import { ViewWalletOwnerService } from './view-wallet-owner/view-wallet-owner.service';
 
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'angular-calendar';
import { ViewModalServiceComponent } from './view-wallet-owner/view-modal-service/viewmodalservice.component';
import { EditServiceComponent } from './view-wallet-owner/edit-modal-service/editmodalservice.component';
import { viewModalComponent } from './view-wallet-owner/view-modal/viewmodal.component';
import { EditMainModalComponent } from './view-wallet-owner/edit-main-modal/editmainmodal.component';
import { EditCommissionModalComponent } from './view-wallet-owner/edit-comm-model/editcommmodal.component';

@NgModule({
  entryComponents: [viewModalComponent,ViewModalServiceComponent,EditMainModalComponent,EditCommissionModalComponent],
  declarations: [
    viewModalComponent,
    EditMainModalComponent,
    EditCommissionModalComponent,
    WalletOwnerComponent,
    AddWalletOwnerComponent,
    AddressComponent,
    BasicInfoComponent,
    BankDetailsComponent,
    ViewModalServiceComponent,
    ViewWalletOwnerComponent,
    EditServiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    WalletOwnerRoutingModule,
    DataTablesModule,
    TranslateModule,
    CalendarModule,
    NgbModule.forRoot()
  ],
  providers: [
    EmployerService,
    AddWalletOwnerService,
    BasicInfoService,
    AddressService,
    HttpClientModule,
    DatePipe,
    BankDetailsService,
    ViewWalletOwnerService,
 
   
    NgbActiveModal
  ]
})
export class EmployerModule { }