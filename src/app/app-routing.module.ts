
import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './guards/auth.guard';

export const Approutes: Routes = [
  {
    path: '', component: FullComponent,
    children: [
      { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
      
      { path: 'authentication', redirectTo: '/authentication/login', pathMatch: 'full' },
      { path: 'dashboard',canActivate : [AuthGuard], loadChildren: () => import('./dashboards/dashboard.module').then(m => m.DashboardModule) },
      { path: 'component', canActivate : [AuthGuard],loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule) },
      { path: 'icons', canActivate : [AuthGuard],loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
      { path: 'forms', canActivate : [AuthGuard],loadChildren: () => import('./form/forms.module').then(m => m.FormModule) },
      { path: 'charts', canActivate : [AuthGuard],loadChildren: () => import('./charts/charts.module').then(m => m.ChartModule) },
      { path: 'widgets', canActivate : [AuthGuard],loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule) },
      { path: 'apps', canActivate : [AuthGuard],loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule) },
      { path: 'sample-pages', canActivate : [AuthGuard],loadChildren: () => import('./sample-pages/sample-pages.module').then(m => m.SamplePagesModule) },
      { path: 'systemconfiguration',canActivate : [AuthGuard],loadChildren:() => import('./system-configuration/system-configuration.module').then(m => m.SystemConfigurationModule)},
      { path: 'wallet-owner', canActivate : [AuthGuard], loadChildren:() => import('./wallet-owner/wallet-owner.module').then(m => m.WalletOwnerModule)},
      { path: 'templates', canActivate : [AuthGuard], loadChildren:() => import('./templates/templates.module').then(m => m.TemplatesModule)},
      { path: 'groups', canActivate : [AuthGuard], loadChildren:() => import('./groups/groups.module').then(m => m.GroupsModule)},
      { path: 'approval', canActivate : [AuthGuard], loadChildren:() => import('./approval/approval.module').then(m => m.ApprovalModule)},
      { path: 'feature', canActivate : [AuthGuard], loadChildren:() => import('./feature/feature.module').then(m => m.FeatureModule)},
      { path: 'rolepermission',canActivate : [AuthGuard],loadChildren:() => import('./rolepermission/rolepermission.module').then(m => m.RolePermissionModule)},
      { path: 'rolegroup',canActivate : [AuthGuard],loadChildren:() => import('./rolegroup/rolegroup.module').then(m => m.RoleGroupModule)},
      { path: 'user', canActivate : [AuthGuard],loadChildren:() => import ('./user/user.module').then(m => m.UserModule)},
      { path: 'manageusersgroup',canActivate : [AuthGuard],loadChildren:() => import ('./manageusersgroup/droplistdata.module').then(m => m.DragDropConnectedGroupModel)},
      { path: 'country',canActivate : [AuthGuard],loadChildren:() => import ('./country/country.module').then(m => m.CountryModule)},
      { path: 'exchangerate',canActivate : [AuthGuard],loadChildren:() => import ('./exchangerate/exchangerate.module').then(m => m.ExchangerateModule)},
      { path: 'walletownercategory', canActivate : [AuthGuard], loadChildren:() => import('./wallet-managemnet/wallet-owner.module').then(m => m.WalletManagementModule)},
      { path : 'emoneycreation',canActivate : [AuthGuard],loadChildren:() => import ('./loadmoney/loadmoney.module').then(m => m.LoadMoneyModule)},
      { path : 'wallettransfer',canActivate : [AuthGuard],loadChildren:() => import ('./wallettransfer/wallettransfer.module').then(m => m.WallettransferModule)},
      { path : 'transactionreversal',canActivate : [AuthGuard],loadChildren:() => import ('./transactionreversal/transactionreversal.module').then(m => m.TransactionreversalModule)},
      
  
      // {path : 'loadmoney',canActivate : [AuthGuard],loadChildren:() => import ('./loadmoney/loadmoney.module').then(m => m.LoadMoneyModule)},
  
      //  { path: 'password/changepassword', redirectTo: 'password/changepassword', pathMatch: 'full' },
      { path: 'changepassword',canActivate : [AuthGuard],loadChildren:() => import ('./changpassword-profile/changepassword.module').then(m => m.ChangePasswordModule)},
      { path: 'channel',canActivate : [AuthGuard],loadChildren:() => import ('./channel/channel.module').then(m => m.ChannelModule)},
      { path: 'taxconfiguration',canActivate : [AuthGuard],loadChildren:() => import ('./taxconfiguration/taxconfiguration.module').then(m => m.TaxConfigurationModule)},
      { path: 'employer',canActivate : [AuthGuard],loadChildren:() => import ('./employer/employer.module').then(m => m.EmployerModule)},
      { path: 'report',canActivate : [AuthGuard],loadChildren:() => import ('./report/report.module').then(m => m.ReportModule)},
 
      { path: 'subscriber-owner',canActivate : [AuthGuard],loadChildren:() => import ('./subscriber/subscriber.module').then(m => m.SubscriberModule)},
      
      { path: 'merchant',canActivate : [AuthGuard],loadChildren:() => import ('./merchant/merchant.module').then(m => m.MerchantModule)},
      
      { path: 'service',canActivate : [AuthGuard],loadChildren:() => import ('./servicecategory/servicecategory.module').then(m => m.ServiceModule)},
      
      { path: 'product',canActivate : [AuthGuard],loadChildren:() => import ('./product/product.module').then(m => m.ProductModule)},

    ]
  },
  {
    path: '', component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/authentication/404'
  }
];
