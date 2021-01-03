import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MastersViewModelBuilder } from '../../../../shared/masters-view-model.builder';
import { WalletOwnerConstants } from '../../../wallet-owner.constants';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MasterResponseModel } from '../../../../shared/master-response.model';
import { setMastersService } from '../../../../shared/services/set-masters.service';
import { Endpoints } from '../../../../shared/endpoints';
 import { CountryService } from '../../../../country/country.service';
import { AddOuletService } from '../add-outlet-service';

@Injectable()
export class OutletAddressService {

  formAddresses = new FormArray([]);
  allAddress: FormGroup;
  savedAddress: any[] = [];
  regionals:any[];
  addressTypeResponse: any;
  constructor(private mastersViewModelBuilder: MastersViewModelBuilder,
    private setMastersService: setMastersService,
    private addOuletService: AddOuletService,
    private http: HttpClient,
    private endpoints: Endpoints,
    private countryService: CountryService) { }

  prepareMasters(): Observable<any> {
    if (this.regionals.length === 0 ||
      this.mastersViewModelBuilder.governarates.length === 0 ||
      this.mastersViewModelBuilder.regions.length === 0 ||
      this.mastersViewModelBuilder.territories.length === 0 ) {

      const addressMasterString = this.setMastersService.prepareMasterString(
        [WalletOwnerConstants.masters.REGIONAL_AREA,
        WalletOwnerConstants.masters.GOVERNORATE,
        WalletOwnerConstants.masters.REGION,
        WalletOwnerConstants.masters.TERRITORY,
        WalletOwnerConstants.masters.ADDRESS_TYPE
        ]);

      return new Observable(observer => {
        this.getAddressMasters(addressMasterString).subscribe((mastersData: MasterResponseModel) => {
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
   * hit masters api for address masters
   * @param masters : Master Identifier
   */
  private getAddressMasters(masters: string) {
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + masters,
      { headers: this.setMastersService.getHeaders() });
  }

  /**
   * get addressTypes: masters from mastersViewModelBuilder
   */
  get addressTypes(): Observable<any> {
    if(this.addressTypeResponse && this.addressTypeResponse.resultCode === '0'){
      return new Observable(observer => {
        observer.next(this.addressTypeResponse);
      });
    }
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + WalletOwnerConstants.masters.ADDRESS_TYPE);
  }

  /**
   * get selected regions of selected governarate: masters from mastersViewModelBuilder
   * @param governarateId : selceted governarateId
   */
  regions(countryCode: string): any[] {
    const regions = [];
    regions.push({ name: 'select region', code: '' });
    this.countryService.regions.subscribe(regionsData => {
      if(regionsData.resultCode === '0') {
        regionsData.regionList.forEach(element => {
          if(countryCode === element.countryCode){
            regions.push(element);
          }
        });
      }
    });
    return regions;
  }

  

  /**
   * get regionals masters from mastersViewModelBuilder
   */
  // get regionals(): any[] {
  //   return this.mastersViewModelBuilder.regionals;
  // }

  /**
   * create address form with default values and validations
   */
  createAddressFormGroup(): FormGroup {
    let group = {}
    this.addOuletService.formFields.addressKycList.forEach(formField => {
      if (formField.kycMetaDataField === WalletOwnerConstants.kyc.formFieldName.GOVERNORATE_NAME ||
        formField.kycMetaDataField === WalletOwnerConstants.kyc.formFieldName.REGION_NAME ||
        formField.kycMetaDataField === WalletOwnerConstants.kyc.formFieldName.TERRITORY_NAME) {
        group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: true });
      } else {
        group[formField.kycMetaDataField] = new FormControl('');
      }
    })
    return new FormGroup(group);
  }

  /**
   * create all address form
   */
  createAllAddress() {
    this.allAddress = new FormGroup({
      adresses: this.formAddresses
    });
  }

  get getAddressesControl() {
    return (this.allAddress.get('adresses') as FormArray).controls;    // Typecasting to FormArray
  }

  /**
   * this method adds the address on clicking add address button
   */
  onAddAddressForm() {
    this.formAddresses.push(this.createAddressFormGroup());
    this.savedAddress.push({ saved: false, address: this.createAddressFormGroup().value });
  }

  /**
   * this method removes the address form of index on clicking remove icon
   * @param index : removing index
   */
  onRemoveAddressForm(index: number) {
    this.formAddresses.removeAt(index);
  }

}
