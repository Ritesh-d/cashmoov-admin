import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTemplateRequestModel } from '../create-template-request.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Endpoints } from '../../../shared/endpoints';
import { setMastersService } from '../../../shared/services/set-masters.service';
import { TemplatesConstants } from '../../templates.constants';
import { MasterResponseModel } from '../../../shared/master-response.model';
import 'rxjs/add/operator/catch';
import { ApprovalService } from '../../../approval/approval.service';
import { ApprovalConstants } from '../../../approval/approval.constants';
@Injectable()
export class ServiceProfileTemplateServie {
  sharedDate : any;
  // serviceTemplateList : any = [];
  serviceTemplateList : any[] = [];
  constructor(private http: HttpClient,   private approvalService : ApprovalService,  private setMastersService: setMastersService,
    private endpoints: Endpoints) { }

  getTransactions(templateCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_TRANSTYPE_URL + '/all')
      .pipe(map((response) => {
        return this.transformTransactionsForMultiselect(response);
      }));
  }

  /**
   * transorm list for multiselect
   * @param transactionsResponse : transaction response
   */
  private transformTransactionsForMultiselect(transactionsResponse): any[] {
    const transactions = [];
    transactionsResponse.transTypeList.forEach(element => {
      transactions.push({ id: element.code, text: element.name })
    });
    return transactions;
  }

  /**
   * hit create template API for service profile template
   */
  createServiceProfileTemplate(createServiceProfileTemplateRequest : any): Observable<any> {
    
  
     return this.http.post(this.endpoints.E_WALLET_SERVICE_TRANSTEMPLATE_URL, createServiceProfileTemplateRequest);
  }
 

  modifyServiceProfileTemplate(createServiceProfileTemplateRequest : any, code : string): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_SERVICE_TRANSTEMPLATE_URL + '/'+ code, createServiceProfileTemplateRequest);

  }

  prepareMasters(): Observable<any> {
    const groupMasterString = TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE;
   
    // const groupMasterString = this.setMastersService.prepareMasterString(
    //   [TemplatesConstants.masters.CHANNELTYPE,TemplatesConstants.masters.EWALLETSERVICE]);
        return new Observable(observer => {
            this.getTemplateMasters(groupMasterString).subscribe((mastersData: MasterResponseModel) => {
                // this.setMastersService.setMastersData(mastersData);
                // observer.next();
            });
        });
    
  }
  getTemplateMasters(masters: any) {
    console.log('master api ',( this.http.get(this.endpoints.E_WALLET_MASTERS_URL.concat(masters))));
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL.concat(masters),
        { headers: this.setMastersService.getHeaders() });
  }
  getServiceCategoryList(code :string){
    console.log('url category  ' + this.endpoints.E_WALLET_SERVICE_CATEGORY_URL + code);
    // return this.http.get(this.endpoints.E_WALLET_SERVICE_CATEGORY_URL + code ,    { headers: this.setMastersService.getHeaders() });

    return this.http.get(this.endpoints.E_WALLET_SERVICE_CATEGORY_URL + 'allByCriteria?serviceCode='+code + '&status=Y' ,    { headers: this.setMastersService.getHeaders() });
    
  }
  getServiceProviderList(code :string){
    console.log('url provider ' + this.endpoints.E_WALLET_SERVICE_PROVIDER_URL + code);
    return this.http.get(this.endpoints.E_WALLET_SERVICE_PROVIDER_URL + code,
    { headers: this.setMastersService.getHeaders() });
  }
  getServiceProviderApiData(code :string){
  
    return this.http.get(this.endpoints.E_WALLET_SERVICE_PROVIDER_API_URL + code,
    { headers: this.setMastersService.getHeaders() });
  }
  
  getAllDetail(code: string){
    return this.http.get(this.endpoints.E_WALLET_SERVICE_TRANSTEMPLATE_URL + 
      '/allByCriteria?limit=100&offset=0&templateCode='+ code,
      { headers: this.setMastersService.getHeaders() });

  }
  preparedUpdatedDataForApproval(unChangedData: any, updatedData: any) {
   
    let updatedInfo: any = {};

    if(unChangedData.channelTypeCode != updatedData.channelTypeCode){
    updatedInfo.channelTypeCode = updatedData.channelTypeCode;
    }
    if(unChangedData.serviceCode != updatedData.serviceCode){
      updatedInfo.serviceCode = updatedData.serviceCode;
      }
      if(unChangedData.serviceCategoryCode != updatedData.serviceCategoryCode){
        updatedInfo.serviceCategoryCode = updatedData.serviceCategoryCode;
        }
        if(unChangedData.serviceProviderCode != updatedData.serviceProviderCode){
          updatedInfo.serviceProviderCode = updatedData.serviceProviderCode;
          }
          if(unChangedData.transTypeCode != updatedData.transTypeCode){
            updatedInfo.transTypeCode = updatedData.transTypeCode;
            }
            if(unChangedData.minTransValue != updatedData.minTransValue){
              updatedInfo.minTransValue = updatedData.minTransValue;
              }
              if(unChangedData.maxTransValue != updatedData.maxTransValue){
                updatedInfo.maxTransValue = updatedData.maxTransValue;
                }
    
    // if( this.approvalService.getDataApprovalStatus(unChangedData.status) != updatedData.status){
    //   updatedInfo.status = updatedData.status;
    // }

    return updatedInfo;
}
// ApprovalConstants.featureCode.TEMPLATE,
public makeEntryToApproval(entity:any,templateCategoryName : string,templateCategoryCode :string, featureCode: string, updatedData?: any): Observable<any> {
  const approvalRequest = this.dataApprovalRequest(entity,templateCategoryName,templateCategoryCode,featureCode, updatedData);
  console.log('--request for approval --', approvalRequest);
  return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
}
private dataApprovalRequest(entity:any,templateCategoryName : string,templateCategoryCode :string, featureCode:string,updatedData?: any) {
  let dataApprovalList1 = [];
  var upentity={"serviceTemplateList": entity}
  console.log(entity);
      dataApprovalList1.push({
      featureCode: featureCode,
      entityCode: templateCategoryCode,
      actionType: updatedData ? 'Updated' : 'Created',
      updatedInformation: updatedData ?  updatedData :{},
      comments: '',
      status:  updatedData ? ApprovalConstants.status.code.UPDATED :ApprovalConstants.status.code.CREATED,
      assignTo: '',
      entityName: templateCategoryName,
      entity:
        updatedData ?  upentity: entity
        
      
  });
  return {dataApprovalList : dataApprovalList1};
}
 
}
