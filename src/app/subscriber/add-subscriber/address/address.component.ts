import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressService } from './address.service';
import { DOCUMENT } from '@angular/common';
import { AddSubscriberService } from '../add-subscriber.service';
import { SubscriberConstants } from '../../subscriber.constants';
import { CountryService } from '../../../country/country.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  addressForm: FormGroup;
  addressTypes: any[];
  regions: any[];
  countries: any[];
  formSaved = false;
  showSave = true;
  addressFormFields: any[];
  input_text = SubscriberConstants.kyc.formFieldType.INPUT_TEXT;
  input_select = SubscriberConstants.kyc.formFieldType.INPUT_SELECT;
  address_type = SubscriberConstants.kyc.formFieldName.ADDRESS_TYPE;
  country_name = SubscriberConstants.kyc.formFieldName.COUNTRY_NAME;
  region_name = SubscriberConstants.kyc.formFieldName.REGION_NAME;
  city = SubscriberConstants.kyc.formFieldName.CITY;

  @Input('formIndex')
  formIndex: number;
  @Output()
  public saveAddressEvent = new EventEmitter();

  constructor(private addressService: AddressService,
    private addSubscriberService: AddSubscriberService,
    @Inject(DOCUMENT) document,
    private countryService: CountryService) { }

  ngOnInit() {
    this.countryService.countries.subscribe(countriesData => {
   
      if (countriesData.resultCode === '0') {
        this.countryService.countryResponse = countriesData;
        this.countries = [{ code: '', name: 'select  ' }, ...countriesData.countryList];

        this.addressFormFields = this.addSubscriberService.formFields.addressKycList;
        console.log('--addressFormFields--', this.addressFormFields);
        this.addressForm = this.addressService.createAddressFormGroup();
      }
    });
    this.countryService.regions.subscribe(regionData => {
      if (regionData.resultCode === '0') {
        this.countryService.regionResponse = regionData;
        this.regions = [{ code: '', type: 'select  ' }, ...regionData.regionList];
      }
    });
    this.addressService.addressTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.addressService.addressTypeResponse = data;
        this.addressTypes = [{ code: '', type: 'select  ' }, ...data.addressTypeList];
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

  /**
   * this method save the address form on clicking save icon disable the form
   */
  submitAddress() {
    
    document.getElementById('addressform_' + this.formIndex).click();
    this.formSaved = true;
    if (this.addressForm.valid) {
      this.showSave = false;
      console.log('--form is valid--');
      console.log(this.addressForm.value);
      // eventEmitter to emit address is saved
      this.saveAddressEvent.emit('true');
      // updating the address(actual: user enterd) at formIndex
      this.addressService.savedAddress.splice(this.formIndex, 1, { saved: true, address: this.addressForm.value });
      this.addressForm.disable();
    } else {
      console.log('--form is invalid--');
    }
  }

}

