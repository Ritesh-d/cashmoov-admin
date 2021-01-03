import { Component, OnInit, Input } from '@angular/core';
import { WalletOwnerService } from '../wallet-owner.service';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { ViewWalletOwnerService } from './view-wallet-owner.service';
import { BasicInfoService } from '../add-wallet-owner/basic-info/basic-info.service';
import { AddWalletOwnerService } from '../add-wallet-owner/add-wallet-owner-service';
import { AddressService } from '../add-wallet-owner/address/address.service';
import { BankDetailsService } from '../add-wallet-owner/bank-details/bank-details.service';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { CountryService } from '../../country/country.service';
import { DocumentsUploadService } from '../add-wallet-owner/documents-upload/documents-upload.service';
import { WalletOwnerConstants } from '../wallet-owner.constants';
import { HttpEventType } from '@angular/common/http';
import { Endpoints } from '../../shared/endpoints';
import { viewModalComponent } from './view-modal/viewmodal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalConstants } from '../../approval/approval.constants';
import { EditMainModalComponent } from './edit-main-modal/editmainmodal.component';
import { EditCommissionModalComponent } from './edit-comm-model/editcommmodal.component';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';


@Component({
  selector: 'app-branch-view-wallet-owner',
  templateUrl: './branch-view-wallet-owner.component.html',
  styleUrls: ['./branch-view-wallet-owner.component.css']
})
export class ViewBranchWalletOwnerComponent implements OnInit {
  templateCategoryForm: FormGroup;
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
  walletWalletOwner: any;
  state: string;
  categoryCode:any;
  showTemplate: boolean=true;
  walletOwnerName: string;
  constructor(private walletOwnerService: WalletOwnerService, private formBuilder: FormBuilder,
    private basicInfoService: BasicInfoService,
    private translate : TranslatelanguageService,
    private router: Router,
    private route: ActivatedRoute,
    private viewWalletOwnerService: ViewWalletOwnerService,
    private addWalletOwnerService: AddWalletOwnerService,
    private addressService: AddressService,
    private bankDetailsService: BankDetailsService,
    private commonHelperService: CommonHelperService,
    private countryService: CountryService,
    private documentsUploadService: DocumentsUploadService,
    private modalService: NgbModal,
    private endpoints: Endpoints) {
  }

  ngOnInit() {
    console.log('--ViewWalletOwnerComponent ngOnInit--');
    this.filesNInfo = [];
    this.savedAddress = [];
    this.editMode = this.commonHelperService.isEditMode;
    this.state ="";
    
    this.enrollMode = this.commonHelperService.isEnrollMode;									  
    if(this.editMode || this.enrollMode){
      this.viewMode = false;
    }
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
             if (this.route.snapshot.queryParamMap.get('code')) {
          const code = this.route.snapshot.queryParamMap.get('code').toString();
          this.addWalletOwnerService.selectedCategoryCode=code;
         }
        this.walletOwnerCode = params.id;
        this.walletOwnerService.getWalletOwnerByCode(this.walletOwnerCode).subscribe(data => {
          if (data.resultCode === '0') {
            this.walletOwner = data.walletOwner;
            this.walletOwnerName=this.walletOwner.ownerName;
             this.state=this.walletOwner.state;
             if(this.state !='Approved'){
              this.showTemplate =false;
            }
             this.addWalletOwnerService.selectedCategoryCode=this.walletOwner.walletOwnerCategoryCode;
             this.categoryCode=this.addWalletOwnerService.selectedCategoryCode;
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
                this.navigateToStep4();
              } else if (stage === WalletOwnerConstants.stage.DOCUMENT) {
                this.sequenceNumber = 4;
                this.navigateToStep4();
              } else if (stage === WalletOwnerConstants.stage.WALLET) {
                this.sequenceNumber = 5;
                this.navigateToStep5();

              }
              else if (stage === WalletOwnerConstants.stage.TEMPLATE) {
                this.sequenceNumber = 6;
                this.navigateToStep6();

              }
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
        // this.countries = [{ code: '', name: 'select country' }, ...countriesData.countryList];
        this.countries = [{ code: '', name: 'select country' }];
        if(this.walletOwner.issuingCountryCode===undefined)
        this.countries = [{ code: '', name: 'select country' }, ...countriesData.countryList]
        else
        this.countries.push(this.viewWalletOwnerService.getCountryOnCode(this.walletOwner.issuingCountryCode, countriesData.countryList));
        this.countries.push(this.viewWalletOwnerService.getCountryOnCode(this.walletOwner.registerCountryCode, countriesData.countryList));
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
    console.log(this.walletOwner.idExpiryDate);
    this.basicInfoForm = this.viewWalletOwnerService.createBasicInfoForm(this.walletOwner, this.editMode);
  }
  

  onBasicInfoSubmit() {
    console.log('--onBasicInfoSubmit--');
    if (this.editMode) {
      console.log('--update basicInfo--');
      this.walletOwnerSentForApprovalUpdate(WalletOwnerConstants.stage.BASIC_INFO);
      /*this.viewWalletOwnerService.updateBasicInfo(this.walletOwnerCode, this.basicInfoForm.getRawValue())
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
      this.viewWalletOwnerService.getAddresses(this.walletOwnerCode).subscribe(data => {
        if (data.resultCode === '0' || (data.resultCode === '1010' && this.enrollMode)) {
          this.unchangedAddress = data.addressList;
          this.addressErrorMessage = undefined;
          this.addressService.addressTypes.subscribe(addressTypeResponse => {
            this.addressTypes = [{ code: '', type: 'select address type' }, ...addressTypeResponse.addressTypeList];
          });
          this.countryService.countries.subscribe(countriesResponse => {
            if (countriesResponse.resultCode === '0') {
              // this.countries = [{ code: '', name: 'select country' }, ...countriesResponse.countryList];
              this.countries = [{ code: '', name: 'select country' }];
              if(this.walletOwner.issuingCountryCode===undefined) 
              this.countries = [{ code: '', name: 'select country' }, ...countriesResponse.countryList];
              else
               this.countries.push(this.viewWalletOwnerService.getCountryOnCode(this.walletOwner.issuingCountryCode, countriesResponse.countryList));
               this.countries.push(this.viewWalletOwnerService.getCountryOnCode(this.walletOwner.registerCountryCode, countriesResponse.countryList));
              }
          });
          if (data.resultCode === '0') {
            this.addresses = this.viewWalletOwnerService.createAddressForms(data.addressList, this.editMode);
            if(data.addressList[0]!=undefined){
            this.countryService.regions.subscribe(regionsResponse => {
              if (regionsResponse.resultCode === '0') {
                this.countryService.regionResponse = regionsResponse;
               
                this.regions = this.addressService.regions(data.addressList[0].countryCode);
              }
            
            
            });
          }else{
            
          }
          } else {
            // this.enrolled = true;
            // addNewAddress: is for new address means enrolled user only
            // this.addNewAddress = true;
            this.addresses = this.viewWalletOwnerService.createAddressForms([], this.enrollMode);
          }
          this.allAddresses = new FormGroup({ addresses: this.addresses });
        } else {
          this.addressErrorMessage = data.resultDescription;
        }
      });
    }
  }

  onAddAddressForm() {
    (this.allAddresses.get('addresses') as FormArray).push(this.viewWalletOwnerService.blankAddressForm);
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
    if (this.editMode) {
      console.log('--update address--', this.allAddresses.getRawValue());
      this.walletOwnerSentForApprovalUpdate(WalletOwnerConstants.stage.ADDRESS);
      // this.viewWalletOwnerService.updateAddressData(this.walletOwnerCode, this.allAddresses.getRawValue())
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
    } else if (this.enrollMode && this.sequenceNumber === 2) {
      console.log('--add address--', this.allAddresses.value);
      this.viewWalletOwnerService.updateAddressData(this.walletOwnerCode, this.allAddresses.getRawValue(), true)
        .subscribe(addressdata => {
          if (addressdata.resultCode === '0') {
            this.sequenceNumber = 3;
            this.addressErrorMessage = undefined;
            //this.addressSuccessMessage = 'Address Added Succesfully';
            this.translate.languageText('MASTER.addressaddedsuccessfully', data=> {
              this.addressSuccessMessage =data;
              });
            setTimeout(() => {
              this.addressSuccessMessage = undefined;
              this.navigateToStep3();
            }, 5000);
          } else {
            this.addressErrorMessage = addressdata.resultDescription;
          }
        });
    } else {
      this.navigateToStep3();
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
      this.viewWalletOwnerService.getBankDetails(this.walletOwnerCode).subscribe(data => {
        this.bankDetailsService.bankNames(this.walletOwner.issuingCountryCode, this.walletOwner.registerCountryCode)
          .subscribe(bankNameResponse => {
            if (bankNameResponse.resultCode === '0') {
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
          this.bankDetailsForm = this.viewWalletOwnerService.createBankDetails(data.settlementAccount, this.editMode);
        } else if (this.enrollMode &&  (data.resultCode === '1010' 
        || data.resultCode === '1053')) {
          // this.enrolled = true;
          this.selectedSettlementOption = {
            code: WalletOwnerConstants.identifiers.BANK_DETAILS_BANK_CODE,
            type: WalletOwnerConstants.kyc.formFieldName.BANK
          };
          this.bankDetailsForm = this.viewWalletOwnerService.createBankDetails([], this.enrollMode);
          this.bankDetailsForm.get('accountType').setValue('');
          this.bankDetailsForm.get('finInstitutionCode').setValue('');
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
    if(this.bankDetailsForm.invalid){
      this.translate.languageText('MASTER.invalidBackDetail', data=> {
        this.bankErrorMessage =data;
        });
      return;
    }
    this.addWalletOwnerService.walletOwnerId = this.walletOwnerCode;
    if (this.editMode && this.bankDetailsCode) {
      this.walletOwnerSentForApprovalUpdate(WalletOwnerConstants.stage.BANK);
      /*this.viewWalletOwnerService.updateBankDetails(this.bankDetailsCode,
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
          //this.bankSuccessMessage = 'Bank Info Added Successfully';
          this.translate.languageText('MASTER.bankInformationaddedsuccessfully', data=> {
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
   //Template Start
   walletOwnerTemplateList: any;
   templateCategoryList: any;
   templateList: any;
   templaterrormessage: string;
   isdelete: boolean = false;
   resultArr = [];
   onAddTemplate() {
     let selectedCategory = [];
     this.  resultArr = [];
     console.log('resultArr', this.resultArr);
     this.resultArr = this.resultArr.concat((this.templateCategoryForm.get('templateCategoryOfList') as FormArray).getRawValue());
 
     selectedCategory = (this.templateCategoryForm.get('templateCategory') as FormArray).getRawValue();
     console.log('selectedCategory', selectedCategory);
  
     
      this.resultArr= this.resultArr.concat(selectedCategory);
      this.resultArr = this.resultArr.filter(function (el) {
       return el.templateCategory != null;
     });
     console.log('resultArr', this.resultArr);
 
       if(this.resultArr && this.templateCategoryList){
        this.resultArr.forEach(m=>{
    
         this.templateCategoryList.forEach(m2=>{
           if( m2.code == m.templateCategory){
              m2.disabled = true;
           } 
         })
         
        
       })
     }
     console.log('after templateCategoryList', this.templateCategoryList);
     (this.templateCategoryForm.get('templateCategory') as FormArray).push(new FormGroup({
       // code: new FormControl(),
       templateCategory: new FormControl(),
       templateName: new FormControl(),
       templateCategoryName : new FormControl(),
       templateNameName: new FormControl(),
       walletOwnerCode: new FormControl(this.walletOwnerCode),
       walletOwnerName: new FormControl(this.walletOwnerName),
       state: new FormControl(''),
     }));   
   }
   onDelete(index: number,template:FormGroup) {
    
     console.log('code template ',template.controls["templateCategory"].value);
     if( template.controls["templateCategory"].value != null){
     this.templateCategoryList.forEach(m2=>{
       if( m2.code == template.controls["templateCategory"].value){
          m2.disabled = false;
       } 
     })
     }
     console.log('onDelete templateCategoryList', this.templateCategoryList);
     (this.templateCategoryForm.get('templateCategory') as FormArray).removeAt(index);
   }
   get getTemplatesControl() {
     return (this.templateCategoryForm.get('templateCategory') as FormArray).controls;
   }
   get getTemplatesControlOfList() {
     console.log('formarray ', (this.templateCategoryForm.get('templateCategoryOfList') as FormArray).controls);
     return (this.templateCategoryForm.get('templateCategoryOfList') as FormArray).controls;
   }
 
  
 
   getAllTemplate() {
     this.walletOwnerService.getTemplateByCategory('100000').subscribe(res => {
       if (res["resultCode"] === '0') {
         this.servicetemplateList =  res["templateList"] 
         // this.servicetemplateList=[{code:"",name:"Select"},...this.servicetemplateList];  
       } else {
         this.templaterrormessage = res["resultDescription"];
         
       }
     });
     this.walletOwnerService.getTemplateByCategory('100002').subscribe(res => {
       if (res["resultCode"] === '0') {
         this.feetemplateList = res["templateList"];
         // this.feetemplateList=[{code:"",name:"Select"},...this.feetemplateList];  
       } else {
         this.templaterrormessage = res["resultDescription"];
       }
     });
     this.walletOwnerService.getTemplateByCategory('100009').subscribe(res => {
       if (res["resultCode"] === '0') {
         this.feeCommisiontemplateList = res["templateList"];
         // this.feeCommisiontemplateList=[{code:"",name:"Select"},...this.feeCommisiontemplateList];  
       } else {
         this.templaterrormessage = res["resultDescription"];
       }
     });
     // this.walletOwnerService.getTemplateByCategory('100001').subscribe(res => {
     //   if (res["resultCode"] === '0') {
     //     this.transtemplateList = res["templateList"];
     //   } else {
     //     this.templaterrormessage = res["resultDescription"];
     //   }
     // });
     this.walletOwnerService.getTemplateByCategory('100008').subscribe(res => {
       if (res["resultCode"] === '0') {
         this.transLimitemplateList = res["templateList"];
         // this.transLimitemplateList=[{code:"",name:"Select"},...this.transLimitemplateList];  
       } else {
         this.templaterrormessage = res["resultDescription"];
       }
     });
   }
   templateSuccessMessage :string='';
   templatErrormessage : string='';
   setTemplateControl($event,template: FormGroup){
    
       let templateName = $event.target.options[$event.target.options.selectedIndex].text;
       template.controls["templateNameName"].setValue(templateName);
   
   }
   onChangeTemplateCategory($event,template: FormGroup){
 
     let templateCategoryName = $event.target.options[$event.target.options.selectedIndex].text;
     template.controls["templateCategoryName"].setValue(templateCategoryName);
 
   }
   onChangeTemplate($event,template: FormGroup){
 
     let templateName = $event.target.options[$event.target.options.selectedIndex].text;
     template.controls["templateNameName"].setValue(templateName);
     // template.controls["templateNameOld"].setValue(templateName);
     
 
   }
   onSaveTemplate() {
     //this.templaterrormessage= 'Technical Failed';
  
       let template =(this.templateCategoryForm.get('templateCategoryOfList') as FormArray).getRawValue();
       let templatenew =(this.templateCategoryForm.get('templateCategory') as FormArray).getRawValue();
 
       console.log('template' , template);
       let walletOwnerTemplateList :any[]=[];
       template.forEach(element=>{
         walletOwnerTemplateList.push({
           code : element.code,
           walletOwnerCode : element.walletOwnerCode,
           walletOwnerName: element.walletOwnerName,
           templateCategoryCode :  element.templateCategory,
           templateCode :  element.templateName,
           templateName : element.templateNameName,
           templateCategoryName: element.templateCategoryName
         })
       });
       if(templatenew){
         templatenew.forEach(element=>{
           walletOwnerTemplateList.push({
             // code : element.code,
             walletOwnerCode : element.walletOwnerCode,
             walletOwnerName: element.walletOwnerName,
             templateCategoryCode :  element.templateCategory,
             templateCode :  element.templateName,
             templateName : element.templateNameName,
             templateCategoryName: element.templateCategoryName
           })
         });
      }
      let  updatedInformation = {walletOwnerTemplateList : walletOwnerTemplateList}
      console.log('updatedInformation'  ,updatedInformation);
      let dataApprovalRequest =   this.viewWalletOwnerService.prepareDataApprovalRequest('Template',this.walletOwnerCode,this.walletOwnerName,updatedInformation,this.walletOwner)
      console.log('template dataApprovalRequest'+ dataApprovalRequest);
      this.viewWalletOwnerService.makeApprovalEntry(dataApprovalRequest)
        .subscribe(data => {
          if (data.resultCode === '0') {
            this.translate.languageText("WALLET.templateupdatemsg", (data)=> { 
              this.templateSuccessMessage =data;
              }); 
          } else {
              this.templatErrormessage = data.resultDescription;
          }
        });
 
   }
   servicetemplateList: any;
   feetemplateList: any;
   feeCommisiontemplateList: any;
   transtemplateList: any;
   transLimitemplateList: any;
   onTemplateClicked() {
     this.resultArr = [];
     this.templaterrormessage = undefined;
     this.templatErrormessage = undefined;
     this.templateSuccessMessage = undefined;
  
     this.templateCategoryForm = this.formBuilder.group({
       templateCategory: new FormArray([]),
       templateCategoryOfList: new FormArray([])
     });
     this.walletOwnerTemplateList = [];
     this.getAllTemplate();
     this.templaterrormessage = '';
     this.viewWalletOwnerService.getWalletOwnerTemplate(this.walletOwnerCode).subscribe(res => {
       if (res.resultCode === '0') {
         this.walletOwnerTemplateList = res["walletOwnerTemplateList"];
         
         this.walletOwnerTemplateList.forEach(element => {
             console.log('elemet of template ' , element );
         
           (this.templateCategoryForm.get('templateCategoryOfList') as FormArray).push(new FormGroup({
             templateCategory: new FormControl({ value: element.templateCategoryCode, disabled: true }),
             code: new FormControl(element.code),
             templateName: new FormControl(element.templateCode),
             templateCategoryName : new FormControl(element.templateCategoryName),
             // templateNameOld : new FormControl(element.templateCategoryName),
             templateNameName: new FormControl(element.templateName),
             walletOwnerCode: new FormControl(element.walletOwnerCode),
             walletOwnerName: new FormControl(element.walletOwnerName),
             state: new FormControl(element.state),
            
        
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
   viewTemplate(index: number,temp : FormGroup){
       console.log('index of form' , index);
     //  let template =  ((this.templateCategoryForm.get('templateCategoryOfList') as FormArray).getRawValue())[index];
       let template = temp.getRawValue()
      
      
       
       var tmp =
       {
         code:  template.templateName,   
         name: template.templateNameName,  
         state: template.state,
         editMode : this.editMode,
         walletOwnerCategoryName: template.walletOwnerName,
         walletOwnerCategoryCode : template.walletOwnerCode,
         templateCategoryName: template.templateCategoryName,
         templateCategoryCode: template.templateCategory,  
         redirectedFrom : WalletOwnerConstants.redirectedFrom.WALLETOWNER   
       };
   
 
       let  data : any;
       if (template.templateCategory == 100000 ) {
      
         this.router.navigate(['../../../templates/createServiceTemplate'], { relativeTo: this.route, skipLocationChange: true, 
           queryParams:  { data: JSON.stringify(data), temp: JSON.stringify(tmp), display: 'none' } });
       } 
       else if (template.templateCategory == 100002) {
         this.router.navigate(['../../../templates/createFeeTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(data), temp: JSON.stringify(tmp), display: 'none' } });
   
       }
       else if (template.templateCategory == 100009) {
         this.router.navigate(['../../../templates/createFeeCommisionTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(data), temp: JSON.stringify(tmp), display: 'none' } });
   
       }
       else if (template.templateCategory == 100008) {
         this.router.navigate(['../../../templates/tranLimitTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(data), temp: JSON.stringify(tmp), display: 'none' } });
   
       } 
       else if (template.templateCategory == 100010) {
         this.router.navigate(['../../../templates/createIncentiveTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(data), temp: JSON.stringify(tmp), display: 'block' } });
   
       }
     }
     //Template End
     displaytable: boolean = false;
     walletErrorMessage: string;
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
  viewUser(user: any) {
    user["walletOwnerCategoryCode"] = this.walletOwner.walletOwnerCategoryCode;
    const modalRef = this.modalService.open(viewModalComponent);
    modalRef.componentInstance.user = user;
    //this.router.navigate( ['view', userid], {relativeTo: this.route} );
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
  onDocumentsTabClicked() {
    this.docInfo = this.documentsUploadService.prepareDocNote;
    this.documentsUploadService.getDocumentsOfWalletOwner(this.walletOwnerCode)
      .subscribe(data => {
        if (data.resultCode === '0') {
          this.unchangedDocuments = data.documentUploadList;
          this.walletOwnerUploadedDocuments = data.documentUploadList;
          this.documentsUploadService.documentsTypes.subscribe(documentsTypeData => {
            if (documentsTypeData.resultCode === '0') {
              this.documentsUploadService.documentTypeResponse = documentsTypeData;
              this.documentsType = [{ code: '', type: 'select document' }, ...documentsTypeData.documentTypeList];
              this.uploadedDocumentsForm = new FormGroup({
                documents: this.viewWalletOwnerService.createDocumentsForm(this.walletOwnerUploadedDocuments, this.editMode),
                newDocuments: new FormArray([])
              });
              // console.log('--uploadedDocumentsForm--', this.uploadedDocumentsForm);
              // this.uploadedDocumentsForm = this.viewWalletOwnerService.createDocumentsForm(this.walletOwnerUploadedDocuments)
            }
          });
        } else if ((data.resultCode === '1010' || data.resultCode === '1032') && this.enrollMode || this.editMode) {
          // this.enrolled = true;
          this.documentsUploadService.documentsTypes.subscribe(documentsTypeData => {
            if (documentsTypeData.resultCode === '0') {
              this.walletOwnerUploadedDocuments = [];
              this.documentsUploadService.documentTypeResponse = documentsTypeData;
              this.documentsType = [{ code: '', type: 'select document' }, ...documentsTypeData.documentTypeList];
              this.uploadedDocumentsForm = new FormGroup({
                documents: new FormArray([]),
                newDocuments: new FormArray([])
              });
              this.onAddDocument();
            }
          });
        } else {
          this.documentsErrorMessage = data.resultDescription;
        }
      });
  }

  get getDocControl() {
    return (this.uploadedDocumentsForm.get('documents') as FormArray).controls;    // Typecasting to FormArray
  }

  get getNewDocControl() {
    return (this.uploadedDocumentsForm.get('newDocuments') as FormArray).controls;    // Typecasting to FormArray
  }

  onFileSelected(fileInput: any, index: number) {
    this.filesNInfo[index].fileSelected = true;
    this.filesNInfo[index].file = fileInput.target.files[0];
    this.filesNInfo[index].fileName = fileInput.target.files[0].name;
    console.log('--file--', this.filesNInfo[index].file);
    const validFile = this.documentsUploadService.validFile(fileInput.target.files[0]);
    if (!validFile.valid) {
      this.documentsErrorMessage = validFile.message;
      setTimeout(() => {
        this.documentsErrorMessage = undefined;
      }, 5000);
    };
  }

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

  showUpload(index: number): boolean {
    if (this.filesNInfo[index].docType && this.filesNInfo[index].fileSelected) {
      return this.documentsUploadService.validFile(this.filesNInfo[index].file).valid;
    } else {
      // file / type not selected
      return false;
    }
  }

  onUpload(index: number) {
    if (this.walletOwnerCode) {
      this.filesNInfo[index].uploadstart = true;
      console.log('--filesNInfo--', this.filesNInfo);
      const details = {
        fileName: this.filesNInfo[index].fileName,
        docTypeCode: this.filesNInfo[index].docType,
        walletOwnerCode: this.walletOwnerCode
      };

      this.documentsUploadService.fileUpload(this.filesNInfo[index].file, details).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.filesNInfo[index].uploaded = Math.round(event.loaded / event.total) * 100;
        } else if (event.type === HttpEventType.Response) {
          if (event.body && event.body.resultCode === '0') {
            this.filesNInfo[index].uploaded = 100;
            this.documentsErrorMessage = undefined;
          } else {
            this.documentsErrorMessage = event.body.resultDescription;
            setTimeout(() => {
              this.documentsErrorMessage = undefined;
            }, 5000);
          }
        }
      }, error => {
        console.log('--error--', error);
        this.documentsErrorMessage = error.message;
        setTimeout(() => {
          this.documentsErrorMessage = undefined;
        }, 5000);
      });
    }
  }

  done() {
    this.walletOwnerService.getWalletOwnerByCode(this.walletOwnerCode)
      .subscribe(walletOwnerData => {
        if (walletOwnerData.resultCode === '0') {
          this.addWalletOwnerService.walletOwnerDone(this.walletOwnerCode, walletOwnerData.walletOwner,this.addWalletOwnerService.selectedCategoryCode)
            .subscribe(updated => {
              if (updated.resultCode === '0') {
                if (this.walletOwnerService.approvalRequired) {
                  this.walletOwnerSentForApproval(walletOwnerData.walletOwner);
                } else {
                  this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: 'added' } });
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
  navigateToStep6() {
    document.getElementById('step-6-tab').click();
  }

  /**
   * sent for approval for add wallet owner
   */
  walletOwnerSentForApproval(walletOwnerData: any) {
    this.addWalletOwnerService.walletOwnerApproval(walletOwnerData).subscribe(approvalResponse => {
      if (approvalResponse.resultCode === '0') {
        this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: '1' } });
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
      updatedInformation = this.viewWalletOwnerService
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
      updatedInformation = this.viewWalletOwnerService
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
      updatedInformation = this.viewWalletOwnerService
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

    dataApprovalRequest = this.viewWalletOwnerService
      .prepareDataApprovalRequest(stage, this.walletOwner.code, this.walletOwner.ownerName, updatedInformation, entityData);
    console.log('--dataApprovalRequest--', dataApprovalRequest);

    this.viewWalletOwnerService.makeApprovalEntry(dataApprovalRequest)
      .subscribe(data => {
        if (data.resultCode === '0') {
          this.basicInfoSucessMessage = undefined;
          this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: '2' } });
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
    } else{
        //No Approval Required
        if (stage === WalletOwnerConstants.stage.BASIC_INFO) {
          console.log('this.bankDetailsForm.getRawValue()');
          this.basicInfoService.updateWalletOwner(this.prepareRequest(this.basicInfoForm.getRawValue()),this.walletOwner.code)
          .subscribe(data =>{
           if (data.resultCode === '0') {
           this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: '2' } });
           } else{
             this.basicInfoErrorMessage  =  data.resultDescription;
           }


          });
     } 
     if (stage === WalletOwnerConstants.stage.ADDRESS) {
      
          this.addWalletOwnerService.updateAddress(this.prepareRequest(this.allAddresses.getRawValue()),this.walletOwner.code)
          .subscribe(data =>{
           if (data.resultCode === '0') {
           this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: '2' } });
           } else{
             this.basicInfoErrorMessage  =  data.resultDescription;
           }
         });
     }
     if (stage === WalletOwnerConstants.stage.BANK) {
          
          this.bankDetailsService.updateBankDetailsForm(this.prepareRequest(this.bankDetailsForm.getRawValue()),this.walletOwner.code)
          .subscribe(data =>{
           if (data.resultCode === '0') {
           this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: '2' } });
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
}
