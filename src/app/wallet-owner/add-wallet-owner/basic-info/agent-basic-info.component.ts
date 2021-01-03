import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BasicInfoService } from './basic-info.service';
import { DOCUMENT } from '@angular/common';
import { AddWalletOwnerService } from '../add-wallet-owner-service';
import { WalletOwnerConstants } from '../../wallet-owner.constants';
import { WalletOwnerService } from '../../wallet-owner.service';
import { CountryService } from '../../../country/country.service';
import { Params, ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { API_URLs } from '../../../shared/models/constants';
import {CommonService} from './../../../shared/services/common.service';
import { isEmpty } from 'lodash';
import {TranslatelanguageService} from '../../../shared/services/translatelanguage.service'; 
import * as moment from 'moment'
@Component({
  selector: 'app-agent-basic-info',
  templateUrl: './agent-basic-info.component.html',
  styleUrls: ['./agent-basic-info.component.css']
})
export class AgentBasicInfoComponent implements OnInit {
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
  input_text = WalletOwnerConstants.kyc.formFieldType.INPUT_TEXT;
  input_date = WalletOwnerConstants.kyc.formFieldType.INPUT_DATE;
  input_select = WalletOwnerConstants.kyc.formFieldType.INPUT_SELECT;
  input_radio = WalletOwnerConstants.kyc.formFieldType.INPUT_RADIO;
  business_type = WalletOwnerConstants.kyc.formFieldName.BUSINESS_TYPE;
  id_proof_type = WalletOwnerConstants.kyc.formFieldName.ID_PROOF_TYPE;
  issuing_country = WalletOwnerConstants.kyc.formFieldName.ISSUING_COUNTRY;
  register_country_code = WalletOwnerConstants.kyc.formFieldName.REGISTER_COUNTRY_CODE;
  id_expiry_date = WalletOwnerConstants.kyc.formFieldName.ID_EXPIRY_DATE;
  mobile_number = WalletOwnerConstants.kyc.formFieldName.MOBILE_NUMBER;
  
  date_of_birth = WalletOwnerConstants.kyc.formFieldName.DATE_OF_BIRTH;
  _group = WalletOwnerConstants.kyc.formFieldName.GROUP;
  _gender = WalletOwnerConstants.kyc.formFieldName.GENDER;
  wallet_owner_parent = WalletOwnerConstants.kyc.formFieldName.WALLET_OWNER_PARENT;
  selectedCategoryCode: string;
  maxDate : any;
  minDateIdExp:any;
  constructor(private basicInfoService: BasicInfoService,
    @Inject(DOCUMENT) document,
    private addWalletOwnerService: AddWalletOwnerService,
    private walletOwnerService: WalletOwnerService,
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
      this.contractTypes = [{ code: '', type: 'select contract type' }, ...this.basicInfoService.contractTypes];
      this.businessTypes = [{ code: '', type: 'select business type' }, ...this.basicInfoService.businessTypes];
    });
    if (this.parentWalletCode) {
      this.walletOwnerService.getWalletOwnerByCode(this.parentWalletCode).subscribe(walletOwner => {
        this.parentWalletOwners = [{ code: walletOwner.walletOwner.code, name: walletOwner.walletOwner.ownerName }];
      });
    }
    this.basicInfoService.idProofTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.idProofTypeResponse = data;
        this.idProofTypes = [{ code: '', type: 'select id proof' }, ...data.idProffTypeList];
      }
    });
    this.basicInfoService.genderTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.genderTypeResponse = data;
        this.genders = data.genderTypeList;
      }
    });
    this.basicInfoService.groups.subscribe(response => {
      this.groups = [{ code: '', name: 'select group' }, ...response.groupList];
    });
    this.countryService.countries.subscribe(countriesData => {
      if (countriesData.resultCode === '0') {
        this.countryService.countryResponse = countriesData;
        this.countries = [{ code: '', name: 'select country' }, ...countriesData.countryList];
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
    this.basicInformationForm.get('idExpiryDate').clearValidators();
    this.basicInformationForm.get('idExpiryDate').updateValueAndValidity();
    this.basicInformationForm.get('dateOfBirth').clearValidators();
    this.basicInformationForm.get('dateOfBirth').updateValueAndValidity();
    console.log('this.basicInformationForm.invalid'+ this.basicInformationForm.invalid);
    if(this.basicInformationForm.invalid){
      return;
    }
    this.prepareCountriesForAddress();
    this.nextClicked = true;
    console.log(this.basicInformationForm.getRawValue(), this.addWalletOwnerService.walletOwnerParent);
      // after all validation and checks
      this.basicInfoService.createWalletOwner(this.basicInformationForm.getRawValue()).subscribe(response => {
        console.log('--create wallet owner--', response);
        if (response.resultCode === '0') {  
          this.errorMessage = undefined;
          this.basicInfoSubmitted = true;
          //this.basicInformationForm.disable();
          this.addWalletOwnerService.walletOwnerId = response.walletOwnerCode;
          //this.successMessage = 'Basic Info added successfully.'
          this.translate.languageText('MASTER.basicInfoaddedsuccessfully', data=> {
            this.successMessage =data;
            });
            
          setTimeout(() => {
            this.successMessage = undefined;
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
