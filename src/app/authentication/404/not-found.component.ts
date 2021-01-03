import { Component } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
 
  code:number;
  error:any;
  languagecode : string = "en";

  constructor(private router : Router , private activatedrouter : ActivatedRoute,private translateservice: TranslateService,private authenticationService:AuthenticationService){}

  ngOnInit(){
   // this.router.navigate(['/authentication/login/'],{skipLocationChange: true, relativeTo : this.activatedrouter});
 
    this.activatedrouter.queryParams.subscribe(params =>{
        if(!params.code){
          this.code = 404;
          this.translateservice.get('page_not_found').subscribe((text: string) => { this.error = text;})          
        }else{
          this.code = params.code;          
          this.error = this.authenticationService.storage+" : ";
          this.translateservice.get('common_error_message').subscribe((text: string) => { this.error += text;});
        }        
    });
}

backToDashBoard(){
  this.router.navigate(["/authentication/login/"]);
 }

}
