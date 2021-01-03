import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service'
import { Endpoints } from '../shared/endpoints';
import { ApprovalConstants } from '../approval/approval.constants';
import { Observable } from 'rxjs';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable({
  providedIn: 'root',
})
export class CountryService {

  sharedData: any;
  countryResponse: any;
  regionResponse: any;
  private message: string;
  region: {
    name: string;
    code: string;
  } = {
      name: '',
      code: ''
    };
    setPermission : any;
    approvalRequired : boolean = false;
  constructor(private router: Router,private route : ActivatedRoute,
    private http: HttpClient,
    private session: SessionMgtService, private commonHttpService: CommonHelperService,
    private endpoints: Endpoints) { 
      // this.route.queryParams.subscribe((params: Params) => {
      //   if(params['property']){
      //   this.setPermission = JSON.parse(params['property']);
      //  console.log('  this.setPermission',  this.setPermission);
      //   }
      // });

      this.apporvalRequired(ApprovalConstants.featureCode.COUNTRY);
          
    }
    apporvalRequired(code: string) {

        this.setPermission = JSON.parse(localStorage.getItem(code));

        this.commonHttpService.approvalRequired(code,
            (status) => {
                this.approvalRequired = status
            }
        )

   }

  public get countries(): Observable<any> {
    if (this.countryResponse && this.countryResponse.resultCode === '0') {
      return new Observable(observer => {
        observer.next(this.countryResponse);
      })
    } else {
      return this.http.get(this.endpoints.E_WALLET_COUNTRY_URL + '/all');
    }
  }

  public getRegionByCountryCode(countryCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_COUNTRY_REGION_URL + '/' + countryCode);
  }

  public createRegion(formData: any, countryCode: string): Observable<any> {
    return this.http.post(this.endpoints.E_WALLET_REGION_URL,
      {
        name: formData.region.value,
        countryCode: formData.country.value
      });
  }

  public updateRegion(formData: any, countryCode: string, regionCode: string): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_REGION_URL + '/' + regionCode,
      {
        name: formData.region,
        countryCode: countryCode
      });
  }

  set setMessage(message: any) {
    this.message = message;
  }

  get getMessage() {
    return this.message;
  }

  get regions(): Observable<any> {
    if (this.regionResponse && this.regionResponse.resultCode === '0') {
      return new Observable(observer => {
        observer.next(this.regionResponse);
      })
    } else {
      return this.http.get(this.endpoints.E_WALLET_REGION_URL + '/all');
    }
  }
}



