import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const InterceptorCacheHeader = 'X-Cache-Interceptor';
const headers = new HttpHeaders().set(InterceptorCacheHeader, '');

@Injectable()
export class CachingService {
    storage: any;
    
    public constructor(private http: HttpClient) { }

    searchRoleType(url: string, request: any) {
        return this.http.post<any>(url, request , {headers})
            .toPromise()
            .then(data => {     
                return data
            }, error => {
                console.log("API error : " + JSON.stringify(error));
                return null;
            }
            );

    }
    
    searchGroupType(url: string, request: any) {
        return this.http.post<any>(url, request , {headers})
            .toPromise()
            .then(data => {                
                return data
            }, error => {
                console.log("API error : " + JSON.stringify(error));
                return null;
            }
            );
    }

}