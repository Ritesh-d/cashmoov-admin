import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoginModel } from './login.model';
import { Router, ActivatedRoute, UrlTree, UrlSegmentGroup, PRIMARY_OUTLET, UrlSegment, Params } from '@angular/router';
import { LoginLogoutAuthenticationService } from '../../shared/services/loginlogoutauthentication.service';
import { LoginRequestModel } from './loginrequest.model';
import { formatDate } from '@angular/common';
import { MasterDataService } from '../../shared/services/masterdataservice.service';
import { MasterDataRequestModel } from './masterdatarequest.model';
import { API_URLs } from '../../shared/models/constants';
import { ConfigService } from '../../shared/services/config.service';
import { LogoutRequestModel } from '../../shared/models/logoutrequest.model';
import { LogoutModel } from '../../shared/models/logout.model';
import { EncryptData } from '../../shared/services/encryptdata.service';
import { SessionMgtService } from '../../shared/services/SessionMgt.service';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SessionMgtService]
})
export class LoginComponent implements OnInit {
languageArr:any;
languageArrCode:any;
getcurrentLang:any;
  loginForm: FormGroup;
  errorMessage: String;
  successMessage : String;
  language: string;
  error = '';
  loginModel: LoginModel = new LoginModel();
  loginrequest: LoginRequestModel = new LoginRequestModel();
  logindateandtime: string;
  masterdatarequest: MasterDataRequestModel = new MasterDataRequestModel();
  languageresponsedata: any[] = [{ "languageId": 1, "languageCode": "EN", "languageName": "English", "statusId": 1 }];
  languagevalue: string = "en";
  requestparam: {};
  password: string;
  default: string = "Select";
  logoutrequest: LogoutRequestModel = new LogoutRequestModel();
  logoutdata: LogoutModel = new LogoutModel();

  constructor(private apiurls: API_URLs,
    private translateService: TranslateService,
    private translate: TranslatelanguageService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private loginauthenticationservice: LoginLogoutAuthenticationService,
    private masterdataservice: MasterDataService,
    public configService: ConfigService,
    private commonHelperService: CommonHelperService,
    private encryptionService: EncryptData,
    private sessionSerivce: SessionMgtService,
    private route: ActivatedRoute) {
      this.languageArr=this.translate.languageArr;
    this.getcurrentLang=this.translate.getcurrentLang();
    this.languageArrCode=this.translate.getLanguage();
    
  }

  ngOnInit() {
    this.errorMessage = '';
    this.successMessage='';
    sessionStorage.clear();
    this.buildForm();
    this.checkAndShowMessage();
  }
  


  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      'loginId': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  checkAndShowMessage() {
    if(this.route.snapshot.queryParamMap.get('status') &&
      this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        this.successMessage = '';
        this.successMessage = this.commonHelperService.languageText('LOGIN.newPasswordChangeMsg')
    }
    if(this.route.snapshot.queryParamMap.get('status') &&
    this.route.snapshot.queryParamMap.get('status').toString() === 'resetpassword') {
      this.successMessage = '';
      this.successMessage = this.commonHelperService.languageText('LOGIN.newPasswordMsg')

  }
 
   
 
  }

  changeLang(language: string) {   
 
    this.languagevalue = language.toLowerCase();
    this.translateService.use(this.languagevalue);
    this.translateService.setDefaultLang(this.languagevalue);
    this.translate.changeLanguage(this.languagevalue);  
 //this.sessionSerivce.setLanguage(this.languagevalue);
  } 



  
  onkeyEvent(event :any){
   
  }
  onSubmit(event :any)
  {
    
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value, null, 4));
    if(this.loginForm.status === 'VALID'){
     
      this.login();
    }
  }
  login() {
    this.errorMessage = '';
    this.successMessage='';
    if (this.loginForm.value.loginId === '' || this.loginForm.value.password === '') {
      this.errorMessage = this.commonHelperService.languageText('LOGIN.provideAllValueTxt')
      return;
    }
    
    sessionStorage.setItem('loginId', this.loginForm.value.loginId);
    if (this.loginForm.status === 'VALID') {
 
      this.loginauthenticationservice.logIn(this.loginForm.value.loginId, this.loginForm.value.password)
        .subscribe(data => {
          console.log('data' , data);
           if (data.access_token) {
            sessionStorage.setItem("currentuser", this.loginForm.value.loginId);
            sessionStorage.setItem("featureList", JSON.stringify(data.featuresList));
            this.sessionSerivce.setLeftMenu(data.featuresList);
            console.log('data.access_token' , data.access_token);
            this.sessionSerivce.setLoginToken(data.access_token);
            this.sessionSerivce.setUserName(data.firstName);
            this.sessionSerivce.setUserData(data);
            this.router.navigate(["/dashboard"]);
            
          } else {
            console.log('--error--', data.error_message);
            this.errorMessage = data.error_message;
          }
        }, error => {  
          console.log('--err--'  , error);
          if(error.error.error == '400'){
            if(this.languagevalue=="en")
          this.errorMessage = 'Invalid credential.Try again or click Forgot password to reset it';
          if(this.languagevalue=="fr")
          this.errorMessage= 'Identifiant invalide. Réessayez ou cliquez sur Mot de passe oublié pour le réinitialiser';
          }else{
            this.errorMessage = error.error.error_message;
          }
        });
    }
  }

  /*masterAfterLogin() {
    this.masterdatarequest.action = "MASTERDATA";
    this.masterdatarequest.request = {};
    console.log("MASTERDATA Request : " + JSON.stringify(this.masterdatarequest));
    //  console.log("SavedServerPath: " + this.configService.getURL());

    this.masterdataservice.getData(this.apiurls.URL_MASTERDATA, this.masterdatarequest)
      .then(data => {
        //console.log("MASTERDATA Response : "+JSON.stringify(data));

        if (data == null) {
          this.translateservice.get('common_error_message').subscribe((text: string) => { this.errorMessage = text; });
        } else if (data == "error") {
          this.translateService.get('common_error_message').subscribe((text: string) => { this.errorMessage = text; });
        } else if (data["response"]["resultCode"] == this.apiurls.RESULT_CODE) {
          console.log("Master data successfully loaded");
          this.masterdataservice.getSysytemConfiguration().forEach(element => {
            if (element["configurationCode"] == "BROWSER_SESSION_TIMEOUT") {
              sessionStorage.setItem("BROWSER_SESSION_TIMEOUT", element["defaultValue"]);
              let time: Date = new Date();
              time.setMinutes(time.getMinutes() + Number(element["defaultValue"]));
              sessionStorage.setItem("SESSION_START_TIME", time.getTime().toString());
            }
          });

          this.router.navigate(["/dashboard"], { queryParams: { language: this.languagevalue } });

        } else {
          this.errorMessage = "Failed Error Code : " + data["response"]["resultCode"] + " : Error Desc : " + data["response"]["resultCodeDesc"];
        }
      });
  }*/

}
