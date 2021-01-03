import { Routes } from '@angular/router';

import { NotFoundComponent } from './404/not-found.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './changepassword/change-password.component';
import { AuthGuard } from '../guards/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
  

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', component: LoginComponent
      },
      {
        path: '404',
        canActivate : [AuthGuard],
        component: NotFoundComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      {
       
        path: 'change-password', component: ChangePasswordComponent
      },
      
      {
        path: 'forgot-password', component: ForgotPasswordComponent
      }
    ]
  }
];
