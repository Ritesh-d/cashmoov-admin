import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AuthenticationService{
    constructor(private http : HttpClient){}
   
    logIn(url: string, request: any) {
        console.log(url + '  ' + request);
        return this.http.post<any>(url, request)
            .toPromise()
            .then(data => {     
                return data
            }, error => {
                console.log("API error : " + JSON.stringify(error));
                return null;
            }
            );
    }
    storage : any;

}