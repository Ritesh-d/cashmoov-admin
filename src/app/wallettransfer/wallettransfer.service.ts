import { Injectable } from '@angular/core'; 
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { map } from 'rxjs/operators';
import { Endpoints } from '../shared/endpoints';  
import { ActivatedRoute, Params } from '@angular/router';
import { ApprovalConstants } from '../approval/approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';


@Injectable({
  providedIn: 'root'
})
export class WallettransferService {

  idProofTypeResponse: any;
  genderTypeResponse: any; 
  setPermission: any;
  approvalRequired: boolean =false;
  constructor(  
    private http: HttpClient,  private route: ActivatedRoute,
    private commonHttpService: CommonHelperService,
    private endpoints: Endpoints,  ) { 
      // this.route.queryParams.subscribe((params: Params) => {
      //   if(params['property']){
      //   this.setPermission = JSON.parse(params['property']);
      //   }
      // });
      this.apporvalRequired(ApprovalConstants.featureCode.WALLETTRANSFER);
     
    }
    apporvalRequired(code: string) {

        this.setPermission = JSON.parse(localStorage.getItem(code));
       
        this.commonHttpService.approvalRequired(code,
            (status) => {
                this.approvalRequired = status
                
               
            }
        )

   }
 
   


    getListWalletTransfer(): Observable<any> { 
    return this.http.get(this.endpoints.E_WALLET_WALLETTRANSFER +'/all');
  }
   getTrustAccount(walletOwnerCategoryCode:string): Observable<any> { 
    return this.http.get(this.endpoints.E_WALLET_CONTROLACCOUNT_URL +'/all?walletOwnerCategoryCode='+walletOwnerCategoryCode+'&status=Y');
  }
  getServiceProvider(serviceCode: string, serviceCategoryCode:string): Observable<any> { 
    return this.http.get(this.endpoints.E_WALLET_SERVICE_PROVIDER_API_URL +'serviceCategory?serviceCode='+ serviceCode+'&serviceCategoryCode='+serviceCategoryCode);
  }

  getByCodeCurrency(code: string): Observable<any> { 
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL+ '/' + code);
  }

  getByCodeAgentChild(code: string): Observable<any> { 
    return this.http.get(this.endpoints.E_WALLET_OWNER_SUBORDINATE_URL+ '/' + code);
  }
    getByCodeAgent(code: string): Observable<any> { 
    return this.http.get(this.endpoints.E_WALLET_OWNER_URL+ '/' + code);
  }
 
 


     walletOwnerCategoryCode(code: string): Observable<any> { 

    return this.http.get(this.endpoints.E_WALLET_OWNER_URL+ '/all?walletOwnerCategoryCode=' + code+'&offset=0&limit=500');
  }
 
  walletOwnerallCategoryCode(): Observable<any> { 
    return this.http.get(this.endpoints.E_WALLET_OWNER_URL+ '/all');
  }
    currencyConverter(request :any) : Observable<any>{
         
        return this.http.get<any>(this.endpoints.E_WALLET_EXCHANGE_RATE_URL + '/currencyConverter?'+request );
    }
    
    callGetWalletOwnerCategory() : Observable <any>{
      return this.http.get<any>(this.endpoints.E_WALLET_MASTERS_URL + 'CATEGORY'  );
  }
  callGetWalletOwner(ownercode) : Observable <any>{
    return this.http.get<any>(this.endpoints.E_WALLET_CONTROLACCOUNT_URL + '/all?offset=0&limit=100&status=Y&walletOwnerCategoryCode='+ownercode );

}
     
 
 
}
