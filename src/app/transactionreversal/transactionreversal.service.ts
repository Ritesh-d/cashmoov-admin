import { Endpoints } from './../shared/endpoints';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { ActivatedRoute, Params } from '@angular/router'; 
import { Observable } from 'rxjs';  
import { ApprovalConstants } from '../approval/approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';
@Injectable({
  providedIn: 'root'
})
export class TransactionreversalService {
 setPermission: any;
  approvalRequired: boolean =false;


  constructor(private http: HttpClient,  private route: ActivatedRoute,
    private commonHttpService: CommonHelperService,
    private endpoints: Endpoints) { 

 this.apporvalRequired(ApprovalConstants.featureCode.TRANSACTIONREVERSAL);
  } 

  apporvalRequired(code: string) {

        this.setPermission = JSON.parse(localStorage.getItem(code));
       
        this.commonHttpService.approvalRequired(code,
            (status) => {
                this.approvalRequired = status
                
               
            }
        )

   }


  public getReversal(params?): Observable<any> { 
    if(params) {
      return this.http.get(this.endpoints.TRANSACTION_REVERSAL+'?'  + params+ '&offset=0&limit=200');
    } else {
      return this.http.get(this.endpoints.TRANSACTION_REVERSAL );
    }
  } 

 
  getTranstype(): Observable<any> { 
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL+'TRANSTYPE'); 
 }
 


}
