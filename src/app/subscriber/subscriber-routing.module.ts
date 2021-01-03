import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SubscriberComponent } from './subscriber.component';
import { AddSubscriberComponent } from './../subscriber/add-subscriber/add-subscriber.component';
import { ViewSubscriberComponent } from './../subscriber/view-subscriber/view-subscriber.component';
import { EditServiceComponent } from './view-subscriber/edit-modal-service/editmodalservice.component';

const routes: Routes = [
  { path: '', component: SubscriberComponent, pathMatch: "full" }, 
  //{ path: 'owner/:institutionCode', component: WalletOwnerComponent},
  //{ path: 'owner/:institutionCode/:agentCode', component: WalletOwnerComponent},
  { path: 'add', component: AddSubscriberComponent },
  { path: 'add/:walletOwnerCode/:category', component: AddSubscriberComponent },
  { path: 'view/:id', component: ViewSubscriberComponent },
  { path: 'edit/:id', component: ViewSubscriberComponent },
  { path: 'enroll/:id', component: ViewSubscriberComponent },
  { path: 'editservice', component: EditServiceComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubscriberRoutingModule { }
