import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WalletOwnerConstants } from '../../wallet-owner.constants';
import { MasterResponseModel } from '../../../shared/master-response.model';
import { MastersViewModelBuilder } from '../../../shared/masters-view-model.builder';
import { setMastersService } from '../../../shared/services/set-masters.service';
import { WalletOwnerBasicInfoRequestModel } from './wallet-owner-basic-info-request.model';
import { map } from 'rxjs/operators';
import { Endpoints } from '../../../shared/endpoints';
import { AddWalletOwnerService } from '../add-wallet-owner-service';
import { CommonHelperService } from '../../../shared/services/common-helper-service';

@Injectable()
export class BasicInfoService {

  idProofTypeResponse: any;
  genderTypeResponse: any;
  // basicInfoFormFields: any;
  // basicInformationForm: FormGroup
  constructor(private datePipe: DatePipe,
    private setMastersService: setMastersService,
    private http: HttpClient,
    private mastersViewModelBuilder: MastersViewModelBuilder,
    private addWalletOwnerService: AddWalletOwnerService,
    private endpoints: Endpoints,
    private commonHelperService: CommonHelperService) { }

  /**
   * This method is to create basicInformationForm
   */
  public createBasicInformationFormGroup(): FormGroup {
    let group = {}
    this.addWalletOwnerService.formFields.genInfoKycList.forEach(formField => {
      if (formField.kycMetaDataField === WalletOwnerConstants.kyc.formFieldName.WALLET_OWNER_PARENT) {
        group[formField.kycMetaDataField] = new FormControl(
          { value: this.addWalletOwnerService.walletOwnerParent, disabled: true });
      } else {
        group[formField.kycMetaDataField] = new FormControl('');
      }
    })
    return new FormGroup(group);
  }

  /**
   * prepare masters for basic info
   */
  public updateWalletOwner(formData: any,wllletOwnerCode:string): Observable<any> {
    return this.http.put<any>(this.endpoints.E_WALLET_OWNER_URL+'/employer' +'/'+wllletOwnerCode, this.prepareCreateWalletOwnerRequest(formData));
  }
  prepareMasters(): Observable<any> {
    if (this.contractTypes.length === 0 || this.businessTypes.length === 0) {
      // const basicInfoMasterString= ['contractTypes', 'businessTypes'];
      const basicInfoMasterString = this.setMastersService.prepareMasterString(
        [WalletOwnerConstants.masters.CONTRACT_TYPE, WalletOwnerConstants.masters.BUSINESS_TYPE]);
      return new Observable(observer => {
        this.getBasicInfoMasters(basicInfoMasterString).subscribe((mastersData: MasterResponseModel) => {
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

  /**
   * hit masters api for basic Info masters
   * @param masters : Master Identifier
   */
  private getBasicInfoMasters(masters: string) {
    //TODO : look header thing
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + masters,
      { headers: this.setMastersService.getHeaders() });
  }

  /**
   * get businessTypes: masters from mastersViewModelBuilder
   */
  get businessTypes(): any[] {
    return this.mastersViewModelBuilder.businessTypes;
  }

  /**
   * get contractTypes: masters from mastersViewModelBuilder
   */
  get contractTypes(): any[] {
    return this.mastersViewModelBuilder.contractTypes;
  }

  /**
   * get groups from group API
  */
  get groups(): Observable<any> {
    return this.http.get(this.endpoints.E_WALLET_GROUP_URL + '/all');
  }

  get idProofTypes(): Observable<any> {
    if(this.idProofTypeResponse && this.idProofTypeResponse.resultCode === '0') {
      return new Observable(observer => {
        observer.next(this.idProofTypeResponse);
      });
    } else {
      return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + WalletOwnerConstants.masters.ID_PROOF_TYPE);
    }
  }

  get genderTypes(): Observable<any> {
    if(this.genderTypeResponse && this.genderTypeResponse.resultCode === '0') {
      return new Observable(observer => {
        observer.next(this.genderTypeResponse);
      });
    } else {
      return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + WalletOwnerConstants.masters.GENDER_TYPE);
    }
  }

  /**
   * method is to prepare WalletOwnerBasicInfoRequestModel: basic details
   * @param data : user provided details
   */
  public prepareCreateWalletOwnerRequest(formData: any): WalletOwnerBasicInfoRequestModel {
    console.log('--', formData.idExpiryDate);
    if(formData.idExpiryDate) {
      formData.idExpiryDate = this.commonHelperService.formatDate(formData.idExpiryDate);
    }
    if(formData.dateOfBirth) {
      formData.dateOfBirth = this.commonHelperService.formatDate(formData.dateOfBirth);
    }
    let createWalletOwnerRequest: WalletOwnerBasicInfoRequestModel = {
      ...formData,
      walletOwnerCategoryCode: this.addWalletOwnerService.selectedCategoryCode,
    };
    console.log('--createEmployerRequest--', JSON.stringify(createWalletOwnerRequest));
    return createWalletOwnerRequest;
  }

  /**
   * method is to craete wallet owner 
   * @param formData : user provided details
   */
  public createWalletOwner(formData: any): Observable<any> {
    return this.http.post<any>(this.endpoints.E_WALLET_OWNER_URL+'/employer', this.prepareCreateWalletOwnerRequest(formData));
  }
}
