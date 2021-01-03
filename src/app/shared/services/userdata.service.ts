import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserDataService{
    constructor(private http : HttpClient){}

getData (requesturl : string , requestdata : any) {
    return this.http.post<any>(requesturl,requestdata)
      .toPromise()
      .then(data => {
          return data
        },error=>{
            console.log("API error : "+JSON.stringify(error));
            return "error";
        }
    );
}

        
}

