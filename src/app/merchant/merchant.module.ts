import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WalletOwnerComponent } from './wallet-owner.component';
import { WalletOwnerRoutingModule } from './wallet-owner-routing.module';
import { MerchantService } from './merchant.service';
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
import { DocumentsUploadComponent } from './add-wallet-owner/documents-upload/documents-upload.component';
import { DocumentsUploadService } from './add-wallet-owner/documents-upload/documents-upload.service';
import { OutletsComponent } from './outlet/outlet.component';
import { AddOutletComponent } from './outlet/add-outlet/add-outlet.component';
import { AddOuletService } from './outlet/add-outlet/add-outlet-service';
import { OutletBasicInfoService } from './outlet/add-outlet/basic-info/basic-info.service';
import { OutletBasicInfoComponent } from './outlet/add-outlet/basic-info/outlet-basic-info.component';
import { OutletAddressComponent } from './outlet/add-outlet/address/outlet-address.component';
import { OutletAddressService } from './outlet/add-outlet/address/address.service';
import { ViewOutletService } from './outlet/view-outlet/view-outlet.service';
import { ViewOutletComponent } from './outlet/view-outlet/view-outlet.component';
import { ViewOutletModalComponent } from './outlet/view-outlet/view-modal/viewoutletmodal.component';
import { viewModalComponent } from './view-wallet-owner/view-modal/viewmodal.component';
import { ViewOutletModalServiceComponent } from './outlet/view-outlet/view-modal-service/viewoutletmodalservice.component';
import { EditCommissionModalComponent } from './view-wallet-owner/edit-comm-model/editcommmodal.component';
import { EditMainModalComponent } from './view-wallet-owner/edit-main-modal/editmainmodal.component';
    
@NgModule({
  entryComponents: [ViewModalServiceComponent,ViewOutletModalComponent,viewModalComponent,EditMainModalComponent,EditCommissionModalComponent],
  declarations: [
    viewModalComponent,
    EditMainModalComponent,
    EditCommissionModalComponent,
    ViewOutletModalComponent,
    WalletOwnerComponent,
    AddWalletOwnerComponent,
    AddressComponent,
    BasicInfoComponent,
    BankDetailsComponent,
    ViewModalServiceComponent,
    ViewWalletOwnerComponent,
    ViewOutletModalServiceComponent,
    DocumentsUploadComponent,
    EditServiceComponent,
    OutletsComponent,
    AddOutletComponent,
    OutletBasicInfoComponent,
    OutletAddressComponent,
    ViewOutletComponent
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
    MerchantService,
    AddWalletOwnerService,
    BasicInfoService,
    AddressService,
    HttpClientModule,
    DatePipe,
    BankDetailsService,
    DocumentsUploadService,
    ViewWalletOwnerService,
    AddOuletService,
    OutletBasicInfoService,
    OutletAddressService,
    ViewOutletService,
    NgbActiveModal
  ]
})
export class MerchantModule { }