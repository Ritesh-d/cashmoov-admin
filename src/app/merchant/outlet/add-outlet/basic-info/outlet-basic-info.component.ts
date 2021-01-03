import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OutletBasicInfoService } from './basic-info.service';
import { DOCUMENT } from '@angular/common';
 
import { WalletOwnerConstants } from '../../../wallet-owner.constants';
 
 
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';
import { API_URLs } from '../../../../shared/models/constants';
import { MerchantService } from '../../../merchant.service';
import { CountryService } from '../../../../country/country.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AddOuletService } from '../add-outlet-service';
import { CommonService } from '../../../../shared/services/common.service';
import { TranslatelanguageService } from '../../../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-outlet-basic-info',
  templateUrl: './outlet-basic-info.component.html',
  styleUrls: ['./outlet-basic-info.component.css']
})
export class OutletBasicInfoComponent implements OnInit {

  getcurrentLang:any;
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
  input_checkbox = WalletOwnerConstants.kyc.formFieldType.INPUT_CHECKBOX;
  business_type = WalletOwnerConstants.kyc.formFieldName.BUSINESS_TYPE;
  id_proof_type = WalletOwnerConstants.kyc.formFieldName.ID_PROOF_TYPE;
  issuing_country = WalletOwnerConstants.kyc.formFieldName.ISSUING_COUNTRY;
  register_country_code = WalletOwnerConstants.kyc.formFieldName.REGISTER_COUNTRY_CODE;
  id_expiry_date = WalletOwnerConstants.kyc.formFieldName.ID_EXPIRY_DATE;
  mobile_number = WalletOwnerConstants.kyc.formFieldName.MOBILE_NUMBER;
 
  date_of_birth = WalletOwnerConstants.kyc.formFieldName.DATE_OF_BIRTH;
  _group = WalletOwnerConstants.kyc.formFieldName.GROUP;
  _gender = WalletOwnerConstants.kyc.formFieldName.GENDER;
  _walletExists = WalletOwnerConstants.kyc.formFieldName.WALLETEXISTS;
  wallet_owner_parent = WalletOwnerConstants.kyc.formFieldName.WALLET_OWNER_PARENT;
  selectedCategoryCode: string;
  maxDate : any;
  minDateIdExp:any;
  constructor(private basicInfoService: OutletBasicInfoService,
    @Inject(DOCUMENT) document,
    private addWalletOwnerService: AddOuletService,
    private walletOwnerService: MerchantService,
    private translate : TranslatelanguageService,
    private countryService: CountryService,
    private route: ActivatedRoute,private apiurls: API_URLs,private commonService:CommonService) {

      this.getcurrentLang=this.translate.getcurrentLang();
     }

  ngOnInit() {
    let validYear=this.apiurls.MINIMUM_AGE_DATE_OF_BIRTH;
    this.minDateDOB=this.commonService.convertDatepicker(moment().subtract(70, "year"));
    this.maxDateDOB=this.commonService.convertDatepicker(moment().subtract(validYear, "year"));

    this.minDateIdExp =  this.commonService.convertDatepicker(moment().add(1, "day"));

    this.maxDate={year:new Date().getFullYear(),month: 1, day: 1}
    this.route.params.subscribe((params: Params) => {
      console.log('bf params', params);
      if (params.walletOwnerCode ) {
        this.parentWalletCode = params.walletOwnerCode;
        console.log('this.parentWalletCode'+ this.parentWalletCode);
      }
    });

    this.selectedCategoryCode = this.addWalletOwnerService.selectedCategoryCode;
    this.basicInfoService.prepareMasters().subscribe(() => {
      this.contractTypes = [{ code: '', type: 'select contract type' }, ...this.basicInfoService.contractTypes];
      this.businessTypes = [{ code: '', type: 'select business type' }, ...this.basicInfoService.businessTypes];
    });
    if (this.parentWalletCode) {
      this.walletOwnerService.getOutletByCode(this.parentWalletCode).subscribe(walletOwner => {
       
        
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
    this.basicInformationForm = this.basicInfoService.createBasicInformationFormGroup(this.parentWalletCode);
 
  }

  /**
   * basicInformation form submission
   */
  checkForExpiryDate(value:any){
 
    var now = new Date();
    var year = now.getFullYear();
    var month= now.getMonth();
    var date = now.getDate()
  //someday.setFullYear(value.year, value.month, 0);
  if(this.isEmptyOrSpaces(value))
return true;
  if(value.year>year) 
  return true;
  if (value.year  >=year) {
     if(value.month==month+1){
       if(value.day>=date)
         return true;
        }
        if(value.month>month+1)
        return true;
     }
     
  else
    return false;
  
  }
checkValidDate(value:any){
  if (value && typeof value === "string") {
    let match = value.match(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
    if (!match) {
      return { 'dateInvalid': true };
    } else if (match && match[0] !== value) {
      return { 'dateInvalid': true };
    }
  }
}


checkdateOfBirth(value :any){
 
  var now = new Date();
  var year = now.getFullYear();
  var month= now.getMonth();
  var date = now.getDate()
 let validYear=year- this.apiurls.MINIMUM_AGE_DATE_OF_BIRTH;
 if(this.addWalletOwnerService.selectedCategoryCode==='100002'){
 if(this.isEmptyOrSpaces(value))
return true;
 }
  if(value.year<= validYear)
        return true;
     else
    return false;
      
}

checkforSpecialChar(value:any){
  let match = /^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{2,20}$/;
  //institute
 
     if(match.test(value.businessName) || match.test(value.businessTypeCode) ||
    match.test(value.code) || match.test(value.groupCode) || match.test(value.idProofNumber)||
     match.test(value.idProofTypeCode) || match.test(value.issuingCountryCode) ||
    match.test(value.mobileNumber) || match.test(value.ownerName)  
    )
      return true;
    
    else
      return false;	
  
 
}
isEmptyOrSpaces(str){
  
  return str === null || str.trim() === ''|| str.match(/^ *$/) !== null;
 
}
validateEmail(email :any) {
  var re = /\S+@\S+\.\S+/;
     return re.test(email)
}
submitted: boolean = false;
  onSubmitForm() {
    this.submitted = true;

 
    
    if(this.basicInformationForm.get('walletExists').value===''){ 
      this.basicInformationForm.controls.walletExists.setValue(true);
    } 
  

    // this.basicInformationForm.get('idExpiryDate').validator.get('required');
    // this.basicInformationForm.get('idExpiryDate').clearValidators();
    // this.basicInformationForm.get('idExpiryDate').updateValueAndValidity();
    console.log('this.basicInformationForm.invalid'+ this.basicInformationForm.invalid);
    if(this.basicInformationForm.invalid){
     return;
   }
    this.prepareCountriesForAddress();
    this.nextClicked = true;
       
   let value= this.basicInformationForm.value.idExpiryDate;
   let dob= this.basicInformationForm.value.dateOfBirth;
   if(!this.checkforSpecialChar(this.basicInformationForm.getRawValue())){
     //this.checkforlength(this.basicInformationForm.getRawValue())
     if(this.validateEmail(this.basicInformationForm.value.email)){
     if(!this.checkValidDate(value)){
    // console.log('--basicInformationForm--', this.basicInformationForm.getRawValue());
    // if (this.basicInformationForm.valid) {
      // console.log('--VALID--');
      // if(!this.basicInfoSubmitted){
      //  if(this.checkForExpiryDate(value))
       // {
        
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
            document.getElementById('step-2-tab').click();
          }, 5000);
        } else {
          this.errorMessage = response.resultDescription;
          
        }
      }, err => {
        console.log('err',err.error);
        this.errorMessage = err.error.resultDescription;
      });
    }
     else{
         
           if(dob){
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
                  document.getElementById('step-2-tab').click();
                }, 5000);
              } else {
                this.errorMessage = response.resultDescription;
                
              }
            }, err => {
              console.log('err',err.error);
              this.errorMessage = err.error.resultDescription;
            });
           //}
          // else{
          //  let mimumage= this.apiurls.MINIMUM_AGE_DATE_OF_BIRTH ;
          //  if(this.isEmptyOrSpaces(dob))
           // this.errorMessage="dateOfbirth cannot be empty";
          //  else
           // this.errorMessage="Please select a valid date of birth,the minimum Age criteria i.e. "+(mimumage)+" years or higher";
          //}
           }
     
   // }
   // else{
      
      //this.errorMessage="The expiry date is before today's date. Please select a valid expiry date";
    //}
  }
}else{
  //this.errorMessage="Enter valid Email-Id ";
  if(this.getcurrentLang==="en"){
    this.errorMessage="Enter valid Email-Id ";
     }
     if(this.getcurrentLang==="fr"){
      this.errorMessage="Entrez email-id valide ";
     }
     
}
}
    else{
      this.errorMessage="Enter valid Data";
      if(this.getcurrentLang==="en"){
        this.errorMessage="Enter valid Data";
         }
         if(this.getcurrentLang==="fr"){
          this.errorMessage="Entrez des donnees valides";
         }
         
    }
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
