import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NotFoundComponent } from './404/not-found.component';

import { LoginComponent } from './login/login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthenticationRoutes } from './authentication.routing';
import { ChangePasswordComponent } from './changepassword/change-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { SessionMgtService } from '../shared/services/SessionMgt.service';
import { ChangePasswordService } from './changepassword/change-password.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
 

@NgModule({
  imports: [CommonModule, RouterModule.forChild(AuthenticationRoutes), NgbModule, FormsModule,
    ReactiveFormsModule, TranslateModule],
  declarations: [NotFoundComponent, LoginComponent, ChangePasswordComponent, ForgotPasswordComponent],
  providers: [SessionMgtService, ChangePasswordService]
})
export class AuthenticationModule { }
