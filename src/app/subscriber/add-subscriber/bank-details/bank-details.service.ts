import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MastersViewModelBuilder } from '../../../shared/masters-view-model.builder';
import { HttpClient } from '@angular/common/http';
import { setMastersService } from '../../../shared/services/set-masters.service';
import { MasterResponseModel } from '../../../shared/master-response.model';
import { SubscriberConstants } from '../../subscriber.constants';
import { BankDetailsRequestModel } from './bank-details-request-model';
import { AddSubscriberService } from '../add-subscriber.service';
import { Endpoints } from '../../../shared/endpoints';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BankDetailsService {

    bankDetailsForm: FormGroup;
    settlementOption: string;
    settlementOptionsResponse: any;
    accountTypeResponse: any;

    constructor(private mastersViewModelBuilder: MastersViewModelBuilder,
        private setMastersService: setMastersService,
        private http: HttpClient,
        private addSubscriberService: AddSubscriberService,
        private endpoints: Endpoints) { }

        /**
     * get the bank names as FININSTITUTION code for Bank
     */
    // bankNames(issuingCountryCode: string, operatingCountryCode: string): Observable<any> {
    //     return this.http.get(this.endpoints.E_WALLET_FIN_INSTITUTION_URL + '/all?finInstitutionTypeCode='
    //         + WalletOwnerConstants.identifiers.BANK_DETAILS_BANK_CODE + '&countryCode='
    //         + issuingCountryCode + ',' + operatingCountryCode);
    // }
    bankNames(issuingCountryCode: string, operatingCountryCode: string): Observable<any> {
      return this.http.get(this.endpoints.E_WALLET_FIN_INSTITUTION_URL + '/all?finInstitutionTypeCode='
          + SubscriberConstants.identifiers.BANK_DETAILS_BANK_CODE 
          // + '&countryCode='
          // + issuingCountryCode + ',' + operatingCountryCode
          );
  }

  get accountTypes(): Observable<any> {
      if (this.accountTypeResponse && this.accountTypeResponse.resultCode === '0') {
          return new Observable(observer => {
              observer.next(this.accountTypeResponse);
          });
      }
      return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + SubscriberConstants.masters.ACCOUNT_TYPE);
  }

  /**
   * get the mobile operators as FININSTITUTION code for MMO
   */
  get mobileOperators() {
      if (this.mastersViewModelBuilder.mobileOperators.length === 0) {
          return this.http.get(this.endpoints.E_WALLET_FIN_INSTITUTION_URL + '/'
              + SubscriberConstants.identifiers.BANK_DETAILS_MMO_CODE)
              .pipe(map((response: any) => {
                  this.mastersViewModelBuilder.mobileOperatorsData(response.finInstitutionList);
                  return this.mastersViewModelBuilder.mobileOperators;
              }));
      } else {
          return new Observable(observer => {
              observer.next(this.mastersViewModelBuilder.mobileOperators);
          });
      }
  }

  /**
   * master for bank details section; 
   */
  updateBankDetailsForm(detailsForm: any , code:string): Observable<any> {
    let bankRequest: BankDetailsRequestModel;
    if (detailsForm) {
        if (detailsForm.confirmAccountNumber) {
            delete detailsForm['confirmAccountNumber'];
        }
        bankRequest = this.prepareBankRequest(detailsForm);
    } else {
        // this.bankDetailsForm.patchValue(
        //     { settlementAccount: this.settlementOption }
        // );
        bankRequest = this.prepareBankRequest(this.bankDetailsForm.value);
    }
    return this.http
        .put(this.endpoints.E_WALLET_BANK_DETAILS_URL +'/'+code, bankRequest);
}
  preapareMaster(): Observable<any> {
      if (this.settlementOptions.length === 0) {

          const bankMasterString = this.setMastersService.prepareMasterString(
              [SubscriberConstants.masters.FIN_INSTITUTION_TYPE]);

          return new Observable(observer => {
              this.getBankMasters(bankMasterString).subscribe((mastersData: MasterResponseModel) => {
                  this.setMastersService.setMastersData(mastersData);
                  observer.next();
              });
          });
      } else {
          return new Observable(observer => {
              observer.next();
          });
      }
  }

  get settelementOptions(): Observable<any> {
      if (this.settlementOptionsResponse && this.settlementOptionsResponse.resultCode === '0') {
          return new Observable(observer => {
              observer.next(this.settlementOptionsResponse);
          })
      } else {
          return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + SubscriberConstants.masters.FIN_INSTITUTION_TYPE);
      }
  }

  private getBankMasters(masters: string) {
      //TODO : look header thing
      return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + masters,
          { headers: this.setMastersService.getHeaders() });
  }

  createBankForm() {
      let group = {}
      this.addSubscriberService.formFields.bankKycList.forEach(formField => {
          if (formField.kycInstituteType === 'Bank' && formField.kycMetaDataField != 'settlementAccount') {
              group[formField.kycMetaDataField] = new FormControl('');
          }
      });
      this.bankDetailsForm = new FormGroup(group);
      return this.bankDetailsForm;
  }

  /**
   * submit bank details form
   */
  submitBankDetailsForm(detailsForm?: any): Observable<any> {
      let bankRequest: BankDetailsRequestModel;
      if (detailsForm) {
          if (detailsForm.confirmAccountNumber) {
              delete detailsForm['confirmAccountNumber'];
          }
          bankRequest = this.prepareBankRequest(detailsForm);
      } else {
          // this.bankDetailsForm.patchValue(
          //     { settlementAccount: this.settlementOption }
          // );
          bankRequest = this.prepareBankRequest(this.bankDetailsForm.value);
      }
      return this.http
          .post(this.endpoints.E_WALLET_BANK_DETAILS_URL, bankRequest);
  }

  get settlementOptions() {
      return this.mastersViewModelBuilder.finInstitutionTypes;
  }

  public prepareBankRequest(formData: any): BankDetailsRequestModel {
      let bankRequest: BankDetailsRequestModel = {
          ...formData,
          walletOwnerCode: this.addSubscriberService.walletOwnerId,
          finInstitutionTypeCode: SubscriberConstants.identifiers.BANK_DETAILS_BANK_CODE
      };
      console.log('--bankRequest--', bankRequest);
      return bankRequest;
  }

}
