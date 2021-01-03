import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TemplatesComponent } from './templates.component';
import { AddTemplateComponent } from './add-template/add-template.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { CreditLimitTemplateComponent} from './create-template/credit-limit-template/credit-limit-template.component';
// import { CommissionTemplateComponent} from './create-template/fee-commission-template/commission/commission.component';
import { FeeCommissionTemplateComponent} from './create-template/fee-template/fee-commission-template.component';
import { ServiceProfileTemplateComponent } from './create-template/service-profile-template/service-profile-template.component';
import { ViewServiceComponent } from './create-template/service-profile-template/service-view/viewservicetemplate.component';
import { EditServiceTemplateComponent } from './create-template/service-profile-template/editservicetemplate/editservice-template.component';
import { EditFeeTemplateComponent } from './create-template/fee-template/editservicetemplate/editservice-template.component';
import { EditFeeCommisionTemplateComponent } from './create-template/fee-commision-template/editservicetemplate/editservice-template.component';
import { FeeCommTemplateComponent} from './create-template/fee-commision-template/fee-commission-template.component';
import { ViewFeeTemplateComponent } from './create-template/fee-template/viewfee/viewfee-template.component';
import { ViewFeeCommTemplateComponent } from './create-template/fee-commision-template/viewfeecommision/viewfeecommision.component';
import { ViewTemplateLimit } from './create-template/transaction-limit/viewtemplatelimit/viewtemplatelimit.component';
import { ViewserviceTemplateLimit} from './create-template/transaction-limit/service-view/viewservicetemplate.component';
import { EditServiceTemplateLimit} from './create-template/transaction-limit/editservicetemplate/editservice-template.component';
import { LimitTemplateComponent } from './create-template/transaction-limit/limit-template.component';

import { IncentiveTemplateComponent } from './create-template/incentive-template/incentive-template.component';
import { ViewIncentiveTemplateComponent } from './create-template/incentive-template/viewincentive/viewincentive-template.component';
import { EditIncentiveTemplateComponent } from './create-template/incentive-template/editservicetemplate/editservice-template.component';


const routes: Routes = [
    { path: '', component: TemplatesComponent, pathMatch: "full" },
    { path: 'add', component: AddTemplateComponent },
    { path: 'create', component: CreateTemplateComponent },
    { path: 'createTransactionTemplate', component: CreditLimitTemplateComponent },
    { path: 'createServiceTemplate', component: ServiceProfileTemplateComponent },
    { path: 'viewserviceTemplate',component: ViewServiceComponent},
    { path: 'editServiceTemplate' ,component: EditServiceTemplateComponent},
    { path: 'editFeeTemplate' ,component: EditFeeTemplateComponent},
    { path: 'createFeeTemplate', component: FeeCommissionTemplateComponent },
    { path: 'editFeeCommisionTemplate' ,component: EditFeeCommisionTemplateComponent},
    { path: 'createFeeCommisionTemplate', component: FeeCommTemplateComponent },
    { path: 'viewFeeTemplate', component: ViewFeeTemplateComponent },
    { path: 'viewFeeCommisionTemplate', component: ViewFeeCommTemplateComponent },
    { path: 'editTemplateLimit', component: EditServiceTemplateLimit },
    { path: 'viewTemplateLimit', component: ViewserviceTemplateLimit },
    { path: 'createTranLimitTemplate', component: ViewTemplateLimit },
    { path: 'tranLimitTemplate', component: LimitTemplateComponent },
    { path: 'createIncentiveTemplate', component: IncentiveTemplateComponent },
    { path: 'viewIncentiveTemplate', component: ViewIncentiveTemplateComponent },
    { path: 'editIncentiveTemplate', component: EditIncentiveTemplateComponent},
    
    
    // { path: 'createCommisionTemplate', component: CommissionTemplateComponent },
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)], 
    exports: [RouterModule]
  })
export class TemplatesRoutingModule{}