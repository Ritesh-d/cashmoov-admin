import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BasicInfoService } from './basic-info.service';
import { DOCUMENT } from '@angular/common';
import { AddSubscriberService } from '../add-subscriber.service';
import { SubscriberConstants } from '../../subscriber.constants';
import { SubscriberService } from '../../subscriber.service';
import { CountryService } from '../../../country/country.service';
import { Params, ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {TranslatelanguageService} from './../../../shared/services/translatelanguage.service';
import {CommonService} from './../../../shared/services/common.service';
import * as moment from 'moment';
import { API_URLs } from './../../../shared/models/constants';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
  minDateDOB:any;
  maxDateDOB:any;
  basicInformationForm: FormGroup;
  selectedChannels: string[];
  selectedWallets: string[];
  businessTypes: any[];
  contractTypes: any[];
  idProofTypes: any[];
  groups: any[];
  nextClicked = false;
  basicInfoSubmitted = false;
  errorMessage: string;
  successMessage: string;
  basicInfoFormFields: any[];
  walletOwners: any[];
  countries: any[];
  genders: any[];
  parentWalletOwners: any[];
  parentWalletCode: string;
  input_text = SubscriberConstants.kyc.formFieldType.INPUT_TEXT;
  input_date = SubscriberConstants.kyc.formFieldType.INPUT_DATE;
  input_select = SubscriberConstants.kyc.formFieldType.INPUT_SELECT;
  input_radio = SubscriberConstants.kyc.formFieldType.INPUT_RADIO;
  business_type = SubscriberConstants.kyc.formFieldName.BUSINESS_TYPE;
  id_proof_type = SubscriberConstants.kyc.formFieldName.ID_PROOF_TYPE;
  issuing_country = SubscriberConstants.kyc.formFieldName.ISSUING_COUNTRY;
  register_country_code = SubscriberConstants.kyc.formFieldName.REGISTER_COUNTRY_CODE;
  id_expiry_date = SubscriberConstants.kyc.formFieldName.ID_EXPIRY_DATE;
  mobile_number = SubscriberConstants.kyc.formFieldName.MOBILE_NUMBER;
  date_of_birth = SubscriberConstants.kyc.formFieldName.DATE_OF_BIRTH;
  _group = SubscriberConstants.kyc.formFieldName.GROUP;
  _gender = SubscriberConstants.kyc.formFieldName.GENDER;
  wallet_owner_parent = SubscriberConstants.kyc.formFieldName.WALLET_OWNER_PARENT;
  selectedCategoryCode: string;
  maxDate : any;
  minDateIdExp:any;
  constructor(private basicInfoService: BasicInfoService,
    @Inject(DOCUMENT) document,
    private addWalletOwnerService: AddSubscriberService,
    private walletOwnerService: SubscriberService,
    private countryService: CountryService,
    private translate: TranslatelanguageService, 
    private route: ActivatedRoute,private apiurls: API_URLs,private commonService:CommonService) { }

  ngOnInit() {
    let validYear=this.apiurls.MINIMUM_AGE_DATE_OF_BIRTH;
    this.minDateDOB=this.commonService.convertDatepicker(moment().subtract(70, "year"));
    this.maxDateDOB=this.commonService.convertDatepicker(moment().subtract(validYear, "year"));

    this.minDateIdExp =  this.commonService.convertDatepicker(moment().add(1, "day"));

    this.maxDate={year:new Date().getFullYear(),month: 1, day: 1}
    this.route.params.subscribe((params: Params) => {
      if (params.walletOwnerCode && params.category) {
        this.parentWalletCode = params.walletOwnerCode;
      }
    });

    this.selectedCategoryCode = this.addWalletOwnerService.selectedCategoryCode;
    this.basicInfoService.prepareMasters().subscribe(() => {
      this.contractTypes = [{ code: '', type: 'Select  ' }, ...this.basicInfoService.contractTypes];
      this.businessTypes = [{ code: '', type: 'Select  ' }, ...this.basicInfoService.businessTypes];
    });
    if (this.parentWalletCode) {
      this.walletOwnerService.getWalletOwnerByCode(this.parentWalletCode).subscribe(walletOwner => {
        this.parentWalletOwners = [{ code: walletOwner.walletOwner.code, name: walletOwner.walletOwner.ownerName }];
      });
    }
    this.basicInfoService.idProofTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.idProofTypeResponse = data;
        this.idProofTypes = [{ code: '', type: 'Select  ' }, ...data.idProffTypeList];
      }
    });
    this.basicInfoService.genderTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.genderTypeResponse = data;
        this.genders = data.genderTypeList;
      }
    });
    this.basicInfoService.groups.subscribe(response => {
      this.groups = [{ code: '', name: 'Select  ' }, ...response.groupList];
    });
    this.countryService.countries.subscribe(countriesData => {
      if (countriesData.resultCode === '0') {
        this.countryService.countryResponse = countriesData;
        this.countries = [{ code: '', name: 'Select  ' }, ...countriesData.countryList];
      }
    });
    // this.walletOwnerService.allWalletOwners().subscribe(data => {
    //   if(data.resultCode === '0') {
    //     this.walletOwners = data.walletOwnerList;
    //   }
    // });


    this.basicInfoFormFields = this.addWalletOwnerService.formFields.genInfoKycList;
    console.log('--basicInfoFormFields--', this.basicInfoFormFields);
    this.basicInformationForm = this.basicInfoService.createBasicInformationFormGroup();
  }

  /**
   * basicInformation form submission
   */
submitted: boolean = false;
onSubmitForm() {
  this.submitted = true;
  
  if(this.nextClicked){
    document.getElementById('step-2-tab').click();
    return;
   }
  // this.basicInformationForm.get('idExpiryDate').validator.get('required');
 // this.basicInformationForm.get('idExpiryDate').clearValidators();
  //this.basicInformationForm.get('idExpiryDate').updateValueAndValidity();
  console.log('this.basicInformationForm.invalid'+ this.basicInformationForm.invalid);
  if(this.basicInformationForm.invalid){
    return;
  }
  this.prepareCountriesForAddress();
  
  
    console.log(this.basicInformationForm.getRawValue(), this.addWalletOwnerService.walletOwnerParent);
    // after all validation and checks
    this.basicInfoService.createWalletOwner(this.basicInformationForm.getRawValue()).subscribe(response => {
      console.log('--create wallet owner--', response);
      if (response.resultCode === '0') {  
        this.errorMessage = undefined;
        this.basicInfoSubmitted = true;
        //this.basicInformationForm.disable();
        this.addWalletOwnerService.walletOwnerId = response.walletOwnerCode;
         
         this.translate.languageText('SUBSCRIBER.successBasic', data=> {  
    this.successMessage=data;
  });

        setTimeout(() => {
          this.successMessage = undefined;
          this.nextClicked = true;
          this.basicInformationForm.disable();
          document.getElementById('step-2-tab').click();
        }, 5000);
      } else {
        this.errorMessage = response.resultDescription;
        
      }
    }, err => {
      console.log('err',err.error);
      this.errorMessage = err.error.resultDescription;
    });
  
  document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

  prepareCountriesForAddress() {
    this.addWalletOwnerService.selectedCountries = [];
    this.addWalletOwnerService.selectedCountries.push(
      this.addWalletOwnerService.getCountryOnCode(this.basicInformationForm.value.issuingCountryCode,
        this.countries),
      this.addWalletOwnerService.getCountryOnCode(this.basicInformationForm.value.registerCountryCode,
        this.countries));
    console.log('--selectedCountries--', this.addWalletOwnerService.selectedCountries);
  }
}
