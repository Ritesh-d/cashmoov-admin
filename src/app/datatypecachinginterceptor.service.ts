import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DataTypeCachingService } from './datatypecaching.service';
import { SessionMgtService } from './shared/services/SessionMgt.service';

const InterceptorCacheHeader = 'X-Cache-Interceptor';
var headers_obj = new HttpHeaders();

@Injectable()
export class DataTypeCachingInterceptor implements HttpInterceptor {
  constructor(private cache: DataTypeCachingService,private sessionMgt:SessionMgtService) { }
  error: any;
  baseUrl: string;
  
  // createAuthorizationHeader(headers: HttpHeaders) :string{
  //   headers.append('Authorization', 'Basic QXJjaGFuYV9UZXN0OkFBQUFAMTIzNDU2Nzg='); 
  //     return headers;
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // console.log("==>"+this.sessionMgt.toBeAuthenticated);
    // if(this.sessionMgt.toBeAuthenticated){
    //   this.sessionMgt.toBeAuthenticated=false;
    //   req = req.clone({
    //     setHeaders: {
    //       Authorization: this.sessionMgt.basicAuthCredentials,
    //     }
    //   });
    // }
    // req = req.clone({
    //   setHeaders: {
    //     Authorization: "Basic QXJjaGFuYV9UZXN0OkFBQUFAMTIzNDU2Nzg=",
    //   }
    // });
    return next.handle(req);
    // const cachedResponse = this.cache.get(req);    
    // return cachedResponse ? Observable.of(cachedResponse) : this.sendRequest(req, next, this.cache);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: DataTypeCachingService): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse && req.headers.has(InterceptorCacheHeader)) {
          cache.put(req, event);
        }
        return event;
      })
    );
  }
}