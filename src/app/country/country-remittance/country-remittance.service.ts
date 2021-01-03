import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../../shared/endpoints';
import { ObserversModule } from '@angular/cdk/observers';
import { Observable } from 'rxjs';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { ApprovalConstants } from '../../approval/approval.constants';

@Injectable({ providedIn: "root" })
export class CountryRemittanceService {

  constructor(private http: HttpClient,
    private endpoints: Endpoints) { }

  get countryRemittance(): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_COUNTRY_REMITTANCE_URL + '/all');

  }

  public updateCountryRemittance(remittanceList: any[]): Observable<any> {
    return this.http.post(this.endpoints.E_WALLET_COUNTRY_REMITTANCE_URL,
      {
        countryRemittanceList: this.prepareCountryRemittanceRequest(remittanceList)
      });
  }

  private prepareCountryRemittanceRequest(remittanceList: any[]): any[] {
    const listArray = [];
    remittanceList.forEach(remittance => {
      if (remittance.earlier) {
        listArray.push({
          code: remittance.code,
          countryCode: remittance.countryCode,
          remitSending: remittance.sendChecked,
          remitReceiving: remittance.receiveChecked,
          status: ApprovalConstants.status.code.ACTIVE
        });
      } else {
        listArray.push({
          countryCode: remittance.countryCode,
          remitSending: remittance.sendChecked,
          remitReceiving: remittance.receiveChecked,
          status: ApprovalConstants.status.code.ACTIVE
        });
      }
    });
    return listArray;
  }

}
