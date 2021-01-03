import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared-module.module';
import { TemplatesComponent } from './templates.component';
import { TemplatesRoutingModule } from './templates-routing.module';
import { AddTemplateComponent } from './add-template/add-template.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ServiceProfileTemplateComponent } from './create-template/service-profile-template/service-profile-template.component';
import { SubscriptionProfileTemplateComponent } from './create-template/subscription-profile-template/subscription-profile-template.component';
import { FeeCommissionTemplateComponent } from './create-template/fee-template/fee-commission-template.component';
// import { CommissionTemplateComponent } from './create-template/fee-commission-template/commission/commission.component';
import { LimitRestrictionTemplateComponent } from './create-template/limit-restriction-template/limit-restriction-template.component';
import { CreditLimitTemplateComponent } from './create-template/credit-limit-template/credit-limit-template.component';
import { OverdraftProfileTemplateComponent } from './create-template/overdraft-profile-template/overdraft-profile-template.component';
import { PromotionProfileTemplateComponent } from './create-template/promotion-profile-template/promotion-profile-template.component';
import { LoyaltyProfileTemplateComponent } from './create-template/loyalty-profile-template/loyalty-profile-template.component';
import { CreateTemplateService } from './create-template/create-template.service';
import { FeeTemplateService } from './create-template/fee-template/fee-template.service';
import { ServiceProfileTemplateServie } from './create-template/service-profile-template/service-profile-template.service';
import { NgSelect2Module } from 'ng-select2';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { CommonModule } from '@angular/common';
import { AddTemplateService } from './add-template/add-template.service';
import { TemplatesService } from './templates.service';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewServiceComponent } from './create-template/service-profile-template/service-view/viewservicetemplate.component';
import { EditServiceTemplateComponent } from './create-template/service-profile-template/editservicetemplate/editservice-template.component';
import { EditFeeTemplateComponent } from './create-template/fee-template/editservicetemplate/editservice-template.component';
import { ViewFeeComponent } from './create-template/fee-template/service-view/viewservicetemplate.component';
import { ViewFeeCommisionComponent } from './create-template/fee-commision-template/service-view/viewservicetemplate.component';
import { FeeCommisionTemplateService } from './create-template/fee-commision-template/fee-template.service';
import { EditFeeCommisionTemplateComponent } from './create-template/fee-commision-template/editservicetemplate/editservice-template.component';
import { FeeCommTemplateComponent } from './create-template/fee-commision-template/fee-commission-template.component';
import { ViewFeeTemplateComponent } from './create-template/fee-template/viewfee/viewfee-template.component';
import { ViewFeeCommTemplateComponent } from './create-template/fee-commision-template/viewfeecommision/viewfeecommision.component';
import { TranslateModule } from '@ngx-translate/core';
import { TemplateLimitService } from './create-template/transaction-limit/template-limit.service';
import { ViewTemplateLimit } from './create-template/transaction-limit/viewtemplatelimit/viewtemplatelimit.component';
import { ViewserviceTemplateLimit} from './create-template/transaction-limit/service-view/viewservicetemplate.component';
import { EditServiceTemplateLimit} from './create-template/transaction-limit/editservicetemplate/editservice-template.component';
import { LimitTemplateComponent } from './create-template/transaction-limit/limit-template.component';
import { IncentiveTemplateService } from './create-template/incentive-template/incentive-template.service';
import { IncentiveTemplateComponent } from './create-template/incentive-template/incentive-template.component';
import { EditIncentiveTemplateComponent } from './create-template/incentive-template/editservicetemplate/editservice-template.component';
import { ViewIncentiveComponent } from './create-template/incentive-template/service-view/viewservicetemplate.component';
import { ViewIncentiveTemplateComponent } from './create-template/incentive-template/viewincentive/viewincentive-template.component';
import { ViewDistributionTemplateComponent } from './create-template/incentive-template/distribution-view/viewdistribution.component';
import { ViewDistributionComponent } from './create-template/incentive-template/distributionchild-view/viewdistributionchildtemplate.component';
import { EditDistributionTemplateComponent } from './create-template/incentive-template/editdistributiontemplate/editdistribution-template.component';

@NgModule({
  declarations: [
    ViewFeeCommTemplateComponent,
    ViewFeeTemplateComponent,
    TemplatesComponent,
    AddTemplateComponent,
    EditServiceTemplateComponent,
    CreateTemplateComponent,
    ServiceProfileTemplateComponent,
    SubscriptionProfileTemplateComponent,
    FeeCommissionTemplateComponent,
    FeeCommTemplateComponent,
    EditFeeTemplateComponent,
    EditFeeCommisionTemplateComponent,
    // CommissionTemplateComponent,
    LimitRestrictionTemplateComponent,
    CreditLimitTemplateComponent,
    OverdraftProfileTemplateComponent,
    PromotionProfileTemplateComponent,
    LoyaltyProfileTemplateComponent,
    ViewServiceComponent,
    ViewFeeComponent,
    ViewFeeCommisionComponent,
    ViewTemplateLimit,
    ViewserviceTemplateLimit,
    LimitTemplateComponent,
    EditServiceTemplateLimit,
    MultiSelectComponent,
    ViewIncentiveComponent,
    IncentiveTemplateComponent,
    EditIncentiveTemplateComponent,
    ViewIncentiveTemplateComponent,
    ViewDistributionTemplateComponent,
    ViewDistributionComponent,
    EditDistributionTemplateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TemplatesRoutingModule,
    NgSelect2Module,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule.forRoot(),
    TranslateModule,
    
  ],
  entryComponents: [ ViewServiceComponent,ViewFeeComponent,ViewFeeCommisionComponent,ViewIncentiveComponent,ViewDistributionTemplateComponent,ViewDistributionComponent,EditDistributionTemplateComponent],
  providers: [
    TemplatesService,
    AddTemplateService,
    CreateTemplateService,
    FeeTemplateService ,
    FeeCommisionTemplateService,
    TemplateLimitService,
    IncentiveTemplateService,
    ServiceProfileTemplateServie],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class TemplatesModule { }