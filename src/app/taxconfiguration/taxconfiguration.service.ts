import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
 
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service'
import { Endpoints } from '../shared/endpoints';
import { ApprovalConstants } from '../approval/approval.constants';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { ApprovalService } from '../approval/approval.service';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable({
    providedIn: 'root',
})
export class TaxConfigurationService {
    setPermission: any;
    approvalRequired: Boolean=false;
    constructor(private router: Router,private route: ActivatedRoute,
        private http: HttpClient,
        private session: SessionMgtService,
        private approvalService : ApprovalService,private commonHttpService: CommonHelperService,
        private endpoints: Endpoints) {
            // this.route.queryParams.subscribe((params: Params) => {
            //     if(params['property']){
            //     this.setPermission = JSON.parse(params['property']);
            //     }
            //   });
            this.apporvalRequired(ApprovalConstants.featureCode.TAXTYPE);
          
  }
  apporvalRequired(code: string) {

      this.setPermission = JSON.parse(localStorage.getItem(code));

      this.commonHttpService.approvalRequired(code,
          (status) => {
              this.approvalRequired = status
          }
      )

 }

  

    public getCurrentURL() {
        return this.router.url;
    }

    public prepareUserAction(): boolean {
        const currentURL = this.getCurrentURL();
        if (currentURL.indexOf('/add') > -1) {
            return false;
        } else if (currentURL.indexOf('/edit') > -1) {
            return true;
        }
        return null;
    }
    getAll(code : string){
        return this.http.get<any>(this.endpoints.E_WALLET_TAX_CONFIGURATION_API_URL + '/' + code,
        { headers: this.getHeaders() })
    }
    getAllByCriteria(code : string){
        return this.http.get<any>(this.endpoints.E_WALLET_TAX_CONFIGURATION_API_URL + '/allByCriteria?taxTypeCode=' + code,
        { headers: this.getHeaders() })
    }
     
    getAllCalculationType(){
        return this.http.get<any>(this.endpoints.E_WALLET_CALCULATION_TYPE_URL+ '/all',
        { headers: this.getHeaders() })
    }
    getAllTaxType(){
        return this.http.get<any>(this.endpoints.E_WALLET_TAX_TYPE_URL + '/all',
        { headers: this.getHeaders() })
    }
    createTaxConfiguration(request : any): Observable<any> {  
        return this.http.post(this.endpoints.E_WALLET_TAX_CONFIGURATION_API_URL, request);
     }
     modifyTaxConfiguration(request : any, code : string): Observable<any> {
         console.log("modifiy request:="+JSON.stringify(request));
        return this.http.put(this.endpoints.E_WALLET_TAX_CONFIGURATION_API_URL + '/'+ code, request);
    
      }
      createTaxType(request: any){
        return this.http.post(this.endpoints.E_WALLET_TAX_TYPE_URL, request);

      }
   

    private getHeaders() {
        var token = this.session.getLoginToken();
        console.log('token ' + token);
        return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token);
    }



    public makeEntryToApproval(Info: any,templateCategoryName : string, taxTypeCode : string,updatedData?: any): Observable<any> {
        const approvalRequest = this.prepareDataApprovalRequest(Info,templateCategoryName,taxTypeCode, updatedData);
        console.log('--request--', approvalRequest);
        return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
    }


    private prepareDataApprovalRequest(Info: any,templateCategoryName : string,taxTypeCode, updatedData?: any) {
         let dataApprovalList = [];

            dataApprovalList.push({
        
            featureCode: ApprovalConstants.featureCode.TaxType,
            entityCode: taxTypeCode,
            actionType: updatedData ? 'Updated' : 'Created',
            updatedInformation: updatedData ? updatedData :{},
            comments: '',
            status:  updatedData ? ApprovalConstants.status.code.UPDATED :ApprovalConstants.status.code.CREATED,
            assignTo: '',
            entityName: templateCategoryName,
            entity: {feeTemplateList : Info}       
        });
        console.log("########",updatedData,dataApprovalList);
        return {dataApprovalList : dataApprovalList};
    }
}



