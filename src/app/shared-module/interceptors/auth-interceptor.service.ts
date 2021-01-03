import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { loginDataBuilder } from '../../shared/login-data.builder';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from '../../shared/services/config.service';
import { Router } from '@angular/router';
import { of, throwError, from } from 'rxjs';
@Injectable({providedIn: 'root'})
export class AuthInterceptorService  implements HttpInterceptor {
 locale:string;
    constructor(private loginDataBuilder: loginDataBuilder, private router: Router,
        private configService: ConfigService){}

    intercept(request: HttpRequest<any>, next: HttpHandler) {

         this.locale=localStorage.getItem('locale');
          if(this.locale==null){
          this.locale='en';
          }

          
        if (request.url.indexOf('/oauth/token') > -1  || request.url.indexOf('/public/') > -1 ) {
            return next.handle(request.clone(
                {
                    headers: request.headers
               
                    .append('Accept-Language', this.locale)
                  
                    
                   
                }
            ));
        }
        // console.log('source config',this.configService.sourceType );

        const modifiedRequest = request.clone(
            {
                headers: request.headers
                .append('author', 'ankit tanwar')
                .append('Authorization', 'Bearer ' + this.loginDataBuilder.token)
                .append('Accept-Language', this.locale)
                .append('source', 'ADMIN')
            }
        );
        // return next.handle(modifiedRequest);
        // return next.handle(modifiedRequest).pipe(tap(event => {
        //     if (event.type === HttpEventType.Response) {
        //         // TODO: update inactivity time
        //         // console.log('--userInactivetime--', this.configService.userInactiveTime);
        //     }
        // }));
        return next.handle(modifiedRequest).pipe(
            catchError(
              (err, caught) => {
                if (err.status === 401){
                  this.handleAuthError();
                //   return of(err);
                }
                throw err;
              }
            )
          );
    }
    private handleAuthError() {
          sessionStorage.clear(); 
          localStorage.clear(); 
          this.router.navigate(["/authentication/login"]);
        
      }
}