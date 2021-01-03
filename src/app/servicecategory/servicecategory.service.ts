import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service'
import { Endpoints } from '../shared/endpoints';
import { ApprovalConstants } from '../approval/approval.constants';
import { Observable } from 'rxjs';
import { ApprovalService } from '../approval/approval.service';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable({
  providedIn: 'root',
})
export class ServiceCategoryService {

  sharedData: any;
  countryResponse: any;
  regionResponse: any;
  private message: string;
  category: {
    name: string;
    code: string;
    status: string;
    productAllowed: boolean;
    serviceCountryList : any;
  } = {
      name: '',
      code: '',
      status:'',
      productAllowed:false,
      serviceCountryList : []
    };
    operator: {
      name: string;
      code: string;
      status: string;
      serviceProviderCode: string;
      serviceProviderName: string;
  
    } = {
        name: '',
        code: '',
        status:'',
        serviceProviderCode:'',
        serviceProviderName:''
       
      };
   setPermission: any;
   approvalRequired: boolean=false;
   constructor(private router: Router,private route: ActivatedRoute,
    private http: HttpClient,
    private session: SessionMgtService, private approvalService : ApprovalService,private commonHttpService: CommonHelperService,
    private endpoints: Endpoints) {
      // this.route.queryParams.subscribe((params: Params) => {
      //   if(params['property']){
      //   this.setPermission = JSON.parse(params['property']);
      //  console.log('  this.setPermission',  this.setPermission);
      //   }
      // });
      this.apporvalRequired(ApprovalConstants.featureCode.SERVICE);
          
    }
    apporvalRequired(code: string) {

        this.setPermission = JSON.parse(localStorage.getItem(code));
        console.log('setPermission' ,this.setPermission);
        this.commonHttpService.approvalRequired(code,
            (status) => {
                this.approvalRequired = status
            }
        )

   }
     

  public  getCurrency() : Observable <any>{
    return this.http.get<any>(this.endpoints.E_WALLET_COUNTRY_URL + '/all');

  }
  getTemplateMasters(masters: any) {
     return this.http.get(this.endpoints.E_WALLET_MASTERS_URL.concat(masters));
  }
  getServiceCategory(serviceCode:string){
    return this.http.get(this.endpoints.E_WALLET_SERVICE_CATEGORY_URL+'allByCriteria?serviceCode='+serviceCode);
  }
  
  getServiceProviderList(code :string){
 
    return this.http.get(this.endpoints.E_WALLET_SERVICE_PROVIDER_URL + code);
  }

  getOperator(serviceCategoryCode:string){
    return this.http.get(this.endpoints.E_WAllET_SERVICE_OPERATOR_URL+'/allByCriteria?serviceCategoryCode='+serviceCategoryCode);
  }
  public createCategory(formData: any ): Observable<any> {
    return this.http.post(this.endpoints.E_WALLET_SERVICE_CATEGORY_URL,formData  );
  }

  public updateCategory(formData: any,serviceCode:string,   categoryCode: string): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_SERVICE_CATEGORY_URL +  categoryCode,{...formData,
      serviceCode : serviceCode }
     
     );
  }
  public createOperator(formData: any ): Observable<any> {
    return this.http.post(this.endpoints.E_WAllET_SERVICE_OPERATOR_URL ,formData  );
  }
  public updateOperator(formData: any,serviceCode:string,   operatorCode: string): Observable<any> {
    return this.http.put(this.endpoints.E_WAllET_SERVICE_OPERATOR_URL + '/'+ operatorCode,formData,
     );
  }
  set setMessage(message: any) {
    this.message = message;
  }

  get getMessage() {
    return this.message;
  }

  public makeEntryToApproval(Info: any, featureCode: string, updatedData?: any): Observable<any> {
    const approvalRequest = this.prepareDataApprovalRequest(Info,  featureCode,updatedData);
    console.log('--request--', approvalRequest);
    return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
}

private prepareDataApprovalRequest(Info: any, featureCodeConst,updatedData?: any) {
  console.log('Info',Info);

     let dataApprovalList = [];

        dataApprovalList.push({
    
        featureCode: featureCodeConst,
        entityCode: Info.code,
        actionType: updatedData ? 'Updated' : 'Created',
        updatedInformation: updatedData ? updatedData :{},
        comments: '',
        status:  updatedData ? ApprovalConstants.status.code.UPDATED :ApprovalConstants.status.code.CREATED,
        assignTo: '',
        entityName: Info.name,
        
    });
    console.log("dataApprovalList",dataApprovalList);
    return {dataApprovalList : dataApprovalList};
}
preparedUpdatedDataForApproval(  updatedData: any) {
      
    let updatedInfo: any = {};

    if(this.category.name != updatedData.name){
      updatedInfo.name = updatedData.name;
    }
    if(this.category.serviceCountryList != updatedData.serviceCountryList){
      updatedInfo.serviceCountryList = updatedData.serviceCountryList;
    }
    if(this.category.productAllowed != updatedData.productAllowed){
      updatedInfo.productAllowed = updatedData.productAllowed;
    }
    if( this.approvalService.getDataApprovalStatus(this.category.status) != updatedData.status){
      updatedInfo.status = updatedData.status;
    }
    return updatedInfo;
  
  }
  preparedUpdatedDataForOperatorApproval(  updatedData: any) {
      
    let updatedInfo: any = {};

    if(this.operator.name != updatedData.name){
      updatedInfo.name = updatedData.name;
    }
    if(this.operator.serviceProviderName != updatedData.serviceProviderName){
      updatedInfo.serviceProviderName = updatedData.serviceProviderName;
    }
    
    if( this.approvalService.getDataApprovalStatus(this.operator.status) != updatedData.status){
      updatedInfo.status = updatedData.status;
    }
    return updatedInfo;
  
  }
   

}



