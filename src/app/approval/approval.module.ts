import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared-module.module';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalComponent } from './approval.component';
import { ApprovalRoutingModule } from './approval-routing.module';
import { DetailsComponent } from './details/details.component';
import { SystemUserComponent } from './details/system-user/system-user.component';
import { WalletOwnerComponent } from './details/wallet-owner/wallet-owner.component';
import { RoleComponent } from './details/role/role.component';
import { ExchangeRateComponent } from './details/exchage-rate/exchange-rate.component';
import { WallerOwnerUser } from './details/wallet-owner-user/wallet-owner-user.component';
import { DetailsWalletOwnerService } from './details/wallet-owner/details-wallet-owner.service';
import { transTemplateComponent } from './details/trans-template/transtemplate.component';
import { ServiceTemplateComponent } from './details/servicetemplate/servicetemplate.component';
import { TemplateComponent } from './details/template/template.component';
import { commisionComponent } from './details/commision/commision.component';
import { feeComponent } from './details/fee/fee.component';
import { FeeTemplateComponent } from './details/template/feetemplatecategory/feetemplatecategory.component';
import { ServiceTemplateCategoryComponent } from './details/template/servicetemplatecategory/servicetemplatecategory.component';
import { FeeTempComponent } from './details/feetemplate/feetemplate.component';
import { LoadMoneyComponent } from './details/loadmoney/loadmoney.component';
import { FeeCommisionTemplateComponent } from './details/template/feecommisiontemplatecategory/feecommisiontemplatecategory.component';
import { FeeCommisionComponent } from './details/feecommisiontemplate/feecommisiontemplate.component';
import { ViewFeeComponent } from './details/template/feetemplatecategory/service-view/viewservicetemplate.component';
import { ViewFeeCommisionComponent } from './details/template/feecommisiontemplatecategory/service-view/viewservicetemplate.component';
import { ViewServiceComponent } from './details/template/servicetemplatecategory/service-view/viewservicetemplate.component';
import { ViewTransactionLimitTemplateComponent } from './details/template/transactionlimittemplate/service-view/viewservicetemplate.component';
import { TransactionLimitTemplateComponent } from './details/template/transactionlimittemplate/transactionlimittemplate.component';
import { TransactionLimitTemplateUpdateComponent } from './details/transactionlimittemplate/transactionlimittemplate.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WallettransferComponent } from './details/wallettransfer/wallettransfer.component';
import { IncentiveTempComponent } from './details/incentivetemplate/incentivetemplate.component';
import { IncentiveTemplateComponent } from './details/template/incentivetemplatecategory/incentivetemplatecategory.component';
import { ViewIncentiveComponent } from './details/template/incentivetemplatecategory/service-view/viewservicetemplate.component';
import { ServiceComponent } from './details/service/service.component';
import { ProductComponent } from './details/product/product.component';
import { OperatorComponent } from './details/operator/operator.component';
import { AddTaxConfigurationComponent } from '../taxconfiguration/add/addtaxconfiguration.component';
import { TaxtypeComponent } from './details/taxtype/taxtype.component';
import { ViewTaxConfigurationComponent } from './details/taxtype/view/viewtaxconfiguration.component';
import { ViewDistributionTemplateComponent } from './details/template/incentivetemplatecategory/distribution-view/viewdistribution.component';
import { ViewDistributionComponent } from './details/template/incentivetemplatecategory/distributionchild-view/viewdistributionchildtemplate.component';
import { WalletComponent } from './details/wallet/wallet.component';
import { WalletOwnerTemplateComponent } from './details/walletownertemplate/walletownertemplate.component';
import { ReversalComponent } from './details/reversal/reversal.component';


@NgModule({
  declarations: [
    ApprovalComponent,
    feeComponent,
    commisionComponent,
    transTemplateComponent,
    DetailsComponent,
    SystemUserComponent,
    WalletOwnerComponent,
    RoleComponent,
    ServiceComponent,
    ProductComponent,
    OperatorComponent,
    ExchangeRateComponent,
    WallerOwnerUser,
    LoadMoneyComponent,
    ViewFeeComponent,
    ViewFeeCommisionComponent,
    ViewServiceComponent,
    ServiceTemplateComponent,
    TemplateComponent,
    FeeTemplateComponent,
    ServiceTemplateCategoryComponent,
    FeeTempComponent,
    FeeCommisionTemplateComponent,
    TransactionLimitTemplateComponent,
    ViewTransactionLimitTemplateComponent,
    TransactionLimitTemplateUpdateComponent,
    FeeCommisionComponent,
    WallettransferComponent,
    ViewIncentiveComponent,
    IncentiveTemplateComponent,
    IncentiveTempComponent,
    TaxtypeComponent,
    ViewTaxConfigurationComponent,
    ViewDistributionTemplateComponent,
    ViewDistributionComponent,
    WalletComponent,
    WalletOwnerTemplateComponent,
    ReversalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    ApprovalRoutingModule,
    DataTablesModule,
    TranslateModule,
    NgbModule.forRoot()
  ],
  entryComponents: [ViewDistributionTemplateComponent,ViewDistributionComponent,ViewIncentiveComponent, ViewFeeComponent, ViewFeeCommisionComponent, ViewServiceComponent, ViewTransactionLimitTemplateComponent,ViewTaxConfigurationComponent],
  providers: [
    DetailsWalletOwnerService,
    
  ]
})
export class ApprovalModule { }