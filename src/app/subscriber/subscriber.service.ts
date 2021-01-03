import { Injectable } from '@angular/core'; 
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';  
import { HttpClient } from '@angular/common/http';  
import { Endpoints } from './../shared/endpoints'; 
import { SubscriberConstants } from './subscriber.constants';
import { ActivatedRoute, Params } from '@angular/router';
import { ApprovalConstants } from '../approval/approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  categoryResponse: any;
  setPermission : any;
  approvalRequired: Boolean =false;
  constructor(
    private http: HttpClient,  private route: ActivatedRoute,
    private commonHttpService: CommonHelperService,
    private endpoints: Endpoints) { 
      // this.route.queryParams.subscribe((params: Params) => {
      //   if(params['property']){
      //   this.setPermission = JSON.parse(params['property']);
      //   }
      // });
      this.apporvalRequired(ApprovalConstants.featureCode.SUBSCRIBER);
          
    }
    apporvalRequired(code: string) {

        this.setPermission = JSON.parse(localStorage.getItem(code));

        this.commonHttpService.approvalRequired(code,
            (status) => {
                this.approvalRequired = status
            }
        )

   }
   public getSeriviceCategoryByService(code: string): Observable<any> {
   
    return this.http.get(this.endpoints.E_WALLET_SERVICE_CATEGORY_URL + code);
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
  public addServiceProvider(request: any){
    return this.http.post(this.endpoints.E_WALLET_SERVICE_PROVIDER_API_URL, request);

  }
  public updateServiceProvider(request: any,code: string){
    return this.http.put(this.endpoints.E_WALLET_SERVICE_PROVIDER_API_URL + code, request);

  }
    public fetchWalletOwnerOnCategory(categoryCode: string): Observable<any> {
      // return this.http.get(this.endpoints.E_WALLET_OWNER_URL  +
      //   '/all?walletOwnerCategoryCode=' + categoryCode + '&offset=0&limit=100');
        return this.http.get(this.endpoints.E_WALLET_OWNER_URL +'/subscriber' +
        '/all?offset=0&limit=500');
    }
  getByCodeWalleOwner(code: string): Observable<any> { 
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_URL + code);
  }

  // getMiniStatementByWalletOwnerCode(code: string): Observable<any> { 
  //   return this.http.get(this.endpoints.E_WALLET_WALLEOWNER_MINISTATEMENT_URL + code);
  // }
  public getWalletWalletOwnerByCode(walletOwnerCode: string): Observable<any> {
   
    return this.http.get(this.endpoints.E_WALLET_WALLETOWNER_URL + '/' + walletOwnerCode);
  }
  public getWalletOwnerByCode(walletOwnerCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_OWNER_URL +'/subscriber' +'/' + walletOwnerCode);
  }
  public allWalletOwners(params?): Observable<any> {
    if(params) {
      return this.http.get(this.endpoints.E_WALLET_OWNER_URL +'/subscriber' + '/all?' + params);
    } else {
      return this.http.get(this.endpoints.E_WALLET_OWNER_URL +'/subscriber' + '/all?offset=0&limit=300');
    }
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
  
  public get categories(): Observable<any> {
    if (this.categoryResponse != undefined) {
      return new Observable(observer => {
        observer.next(this.categoryResponse);
      });
    }
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + SubscriberConstants.masters.CATEGORY);
   
  }
  public fetchWaletOwnerDetails(walletOwnerCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_OWNER_SUBORDINATE_URL + '/' + walletOwnerCode +
      '?offset=0&limit=30');
  }

}
