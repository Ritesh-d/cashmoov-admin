import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WalletOwnerComponent } from './wallet-owner.component';
import { AddWalletOwnerComponent } from './add-wallet-owner/add-wallet-owner.component';
import { ViewWalletOwnerComponent } from './view-wallet-owner/view-wallet-owner.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { UsersComponent } from './users/users.component';
import { WalletOwnerConfigurationComponent } from './wallet-owner-configuration/wallet-owner-configuration.component';
import { WalletOwnerCurrencyComponent } from './wallet-owner-configuration/wallet-owner-currency/wallet-owner-currency.component';
import { WalletOwnerRemittanceComponent } from './wallet-owner-configuration/wallet-owner-remittance/wallet-owner-remittance.component';
import { AddAgentWalletOwnerComponent } from './add-wallet-owner/agent-add-wallet-owner.component';
import { AddBranchWalletOwnerComponent } from './add-wallet-owner/branch-add-wallet-owner.component';
import { ViewAgentWalletOwnerComponent } from './view-wallet-owner/agent-view-wallet-owner.component';
import { ViewBranchWalletOwnerComponent } from './view-wallet-owner/branch-view-wallet-owner.component';
 
const routes: Routes = [
    { path: '', component: WalletOwnerComponent, pathMatch: "full" },
    { path: 'owner/:institutionCode', component: WalletOwnerComponent},
    { path: 'owner/:institutionCode/:agentCode', component: WalletOwnerComponent},
    { path: 'add', component: AddWalletOwnerComponent },
    { path: 'addAgent', component: AddAgentWalletOwnerComponent },
    { path: 'addAgent/:walletOwnerCode/:category', component: AddAgentWalletOwnerComponent },
    { path: 'addBranch', component: AddBranchWalletOwnerComponent },
    { path: 'addBranch/:walletOwnerCode/:category', component: AddBranchWalletOwnerComponent },
    
    { path: 'add/:walletOwnerCode/:category', component: AddWalletOwnerComponent },
    { path: 'view/:id', component: ViewWalletOwnerComponent },
    { path: 'edit/:id', component: ViewWalletOwnerComponent },
    { path: 'editAgent/:id', component: ViewAgentWalletOwnerComponent },
    { path: 'editBranch/:id', component: ViewBranchWalletOwnerComponent },
    { path: 'viewAgent/:id', component: ViewAgentWalletOwnerComponent },
    { path: 'viewBranch/:id', component: ViewBranchWalletOwnerComponent },
    { path: 'enroll/:id', component: ViewWalletOwnerComponent },
    { path: 'addUser/:walletOwnerCode', component: AddUserComponent },
    { path: 'editUser/:userCode', component: AddUserComponent },
    { path: 'viewUser/:userCode', component: AddUserComponent },
    { path: 'users/:walletOwnerCode', component: UsersComponent },
    { path: 'configuration/:walletOwnerCode/currency', component: WalletOwnerCurrencyComponent},
    { path: 'configuration/:walletOwnerCode/remittance', component: WalletOwnerRemittanceComponent},
    { path: 'configuration/:walletOwnerCode', component: WalletOwnerConfigurationComponent}
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class WalletOwnerRoutingModule{}