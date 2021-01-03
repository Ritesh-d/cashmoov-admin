import { WalletOwnerModel } from './wallet-owner.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../shared/endpoints';
import { WalletOwnerConstants } from './wallet-owner.constants';
import { ApprovalConstants } from '../approval/approval.constants';
import { FormGroup, FormArray } from '@angular/forms';
import { SessionMgtService } from '../shared/services/SessionMgt.service';
import { AddWalletOwnerService } from './add-wallet-owner/add-wallet-owner-service';
import { BasicInfoService } from './add-wallet-owner/basic-info/basic-info.service';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable()
export class WalletOwnerService {

  categoryResponse: any;
  setPermission: any;
  approvalRequired:Boolean=false;
  constructor(private router: Router,private route: ActivatedRoute,
    private session: SessionMgtService,
    private http: HttpClient,  private addWalletOwnerService: AddWalletOwnerService,
    private commonHttpService: CommonHelperService,
    private basicInfoService: BasicInfoService,
    private endpoints: Endpoints) { 
      // this.route.queryParams.subscribe((params: Params) => {
      //   if(params['property']){
      //   this.setPermission = JSON.parse(params['property']);
      //   }
      // });
      this.apporvalRequired(ApprovalConstants.featureCode.WALLET_OWNER);
          
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

  public allWalletOwners(categoryCode:string , params?): Observable<any> {
    console.log('categoryCode'+ categoryCode);
    
    // if(params) {
    //   return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/all?' + params,{ headers: this.getHeaders() });
    // } else {
    //   return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/all?offset=0&limit=30',{ headers: this.getHeaders() });
    // }
    if(params) {
        if(categoryCode){
          //  return this.http.get(this.basicInfoService.getWalletUrl(categoryCode) + '/all?' + params,{ headers: this.getHeaders() });
          return this.http.get(this.basicInfoService.getWalletUrl(categoryCode) + '/all',{ headers: this.getHeaders() });

        }else{
                // return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/all?' + params,{ headers: this.getHeaders() });
                return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/all',{ headers: this.getHeaders() });


        }
    } else {
      return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/all',{ headers: this.getHeaders() });
    }

  }

  public getWalletOwnerByCode(walletOwnerCode: string): Observable<any> {
   console.log('getWalletOwnerByCode'+this.addWalletOwnerService.selectedCategoryCode + this.basicInfoService.getWalletUrl(this.addWalletOwnerService.selectedCategoryCode));
   return this.http.get( this.basicInfoService.getWalletUrl(this.addWalletOwnerService.selectedCategoryCode) + '/' + walletOwnerCode,{ headers: this.getHeaders() });

    // return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/' + walletOwnerCode,{ headers: this.getHeaders() });
  }
  public getWalletWalletOwnerByCode(walletOwnerCode: string): Observable<any> {
   
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_URL + '/' + walletOwnerCode,{ headers: this.getHeaders() });
  }
  public getWalletOwnerTemplate(walletOwnerCode: string): Observable<any> {
    
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_TEMPLATE_URL + '/' + walletOwnerCode,{ headers: this.getHeaders() });
  }
  public getWalleByCode(walletOwnerCode: string): Observable<any> {
   
    return this.http.get(this.endpoints.E_WALLET_URL + '/' + walletOwnerCode,{ headers: this.getHeaders() });
  }
  public getTemplateCategoryMasters() {
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + 'TEMPLATECATEGORY',{ headers: this.getHeaders() } );
        
  }
  public getTemplateAll() {
    return this.http.get(this.endpoints.E_WALLET_TEMPLATE_URL + '/all',{ headers: this.getHeaders() } );
        
  }
  public getTemplateByCategory(code : string) {
    return this.http.get(this.endpoints.E_WALLET_TEMPLATE_URL + '/tempCatCode/'+ code,{ headers: this.getHeaders() });
  }

  
  public get categories(): Observable<any> {
    if (this.categoryResponse != undefined) {
      return new Observable(observer => {
        observer.next(this.categoryResponse);
      });
    }
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + WalletOwnerConstants.masters.CATEGORY,{ headers: this.getHeaders() });
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
    
    // return this.http.get(this.endpoints.E_WALLET_OWNER_URL +
    //   '/all?walletOwnerCategoryCode=' + categoryCode + '&offset=0&limit=500',{ headers: this.getHeaders() });
      return this.http.get(this.basicInfoService.getWalletUrl(categoryCode)+
        '/all?offset=0&limit=500',{ headers: this.getHeaders() });
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
      '?offset=0&limit=30',{ headers: this.getHeaders() });
  }

  public saveCountryCurrency(walletOwnerCode: string, formData: any): Observable<any> {
      return this.http.post(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL, this.prepareCountryCurrencyRequest(walletOwnerCode, formData),{ headers: this.getHeaders() });
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
        status: ApprovalConstants.status.code.ACTIVE,
        countryCurrencyCode : element.countryCurrencyCode
      }
    } else {
      return {
        code : element.code,
        currencyCode: element.currency,
        inBound: element.inbound,
        outBound: element.outbound,
        status: ApprovalConstants.status.code.ACTIVE,
        countryCurrencyCode : element.countryCurrencyCode
      }
    }
    
  }
   
  getCurrencyByWalletOwenerCode(code: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL+ '/' + code,{ headers: this.getHeaders() });
  }
  getCountryRemittanceByWalletOwenerCode(code: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYREMITTANCE_URL+ '/' + code,{ headers: this.getHeaders() });
  }
  
  getCountryDetail(code: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_COUNTRY_URL+ '/' + code,{ headers: this.getHeaders() });
  }


  public initializeCurrencyForm() {
    return new FormGroup({
      countryCurrency: new FormArray([])
    });

  }

  deleteByCode(code : string){
    return this.http.delete(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL+ '/' + code,{ headers: this.getHeaders() });



  }
  getCountryCurrencyCountry(code : string){
    return this.http.get(this.endpoints.E_WALLET_COUNTRYCURRENCY_COUNTRY_URL+ '/' + code,{ headers: this.getHeaders() });


  }
  public saveWalletOwnerCountryRemittance(request : any): Observable<any> {
    return this.http.post(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYREMITTANCE_URL, request, { headers: this.getHeaders() });
}
private getHeaders() {
  var token = this.session.getLoginToken();
  console.log('token ' + token);
  return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token)

}

}
