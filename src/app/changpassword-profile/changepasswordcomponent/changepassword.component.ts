import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangePasswordValidator } from './changepassword.validator';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordService } from '../../authentication/changepassword/change-password.service';
import { LoginLogoutAuthenticationService } from '../../shared/services/loginlogoutauthentication.service';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers: [ChangePasswordService]
})

export class ChangepasswordNewComponent implements OnInit {

  changePasswordFormGroup: FormGroup;

  errorMessage: string;
  successMessage: string;
  languagecode: string;

  submitted = false;
  loginuserId: string;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private translateservice: TranslateService, private activatedrouter: ActivatedRoute,
    private loginLogoutAuthenticationService: LoginLogoutAuthenticationService,
    private translate: TranslatelanguageService,
    private changePasswordService: ChangePasswordService) { }

  ngOnInit() {


    this.activatedrouter.queryParams.subscribe(params => {
      console.log("language : " + params.language);
      this.languagecode = params.language;
      this.translateservice.use(params.language);
    });

    this.changePasswordFormGroup = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[@._#,:()])[a-zA-Z0-9@._#,:()]{8,12}$')]],
      confirmPassword: ['', Validators.required]
    }, {
      // validator: ChangePasswordValidator.validate.bind(this)
    })
    this.loginuserId = sessionStorage.getItem("currentuser").toString();
  }


  get f() { return this.changePasswordFormGroup.controls; }


  onSubmit() {

    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    console.log('valid ::', (this.changePasswordFormGroup.controls));
    if (this.changePasswordFormGroup.status === 'VALID') {
      if (this.changePasswordFormGroup.value.newPassword === this.changePasswordFormGroup.value.confirmPassword) {
        this.changePasswordService.changePassword(this.changePasswordFormGroup.value).subscribe(data => {
          if (data.resultCode === '0') {
            this.loginLogoutAuthenticationService.logout.subscribe(data => {
              console.log('data fromlogout', data);
              if (data.resultCode === '0') {
                sessionStorage.clear();
                this.successMessage = data.resultDescription;
                this.router.navigate(['/authentication/login'], { relativeTo: this.activatedrouter, queryParams: { status: 'updated' } });
          
              } else {
                console.log('--ERROR in Logout--');
              }
            });
            
           
            // sessionStorage.clear();
            // this.router.navigate(['/authentication/login'], { relativeTo: this.activatedrouter, queryParams: { status: 'updated' } });

          } else {
            this.errorMessage = data.resultDescription;

          }
        });
      } else {
        //this.errorMessage = 'New Password and confirm password should be same';
        this.translate.languageText('CHANGE_PASSWORD.newPasswordandconfirmpasswordshouldbesame', data=> {
            this.errorMessage=data;
          });
      }
    }
    else {
      console.log('--never print--');
    }
  }
  backToDashBoard() {
    this.router.navigate(["/dashboard"], { queryParams: { language: this.languagecode } });
  }
}
