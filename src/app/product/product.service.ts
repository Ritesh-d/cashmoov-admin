import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service';
import { Endpoints } from '../shared/endpoints';
import { Observable } from 'rxjs';
import { ApprovalConstants } from '../approval/approval.constants';
import { ApprovalService } from '../approval/approval.service';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable({
    providedIn: 'root',
})
export class ProductService{
    setPermission: any;
    approvalRequired: Boolean=false;
    constructor(private router: Router, private route: ActivatedRoute,
        private http: HttpClient,
        private session: SessionMgtService,private approvalService : ApprovalService,private commonHttpService: CommonHelperService,
        private endpoints: Endpoints) {
            // this.route.queryParams.subscribe((params: Params) => {
            //     if(params['property']){
            //     this.setPermission = JSON.parse(params['property']);
            //     }
            //   });
            this.apporvalRequired(ApprovalConstants.featureCode.PRODUCT);
          
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
   
    private getHeaders() {
        var token = this.session.getLoginToken();
        console.log('token ' + token);
        return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token);
    }
    getTemplateMasters(masters: any) {
        return this.http.get(this.endpoints.E_WALLET_MASTERS_URL.concat(masters));
     }
   public  callGetDetail(request ) : Observable <any>{
        // console.log('url ' + this.endpoints.E_WALLET_EXCHANGE_RATE_URL + '/all?'+request);
        return this.http.get<any>(this.endpoints.E_WALLET_PRODUCT_URL + '/allByCriteria' );
    }
    getServiceCategory(){
        return this.http.get(this.endpoints.E_WALLET_SERVICE_CATEGORY_URL+ 'allByCriteria?productAllowed=true');
    }
  
    getOperatorList(serviceCategoryCode:string){
         return this.http.get(this.endpoints.E_WAllET_SERVICE_OPERATOR_URL+'/allByCriteria?serviceCategoryCode='+serviceCategoryCode);

}

    createProduct(request) {
 
        return this.http.post<any>(this.endpoints.E_WALLET_PRODUCT_URL , request,
             )
            .toPromise()
            .then(data => {
                return data
            }, error => {
                console.log("API error : " + JSON.stringify(error));
                if (error)
                    return error.error;
                else
                    return null;
            }
            );
    }
    updateProduct(request, code :string){

        return this.http.put<any>(this.endpoints.E_WALLET_PRODUCT_URL + '/'+ code, request,
           )
            .toPromise()
            .then(data => {
                return data
            }, error => {
                console.log("API error : " + JSON.stringify(error));
                if (error)
                    return error.error;
                else
                    return null;
            }
            );

    }

    public makeEntryToApproval(Info: any, updatedData?: any): Observable<any> {
        const approvalRequest = this.prepareDataApprovalRequest(Info, updatedData);
        console.log('--request--', approvalRequest);
        return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
    }

    private prepareDataApprovalRequest(Info: any, updatedData?: any) {
         let dataApprovalList = [];

            dataApprovalList.push({
            featureCode: ApprovalConstants.featureCode.PRODUCT,
            entityCode: Info.code,
            actionType: updatedData ? 'Updated' : 'Created',
            updatedInformation: updatedData ? updatedData :{},
            comments: '',
            status:  updatedData ? ApprovalConstants.status.code.UPDATED :ApprovalConstants.status.code.CREATED,
            assignTo: '',
            entityName: Info.name,
            
        });
        return {dataApprovalList : dataApprovalList};
    }

    preparedUpdatedDataForApproval(unChangedData: any, updatedData: any) {
         
        let updatedInfo: any = {};
            if(unChangedData.name != updatedData.name){
            updatedInfo.name = updatedData.name;
            } 
            if(unChangedData.productTypeCode != updatedData.productTypeCode){
                updatedInfo.productTypeName = updatedData.productTypeName;
            } 
            if(unChangedData.serviceCategoryCode != updatedData.serviceCategoryCode){
                updatedInfo.serviceCategoryName = updatedData.serviceCategoryName;
            }    
            if(unChangedData.operatorCode != updatedData.operatorCode){
                updatedInfo.operatorName = updatedData.operatorName;
            }                  
            if(unChangedData.value != updatedData.value){
                updatedInfo.value = updatedData.value;
            }
            if(unChangedData.description != updatedData.description){
                updatedInfo.description = updatedData.description;
            }
            if(unChangedData.minValue != updatedData.minValue){
                updatedInfo.minValue = updatedData.minValue;
            } 
            if(unChangedData.maxValue != updatedData.maxValue){
                updatedInfo.maxValue = updatedData.maxValue;
            }
            if(unChangedData.description != updatedData.description){
                updatedInfo.description = updatedData.description;
            }
            if( this.approvalService.getDataApprovalStatus(updatedData.status) != unChangedData.status){
                updatedInfo.status = updatedData.status;
            }           
         
        return updatedInfo;
    }
}