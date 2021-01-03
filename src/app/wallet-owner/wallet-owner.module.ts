import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WalletOwnerComponent } from './wallet-owner.component';
import { WalletOwnerRoutingModule } from './wallet-owner-routing.module';
import { WalletOwnerService } from './wallet-owner.service';
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
import { DocumentsUploadComponent } from './add-wallet-owner/documents-upload/documents-upload.component';
import { MastersViewModelBuilder } from '../shared/masters-view-model.builder';
import { BankDetailsService } from './add-wallet-owner/bank-details/bank-details.service';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewWalletOwnerComponent } from './view-wallet-owner/view-wallet-owner.component';
import { ViewWalletOwnerService } from './view-wallet-owner/view-wallet-owner.service';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { UserDetailsService } from './users/user-details.service';
import { DocumentsUploadService } from './add-wallet-owner/documents-upload/documents-upload.service';
import { WalletOwnerConfigurationComponent } from './wallet-owner-configuration/wallet-owner-configuration.component';
import { WalletOwnerCurrencyComponent } from './wallet-owner-configuration/wallet-owner-currency/wallet-owner-currency.component';
import { WalletOwnerRemittanceComponent } from './wallet-owner-configuration/wallet-owner-remittance/wallet-owner-remittance.component';
import { TranslateModule } from '@ngx-translate/core';
import { WalletOwnerRemittanceService } from './wallet-owner-configuration/wallet-owner-remittance/wallet-owner-remittance.service';
import { CalendarModule } from 'angular-calendar';
import { viewModalComponent } from './view-wallet-owner/view-modal/viewmodal.component';
import { AddAgentWalletOwnerComponent } from './add-wallet-owner/agent-add-wallet-owner.component';
import { AddBranchWalletOwnerComponent } from './add-wallet-owner/branch-add-wallet-owner.component';
import { AgentBasicInfoComponent } from './add-wallet-owner/basic-info/agent-basic-info.component';
import { BranchBasicInfoComponent } from './add-wallet-owner/basic-info/branch-basic-info.component';
import { ViewBranchWalletOwnerComponent } from './view-wallet-owner/branch-view-wallet-owner.component';
import { ViewAgentWalletOwnerComponent } from './view-wallet-owner/agent-view-wallet-owner.component';
import { viewTemplateModalComponent } from './view-wallet-owner/viewtemplate/viewtemplate.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditCommissionModalComponent } from './view-wallet-owner/edit-comm-model/editcommmodal.component';
import { EditMainModalComponent } from './view-wallet-owner/edit-main-modal/editmainmodal.component';
 
@NgModule({
  entryComponents: [viewModalComponent,viewTemplateModalComponent,EditCommissionModalComponent,EditMainModalComponent],
  declarations: [
    viewModalComponent,
    WalletOwnerComponent,
    AddWalletOwnerComponent,
    AddAgentWalletOwnerComponent,
    AddBranchWalletOwnerComponent,
    AddressComponent,
    BasicInfoComponent,
    AgentBasicInfoComponent,
    BranchBasicInfoComponent,
    BankDetailsComponent,
    DocumentsUploadComponent,
    ViewWalletOwnerComponent,
    ViewAgentWalletOwnerComponent,
    ViewBranchWalletOwnerComponent,
    AddUserComponent,
    UsersComponent,
    WalletOwnerConfigurationComponent,
    WalletOwnerCurrencyComponent,
    viewTemplateModalComponent,
    EditCommissionModalComponent,
    EditMainModalComponent,
    WalletOwnerRemittanceComponent,
 
  
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
    NgMultiSelectDropDownModule,
    NgbModule.forRoot()
  ],
  providers: [
    WalletOwnerService,
    AddWalletOwnerService,
    BasicInfoService,
    AddressService,
    HttpClientModule,
    DatePipe,
    BankDetailsService,
    ViewWalletOwnerService,
    UserDetailsService,
    DocumentsUploadService,
    WalletOwnerRemittanceService,
    NgbActiveModal,
 
  ]
})
export class WalletOwnerModule { }