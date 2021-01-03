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
import { TranslatelanguageService } from '../../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {

  getcurrentLang:any;
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
  date_of_birth = WalletOwnerConstants.kyc.formFieldName.DATE_OF_BIRTH;
  _group = WalletOwnerConstants.kyc.formFieldName.GROUP;
  _gender = WalletOwnerConstants.kyc.formFieldName.GENDER;
  wallet_owner_parent = WalletOwnerConstants.kyc.formFieldName.WALLET_OWNER_PARENT;
  selectedCategoryCode: string;

  constructor(private basicInfoService: BasicInfoService,
    @Inject(DOCUMENT) document,
    private addWalletOwnerService: AddWalletOwnerService,
    private walletOwnerService: WalletOwnerService,
    private translate : TranslatelanguageService,
    private countryService: CountryService,
    private route: ActivatedRoute) {
      this.getcurrentLang=this.translate.getcurrentLang();
     }

  ngOnInit() {

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
  onSubmitForm() {
 
    if(this.nextClicked){
      document.getElementById('step-2-tab').click();
      return;
     }
    this.prepareCountriesForAddress();
    
    // console.log('--basicInformationForm--', this.basicInformationForm.getRawValue());
     if (this.basicInformationForm.valid) {
       console.log('--VALID--');
      console.log(this.basicInformationForm.getRawValue(), this.addWalletOwnerService.walletOwnerParent);
      // after all validation and checks
      this.basicInfoService.createWalletOwner(this.basicInformationForm.getRawValue()).subscribe(response => {
        console.log('--create wallet owner--', response);
        if (response.resultCode === '0') {
          this.errorMessage = undefined;
          this.basicInfoSubmitted = true;
          this.basicInformationForm.disable();
          this.addWalletOwnerService.walletOwnerId = response.walletOwnerCode;
          //this.successMessage = 'Basic Info added successfully.'
          this.translate.languageText('MASTER.basicInfoaddedsuccessfully', data=> {
            this.successMessage =data;
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
      }, error => {
        this.errorMessage = error.error.resultDescription;
      });
     } else {
     console.log('--INVALID--');
     }
     document.querySelector('#basicerror').scrollIntoView({ behavior: 'smooth', block: 'center' });
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
