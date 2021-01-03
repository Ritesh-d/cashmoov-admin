import { Component, OnInit, Input } from '@angular/core';
// import { EmployerService } from '../employer.service';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';

import { BasicInfoService } from '../../add-wallet-owner/basic-info/basic-info.service';
import { AddWalletOwnerService } from '../../add-wallet-owner/add-wallet-owner-service';
import { AddressService } from '../../add-wallet-owner/address/address.service';
import { BankDetailsService } from '../../add-wallet-owner/bank-details/bank-details.service';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { CountryService } from '../../../country/country.service';
import { WalletOwnerConstants } from '../../wallet-owner.constants';
 
import { Endpoints } from '../../../shared/endpoints';
 
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
 import { MerchantService } from '../../merchant.service';
import { formatDate } from '@angular/common';
// import { DocumentsUploadService } from '../../add-wallet-owner/documents-upload/documents-upload.service';
import { ViewOutletService } from './view-outlet.service';
import { ViewOutletModalComponent } from './view-modal/viewoutletmodal.component';
import { ViewOutletModalServiceComponent } from './view-modal-service/viewoutletmodalservice.component';
 
import { ApprovalConstants } from '../../../approval/approval.constants';
 
 
import { TranslatelanguageService } from '../../../shared/services/translatelanguage.service';
import { EditCommissionModalComponent } from '../../view-wallet-owner/edit-comm-model/editcommmodal.component';
import { EditMainModalComponent } from '../../view-wallet-owner/edit-main-modal/editmainmodal.component';
 

@Component({
  selector: 'app-view-outlet',
  templateUrl: './view-outlet.component.html',
  styleUrls: ['./view-outlet.component.css']
})
export class ViewOutletComponent implements OnInit {
  getcurrentLang:any;
  walletOwnerCode: string;
  editMode = false;
  enrollMode = false;
  walletOwner: any;
  parentWalletOwners: any[];
  basicInfoForm: FormGroup;
  addresses = new FormArray([]);
  savedAddress: any[];
  allAddresses: FormGroup;
  bankDetailsForm: FormGroup;
  contractTypes: any[];
  idProofTypes: any[];
  genders: any[];
  businessTypes: any[];
  categories: any[];
  groups: any[];
  addressTypes: any[];
  governorates: any[];
  regions: any[];
  territories: any[];
  countries: any[];
  bankNames: any[];
  basicInfoErrorMessage: string;
  basicInfoSucessMessage: string;
  addressErrorMessage: string;
  addressSuccessMessage: string;
  bankSuccessMessage: string;
  bankErrorMessage: string;
  settlementOptions: any[];
  selectedSettlementOption: any;
  accountTypes: any[];
  bankDetailsCode: string;
  addNewAddress = false;
  walletOwnerUploadedDocuments: any[];
  documentsType: any[];
  documentsErrorMessage: string;
  uploadedDocumentsForm: FormGroup;
  filesNInfo: any[];
  sequenceNumber: number;
  enrolled = false;
  unchangedBasicInfo: any;
  unchangedAddress: any;
  unchangedBankDetails: any;
  unchangedDocuments: any;
  docInfo: string;
  walletWalletOwner : any;
  isDisabled:boolean=true;
  constructor(private walletOwnerService: MerchantService, 
  
    private basicInfoService: BasicInfoService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private viewOutletService: ViewOutletService,
    private addWalletOwnerService: AddWalletOwnerService,
    private addressService: AddressService,
    private bankDetailsService: BankDetailsService,
    private commonHelperService: CommonHelperService,
    private countryService: CountryService,
    private translate : TranslatelanguageService,
    // private documentsUploadService: DocumentsUploadService,
    private modalService: NgbModal,
    private endpoints: Endpoints) {
      this.getcurrentLang=this.translate.getcurrentLang();
  }
  templateCategoryForm: FormGroup;
  category : string;
  serviceBlockType: string;
  state: string;
  showwallet : boolean=false;;
  ngOnInit() {
    console.log('--ViewWalletOwnerComponent ngOnInit--');
    this.filesNInfo = [];
    this.savedAddress = [];
    this.editMode = this.commonHelperService.isEditMode;
    console.log('editMode'+ this.editMode);
    this.enrollMode = this.commonHelperService.isEnrollMode;									  
    if(this.editMode || this.enrollMode){
      this.viewMode = false;
    }
    this.route.params.subscribe((params: Params) => {
      if (params.id) {

      
        this.walletOwnerCode = params.id;
        this.walletOwnerService.getOutletByCode(this.walletOwnerCode).subscribe(data => {
          if (data.resultCode === '0') {
            this.walletOwner = data.walletOwner;
            this.state = this.walletOwner.state
            if(!this.editMode && this.walletOwner.state == 'Approved'){
              this.showwallet= true;
            }
            // this.category = this.walletOwner.walletOwnerCategoryCode;
            this.category= WalletOwnerConstants.category.OUTLET_CODE;
            console.log('walletOwner' , this.category);
            this.getWalletOwnerDetails();
           
         
            if (this.route.snapshot.queryParamMap.get('stage')) {
             
              const stage = this.route.snapshot.queryParamMap.get('stage').toString();
              
              // this.enrollMode = true;
             
             
              if (stage === WalletOwnerConstants.stage.BASIC_INFO) {
                this.sequenceNumber = 2;
                this.navigateToStep2();
              } else if (stage === WalletOwnerConstants.stage.ADDRESS) {
                this.sequenceNumber = 3;
                this.navigateToStep3();
              } else if (stage === WalletOwnerConstants.stage.BANK) {
                this.sequenceNumber = 4;
                this.navigateToStep5();
              } 
              // else if (stage === WalletOwnerConstants.stage.DOCUMENT) {
              //   this.sequenceNumber = 4;
              //   this.navigateToStep4();
              // }
               else if (stage === WalletOwnerConstants.stage.WALLET) {
                this.sequenceNumber = 5;
                this.navigateToStep5();
          
              }
              // else if (stage === WalletOwnerConstants.stage.SERVICES) {
              //   this.sequenceNumber = 6;
              //   this.navigateToStep6();
          
              // }
              else {
                this.sequenceNumber = 4;
                console.log('--invalid stage--', stage);
              }
            } else {
              this.sequenceNumber = 4;
            }
          } else {
            this.basicInfoErrorMessage = data.resultDescription;
          }
        });
        this.templateCategoryForm = this.formBuilder.group({
          // templateCategory : this.formBuilder.array([])
          templateCategory: new FormArray([]),
          templateCategoryOfList: new FormArray([])
        });
       
      }
    });
    this.loadServiceForm();
    this.route.queryParams.subscribe((params: Params) => {
          console.log('queryParams', params);
          this.serviceBlockType = params.services;
          console.log('serviceBlockType'+ this.serviceBlockType);
          // if(this.serviceBlockType=='serviceBlock'){
          // this.navigateToStep6();
          // }

    });
   
 
   
  
  }
  ngAfterContentInit(){

  }
  
  // ----------------------- Basic INFO -----------------------

  getWalletOwnerDetails() {
    this.unchangedBasicInfo = this.walletOwner;
    this.basicInfoErrorMessage = undefined;
    this.basicInfoService.prepareMasters().subscribe(() => {
      this.contractTypes = [...this.basicInfoService.contractTypes];
      this.businessTypes = [...this.basicInfoService.businessTypes];
    });
    if (this.walletOwner.walletOwnerParentCode) {
      this.walletOwnerService.getWalletOwnerByCode(this.walletOwner.walletOwnerParentCode).subscribe(walletOwner => {
        this.parentWalletOwners = [{ code: walletOwner.walletOwner.code, name: walletOwner.walletOwner.ownerName }];
      });
    }
    this.addWalletOwnerService.categories.subscribe(categories => {
      this.categories = [...categories];
    });
    this.basicInfoService.groups.subscribe(response => {
      this.groups = [...response.groupList];
    });
    this.countryService.countries.subscribe(countriesData => {
      if (countriesData.resultCode === '0') {
        this.countryService.countryResponse = countriesData;
        this.countries = [{ code: '', name: 'select country' }, ...countriesData.countryList];
        // this.countries = [{ code: '', name: 'select country' }];
        // this.countries.push(this.viewOutletService.getCountryOnCode(this.walletOwner.issuingCountryCode, countriesData.countryList));
        // this.countries.push(this.viewOutletService.getCountryOnCode(this.walletOwner.registerCountryCode, countriesData.countryList));
      }
    });
    this.basicInfoService.idProofTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.idProofTypeResponse = data;
        this.idProofTypes = [{ code: '', type: 'select business type' }, ...data.idProffTypeList];
      }
    });
    this.basicInfoService.genderTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.genderTypeResponse = data;
        this.genders = data.genderTypeList;
      }
    });
  
    this.basicInfoForm = this.viewOutletService.createBasicInfoForm(this.walletOwner, this.editMode);
    console.log(this.walletOwner.walletExists, "isDisabled");

    if(this.editMode){
      if(this.walletOwner.walletExists){
        this.isDisabled=this.walletOwner.walletExists;
      }else{
        this.isDisabled=null;
      }
      
          } 
          if(this.walletOwner.walletExists){
            this.showwallet= true;
          }else{
            this.showwallet= false;
          }
          



     if(this.walletOwner.dateOfBirth){
      const [day, month, year] = formatDate(this.walletOwner.dateOfBirth, "dd/MM/yyyy", "en").split('/'); 
      this.dateOfBirth = { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
  }
  if(this.walletOwner.idExpiryDate){
    
      const [day1, month1, year1] = formatDate(this.walletOwner.idExpiryDate, "dd/MM/yyyy", "en").split('/'); 
      this.idExpiryDate = { year: parseInt(year1), month: parseInt(month1), day: parseInt(day1) };
  }
  }
  idExpiryDate: NgbDateStruct;
  dateOfBirth: NgbDateStruct;
  onBasicInfoSubmit() {
    console.log('--onBasicInfoSubmit--');
    if (this.editMode) {
      console.log('--update basicInfo--');
      this.walletOwnerSentForApprovalUpdate(WalletOwnerConstants.stage.BASIC_INFO);
      /*this.viewOutletService.updateBasicInfo(this.walletOwnerCode, this.basicInfoForm.getRawValue())
        .subscribe(basicInfoData => {
          if (basicInfoData.resultCode === '0') {
            // this.sequenceNumber = this.sequenceNumber > 2 ? this.sequenceNumber : 2;
            this.basicInfoErrorMessage = undefined;
            this.basicInfoSucessMessage = 'Basic Info Updated Succesully'
            this.walletOwnerSentForApprovalUpdate(WalletOwnerConstants.stage.BASIC_INFO);
          } else {
            this.basicInfoErrorMessage = basicInfoData.resultDescription;
          }
        });*/
    } else if (this.enrollMode) {
      this.navigateToStep2();
    } else {
      this.navigateToStep2();
    }
  }

  // ----------------------- Address -----------------------

  onAddressTabClicked() {
    if (!this.allAddresses) {
      this.viewOutletService.getAddresses(this.walletOwnerCode).subscribe(data => {
        if (data.resultCode === '0' || (data.resultCode === '1010' && this.enrollMode)) {
          this.unchangedAddress = data.addressList;
          this.addressErrorMessage = undefined;
          this.addressService.addressTypes.subscribe(addressTypeResponse => {
            this.addressTypes = [{ code: '', type: 'select address type' }, ...addressTypeResponse.addressTypeList];
          });
          this.countryService.countries.subscribe(countriesResponse => {
            if (countriesResponse.resultCode === '0') {
              this.countries = [{ code: '', name: 'select country' }, ...countriesResponse.countryList];
              // this.countries = [{ code: '', name: 'select country' }];
              // this.countries.push(this.viewOutletService.getCountryOnCode(this.walletOwner.issuingCountryCode, countriesResponse.countryList));
              // this.countries.push(this.viewOutletService.getCountryOnCode(this.walletOwner.registerCountryCode, countriesResponse.countryList));
            }
          });
          if (data.resultCode === '0') {
            this.addresses = this.viewOutletService.createAddressForms(data.addressList, this.editMode);
            this.countryService.regions.subscribe(regionsResponse => {
              if (regionsResponse.resultCode === '0') {
                this.countryService.regionResponse = regionsResponse;
                if(data.addressList[0]){
                this.regions = this.addressService.regions(data.addressList[0].countryCode);
                }
              }
            });
          } else {
            // this.enrolled = true;
            // addNewAddress: is for new address means enrolled user only
            // this.addNewAddress = true;
            this.addresses = this.viewOutletService.createAddressForms([], this.enrollMode);
          }
          this.allAddresses = new FormGroup({ addresses: this.addresses });
        } else {
          this.addressErrorMessage = data.resultDescription;
        }
      });
    }
  }

  onAddAddressForm() {
    (this.allAddresses.get('addresses') as FormArray).push(this.viewOutletService.blankAddressForm);
  }

  onRemoveAddressForm(index: number) {
    (this.allAddresses.get('addresses') as FormArray).removeAt(index);
  }

 
                    viewMode : boolean = true;
                    formSaved: boolean = false;
showSave: boolean = true;
onEditAddressForm(addressForm : FormGroup,index: number) {
  // console.log('--onEditAddressForm--', this.formIndex);
  document.getElementById('edit'+index).classList.add("hideoption");
  document.getElementById('save'+index).classList.remove("hideoption");

  // this.addressService.savedAddress.splice(this.formIndex, 1, { saved: false, address: this.addressService.createAddressFormGroup().value });
  addressForm.enable();
}
submitAddress(addressForm : FormGroup,formIndex: number) {
  // document.getElementById('addressform_' + this.formIndex).click();
  document.getElementById(formIndex+'').style.display = "none";
  if (addressForm.valid) {
 
    console.log('--form is valid--');
    console.log(addressForm.value);
    // eventEmitter to emit address is saved
    // this.saveAddressEvent.emit('true');
    // updating the address(actual: user enterd) at formIndex
    // this.addressService.savedAddress.splice(formIndex, 1, { saved: true, address: addressForm.value });
    addressForm.disable();
    document.getElementById('edit'+formIndex).classList.remove("hideoption");
    document.getElementById('save'+formIndex).classList.add("hideoption");
    this.formSaved = false;
  } else {
    
    document.getElementById(formIndex+'').style.display = "block";
  }
}

  onSaveAddressForm(index: number) {
    console.log('--onSaveAddressForm--', index);
    console.log((this.allAddresses.get('addresses') as FormArray));
  }

  // showSave(index: number) {
  //   return true;
  // }

  onCountryChange(event: any) {
    this.regions = this.addressService.regions(event.target.value);
  }

  get getAddressesControl() {
    return (this.allAddresses.get('addresses') as FormArray).controls;    // Typecasting to FormArray
  }

  addressChangeHandler(event: any, attribute: string, formIndex?: number) {
    if (attribute === 'addType') {
      this.allAddresses.value.addresses[formIndex].addType = event.target.value;
    }
  }

  onAllAddressSubmit() {
    console.log('--onAddressSubmit--', this.sequenceNumber);
    let hasError;
    this.getAddressesControl.forEach(m=>{
      
      if(m.invalid){
      hasError= true; ;
      }
    })
    console.log('hasError' + hasError);
    if(hasError){
      this.translate.languageText('MERCHANT.pleaseprovidealltherequiredfields', data=> {
        this.addressErrorMessage =data;
        });
      return;
    }
    if (this.editMode) {
      console.log('--update address--', this.allAddresses.getRawValue());
      this.walletOwnerSentForApprovalUpdate(WalletOwnerConstants.stage.ADDRESS);
      // this.viewOutletService.updateAddressData(this.walletOwnerCode, this.allAddresses.getRawValue())
      //   .subscribe(addressdata => {
      //     if (addressdata.resultCode === '0') {
      //       // this.sequenceNumber = this.sequenceNumber > 3 ? this.sequenceNumber : 3;
      //       this.addressErrorMessage = undefined;
      //       this.addressSuccessMessage = 'Address Updated Succesfully';
      //       // this.walletOwnerSentForApprovalUpdate(WalletOwnerConstants.stage.ADDRESS);
      //     } else {
      //       this.addressErrorMessage = addressdata.resultDescription;
      //     }
      //   });
    } 
    else if(!this.editMode && !this.enrollMode){
      this.navigateToStep5();
    }
    else if (this.enrollMode && this.sequenceNumber === 2) {
      console.log('--add address--', this.allAddresses.value);
      this.viewOutletService.updateAddressData(this.walletOwnerCode, this.allAddresses.getRawValue(), true)
        .subscribe(addressdata => {
          if (addressdata.resultCode === '0') {
            this.sequenceNumber = 3;
            this.addressErrorMessage = undefined;
           // this.addressSuccessMessage = 'Address Added Succesfully';
           this.translate.languageText('MASTER.addressaddedsuccessfully', data=> {
            this.addressSuccessMessage =data;
            });
            
             
            setTimeout(() => {
              this.addressSuccessMessage = undefined;
              this.navigateToStep5();
            }, 5000);
          } else {
            this.addressErrorMessage = addressdata.resultDescription;
          }
        });
    } else {
      this.navigateToStep5();
    }
  }

  // ----------------------- Bank Details -----------------------

  onBankDetailsTabClicked() {
    if (!this.bankDetailsForm) {
      this.bankDetailsService.settelementOptions.subscribe(settlementOptionsData => {
        if (settlementOptionsData.resultCode === '0') {
          this.bankDetailsService.settlementOptionsResponse = settlementOptionsData;
          this.settlementOptions = settlementOptionsData.finInstitutionTypeList;
        }
      });
      this.viewOutletService.getBankDetails(this.walletOwnerCode).subscribe(data => {
        this.bankDetailsService.bankNames(this.walletOwner.issuingCountryCode, this.walletOwner.registerCountryCode)
          .subscribe(bankNameResponse => {
            if(bankNameResponse.resultCode === '0') {
              this.bankNames = [{ code: '', type: 'select bank' }, ...bankNameResponse.finInstitutionList];
            }
          });
        this.bankDetailsService.accountTypes.subscribe(accountTypesData => {
          if (accountTypesData.resultCode === '0') {
            this.bankDetailsService.accountTypeResponse = accountTypesData;
            this.accountTypes = [{ code: '', type: 'select account type' }, ...accountTypesData.accountTypeList];
          }
        });
        if (data.resultCode === '0') {
          this.unchangedBankDetails = data.settlementAccount;
          this.bankDetailsCode = data.settlementAccount.code;
          this.selectedSettlementOption = {
            code: data.settlementAccount.finInstitutionTypeCode,
            type: data.settlementAccount.finInstitutionTypeName
          };
          this.bankDetailsForm = this.viewOutletService.createBankDetails(data.settlementAccount, this.editMode);
        } else if (this.enrollMode && data.resultCode === '1010') {
          // this.enrolled = true;
          this.selectedSettlementOption = {
            code: WalletOwnerConstants.identifiers.BANK_DETAILS_BANK_CODE,
            type: WalletOwnerConstants.kyc.formFieldName.BANK
          };
          this.bankDetailsForm = this.viewOutletService.createBankDetails([], this.enrollMode);
        } else {
          this.bankErrorMessage = data.resultDescription;
        }
      });
    }
  }

  settlementOptionChanged(changedOption: any) {
    this.selectedSettlementOption = { code: changedOption.code, type: changedOption.type }
  }

  onBankDetailsSubmit() {
    console.log('--onBankDetailsSubmit--');
    this.addWalletOwnerService.walletOwnerId = this.walletOwnerCode;
    if (this.editMode && this.bankDetailsCode) {
      this.walletOwnerSentForApprovalUpdate(WalletOwnerConstants.stage.BANK);
      /*this.viewOutletService.updateBankDetails(this.bankDetailsCode,
        this.bankDetailsService.prepareBankRequest(this.bankDetailsForm.value))
        .subscribe(data => {
          if (data.resultCode === '0') {
            this.bankErrorMessage = undefined;
            this.bankSuccessMessage = 'Bank Info Updated Successfully';
            this.walletOwnerSentForApprovalUpdate(WalletOwnerConstants.stage.BANK);
          }
        });*/
    } else if (this.enrollMode && this.sequenceNumber === 3) {
      this.bankDetailsService.submitBankDetailsForm(this.bankDetailsForm.value).subscribe(data => {
        if (data.resultCode === '0') {
         // this.bankSuccessMessage = 'Bank Info Added Successfully';
         this.translate.languageText('MASTER.basicInfoaddedsuccessfully', data=> {
          this.bankSuccessMessage =data;
          });
           
          this.sequenceNumber = 4;
          setTimeout(() => {
            this.bankSuccessMessage = undefined;
            this.navigateToStep4();
          }, 5000);
        } else {
          this.bankErrorMessage = data.resultDescription;
        }
      });
    } else {
      this.navigateToStep4();
    }
    
  }
  
  arrayItems: {
    templateCategoryCode: string;
    templateCode: string;
  }[];
  walletOwnerTemplateList: any;
  templateCategoryList: any;
  templateList: any;
  templaterrormessage: string;
  isdelete: boolean = false;
  onAddTemplate() {
    this.templaterrormessage = '';
    (this.templateCategoryForm.get('templateCategory') as FormArray).push(new FormGroup({
      templateCategory: new FormControl(),
      templateName: new FormControl()
    }));
  }
  onDelete(index: number) {
    (this.templateCategoryForm.get('templateCategory') as FormArray).removeAt(index);

  }
  get getTemplatesControl() {
    return (this.templateCategoryForm.get('templateCategory') as FormArray).controls;
  }
  get getTemplatesControlOfList() {
    console.log('formarray ', (this.templateCategoryForm.get('templateCategoryOfList') as FormArray).controls);
    return (this.templateCategoryForm.get('templateCategoryOfList') as FormArray).controls;
  }

  // prepareTemplate(code: string){
  //   console.log('prepareTemplate');
  //   this.walletOwnerService.getTemplateAll().subscribe(res => {
  //     if (res["resultCode"] === '0') {
  //       this.templateList =  res["templateList"];
  //      }else{
  //       this.templaterrormessage=res["resultDescription"];
  //      } 
  //   });
  // }
  // filter(list :any,templateCategoryCode:string){

  //   list.filter(m=>{
  //   return  m.templateCategoryCode == templateCategoryCode;
  //   })
  // }

  getAllTemplate() {
    this.walletOwnerService.getTemplateByCategory('100000').subscribe(res => {
      if (res["resultCode"] === '0') {
        this.servicetemplateList = res["templateList"];
      } else {
        this.templaterrormessage = res["resultDescription"];
      }
    });
    this.walletOwnerService.getTemplateByCategory('100002').subscribe(res => {
      if (res["resultCode"] === '0') {
        this.feetemplateList = res["templateList"];
      } else {
        this.templaterrormessage = res["resultDescription"];
      }
    });
    this.walletOwnerService.getTemplateByCategory('100009').subscribe(res => {
      if (res["resultCode"] === '0') {
        this.feeCommisiontemplateList = res["templateList"];
      } else {
        this.templaterrormessage = res["resultDescription"];
      }
    });
    this.walletOwnerService.getTemplateByCategory('100001').subscribe(res => {
      if (res["resultCode"] === '0') {
        this.transtemplateList = res["templateList"];
      } else {
        this.templaterrormessage = res["resultDescription"];
      }
    });
    this.walletOwnerService.getTemplateByCategory('100008').subscribe(res => {
      if (res["resultCode"] === '0') {
        this.transLimitemplateList = res["templateList"];
      } else {
        this.templaterrormessage = res["resultDescription"];
      }
    });
  }
  onSaveTemplate() {
    //this.templaterrormessage= 'Technical Failed';
    console.log(this);
    // alert("hi");

  }
  servicetemplateList: any;
  feetemplateList: any;
  feeCommisiontemplateList: any;
  transtemplateList: any;
  transLimitemplateList: any;
  onTemplateClicked() {
    this.templateCategoryForm = this.formBuilder.group({
      // templateCategory : this.formBuilder.array([])
      templateCategory: new FormArray([]),
      templateCategoryOfList: new FormArray([])
    });
    this.walletOwnerTemplateList = [];
    this.getAllTemplate();
    this.templaterrormessage = '';
    this.walletOwnerService.getWalletOwnerTemplate(this.walletOwnerCode).subscribe(res => {
      if (res.resultCode === '0') {
        this.walletOwnerTemplateList = res["walletOwnerTemplateList"];
        this.walletOwnerTemplateList.forEach(element => {

          //  this.onAddTemplate(element.templateCategoryCode ,element.templateCode);
          (this.templateCategoryForm.get('templateCategoryOfList') as FormArray).push(new FormGroup({
            templateCategory: new FormControl({ value: element.templateCategoryCode, disabled: true }),
            templateName: new FormControl(element.templateCode)
          }));
        });



      } else {
        this.templaterrormessage = res["resultDescription"];
      }
    });
    this.walletOwnerService.getTemplateCategoryMasters().subscribe(res => {
      if (res["resultCode"] === '0') {
        this.templateCategoryList = res["templateCategoryList"];
      } else {
        this.templaterrormessage = res["resultDescription"];
      }
    });
    this.walletOwnerService.getTemplateAll().subscribe(res => {
      if (res["resultCode"] === '0') {
        this.templateList = res["templateList"];
      } else {
        this.templaterrormessage = res["resultDescription"];
      }
    });


    // this.navigateToStep6();
  }
  displaytable: boolean = false;
  walletErrorMessage: string;
  viewUser(user: any) {
    user["walletOwnerCategoryCode"] = this.walletOwner.walletOwnerCategoryCode;
    const modalRef = this.modalService.open(ViewOutletModalComponent);
    modalRef.componentInstance.user = user;
 
  }
  editMainWallet(wallet : any){
    wallet["walletOwnerCategoryCode"] = this.walletOwner.walletOwnerCategoryCode;
    const modalRef = this.modalService.open(EditMainModalComponent);
    modalRef.componentInstance.wallet = wallet;
  }
  editCommissionWallet(wallet : any){
    wallet["walletOwnerCategoryCode"] = this.walletOwner.walletOwnerCategoryCode;
    const modalRef = this.modalService.open(EditCommissionModalComponent);
    modalRef.componentInstance.wallet = wallet;
  }
  onWalletClicked() {
 
    this.displaytable = false;
  
 
    let walletOwner: string;
   
    this.walletOwnerService.getWalletWalletOwnerByCode(this.walletOwnerCode).subscribe(res => {
      if (res.resultCode === '0') {
        let walletWalletOwner: any = res.walletList;
        this.walletWalletOwner = [];
        walletWalletOwner.forEach((item, index) => {

          if (this.walletWalletOwner.findIndex(m =>
            m.currencyName == item.currencyName) === -1) {

            if (item.walletTypeCode == '100009') {

              item.walletTypeCommiName = item.walletTypeName;
              item.commisionWalletvalue = item.value;
              item.commisionMaxValue = item.maxValue;
              item.commisionMinValue = item.minValue;
              item.commisionAlertValue = item.alertValue;
            }
            else if (item.walletTypeCode == '100008') {
              item.walletTypeMainName = item.walletTypeName;
              item.mainWalletvalue = item.value;
              item.mainMaxValue = item.maxValue;
              item.mainMinValue = item.minValue;
              item.mainAlertValue = item.alertValue;
            }

            this.walletWalletOwner.push(item)
          }
          else {

            this.walletWalletOwner.findIndex((m, index) => {
              if (m.currencyName == item.currencyName) {

                if (item.walletTypeCode == '100009') {

                  m.walletTypeCommiName = item.walletTypeName;

                  m.commisionWalletvalue = item.value;
                  m.commisionMaxValue = item.maxValue;
                  m.commisionMinValue = item.minValue;
                  m.commisionAlertValue = item.alertValue;

                }
                if (item.walletTypeCode == '100008') {
  
                  m.walletTypeMainName = item.walletTypeName;

                  m.mainWalletvalue = item.value;
                  m.mainMaxValue = item.maxValue;
                  m.mainMinValue = item.minValue;
                  m.mainAlertValue = item.alertValue;

                }

              }
            }
            )
            
          }




        });
        this.displaytable = true;
      } else {
        this.walletErrorMessage = res.resultDescription;
      }
      console.log('this.walletWalletOwner' + JSON.stringify(this.walletWalletOwner));
    });
 

    console.log('walletOwner' + this.walletOwnerCode, walletOwner);

  }
  
  // ----------------------- Documents -----------------------
  // onDocumentsTabClicked() {
  //   this.docInfo = this.documentsUploadService.prepareDocNote;
  //   this.documentsUploadService.getDocumentsOfWalletOwner(this.walletOwnerCode)
  //     .subscribe(data => {
  //       if (data.resultCode === '0') {
  //         this.unchangedDocuments = data.documentUploadList;
  //         this.walletOwnerUploadedDocuments = data.documentUploadList;
  //         this.documentsUploadService.documentsTypes.subscribe(documentsTypeData => {
  //           if (documentsTypeData.resultCode === '0') {
  //             this.documentsUploadService.documentTypeResponse = documentsTypeData;
  //             this.documentsType = [{ code: '', type: 'select document' }, ...documentsTypeData.documentTypeList];
  //             this.uploadedDocumentsForm = new FormGroup({
  //               documents: this.viewOutletService.createDocumentsForm(this.walletOwnerUploadedDocuments, this.editMode),
  //               newDocuments: new FormArray([])
  //             });
  //             // console.log('--uploadedDocumentsForm--', this.uploadedDocumentsForm);
  //             // this.uploadedDocumentsForm = this.viewOutletService.createDocumentsForm(this.walletOwnerUploadedDocuments)
  //           }
  //         });
  //       } else if (data.resultCode === '1010' && this.enrollMode || this.editMode) {
  //         // this.enrolled = true;
  //         this.documentsUploadService.documentsTypes.subscribe(documentsTypeData => {
  //           if (documentsTypeData.resultCode === '0') {
  //             this.walletOwnerUploadedDocuments = [];
  //             this.documentsUploadService.documentTypeResponse = documentsTypeData;
  //             this.documentsType = [{ code: '', type: 'select document' }, ...documentsTypeData.documentTypeList];
  //             this.uploadedDocumentsForm = new FormGroup({
  //               documents: new FormArray([]),
  //               newDocuments: new FormArray([])
  //             });
  //             this.onAddDocument();
  //           }
  //         });
  //       } else {
  //         this.documentsErrorMessage = data.resultDescription;
  //       }
  //     });
  // }

  get getDocControl() {
    return (this.uploadedDocumentsForm.get('documents') as FormArray).controls;    // Typecasting to FormArray
  }

  get getNewDocControl() {
    return (this.uploadedDocumentsForm.get('newDocuments') as FormArray).controls;    // Typecasting to FormArray
  }

  // onFileSelected(fileInput: any, index: number) {
  //   this.filesNInfo[index].fileSelected = true;
  //   this.filesNInfo[index].file = fileInput.target.files[0];
  //   this.filesNInfo[index].fileName = fileInput.target.files[0].name;
  //   console.log('--file--', this.filesNInfo[index].file);
  //   const validFile = this.documentsUploadService.validFile(fileInput.target.files[0]);
  //   if (!validFile.valid) {
  //     this.documentsErrorMessage = validFile.message;
  //     setTimeout(() => {
  //       this.documentsErrorMessage = undefined;
  //     }, 5000);
  //   };
  // }

  onDownload(fileName: string): string {
    const fileURL = this.endpoints.E_WALLET_WALLET_OWNER_FILE_DOWNLOAD + this.walletOwnerCode +
      '/' + fileName;
    return fileURL;
  }

  docHandler(event: any, index: number) {
    this.filesNInfo[index].docType = event.target.value;
  }

  onAddDocument() {
    (this.uploadedDocumentsForm.get('newDocuments') as FormArray).push(new FormGroup({
      documentType: new FormControl(''),
      file: new FormControl('')
    }));
    this.filesNInfo.push({
      fileSelected: false,
      docType: undefined,
      file: undefined,
      fileName: 'choose file',
      uploadstart: false,
      uploaded: 0
    });
    console.log('--uploadedDocumentsForm--', this.uploadedDocumentsForm.getRawValue());
  }

  onRemoveDocument(index: number) {
    (this.uploadedDocumentsForm.get('newDocuments') as FormArray).removeAt(index);
    this.filesNInfo.splice(index, 1);
  }

  // showUpload(index: number): boolean {
  //   if (this.filesNInfo[index].docType && this.filesNInfo[index].fileSelected) {
  //     return this.documentsUploadService.validFile(this.filesNInfo[index].file).valid;
  //   } else {
  //     // file / type not selected
  //     return false;
  //   }
  // }

  // onUpload(index: number) {
  //   if (this.walletOwnerCode) {
  //     this.filesNInfo[index].uploadstart = true;
  //     console.log('--filesNInfo--', this.filesNInfo);
  //     const details = {
  //       fileName: this.filesNInfo[index].fileName,
  //       docTypeCode: this.filesNInfo[index].docType,
  //       walletOwnerCode: this.walletOwnerCode
  //     };

  //     this.documentsUploadService.fileUpload(this.filesNInfo[index].file, details).subscribe(event => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         this.filesNInfo[index].uploaded = Math.round(event.loaded / event.total) * 100;
  //       } else if (event.type === HttpEventType.Response) {
  //         if (event.body && event.body.resultCode === '0') {
  //           this.filesNInfo[index].uploaded = 100;
  //           this.documentsErrorMessage = undefined;
  //         } else {
  //           this.documentsErrorMessage = event.body.resultDescription;
  //           setTimeout(() => {
  //             this.documentsErrorMessage = undefined;
  //           }, 5000);
  //         }
  //       }
  //     }, error => {
  //       console.log('--error--', error);
  //       this.documentsErrorMessage = error.message;
  //       setTimeout(() => {
  //         this.documentsErrorMessage = undefined;
  //       }, 5000);
  //     });
  //   }
  // }

  
 
   
 
 
  done() {
    this.walletOwnerService.getWalletOwnerByCode(this.walletOwnerCode)
      .subscribe(walletOwnerData => {
        if (walletOwnerData.resultCode === '0') {
          this.addWalletOwnerService.walletOwnerDone(this.walletOwnerCode, walletOwnerData.walletOwner)
            .subscribe(updated => {
              if (updated.resultCode === '0') {
                if (this.addWalletOwnerService.approvalRequired) {
                  this.walletOwnerSentForApproval(walletOwnerData.walletOwner);
                } else {
                  this.router.navigate(['/merchant'], { relativeTo: this.route, queryParams: { status: 'added' } });
                }
                // this.router.navigate(['../../'], { relativeTo: this.route });
              } else {
                this.documentsErrorMessage = updated.resultDescription;
              }
            });
        } else {
          this.documentsErrorMessage = walletOwnerData.resultDescription;
        }
      });
  }

  // ---------------------------------------------------------

  navigateToStep1() {
    document.getElementById('step-1-tab').click();
  }

  navigateToStep2() {
    document.getElementById('step-2-tab').click();
  }

  navigateToStep3() {
    document.getElementById('step-3-tab').click();
  }

  navigateToStep4() {
    document.getElementById('step-4-tab').click();
  }
  navigateToStep5() {
    document.getElementById('step-5-tab').click();
  }
  // navigateToStep6() {
    
  //   document.getElementById('step-6-tab').click();
  // }

  /**
   * sent for approval for add wallet owner
   */
  walletOwnerSentForApproval(walletOwnerData: any) {
    this.addWalletOwnerService.walletOwnerApproval(walletOwnerData).subscribe(approvalResponse => {
      if (approvalResponse.resultCode === '0') {
        this.router.navigate(['/merchant'], { relativeTo: this.route, queryParams: { status: '4' } });
      } else {
        this.documentsErrorMessage = approvalResponse.resultDescription;
        console.log('--error in wallet owner approval--');
      }
    });
  }

  /**
   * sent for approval for update wallet owner
   */
  walletOwnerSentForApprovalUpdate(stage: string) {
    console.log('--walletOwnerSentForApprovalUpdate--', stage);
    if(this.walletOwnerService.approvalRequired){
    let dataApprovalRequest: any;
    let updatedInformation: any;
    let entityData: any;
    if (stage === WalletOwnerConstants.stage.BASIC_INFO) {
      entityData = this.unchangedBasicInfo;
      updatedInformation = this.viewOutletService
        .prepareBasicInfoUpdatedData(this.unchangedBasicInfo, this.basicInfoForm.getRawValue());
      if (updatedInformation && (Object.keys(updatedInformation).length === 0)) {
        //this.basicInfoErrorMessage = 'No data updated';
        this.translate.languageText('MASTER.noDataUpdated', data=> {
          this.basicInfoErrorMessage =data;
          });
           
        setTimeout(() => { this.basicInfoErrorMessage = undefined; }, 5000);
        return;
      }
    } else if (stage === WalletOwnerConstants.stage.ADDRESS) {
      entityData = this.unchangedAddress;
      updatedInformation = this.viewOutletService
        .prepareAddressUpdatedData(this.unchangedAddress, this.allAddresses.getRawValue(), this.walletOwnerCode);
      if (updatedInformation && (Object.keys(updatedInformation).length === 0)) {
        //this.addressErrorMessage = 'No data updated';
        this.translate.languageText('MASTER.noDataUpdated', data=> {
          this.addressErrorMessage =data;
          });
           
        setTimeout(() => { this.addressErrorMessage = undefined; }, 5000);
        return;
      }
    } else if (stage === WalletOwnerConstants.stage.BANK) {
      entityData = this.unchangedBankDetails;
      updatedInformation = this.viewOutletService
        .prepareBankDetailsUpdatedData(this.unchangedBankDetails, this.bankDetailsForm.getRawValue());
      if (updatedInformation && (Object.keys(updatedInformation).length === 0)) {
        //this.bankErrorMessage = 'No data updated';
        this.translate.languageText('MASTER.noDataUpdated', data=> {
          this.bankErrorMessage =data;
          });
           
        setTimeout(() => { this.bankErrorMessage = undefined; }, 5000);
        return;
      }
    }

    dataApprovalRequest = this.viewOutletService
      .prepareDataApprovalRequest(stage, this.walletOwner.code, this.walletOwner.ownerName, updatedInformation, entityData);
    console.log('--dataApprovalRequest--', dataApprovalRequest);

    this.viewOutletService.makeApprovalEntry(dataApprovalRequest)
      .subscribe(data => {
        if (data.resultCode === '0') {
          this.basicInfoSucessMessage = undefined;
          this.router.navigate(['/merchant'], { relativeTo: this.route, queryParams: { status: '4' } });
        } else {
          if (stage === WalletOwnerConstants.stage.BASIC_INFO) {
            this.basicInfoErrorMessage = data.resultDescription;
          } else if (stage === WalletOwnerConstants.stage.ADDRESS) {
            this.addressErrorMessage = data.resultDescription;
          } else if (stage === WalletOwnerConstants.stage.BANK) {
            this.bankErrorMessage = data.resultDescription;
          }
        }
      });
    }else{
      //No Approval Required
      if (stage === WalletOwnerConstants.stage.BASIC_INFO) {
           console.log('this.bankDetailsForm.getRawValue()');
           this.basicInfoService.updateWalletOwnerOutlet(this.prepareRequest(this.basicInfoForm.getRawValue()),this.walletOwner.code)
           .subscribe(data =>{
            if (data.resultCode === '0') {
            this.router.navigate(['/merchant'], { relativeTo: this.route, queryParams: { status: '2' } });
            } else{
              this.basicInfoErrorMessage  =  data.resultDescription;
            }


           });
      } 
      if (stage === WalletOwnerConstants.stage.ADDRESS) {
       
           this.addWalletOwnerService.updateAddress(this.prepareRequest(this.allAddresses.getRawValue()),this.walletOwner.code)
           .subscribe(data =>{
            if (data.resultCode === '0') {
            this.router.navigate(['/merchant'], { relativeTo: this.route, queryParams: { status: '2' } });
            } else{
              this.basicInfoErrorMessage  =  data.resultDescription;
            }
          });
      }
      if (stage === WalletOwnerConstants.stage.BANK) {
           
           this.bankDetailsService.updateBankDetailsForm(this.prepareRequest(this.bankDetailsForm.getRawValue()),this.walletOwner.code)
           .subscribe(data =>{
            if (data.resultCode === '0') {
            this.router.navigate(['/merchant'], { relativeTo: this.route, queryParams: { status: '2' } });
            } else{
              this.basicInfoErrorMessage  =  data.resultDescription;
            }
          });
      
      }
}
  }
  prepareRequest(data:any){
    let request = {
      ...data,
      state : ApprovalConstants.state.code.APPROVED
    }
    return request;
  }
  serviceErrorMessage : string;
  serviceProviderForm : FormGroup;
  serviceProviderList : any;
  serviceList : any;
  serviceCategoryList : any;
  submitted : boolean= false;
  seriveSuccessmessage: string;
  serviceProviderMaster: string;
  serviceProviderMasterName : string;
  getServiceProviderMaster(code: string){
    this.submitted = false;
    console.log('getServiceProviderMaster wallet code' + code);
    this.displaytable = false;
    this.walletOwnerService.getServiceProviderMaster(code).subscribe(res => {
      console.log('res',res);
      if (res["resultCode"] === '0') {
      
        this.serviceProviderMaster  =  res["serviceProviderMaster"].code;
        this.serviceProviderMasterName = res["serviceProviderMaster"].nameEn;
        console.log('this.serviceProviderMaster '+ this.serviceProviderMaster );
        this.walletOwnerService.getServiceProviderList(this.serviceProviderMaster).subscribe(res => {
          if ( res["resultCode"] === '0') {
            this.serviceProviderList  = res["serviceProviderList"];
            console.log('serviceProviderList' + JSON.stringify( this.serviceProviderList));
            this.displaytable = true;
          }else{
            this.serviceErrorMessage = res["resultDescription"];
            this.displaytable = true;
          }
          });
      } else{
        this.serviceErrorMessage = res["resultDescription"];
        this.displaytable = true;
      }
      this.loadServiceForm();

      
      });
  }
   onServiceClicked(){
    this.walletOwnerCode = 'TST001';
    
    this.getServiceProviderMaster(this.walletOwnerCode);
   
    this.displaytable = false;
    this.serviceErrorMessage = '';
    console.log('walletOwner' + this.walletOwnerCode);
    this.walletOwnerService.getEWALLETSERVICE().subscribe(res => {
      if (res["resultCode"] === '0') {
        this.serviceList  =  res["ewalletServiceList"];
        
         
      } 
      });
   
 
  }
  loadServiceForm(){
   
    this.serviceProviderForm = this.formBuilder.group({
      serviceCode : ['',[Validators.required]],
      serviceCategoryCode : ['',[Validators.required]],
      serviceProviderMasterCode : [this.serviceProviderMaster],
      name : [this.serviceProviderMasterName]
    })
  }
  onchangeService(event : any){
   
    this.walletOwnerService.getSeriviceCategoryByService(event.target.value).subscribe(res => {
      if (res["resultCode"] === '0') {
        this.serviceCategoryList  = res["serviceCategoryList"];
      } 
      });
  }
  get fservice(){
    return this.serviceProviderForm.controls;

  }
  onSaveService(){
    this.submitted = true;
    this.seriveSuccessmessage= '';
    this.serviceErrorMessage='';
    console.log('this.serviceProviderForm ',this.serviceProviderForm.invalid ,this.serviceProviderForm.getRawValue());
    if(this.serviceProviderForm.invalid){
      return ;
    }
 
     
    this.walletOwnerService.addServiceProvider(this.serviceProviderForm.getRawValue()).subscribe(res => {
      if (res["resultCode"] === '0') {
        this.seriveSuccessmessage  = res["resultDescription"];
       
        this.getServiceProviderMaster(this.walletOwnerCode);
        this.loadServiceForm();
      } 
      });
    
  }
  viewService(data: any){
    const modalRef = this.modalService.open(ViewOutletModalServiceComponent);
    modalRef.componentInstance.data = data;
  }
  editService(data: any){
   console.log('editservice',data);
   
    this.router.navigate(['../../editservice'], { queryParams: data, skipLocationChange: true, relativeTo: this.route });

  }
}
