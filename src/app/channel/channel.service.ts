import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MasterResponseModel } from '../shared/master-response.model';
import { Endpoints } from '../shared/endpoints';
  
import 'rxjs/add/operator/catch';
import { setMastersService } from '../shared/services/set-masters.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ApprovalConstants } from '../approval/approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';
 
@Injectable()
export class ChannelService {
  setPermission : any;
  approvalRequired: Boolean=false;
   constructor(private http: HttpClient,private commonHttpService: CommonHelperService,private route: ActivatedRoute, private setMastersService: setMastersService, private endpoints: Endpoints) {
    // this.route.queryParams.subscribe((params: Params) => {
    //   if(params['property']){
    //   this.setPermission = JSON.parse(params['property']);
    //   }
    // });
    this.apporvalRequired(ApprovalConstants.featureCode.CHANNEL);
          
  }
  apporvalRequired(code: string) {

      this.setPermission = JSON.parse(localStorage.getItem(code));

      this.commonHttpService.approvalRequired(code,
          (status) => {
              this.approvalRequired = status
          }
      )

 }
 
 
  createChannel(request : any): Observable<any> {  
     return this.http.post(this.endpoints.E_WALLET_CHANNEL_API_URL, request);
  }

  modifyChannel(request : any, code : string): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_CHANNEL_API_URL + '/'+ code, request);

  }
  getAllDetail() {
    return this.http.get(this.endpoints.E_WALLET_CHANNEL_API_URL +'/all',
        { headers: this.setMastersService.getHeaders() });
  }
  getAllChannelType(){
    return this.http.get(this.endpoints.E_WALLET_CHANNEL_TYPE_API_URL +'/all',
    { headers: this.setMastersService.getHeaders() });

  }
  getAllWalletOwner(){
    return this.http.get(this.endpoints.E_WALLET_OWNER_URL +'/all',
    { headers: this.setMastersService.getHeaders() });

  }
 
}
