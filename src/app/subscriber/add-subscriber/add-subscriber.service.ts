import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../../shared/endpoints';
import { MastersViewModelBuilder } from '../../shared/masters-view-model.builder';
import { MasterResponseModel } from '../../shared/master-response.model';
import { SubscriberConstants } from '../subscriber.constants';
import { setMastersService } from '../../shared/services/set-masters.service';
import { ApprovalConstants } from '../approval.constants';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { SubscriberAddressRequestModel } from './address/subscriber-address-request-model';

@Injectable({
  providedIn: 'root'
})
export class AddSubscriberService {

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

  fetchFields(categoryCode: string): Observable<any> {
    this.selectedCategoryCode = categoryCode;
    return this.http.get(this.endpoints.E_WALLET_KYC_FIELDS + '/' + categoryCode);
  }

  // ----------------------- Address -----------------------
  updateAddress(addressData: any[],code:string): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_OWNER_ADDRESS_URL + '/'+ code, this.prepareAddressRequest(addressData));
  }
  submitAddress(addressData: any[]): Observable<any> {
    return this.http.post(this.endpoints.E_WALLET_OWNER_ADDRESS_URL, this.prepareAddressRequest(addressData));
  }
  prepareAddressRequest(addressData: any): SubscriberAddressRequestModel {
    const addressArray = [];
    const addAddressRequest: SubscriberAddressRequestModel = {
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
  public walletOwnerDone(walletOwnerCode: string, basicInfoData: any): Observable<any> {
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
     this.selectedCategoryCode =basicInfoData.walletOwnerCategoryCode;
    return this.http.put(this.endpoints.E_WALLET_OWNER_URL + '/subscriber' + '/' + walletOwnerCode,
      updateBasicInfoRequest);
  }

  get approvalRequired(): boolean {
   
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

  getCountryOnCode(countryCode: string, countryList: any[]) {
    for (let i = 0; i < countryList.length; i++) {
      if (countryList[i].code === countryCode) {
        return countryList[i];
      }
    }
  }
  get categories(): Observable<any> {
    return new Observable(observer => {
      this.getCategories(SubscriberConstants.masters.CATEGPRY).subscribe((mastersData: MasterResponseModel) => {
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
    else if (categoryCode == '100009') {
      return  this.endpoints.E_WALLET_OWNER_URL + '/employer' ;
    }
    else if (categoryCode == '100010') {
      return  this.endpoints.E_WALLET_OWNER_URL + '/subscriber' ;
  
    }
  
  }
}
