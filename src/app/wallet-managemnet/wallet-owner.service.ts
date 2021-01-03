import { WalletOwnerModel } from './wallet-owner.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../shared/endpoints';
import { WalletOwnerConstants } from './wallet-owner.constants';
import { ApprovalConstants } from '../approval/approval.constants';
import { FormGroup, FormArray } from '@angular/forms';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable()
export class WalletOwnerService {

  categoryResponse: any;
  setPermission: any;
  approvalRequired: boolean=false;
  constructor(private router: Router,private route: ActivatedRoute,
    private http: HttpClient, private commonHttpService: CommonHelperService,
    private endpoints: Endpoints) {
      // this.route.queryParams.subscribe((params: Params) => {
      //   if(params['property']){
      //   this.setPermission = JSON.parse(params['property']);
      //   console.log('setPermission',this.setPermission);
      //   }
      // });
      this.apporvalRequired(ApprovalConstants.featureCode.WALLETMANAGEMENT);
     
    }
    apporvalRequired(code: string) {

        this.setPermission = JSON.parse(localStorage.getItem(code));

        this.commonHttpService.approvalRequired(code,
            (status) => {
                this.approvalRequired = status
            }
        )

   }

  private walletOwners: WalletOwnerModel[];

  public allWalletOwners(params?): Observable<any> {
    if(params) {
      return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/all?' + params);
    } else {
      return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/all?offset=0&limit=30');
    }
  }

  public getWalletOwnerByCode(walletOwnerCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/' + walletOwnerCode);
  }
  public getWalletWalletOwnerByCode(walletOwnerCode: string): Observable<any> {
   
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_URL + '/' + walletOwnerCode);
  }
  public getWalleByCode(walletOwnerCode: string): Observable<any> {
   
    return this.http.get(this.endpoints.E_WALLET_URL + '/' + walletOwnerCode);
  }
  public getEWALLETSERVICE( ): Observable<any> {
   
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + 'EWALLETSERVICE' );
  }
  public getServiceProviderList(code: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_SERVICE_PROVIDER_SERVICE_MASTER_URL + '/'+ code);
  } 
  public getServiceProviderMaster(code : string): Observable<any> {
    console.log('service' + this.endpoints.E_WALLET_SERVICE_PROVIDER_MASTER_URL + '/'+ code);
    return this.http.get(this.endpoints.E_WALLET_SERVICE_PROVIDER_MASTER_URL + '/'+ code );

  }
  public getSeriviceCategoryByService(code: string): Observable<any> {
   
    return this.http.get(this.endpoints.E_WALLET_SERVICE_CATEGORY_URL + 'allByCriteria?status=Y&serviceCode=' +code );
  }
  
  public addServiceProvider(request: any){
    return this.http.post(this.endpoints.E_WALLET_SERVICE_PROVIDER_API_URL, request);

  }
  public updateServiceProvider(request: any,code: string){
    return this.http.put(this.endpoints.E_WALLET_SERVICE_PROVIDER_API_URL + code, request);

  }
  
  
  public get categories(): Observable<any> {
    if (this.categoryResponse != undefined) {
      return new Observable(observer => {
        observer.next(this.categoryResponse);
      });
    }
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + WalletOwnerConstants.masters.CATEGORY);
    // return new Observable(observer => {
    //   observer.next(
    //     {
    //       "transactionId": "6050", "requestedBy": 1, "requestTime": "Thu Aug 13 22:48:00 IST 2020", "responseTime": "Thu Aug 13 22:48:00 IST 2020",
    //       "resultCode": "0",
    //       "resultDescription": "Transaction Successful",
    //       "categoryList": [
    //         { "id": 1, "code": "100000", "name": "Institution" },
    //         { "id": 2, "code": "100001", "name": "Branch" },
    //         { "id": 3, "code": "100002", "name": "Agent" }]
    //     })
    // });
  }

  public fetchWalletOwnerOnCategory(categoryCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_OWNER_URL +
      '/all?walletOwnerCategoryCode=' + categoryCode); // + '&offset=0&limit=100'
  }
  public fetchWalletOwnerOnCategoryall(categoryCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_OWNER_URL + 
      '/all&offset=0&limit=100');
  }
  public getCategoryCode(category: string): string {
    let categoryCode: string;
    this.categories.subscribe(data => {
      for (let i = 0; i < data.categoryList.length; i++) {
        if (data.categoryList[i].name === category) {
          categoryCode = data.categoryList[i].code;
          break;
        }
      }
    });
    return categoryCode;
  }

  public fetchWaletOwnerDetails(walletOwnerCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_OWNER_SUBORDINATE_URL + '/' + walletOwnerCode +
      '?offset=0&limit=30');
  }

  public saveCountryCurrency(walletOwnerCode: string, formData: any): Observable<any> {
      return this.http.post(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL, this.prepareCountryCurrencyRequest(walletOwnerCode, formData));
  }

  private prepareCountryCurrencyRequest(walletOwnerCode: string, formData: any) {
    const request : any = {
      walletOwnerCode: walletOwnerCode,
      walletOwnerCountryCurrencyList: this.prepareCountryCurrencyItem(formData)
     
    };
    console.log('--request--', JSON.stringify(request));
    return request;
  }


  private prepareCountryCurrencyItem(formData: any): any[] {
    // console.log('--formData--', JSON.stringify(formData));
    const currencies = [];
    formData.countryCurrency.forEach(element => {
      // console.log('this.countryCurrencyItem ' + JSON.stringify(this.countryCurrencyItem(element)));
      currencies.push(this.countryCurrencyItem(element));
    });
    // console.log('--currencies--', JSON.stringify(currencies));
    return currencies;
  }
  private countryCurrencyItem(element) {

    if(element.code === null || element.code=="") {
      return {
    
        currencyCode: element.currency,
        inBound: element.inbound,
        outBound: element.outbound,
        status: ApprovalConstants.status.code.ACTIVE
      }
    } else {
      return {
        code : element.code,
        currencyCode: element.currency,
        inBound: element.inbound,
        outBound: element.outbound,
        status: ApprovalConstants.status.code.ACTIVE
      }
    }
    
  }
   
  getCurrencyByWalletOwenerCode(code: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL+ '/' + code);
  }
  getCountryRemittanceByWalletOwenerCode(code: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYREMITTANCE_URL+ '/' + code);
  }
  
  getCountryDetail(code: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_COUNTRY_URL+ '/' + code);
  }


  public initializeCurrencyForm() {
    return new FormGroup({
      countryCurrency: new FormArray([])
    });

  }

  deleteByCode(code : string){
    return this.http.delete(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL+ '/' + code);



  }
  getCountryCurrencyCountry(code : string){
    return this.http.get(this.endpoints.E_WALLET_COUNTRYCURRENCY_COUNTRY_URL+ '/' + code);


  }
  public saveWalletOwnerCountryRemittance(request : any): Observable<any> {
    return this.http.post(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYREMITTANCE_URL, request);
}


}
