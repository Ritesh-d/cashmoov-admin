import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { setMastersService } from '../../../shared/services/set-masters.service';
import { TemplatesConstants } from '../../templates.constants';
import { HttpClient } from '@angular/common/http';
import { MasterResponseModel } from '../../../shared/master-response.model';
import { Endpoints } from '../../../shared/endpoints';
import { ApprovalConstants } from '../../../approval/approval.constants';
import { ApprovalService } from '../../../approval/approval.service';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
@Injectable()
export class IncentiveTemplateService {
  sharedDate: any;
  // serviceTemplateList : any = [];
  serviceTemplateList: any[] = [];
  constructor(private http: HttpClient, private approvalService: ApprovalService, private setMastersService: setMastersService,
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
  createServiceProfileTemplate(createTemplateRequest: any): Observable<any> {


    return this.http.post(this.endpoints.E_WALLET_INCENTIVE_TEMPLATE_URL, createTemplateRequest);
  }

  createIncentiveProfileTemplate(createTemplateRequest: any): Observable<any> {


    return this.http.post(this.endpoints.E_WALLET_INCENTIVE_DISTRIBUTION_URL, createTemplateRequest);
  }

  modifyServiceProfileTemplate(createTemplateRequest: any, code: string): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_INCENTIVE_TEMPLATE_URL + '/' + code, createTemplateRequest);

  }

  modifyIncentiveProfileTemplate(createTemplateRequest: any, code: string): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_INCENTIVE_DISTRIBUTION_URL + '/' + code, createTemplateRequest);

  }

  prepareMasters(): Observable<any> {
    const groupMasterString = TemplatesConstants.masters.CHANNELTYPE + ',' + TemplatesConstants.masters.EWALLETSERVICE;

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
    console.log('master api ', (this.http.get(this.endpoints.E_WALLET_MASTERS_URL.concat(masters))));
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL.concat(masters),
      { headers: this.setMastersService.getHeaders() });
  }
  getServiceCategoryList(code: string) {
    console.log('url category  ' + this.endpoints.E_WALLET_SERVICE_CATEGORY_URL + code);

    return this.http.get(this.endpoints.E_WALLET_SERVICE_CATEGORY_URL + code,
      { headers: this.setMastersService.getHeaders() });
  }
  getServiceProviderList(code: string) {
    console.log('url provider ' + this.endpoints.E_WALLET_SERVICE_PROVIDER_URL + code);
    return this.http.get(this.endpoints.E_WALLET_SERVICE_PROVIDER_URL + code,
      { headers: this.setMastersService.getHeaders() });
  }
  getServiceProviderApiData(code: string) {

    return this.http.get(this.endpoints.E_WALLET_SERVICE_PROVIDER_API_URL + code,
      { headers: this.setMastersService.getHeaders() });
  }
  fetchWalletOwnerOnCategory(categoryCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_OWNER_URL +
      '/all?walletOwnerCategoryCode=' + categoryCode + '&offset=0&limit=100');
  }
  fetchWalletOwner(): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_OWNER_URL +
      '/all?offset=0&limit=100');
  }
  getAllDetail(code: string) {
    return this.http.get(this.endpoints.E_WALLET_INCENTIVE_TEMPLATE_URL +
      '/allByCriteria?templateCode=' + code,
      { headers: this.setMastersService.getHeaders() });

  }

  getAll() {
    return this.http.get(this.endpoints.E_WALLET_INCENTIVE_DISTRIBUTION_URL +
      '/all',
      { headers: this.setMastersService.getHeaders() });

  }
  getAllIncentiveDetail(code: string) {
    return this.http.get(this.endpoints.E_WALLET_INCENTIVE_DISTRIBUTION_URL +
      '/' + code,
      { headers: this.setMastersService.getHeaders() });

  }
  
  getWalletCategoryMasters() {
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + 'CATEGORY',
      { headers: this.setMastersService.getHeaders() });
  }
  getCalculationType() {
    return this.http.get(this.endpoints.E_WALLET_CALCULATION_TYPE_URL + '/all',
      { headers: this.setMastersService.getHeaders() });
  }
  getCalculationCycleType() {
    return this.http.get(this.endpoints.E_WALLET_CALCULATION_CYCLE_TYPE_URL + '/all',
      { headers: this.setMastersService.getHeaders() });
  }
  getTaxType() {
    return this.http.get(this.endpoints.E_WALLET_TAX_TYPE_URL + '/all',
      { headers: this.setMastersService.getHeaders() });

  }
  getTaxTypeMapped() {
    return this.http.get<any>(this.endpoints.E_WALLET_TAX_TYPE_URL + '/all', { headers: this.setMastersService.getHeaders() }).toPromise()
      .then(data => {
        console.log("Response===============");
        console.log(JSON.stringify(data));

        return data;
      }, error => {
        console.log("API error : " + JSON.stringify(error));
        return null;
      }

      );
  }
  
  

  preparedUpdatedDataForApproval(unChangedData: any, updatedData: any) {

    let updatedInfo: any = {};

    if (unChangedData.channelTypeCode != updatedData.channelTypeCode) {
      updatedInfo.channelTypeCode = updatedData.channelTypeCode;
    }
    if (unChangedData.serviceCode != updatedData.serviceCode) {
      updatedInfo.serviceCode = updatedData.serviceCode;
    }
    if (unChangedData.serviceCategoryCode != updatedData.serviceCategoryCode) {
      updatedInfo.serviceCategoryCode = updatedData.serviceCategoryCode;
    }
    if (unChangedData.serviceProviderCode != updatedData.serviceProviderCode) {
      updatedInfo.serviceProviderCode = updatedData.serviceProviderCode;
    }
    if (unChangedData.transTypeCode != updatedData.transTypeCode) {
      updatedInfo.transTypeCode = updatedData.transTypeCode;
    }
    if (unChangedData.minTransValue != updatedData.minTransValue) {
      updatedInfo.minTransValue = updatedData.minTransValue;
    }
    if (unChangedData.maxTransValue != updatedData.maxTransValue) {
      updatedInfo.maxTransValue = updatedData.maxTransValue;
    }

    // if( this.approvalService.getDataApprovalStatus(unChangedData.status) != updatedData.status){
    //   updatedInfo.status = updatedData.status;
    // }

    return updatedInfo;
  }
  // ApprovalConstants.featureCode.TEMPLATE,
  public makeEntryToApproval(serviceTemplateList: any, templateCategoryName: string, templateCategoryCode: string, featureCode: string, updatedData?: any): Observable<any> {
    const approvalRequest = this.dataApprovalRequest(serviceTemplateList, templateCategoryName, templateCategoryCode, featureCode, updatedData);
    console.log('--request for approval --', approvalRequest);
    return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
  }
  private dataApprovalRequest(serviceTemplateList: any, templateCategoryName: string, templateCategoryCode: string, featureCode: string, updatedData?: any) {
    console.log('serviceTemplateList', serviceTemplateList);
    let dataApprovalList = [];
    dataApprovalList.push({
      featureCode: featureCode,
      entityCode: templateCategoryCode,
      actionType: updatedData ? 'Updated' : 'Created',
      updatedInformation: updatedData ? updatedData : {},
      comments: '',
      status: updatedData ? ApprovalConstants.status.code.UPDATED : ApprovalConstants.status.code.CREATED,
      assignTo: '',
      entityName: templateCategoryName,
      entity: { incentiveTemplateList: serviceTemplateList }
    });
    return { dataApprovalList: dataApprovalList };
  }

}
