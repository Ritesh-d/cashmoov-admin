import { Injectable } from "@angular/core";

@Injectable()
export class SuccessMessageProvider{
    constructor(){}

    getSuccessMessage(successDesc : string, transId : string){
        return successDesc+" , Transaction ID : "+transId;
    }
}