import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WalletOwnerAddressRequest } from './address/wallet-owner-address-request.model';
import { Endpoints } from '../../shared/endpoints';
import { MastersViewModelBuilder } from '../../shared/masters-view-model.builder';
import { MasterResponseModel } from '../../shared/master-response.model';
import { WalletOwnerConstants } from '../wallet-owner.constants';
import { setMastersService } from '../../shared/services/set-masters.service';
import { ApprovalConstants } from '../../approval/approval.constants';
import { CommonHelperService } from '../../shared/services/common-helper-service';



@Injectable()
export class AddWalletOwnerService {

  walletOwnerId: string;
  formFields: any;
  selectedCategoryCode: string;
  walletOwnerParent: string;
  selectedCountries: any[];
  constructor(private http: HttpClient,
    private mastersViewModelBuilder: MastersViewModelBuilder,
    private setMastersService: setMastersService,
    private endpoints: Endpoints,
    private commonHelperService: CommonHelperService) { }

  // ----------------------- Basic INFO -----------------------

  // ----------------------- Address -----------------------

  submitAddress(addressData: any[]): Observable<any> {
    return this.http.post(this.endpoints.E_WALLET_OWNER_ADDRESS_URL, this.prepareAddressRequest(addressData));
  }
  updateAddress(addressData: any[],code:string): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_OWNER_ADDRESS_URL + '/'+ code, this.prepareAddressRequest(addressData));
  }
  prepareAddressRequest(addressData: any): WalletOwnerAddressRequest {
    const addressArray = [];
    const addAddressRequest: WalletOwnerAddressRequest = {
      walletOwnerCode: this.walletOwnerId,
      addressList: addressArray
    };
    addressData.forEach(element => {
      addressArray.push({
        addTypeCode: element.address.addressType,
        addressLine1: element.address.addressLine1,
        addressLine2: element.address.addressLine2,
        countryCode: element.address.country,
        city: element.address.city,
        regionCode: element.address.regionName,
        location: element.address.location
      });
    });
    console.log('--addAddressRequest--',JSON.stringify(addAddressRequest));
    return addAddressRequest;
  }

  getCountryOnCode(countryCode: string, countryList: any[]) {
    for (let i = 0; i < countryList.length; i++) {
      if (countryList[i].code === countryCode) {
        return countryList[i];
      }
    }
  }
  
  // ----------------------- Bank Details -----------------------

  // ----------------------- Documents -----------------------

  public walletOwnerDone(walletOwnerCode: string, basicInfoData: any,categoryCode: string): Observable<any> {
    let updateBasicInfoRequest : any;
    if(this.approvalRequired){
     updateBasicInfoRequest = {
      ...basicInfoData,
      state: ApprovalConstants.status.code.CREATED,
      status: basicInfoData.status === ApprovalConstants.status.text.INACTIVE
        ? ApprovalConstants.status.code.INACTIVE : ApprovalConstants.status.code.ACTIVE
    };
    }else{
      updateBasicInfoRequest = {
        ...basicInfoData,
        status:ApprovalConstants.status.code.ACTIVE,
        state: ApprovalConstants.status.code.APPROVED
      };
    }
    return this.http.put(this.getWalletUrl(categoryCode) + '/' + walletOwnerCode,
      updateBasicInfoRequest);
  }

  
  getWalletUrl( categoryCode:string){
    if (categoryCode == '100000') {
      return  this.endpoints.E_WALLET_OWNER_URL + '/institute' ;
  
    }
    else if (categoryCode== '100001') {
      return  this.endpoints.E_WALLET_OWNER_URL + '/branch' ;
  
    }
    else if (categoryCode== '100002') {
      return  this.endpoints.E_WALLET_OWNER_URL + '/agent' ;
  
    }
  
    else if (categoryCode== '100005') {
      return  this.endpoints.E_WALLET_OWNER_URL  ;
  
    }
    else if (categoryCode == '100006') {
      return  this.endpoints.E_WALLET_OWNER_URL + '/trustAccount' ;
  
    }
    else if (categoryCode == '100007') {
      return  this.endpoints.E_WALLET_OWNER_URL + '/taxAccount' ;
  
    }
    else if (categoryCode == '100008') {
      return  this.endpoints.E_WALLET_OWNER_URL + '/serviceProvider' ;
  
    }
  }
  // ----------------------------------------------


  get categories(): Observable<any> {
    return new Observable(observer => {
      this.getCategories(WalletOwnerConstants.masters.CATEGPRY).subscribe((mastersData: MasterResponseModel) => {
        this.setMastersService.setMastersData(mastersData);
        observer.next(this.mastersViewModelBuilder.categories);
      });
    });
  }

  private getCategories(masters: string) {
    //TODO : look header thing
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + masters,
      { headers: this.setMastersService.getHeaders() });
  }

  fetchFields(categoryCode: string): Observable<any> {
    this.selectedCategoryCode = categoryCode;
    return this.http.get(this.endpoints.E_WALLET_KYC_FIELDS + '/' + categoryCode);
  }

  get approvalRequired(): boolean {
    // TODO: enable actual line; for development its true
    // return this.commonHelperService.approvalRequired(ApprovalConstants.featureCode.WALLET_OWNER);
    return true;
  }

  walletOwnerApproval(walletOwnerData: any): Observable<any> {
    const walletOwnerApproval = {
      dataApprovalList: [
        {
          featureCode: ApprovalConstants.featureCode.WALLET_OWNER,
          entityCode: walletOwnerData.code,
          actionType: ApprovalConstants.status.text.CREATED,
          updatedInformation: {},
          comments: '',
          status: ApprovalConstants.status.code.CREATED,
          assignTo: '',
          entityName: walletOwnerData.ownerName
        }
      ]
    };
    return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, walletOwnerApproval);
  }
  

}