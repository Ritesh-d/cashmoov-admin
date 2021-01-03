import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ChangePasswordAuthenticationService{
    constructor(private http : HttpClient){}

    changePassword(url: string, request: any) {
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
}