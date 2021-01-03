import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URLs } from '../models/constants';

@Injectable()
export class CommonViewService {
    requestObject: RequestObject;
    request: Request;
    public constructor(private http: HttpClient, private apiUrls: API_URLs) { }
    callViewAPI(data: any, action: string) {
        let requestData:any=this.createAPI(data, action)
        return this.http.post<any>(this.apiUrls.URL_COMMON_VIEW_API, requestData)
            .toPromise()
            .then(data => {
                return data
            }, error => {
                console.log("API error : " + JSON.stringify(error));
                return null;
            }
            );
    }
    public createAPI(data: any, action: string): any {
        this.requestObject = new RequestObject();
        this.request = new Request();
        let ignoreKeys:Array<any>=["createdBy","createdOn","lastModifiedBy","lastModifiedOn"];
        let isAppendable:boolean=true;
        let keys = Object.keys(data);
        let values = Object.values(data);
        let details: string="";
        for (let i = 0; i < keys.length; i++) {
            isAppendable=true;
            ignoreKeys.forEach(item=>{
                if(keys[i]==item){
                    isAppendable=false;
                }
            });
            if(isAppendable){
                if (details != "") {
                    details = details + ",";
                }
                details = details + keys[i] + "=" + values[i];
            }
        }
        this.request.userId = sessionStorage.getItem('userId');
        this.request.featureName = action;
        this.request.viewDetail = details;
        this.request.channel = "IWP";
        this.request.comments = action + " API request";
        this.request.requestcts = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss.SSS", "en");

        this.requestObject.action = "VIEW";
        this.requestObject.request = this.request;
        console.log("View Request : "+JSON.stringify(this.requestObject))
        return this.requestObject;
    }
}
class RequestObject {
    action: string;
    request: Request;
}
class Request {
    userId: string;
    featureName: string;
    viewDetail: string;
    comments: string;
    requestcts: string;
    channel: string;
}
