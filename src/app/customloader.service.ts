import { Injectable} from '@angular/core';
import { HttpResponse } from "@angular/common/http";
import { TranslateLoader } from '@ngx-translate/core';
import {Observable} from 'rxjs'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
 

@Injectable()
export class CustomTranslateLoader implements TranslateLoader  {
    contentHeader = new HttpHeaders(
        {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        });

    constructor(private http: HttpClient) {}
    getTranslation(lang: string): Observable<any>{
       // var apiAddress = "/assets/i18n/"+ lang+".json";
        return Observable.create(observer => {
            console.log("loading language files ");
          this.http.get("./assets/i18n/"+ lang+".json", { headers: this.contentHeader })
          .subscribe((res: Response) => {
                    observer.next(res);
                    observer.complete();               
                },
            error => {
                //  failed to retrieve from api, switch to local
                console.log("error in loading language files "+error);
                this.http.get("./assets/i18n/en.json").subscribe((res: Response) => {
                    observer.next(res);
                    observer.complete();               
                })
            }
            );
        }); 
    }
}


