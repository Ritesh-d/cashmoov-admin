import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, Params, ROUTER_CONFIGURATION } from '@angular/router';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { UserDetailsService } from '../user-details.service';
import { WalletOwnerConstants } from '../../wallet-owner.constants';
import { AddWalletOwnerService } from '../../add-wallet-owner/add-wallet-owner-service';
import { Observable } from 'rxjs';
import { BasicInfoService } from '../../add-wallet-owner/basic-info/basic-info.service';
import { CountryService } from '../../../country/country.service';
import { WalletOwnerService } from '../../wallet-owner.service';
import { AddressService } from '../../add-wallet-owner/address/address.service';
import { WalletOwnerUserRequestModel } from './wallet-owner-user-request.model';
import { UserDataService } from '../../../shared/services/userdata.service';
import { ApprovalConstants } from '../../../approval/approval.constants';
import { ApprovalService } from '../../../approval/approval.service';
import { formatDate } from '@angular/common';
import { API_URLs } from '../../../shared/models/constants';
import { isEmpty } from 'lodash';
import { CommonService } from '../../../shared/services/common.service';
import * as moment from 'moment';
import {TranslatelanguageService} from '../../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userDetailsForm: FormGroup;
  password: string;
  passwordOptions: any[];
  walletOwnerCode: string;
  walletOwnerCategoryCode: string;
  
  userCode: string;
  editMode = false;
  userTypes: any[];
  idProofTypes: any[];
  genders: any[];
  countries: any[];
  userTypeCode: string;
  basicInfoFormFields: any[];
  addressFormFields: any[];
  formAddresses = new FormArray([]);
  parentWalletOwners: any[];
  regions: any[];
  addressTypes: any[];
  idExpiryDate: Date;
  input_text = WalletOwnerConstants.kyc.formFieldType.INPUT_TEXT;
  input_date = WalletOwnerConstants.kyc.formFieldType.INPUT_DATE;
  input_select = WalletOwnerConstants.kyc.formFieldType.INPUT_SELECT;
  input_radio = WalletOwnerConstants.kyc.formFieldType.INPUT_RADIO;
  wallet_owner = WalletOwnerConstants.kyc.formFieldName.WALLET_OWNER;
  id_proof_type = WalletOwnerConstants.kyc.formFieldName.ID_PROOF_TYPE;
  issuing_country = WalletOwnerConstants.kyc.formFieldName.ISSUING_COUNTRY;
  id_expiry_date = WalletOwnerConstants.kyc.formFieldName.ID_EXPIRY_DATE;
  date_of_birth = WalletOwnerConstants.kyc.formFieldName.DATE_OF_BIRTH;
  _gender = WalletOwnerConstants.kyc.formFieldName.GENDER;
  address_type = WalletOwnerConstants.kyc.formFieldName.ADDRESS_TYPE;
  _country = WalletOwnerConstants.kyc.formFieldName.COUNTRY_NAME;
  region_name = WalletOwnerConstants.kyc.formFieldName.REGION_NAME;
  userView: string;
  paramsInfo : any;
  errorMessage: string;
  successMessage: string;
  maxDate :any;
  minDateDOB: any;
  maxDateDOB: { year: any; month: any; day: any; };
  minDateIdExp: { year: any; month: any; day: any; };
  submitted=false;
  constructor(private userDetailsService: UserDetailsService,
    private route: ActivatedRoute,
    private router: Router,
    private commonHelperService: CommonHelperService,
    private addWalletOwnerService: AddWalletOwnerService,
    private basicInfoService: BasicInfoService,
    private countryService: CountryService,
    private walletOwnerService: WalletOwnerService,
    private translate: TranslatelanguageService,
    private approvalService : ApprovalService,
    private addressService: AddressService,private apiurls: API_URLs,private commonService:CommonService,private cdref: ChangeDetectorRef ) { }

  ngOnInit() {
    let validYear=this.apiurls.MINIMUM_AGE_DATE_OF_BIRTH;
    this.minDateDOB=this.commonService.convertDatepicker(moment().subtract(70, "year"));
    this.maxDateDOB=this.commonService.convertDatepicker(moment().subtract(validYear, "year"));

    this.minDateIdExp =  this.commonService.convertDatepicker(moment().add(1, "day"));
    this.userView = undefined;
    this.maxDate={year:new Date().getFullYear(),month: 1, day: 1};
    this.route.params.subscribe((params: Params) => {
      
      console.log('params' + JSON.stringify(params));
      this.userDetailsForm = new FormGroup({});
      if (params.walletOwnerCode) {
        console.log('--IF--');
        this.userView = 'add';
        this.walletOwnerCode = params.walletOwnerCode;
        this.userDetailsService.walletOwnerCode = this.walletOwnerCode;
        this.prepareInputAttributes();
      } else if (params.userCode) {
        console.log('--ELSE IF--');
        this.editMode = this.commonHelperService.isEditMode;
        console.log('this.editMode', this.editMode);
        if (this.editMode) {
          this.userView = 'edit';
        } else {
          this.userView = 'view';
        }
        this.userCode = params.userCode;
        this.userDetailsService.getUserByCode(this.userCode).subscribe(userData => {
          if (userData.resultCode === '0') {
            if(userData){
            this.walletOwnerCode = userData.walletOwnerUser.userCode;
            console.log('--walletOwnerUser--', userData.walletOwnerUser);
            this.paramsInfo =  userData.walletOwnerUser; // for store old values # approval process
            console.log('paramsInfo' +JSON.stringify(this.paramsInfo)); 
            if(this.editMode)
           (document.getElementById('status') as HTMLInputElement).value= this.approvalService.getDataApprovalStatus(this.paramsInfo.status);
           
            if(this.paramsInfo.status == ApprovalConstants.status.text.SUSPENDED){
              this.showDateOptions=true;
              const [day, month, year] = formatDate(this.paramsInfo.fromDate, "dd/MM/yyyy", "en").split('/');
              this.model = { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
              const [day1, month1, year1] = formatDate(this.paramsInfo.toDate, "dd/MM/yyyy", "en").split('/'); 
              this.model1 = { year: parseInt(year1), month: parseInt(month1), day: parseInt(day1) };

            }
          

            this.onCategoryChange(userData.walletOwnerUser.walletOwnerUserTypeCode, userData);
          }
          } else {
            this.errorMessage = userData.resultDescription;
          }
        });
      } else {
        console.log('--ELSE--');
      }
    });

    this.passwordOptions = this.userDetailsService.passwordOptions;
  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();

  }
 

  private prepareInputAttributes(userData?: any) {
    this.userDetailsService.userTypes.subscribe(userTypeData => {
      if (userTypeData.resultCode === '0') { 
      this.userTypes = [{  type: 'select user type' }, ...userTypeData.walletOwnerUserTypeList];
      this.userDetailsService.userTypeResponse = userTypeData;  
    }

    });
    this.basicInfoService.idProofTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.idProofTypeResponse = data;
        this.idProofTypes = [{ code: '', type: 'select id proof' }, ...data.idProffTypeList];
      }
    });
    this.countryService.countries.subscribe(countriesData => {
      if (countriesData.resultCode === '0') {
        this.countryService.countryResponse = countriesData;
        this.countries = [{ code: '', name: 'select country' }, ...countriesData.countryList];
      }
    });
    this.basicInfoService.genderTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.genderTypeResponse = data;
        this.genders = data.genderTypeList;
      }
    });
    this.addressService.addressTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.addressService.addressTypeResponse = data;
        this.addressTypes = [{ code: '', type: 'select address type' }, ...data.addressTypeList];
      }
    });
    this.countryService.regions.subscribe(regionData => {
      if (regionData.resultCode === '0') {
        this.countryService.regionResponse = regionData;
        this.regions = [{ code: '', type: 'select region' }, ...regionData.regionList];
        if (userData && (userData.walletOwnerUser.addressList!=undefined || userData.walletOwnerUser.addressList!=null)) {
          this.regions = this.addressService.regions(userData.walletOwnerUser.addressList[0].countryCode);
        }
      }
    });
    this.walletOwnerService.getWalletOwnerByCode(this.walletOwnerCode).subscribe(walletOwner => {
      this.parentWalletOwners = [{ code: walletOwner.walletOwner.code, name: walletOwner.walletOwner.ownerName }];
      this.walletOwnerCategoryCode = walletOwner.walletOwnerCategoryCode;
     });
  }

  onCategoryChange(userType: string, userData?: any) {
    this.userDetailsForm = undefined;
    this.userTypeCode = userType;
    this.submitted=false;
    if(this.userTypeCode!='' &&  this.userTypeCode!=undefined){
    this.userDetailsService.fetchFields(this.userTypeCode).subscribe(formFields => {
      if (formFields.resultCode === '0') {
        this.errorMessage = undefined;
        this.basicInfoFormFields = formFields.genInfoKycList;
        console.log('basicInfoFormFields' + JSON.stringify(this.basicInfoFormFields));
        this.addressFormFields = formFields.addressKycList;
        if (userData) {
          this.userDetailsForm = this.userDetailsService
            .initializeUserDetailsFormViewEdit(formFields, userData.walletOwnerUser, this.commonHelperService.isEditMode);
          // this.setDateFields(userData);
          
          this.prepareInputAttributes(userData);
        } else { this.userDetailsForm = this.userDetailsService
              .initializeUserDetailsForm(formFields, this.walletOwnerCode);
             
          
        }
      } else {
        this.errorMessage = formFields.resultDescription;
      }
    },err => {
      this.errorMessage =err.error.resultDescription;
      console.log('err',err.error.resultDescription)});
   
  }
  else{
    //this.errorMessage = "Please select user Type";
    this.translate.languageText('USER.pleaseselectuserType', data=> {
      this.errorMessage =data;
      });
  }
  }
  showDateOptions : boolean = false;
  model :any; model1 : any;
  onChange(event){
    let status = event.target.value;
    console.log('status' + event.target.value);
  if(status == ApprovalConstants.status.code.SUSPENDED){
    this.showDateOptions = true;
      const [day, month, year] = formatDate(new Date(), "dd/MM/yyyy", "en").split('/');
      const ngxobj = { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
      this.model = ngxobj;
      this.model1 = ngxobj;
  }else{
    this.showDateOptions = false;
    this.model = undefined;
    this.model1 = undefined;
  }
  }
  // setDateFields(userData: any) {
  //   console.log('--idExpiryDate--', userData.walletOwnerUser.idExpiryDate);
  //   let dateAttr = userData.walletOwnerUser.idExpiryDate.split('-');
  //   this.idExpiryDate =  new Date();
  //   console.log(dateAttr);
  //   this.userDetailsForm.patchValue({
  //     idExpiryDate: new Date()
  //   });
  // }

  onCancel() {
    console.log('user code ',this.userCode, '-' ,  this.walletOwnerCode);
    if (this.userCode && this.walletOwnerCode) {
      
     
      this.router.navigate(['../../users', this.walletOwnerCode], { relativeTo: this.route });
    } else {
      console.log('user code blanl');
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  selectChangeHandler(event: any, field: string) {
    switch (field) {
      case 'country':
        this.regions = this.addressService.regions(event.target.value);
        this.userDetailsForm.get('regionName').enable();
        this.userDetailsForm.get('regionName').setValue('');
        break;
      default:
        break;
    }
  }
  formatDatePicker(date : any){
  
    return formatDate(date.year+'-'+ date.month+'-'+ date.day, "yyyy-MM-dd", "en") ;

}

  addUserSubmit() {
    // console.log('--addUserSubmit--', this.userDetailsForm.getRawValue());
    this.submitted=true;
    if(this.userTypeCode=='100001'){
    this.userDetailsForm.get('idExpiryDate').clearValidators();
    this.userDetailsForm.get('idExpiryDate').updateValueAndValidity();
    }
        if(this.userDetailsForm.invalid)
         {
           return;
         }
     if(this.editMode) {
      
      this.paramsInfo.status = this.approvalService.getDataApprovalStatus( this.paramsInfo.status);// const walletUserRequest: WalletOwnerUserRequestModel = this.userDetailsService.prepareWaletOwnerUserRequest(this.paramsInfo, this.userTypeCode, this.walletOwnerCategoryCode,ApprovalConstants.status.code.UPDATED)
      this.paramsInfo.state = ApprovalConstants.status.code.UPDATED;
      this.paramsInfo.walletOwnerCategoryCode= this.paramsInfo.walletOwnerUserTypeCode;
      this.paramsInfo.addressList[0].status= ApprovalConstants.status.code.INACTIVE;
      console.log('walletUserRequest for update  :: '  + JSON.stringify(this.paramsInfo));
      let status = (document.getElementById('status') as HTMLInputElement ).value;
      let fromdate; let todate;
      if(status == ApprovalConstants.status.code.SUSPENDED){
        // todate = this.formatDatePicker((document.getElementById('datepicker1') as HTMLInputElement ).value);
        // fromdate =  this.formatDatePicker((document.getElementById('datepicker') as HTMLInputElement ).value);
          todate = this.formatDatePicker(this.model1);
          fromdate= this.formatDatePicker(this.model);
      }
      if(true){
      this.userDetailsService.updateWalletOwnerUser(this.paramsInfo,this.userTypeCode).subscribe(userData => {
        if (userData.resultCode === '0') {
              this.userDetailsService.makeEntryToApproval(userData.walletOwnerUser,    
              this.userDetailsService.prepareUpdateInformation(this.paramsInfo,  this.userDetailsForm.getRawValue(), status, todate,fromdate)).subscribe(approvalData => {
            console.log('approvalData', approvalData)
            if (approvalData === null) {
              //this.errorMessage = "There is some error, Please try after some time.";
              this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
                this.errorMessage =data;
                });
            } else {
              if (approvalData["resultCode"] == "0") {
                this.errorMessage = undefined;
                this.router.navigate(['../../users', this.walletOwnerCode], { relativeTo: this.route, queryParams: { status: 'updated' } });
              } else {
                this.errorMessage = approvalData["resultDescription"];
              }
            }
          });

          // this.router.navigate(['../../users', this.walletOwnerCode], { relativeTo: this.route });
        } else {
          this.errorMessage = userData.resultDescription;
        }
      });
    }
  } 
  else if(!this.editMode) {
      const walletUserRequest: WalletOwnerUserRequestModel = this.userDetailsService.prepareWaletOwnerUserRequest(this.userDetailsForm.getRawValue(), this.userTypeCode, this.walletOwnerCategoryCode,ApprovalConstants.status.code.CREATED)
      console.log('walletUserRequest for create :: '  + JSON.stringify(walletUserRequest));
      //if(walletUserRequest.mobileNumber!='' &&walletUserRequest.code!=''&& walletUserRequest.userCode!=''){
      this.userDetailsService.createWalletOwnerUser(walletUserRequest,this.userTypeCode).subscribe(userData => {
      console.log('userData', userData);
      if (userData == null) {
        //this.errorMessage = "There is some error, Please try after some time.";
        this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
          this.errorMessage =data;
          });
            }
            else if (userData.resultCode === '0') {
                this.userDetailsService.makeEntryToApproval(userData.walletOwnerUser).subscribe(approvalData => {
                 console.log('approvalData', approvalData)
            if (approvalData === null) {
               //this.errorMessage = "There is some error, Please try after some time.";
               this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
                this.errorMessage =data;
                });
            } else {
              if (approvalData["resultCode"] == "0") {
                this.errorMessage = undefined;
                this.router.navigate(['../../users', this.walletOwnerCode], { relativeTo: this.route, queryParams: { status: 'added' } });
              } else {
                this.errorMessage = approvalData["resultDescription"];
              }
            }
          });
        
          // this.router.navigate(['../../users', this.walletOwnerCode], { relativeTo: this.route });
          // this.router.navigate(['../../users', this.walletOwnerCode], { relativeTo: this.route, queryParams: { status: 'added' } });
        } else {
          this.errorMessage = userData.resultDescription;
        }
      
      },err => {
        this.errorMessage =err.error.resultDescription;
        console.log('err',err.error.resultDescription)});
    }
  document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });

  }
  resetPassword(){
    this.successMessage='';
    this.userDetailsService.resetPassword(this.paramsInfo.code).subscribe(data => {
        if (data["resultCode"] == "0") {
          this.errorMessage = undefined;
          //this.successMessage = "Password reset successfully";
          this.translate.languageText('USER.passwordresetsuccessfully', data=> {
            this.successMessage =data;
            });
         } else {
          this.errorMessage = data["resultDescription"];
        }
    });
  }
  resetPin(){
    this.userDetailsService.resetPin(this.paramsInfo.code).subscribe(data => {
      console.log('data', data)
        if (data["resultCode"] == "0") {
          this.errorMessage = '';
          //this.successMessage = "Pin reset successfully";
          this.translate.languageText('USER.pinresetsuccessfully', data=> {
            this.successMessage =data;
            });
            
         } else {
          this.errorMessage = data["resultDescription"];
        }
    });
  }

}
