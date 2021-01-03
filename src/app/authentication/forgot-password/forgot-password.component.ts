import { Component, OnInit } from '@angular/core';
import { Endpoints } from '../../shared/endpoints';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  errorMessage: string;
  successMessage : string;
  username: string='';
  useremail: string='';
  constructor(private http: HttpClient,private activatedrouter: ActivatedRoute,
    private router: Router,
    private translate: TranslatelanguageService,
    private endppoints: Endpoints) { }

  ngOnInit() {
  }

  validateEmail(elementValue){      
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue); 
  } 

  

  sendLink() {
    this.errorMessage='';
    this.successMessage= '';

   
if(this.username=='' && this.useremail==''){
 
  this.translate.languageText('FORGOT_PASSWORD.useremailErr', data=> {  
    this.errorMessage=data;
  });
  return false;

} 
 
 
if(this.username==''){

  this.translate.languageText('FORGOT_PASSWORD.userErr', data=> {  
    this.errorMessage=data;
  });

 
  return false;

}else if(this.useremail==''){
  this.translate.languageText('FORGOT_PASSWORD.emailErr', data=> {  
    this.errorMessage=data;
  });

 
return false;
}else if(!this.validateEmail(this.useremail)){
 
  this.translate.languageText('FORGOT_PASSWORD.emailValidErr', data=> {  
    this.errorMessage=data;
  });

  return false;
  }else{  
 
  
      let paremsSubmit= {
      "userName":this.username,
      "email":this.useremail
      }
    

      this.http.put<any>(this.endppoints.E_WALLET_PUBLIC_FORGOT_PASSWORD  , paremsSubmit).subscribe(data => {
        if (data.resultCode === '0') {
       
          this.translate.languageText('FORGOT_PASSWORD.successMsg', data=> {  
            this.successMessage=data;
          });

          sessionStorage.clear();
         
          this.router.navigate(['/authentication/login'], { relativeTo: this.activatedrouter, queryParams: { status: 'resetpassword' } });
        } else {
          console.log('--error in forgot password--');
          this.errorMessage = data.resultDescription;
          this.useremail='';
          this.username='';
        }
      }, error => {
        console.log('--error in forgot password--');
        this.errorMessage = error.error.resultDescription;
      });

}

   
  }

}
