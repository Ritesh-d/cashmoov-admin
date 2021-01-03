import { NgModule } from '@angular/core';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared-module.module';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'angular-calendar';
import { HttpClientModule } from '@angular/common/http';
import { SubscriberRoutingModule } from './subscriber-routing.module';
import { SubscriberComponent } from './subscriber.component';
import { SubscriberService } from './subscriber.service';
import { AddressComponent } from './add-subscriber/address/address.component';
import { BasicInfoComponent } from './add-subscriber/basic-info/basic-info.component';
import { BankDetailsComponent } from './add-subscriber/bank-details/bank-details.component';
import { ViewSubscriberComponent } from './view-subscriber/view-subscriber.component';
import { AddSubscriberComponent } from './add-subscriber/add-subscriber.component';
import { BasicInfoService } from './add-subscriber/basic-info/basic-info.service';
import { AddSubscriberService } from './add-subscriber/add-subscriber.service';
import { AddressService } from './add-subscriber/address/address.service';
import { BankDetailsService } from './add-subscriber/bank-details/bank-details.service';
import { ViewSubscriberService } from './view-subscriber/view-subscriber.service';
import { ViewModalServiceComponent } from './view-subscriber/view-modal-service/viewmodalservice.component';
import { EditServiceComponent } from './view-subscriber/edit-modal-service/editmodalservice.component';
import { viewModalComponent } from './view-subscriber/view-modal/viewmodal.component';
import { EditMainModalComponent } from './view-subscriber/edit-main-modal/editmainmodal.component';
import { EditCommissionModalComponent } from './view-subscriber/edit-comm-model/editcommmodal.component';

@NgModule({ 

  entryComponents: [viewModalComponent,ViewModalServiceComponent,EditMainModalComponent,EditCommissionModalComponent],
  declarations: [
    SubscriberComponent,
    AddressComponent,
    BasicInfoComponent,
    viewModalComponent,
    EditMainModalComponent,
    EditCommissionModalComponent,
    BankDetailsComponent,
    AddSubscriberComponent,
    ViewSubscriberComponent,
    ViewModalServiceComponent,
    EditServiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SubscriberRoutingModule,
    DataTablesModule,
    TranslateModule,
    CalendarModule,
    NgbModule.forRoot()
  ],
  providers: [
    SubscriberService,
    HttpClientModule,
    DatePipe,
    NgbActiveModal,
    AddSubscriberService,
    BasicInfoService,
    AddressService,
    BankDetailsService,
    ViewSubscriberService 
  ]
})
export class SubscriberModule { }
