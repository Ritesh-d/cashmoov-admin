import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../../shared/endpoints';
import { FormGroup, FormArray } from '@angular/forms';
import { ApprovalConstants } from '../../approval/approval.constants';

@Injectable()
export class CurrencyService {

  currencyResponse: any;

  constructor(private http: HttpClient,
    private endpoints: Endpoints) { }

  get currencies(): Observable<any> {
    if (this.currencyResponse && this.currencyResponse.resultCode === '0') {
      return new Observable(observer => {
        observer.next(this.currencyResponse);
      });
    }
    return this.http.get(this.endpoints.E_WALLET_CURRENCY_URL + '/all');
  }

  getCurrencyByCountryCode(countryCode: string): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_COUNTRYCURRENCY_COUNTRY_URL + '/' + countryCode);
  }

  public initializeCurrencyForm() {
    return new FormGroup({
      countryCurrency: new FormArray([])
    });

  }

  public saveCountryCurrency(countryCode: string, formData: any): Observable<any> {
    // return new Observable(observer => observer.next(this.prepareCountryCurrencyRequest(countryCode, formData)));
    return this.http.post(this.endpoints.E_WALLET_COUNTRYCURRENCY_URL, this.prepareCountryCurrencyRequest(countryCode, formData));
  }

  private prepareCountryCurrencyRequest(countryCode: string, formData: any): CountryCurrencyRequest {
    const request: CountryCurrencyRequest = {
      countryCode: countryCode,
      countryCurrencyList: this.prepareCountryCurrencyItem(formData)
    };
    console.log('--request--', JSON.stringify(request));
    return request;
  }


  private prepareCountryCurrencyItem(formData: any): any[] {
    console.log('--formData--', JSON.stringify(formData));
    const currencies = [];
    formData.countryCurrency.forEach(element => {
      console.log('this.countryCurrencyItem ' + JSON.stringify(this.countryCurrencyItem(element)));
      currencies.push(this.countryCurrencyItem(element));
    });
    console.log('--currencies--', JSON.stringify(currencies));
    return currencies;
  }

  private countryCurrencyItem(element) {
    if(element.code === null) {
      return {
        currencyCode: element.currency,
        inBound: element.inbound,
        outBound: element.outbound,
       countryCode:element.countryCode,
        status: ApprovalConstants.status.code.ACTIVE
      }
    } else {
      return {
        code: element.code,
        currencyCode: element.currency,
        inBound: element.inbound,
        outBound: element.outbound,
        countryCode:element.countryCode,
        status: ApprovalConstants.status.code.ACTIVE
      }
    }
  }
}

export interface CountryCurrencyRequest {
  countryCode: string;
  countryCurrencyList: any[];
}
