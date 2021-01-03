import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChangePasswordService } from './change-password.service';
import { loginDataBuilder } from '../../shared/login-data.builder';
import { LoginLogoutAuthenticationService } from '../../shared/services/loginlogoutauthentication.service';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  errorMessage: string;
  submitted:boolean;
  constructor(private router: Router,
    private changePasswordService: ChangePasswordService,
    private loginDataBuilder: loginDataBuilder,private activatedrouter: ActivatedRoute,
    private translate: TranslatelanguageService,
    private loginLogoutAuthenticationService: LoginLogoutAuthenticationService) {
  }
  ngOnInit() {
    console.log('--ChangePasswordComponent oninit--');
    this.createForm();
  }

  private createForm() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('',[ Validators.required]),
      newPassword: new FormControl('',[ Validators.required,Validators.pattern('^(?=.*[0-9])(?=.*[@._#,:()])[a-zA-Z0-9@._#,:()]{8,12}$')]),  //
      confirmPassword: new FormControl('', Validators.required)
    });
  }

  changePasswordSubmitted() {
    this.submitted = true;
    this.errorMessage = undefined;
    console.log('valid ::' , (this.changePasswordForm.controls ));
    if (this.changePasswordForm.status === 'VALID') {
      if (this.changePasswordForm.value.newPassword === this.changePasswordForm.value.confirmPassword) {
        this.changePasswordService.changePassword(this.changePasswordForm.value).subscribe(data => {
          if(data.resultCode === '0') {
            this.loginLogoutAuthenticationService.logout.subscribe(data => {
              if (data.resultCode === '0') {
                sessionStorage.clear();
         
                this.router.navigate(['/authentication/login'], { relativeTo: this.activatedrouter, queryParams: { status: 'updated' } });
          
              } else {
                console.log('--ERROR in Logout--');
              }
            });
          } else {
            this.errorMessage = data.resultDescription;
            console.log('--error--', this.errorMessage);
          }
        });
      } else {
        //this.errorMessage = 'New Password and confirm password should be same';
        this.translate.languageText('CHANGE_PASSWORD.newPasswordandconfirmpasswordshouldbesame', data=> {
        this.errorMessage=data;
        });
      }
    } else if (this.changePasswordForm.value.oldPassword === '' ||
      this.changePasswordForm.value.newPassword === '' ||
      this.changePasswordForm.value.confirmPassword === '') {
     //this.errorMessage = 'Please provide all the values';
     this.translate.languageText('CHANGE_PASSWORD.pleaseprovideallthevalues', data=> {
      this.errorMessage=data;
    });
    
    } else {
      console.log('--never print--');
    }
  }

  onSkip() {
    console.log('--skip from change-password--', this.loginDataBuilder.userData.locale);
    this.router.navigate(["/dashboard"], {
      queryParams: { skipped: 'true' }
    });
  }
  get f(){
    return this.changePasswordForm.controls;
  }
}
