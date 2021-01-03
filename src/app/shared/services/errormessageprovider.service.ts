import { Injectable } from "@angular/core";

@Injectable()
export class ErrorMessageProvider{
    constructor(){}

    getErrorMessage(errorCode  :string , errorDesc : string){
        return "Failed : Error Code : "+errorCode+" : Error Desc : "+errorDesc;
    }
}