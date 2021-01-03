import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressService } from './address.service';
import { DOCUMENT } from '@angular/common';
import { AddWalletOwnerService } from '../add-wallet-owner-service';
import { WalletOwnerConstants } from '../../wallet-owner.constants';
import { CountryService } from '../../../country/country.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  addressForm: FormGroup;
  addressTypes: any[];
  regions: any[];
  countries: any[];
  formSaved = false;
  showSave = true;
  addressFormFields: any[];
  input_text = WalletOwnerConstants.kyc.formFieldType.INPUT_TEXT;
  input_select = WalletOwnerConstants.kyc.formFieldType.INPUT_SELECT;
  address_type = WalletOwnerConstants.kyc.formFieldName.ADDRESS_TYPE;
  country_name = WalletOwnerConstants.kyc.formFieldName.COUNTRY_NAME;
  region_name = WalletOwnerConstants.kyc.formFieldName.REGION_NAME;
  addressErrorMessage=false;
  errorMessage: string;
  @Input('formIndex')
  formIndex: number;
  @Output()
  public saveAddressEvent = new EventEmitter();

  constructor(private addressService: AddressService,
    private addWalletOwnerService: AddWalletOwnerService,
    @Inject(DOCUMENT) document,
    private countryService: CountryService) { }

  ngOnInit() {
    this.countryService.countries.subscribe(countriesData => {

      //this.countries = [{ code: '', name: 'select country' }, ...this.addWalletOwnerService.selectedCountries];
     // this.countries = this.addWalletOwnerService.selectedCountries;
     this.countries = this.countryService.countryResponse.countryList;
      this.countries =[...new Map(this.countries.map(item => [item['name'], item])).values()]
      this.countries = [{code: '',name: 'select country' }, ...this.countries];
      console.log("Selected Countries:"+this.countries); 

      this.addressFormFields = this.addWalletOwnerService.formFields.addressKycList;
      console.log('--addressFormFields--', this.addressFormFields);
      this.addressForm = this.addressService.createAddressFormGroup();
      // if (countriesData.resultCode === '0') {
      //   this.countryService.countryResponse = countriesData;
      //   this.countries = [{ code: '', name: 'select country' }, ...countriesData.countryList];

      //   this.addressFormFields = this.addWalletOwnerService.formFields.addressKycList;
      //   console.log('--addressFormFields--', this.addressFormFields);
      //   this.addressForm = this.addressService.createAddressFormGroup();
      // }
    });
    this.countryService.regions.subscribe(regionData => {
      if (regionData.resultCode === '0') {
        this.countryService.regionResponse = regionData;
        this.regions = [{ code: '', type: 'select region' }, ...regionData.regionList];
      }
    });
    this.addressService.addressTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.addressService.addressTypeResponse = data;
        this.addressTypes = [{ code: '', type: 'select address type' }, ...data.addressTypeList];
      }
    });

  }

  /**
   * on changing or select value in dropdown
   * @param event : event, selected value
   * @param field : dropdown
   */
  selectChangeHandler(event: any, field: string) {
    switch (field) {
      case 'country':
        this.regions = this.addressService.regions(event.target.value);
        this.addressForm.get('regionName').enable();
        this.addressForm.get('regionName').setValue('');
        break;
      default:
        break;
    }
  }

  /**
   * this method removes the address form of index on clicking remove icon
   */
  onRemoveAddressForm() {
    console.log('--onRemoveAddressForm--', this.formIndex);
    this.addressService.onRemoveAddressForm(this.formIndex);
    this.addressService.savedAddress.splice(this.formIndex, 1);
  }

  /**
   *  this method is to enable form to allow edit the address form on clicking edit icon
   */
  onEditAddressForm() {
    console.log('--onEditAddressForm--', this.formIndex);
    this.showSave = true;
    // updating the address(default: null) at formIndex
    this.addressService.savedAddress.splice(this.formIndex, 1, { saved: false, address: this.addressService.createAddressFormGroup().value });
    this.addressForm.enable();
  }

  
  submitAddress() {
    document.getElementById('addressform_' + this.formIndex).click();
   
    if (this.addressForm.valid) {
      this.showSave = false;
      console.log('--form is valid--');
      console.log(this.addressForm.value);
      // eventEmitter to emit address is saved
      this.saveAddressEvent.emit('true');
      // updating the address(actual: user enterd) at formIndex
      this.addressService.savedAddress.splice(this.formIndex, 1, { saved: true, address: this.addressForm.value });
      this.addressForm.disable();
      this.formSaved = false;
    } else {
      console.log('--form is invalid--');
      this.addressErrorMessage=true;
      this.formSaved = true;
    }
  }



}
