import {ErrorHandler, ApplicationRef, Injector, NgZone} from '@angular/core';
import { Injectable,Inject } from '@angular/core';
import { Router,ActivatedRoute, ROUTES, ROUTER_INITIALIZER, ROUTER_CONFIGURATION } from '@angular/router';

// import { RoleTypeService } from './roletype/roletypeservice/roletype.service';
import { AuthenticationService } from './authentication/service/authentication.service';
import swal from 'sweetalert';
import { LoginLogoutAuthenticationService } from './shared/services/loginlogoutauthentication.service';
import { loginDataBuilder } from './shared/login-data.builder';
@Injectable()
export class CustomErrorHandler implements ErrorHandler {    
   
  private router:Router;
  private ngZone : NgZone;
  private loginLogoutAuthenticationService: LoginLogoutAuthenticationService
  private activatedrouter: ActivatedRoute;
 
  private authenticationService:AuthenticationService;
  constructor(private injector: Injector) {}
  
  handleError(error) {
    // your custom error handling logic    
    console.log(error);
 
    // swal("Technical Failure", '');

    this.authenticationService = this.injector.get(AuthenticationService);
 

    
    
    // this.authenticationService.storage = error;

    this.router = this.injector.get(Router);
     
   
    this.router.navigate(["/authentication/login"]);
 
    // window.onerror(
    //   'TestRollbarError: testing window.onerror',
     
    // );
    // this.router.navigate(["/authentication/404"],{queryParams:{code : 303}});
    
  }

}