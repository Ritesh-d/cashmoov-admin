import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WalletOwnerComponent } from './wallet-owner.component';
import { AddWalletOwnerComponent } from './add-wallet-owner/add-wallet-owner.component';
import { ViewWalletOwnerComponent } from './view-wallet-owner/view-wallet-owner.component';
import { EditServiceComponent } from './view-wallet-owner/edit-modal-service/editmodalservice.component';
  
const routes: Routes = [
    { path: '', component: WalletOwnerComponent, pathMatch: "full" },
    { path: 'owner/:institutionCode', component: WalletOwnerComponent},
    { path: 'owner/:institutionCode/:agentCode', component: WalletOwnerComponent},
    { path: 'add', component: AddWalletOwnerComponent },
    { path: 'add/:walletOwnerCode/:category', component: AddWalletOwnerComponent },
    { path: 'view/:id', component: ViewWalletOwnerComponent },
    { path: 'edit/:id', component: ViewWalletOwnerComponent },
    { path: 'enroll/:id', component: ViewWalletOwnerComponent },
    { path: 'editservice', component: EditServiceComponent },
    
    // { path: 'addUser/:walletOwnerCode', component: AddUserComponent },
    // { path: 'editUser/:userCode', component: AddUserComponent },
    // { path: 'viewUser/:userCode', component: AddUserComponent },
    // { path: 'users/:walletOwnerCode', component: UsersComponent },
    // { path: 'configuration/:walletOwnerCode/currency', component: WalletOwnerCurrencyComponent},
    // { path: 'configuration/:walletOwnerCode/remittance', component: WalletOwnerRemittanceComponent},
    // { path: 'configuration/:walletOwnerCode', component: WalletOwnerConfigurationComponent}
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class WalletOwnerRoutingModule{}