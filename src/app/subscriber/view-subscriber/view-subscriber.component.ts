import { Component, OnInit, Input } from '@angular/core';
import { SubscriberService } from '../subscriber.service';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ViewSubscriberService } from './view-subscriber.service';
// import { BasicInfoService } from '../add-subscriber/basic-info/basic-info.service';
import { AddSubscriberService } from '../add-subscriber/add-subscriber.service';
import { AddressService } from '../add-subscriber/address/address.service';
import { BankDetailsService } from '../add-subscriber/bank-details/bank-details.service';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { CountryService } from '../../country/country.service';
// import { DocumentsUploadService } from '../add-susbcriber/documents-upload/documents-upload.service';
import { SubscriberConstants } from '../subscriber.constants';
import { HttpEventType } from '@angular/common/http';
import { Endpoints } from '../../shared/endpoints';
 
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BasicInfoService } from '../add-subscriber/basic-info/basic-info.service';
import { formatDate } from '@angular/common';
import { ViewModalServiceComponent } from './view-modal-service/viewmodalservice.component';
import { ApprovalConstants } from '../../approval/approval.constants';
import {TranslatelanguageService} from './../../shared/services/translatelanguage.service';
import { viewModalComponent } from './view-modal/viewmodal.component';
import { EditCommissionModalComponent } from './edit-comm-model/editcommmodal.component';
import { EditMainModalComponent } from './edit-main-modal/editmainmodal.component';
@Component({
  selector: 'app-view-subscriber',
  templateUrl: './view-subscriber.component.html',
  styleUrls: ['./view-subscriber.component.scss']
})
export class ViewSubscriberComponent implements OnInit {

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
  dtOption: any = {};
  constructor(private subscriberService: SubscriberService,
    private formBuilder: FormBuilder,
    private basicInfoService: BasicInfoService,
    private router: Router,
    private route: ActivatedRoute,
    private viewSubscriberService: ViewSubscriberService,
    private addSubscriberService: AddSubscriberService,
    private addressService: AddressService,
    private bankDetailsService: BankDetailsService,
    private commonHelperService: CommonHelperService,
    private countryService: CountryService,
    private translate: TranslatelanguageService, 
    // private documentsUploadService: DocumentsUploadService,
    private modalService: NgbModal,
    private endpoints: Endpoints) {
  }
  category : string;
  showwallet: boolean= false;
  ngOnInit() {
    // console.log('--ViewSubscriberComponent ngOnInit--');
    this.filesNInfo = [];
    this.savedAddress = [];
    this.editMode = this.commonHelperService.isEditMode;
    this.enrollMode = this.commonHelperService.isEnrollMode;									  
    if(this.editMode || this.enrollMode){
      this.viewMode = false;
    }
		
    this.route.params.subscribe((params: Params) => {
      if (params.id) {

      
        this.walletOwnerCode = params.id;
        this.subscriberService.getWalletOwnerByCode(this.walletOwnerCode).subscribe(data => {
          if (data.resultCode === '0') {
            this.walletOwner = data.walletOwner;
            
           if( this.walletOwner.state == 'Approved'){
             this.showwallet= true;
           }
            this.category = this.walletOwner.walletOwnerCategoryCode
            console.log(this.showwallet,'walletOwner' , this.walletOwner.walletOwnerCategoryCode);
            this.getWalletOwnerDetails();
            if (this.route.snapshot.queryParamMap.get('stage')) {
              const stage = this.route.snapshot.queryParamMap.get('stage').toString();
              // this.enrollMode = true;
              if (stage === SubscriberConstants.stage.BASIC_INFO) {
                this.sequenceNumber = 2;
                this.navigateToStep2();
              } else if (stage === SubscriberConstants.stage.ADDRESS) {
                this.sequenceNumber = 3;
                // this.navigateToStep3();
              }
              //  else if (stage === SubscriberConstants.stage.BANK) {
              //   this.sequenceNumber = 4;
              //   this.navigateToStep4();
              // } 
              // else if (stage === SubscriberConstants.stage.DOCUMENT) {
              //   this.sequenceNumber = 4;
              //   this.navigateToStep4();
              // } 
              else if (stage === SubscriberConstants.stage.WALLET) {
                this.sequenceNumber = 5;
                this.navigateToStep5();
              }
              // else if (stage === SubscriberConstants.stage.TEMPLATE) {
              //   this.sequenceNumber = 6;
              //   this.navigateToStep6();
          
              // }
              // else {
              //   this.sequenceNumber = 4;
              //   console.log('--invalid stage--', stage);
              // }
            } else {
              this.sequenceNumber = 4;
            }
          } else {
            this.basicInfoErrorMessage = data.resultDescription;
          }
        });
       
      }
    });
   
    this.loadServiceForm();
   
   
  }
  serviceBlockType: string;
  // ----------------------- Basic INFO -----------------------

  getWalletOwnerDetails() {
    this.unchangedBasicInfo = this.walletOwner;
    this.basicInfoErrorMessage = undefined;
    this.basicInfoService.prepareMasters().subscribe(() => {
      this.contractTypes = [...this.basicInfoService.contractTypes];
      this.businessTypes = [...this.basicInfoService.businessTypes];
    });
    if (this.walletOwner.walletOwnerParentCode) {
      this.subscriberService.getWalletOwnerByCode(this.walletOwner.walletOwnerParentCode).subscribe(walletOwner => {
        this.parentWalletOwners = [{ code: walletOwner.walletOwner.code, name: walletOwner.walletOwner.ownerName }];
      });
    }
    this.addSubscriberService.categories.subscribe(categories => {
      this.categories = [...categories];
    });
    this.basicInfoService.groups.subscribe(response => {
      this.groups = [...response.groupList];
    });
    this.countryService.countries.subscribe(countriesData => {
      if (countriesData.resultCode === '0') {
        this.countryService.countryResponse = countriesData;
        this.countries = [{ code: '', name: 'select  ' }, ...countriesData.countryList];
        // this.countries = [{ code: '', name: 'select country' }];
        // this.countries.push(this.viewWalletOwnerService.getCountryOnCode(this.walletOwner.issuingCountryCode, countriesData.countryList));
        // this.countries.push(this.viewWalletOwnerService.getCountryOnCode(this.walletOwner.registerCountryCode, countriesData.countryList));
      }
    });
    this.basicInfoService.idProofTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.idProofTypeResponse = data;
        this.idProofTypes = [{ code: '', type: 'select  ' }, ...data.idProffTypeList];
      }
    });
    this.basicInfoService.genderTypes.subscribe(data => {
      if (data.resultCode === '0') {
        this.basicInfoService.genderTypeResponse = data;
        this.genders = data.genderTypeList;
      }
    });
    
    // console.log(this.walletOwner.idExpiryDate);
    this.basicInfoForm = this.viewSubscriberService.createBasicInfoForm(this.walletOwner, this.editMode);
    if(this.walletOwner.dateOfBirth){
        const [day, month, year] = formatDate(this.walletOwner.dateOfBirth, "dd/MM/yyyy", "en").split('/'); 
        this.dateOfBirth = { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
    }
    if(this.walletOwner.idExpiryDate){
      
        const [day1, month1, year1] = formatDate(this.walletOwner.idExpiryDate, "dd/MM/yyyy", "en").split('/'); 
        this.idExpiryDate = { year: parseInt(year1), month: parseInt(month1), day: parseInt(day1) };
    }
    // this.basicInfoForm.controls.idExpiryDate.patchValue({ year: parseInt(year1), month: parseInt(month1), day: parseInt(day1) })
    // this.basicInfoForm.controls.dateOfBirth.patchValue({ year: parseInt(year), month: parseInt(month), day: parseInt(day) })

  }
  idExpiryDate: NgbDateStruct;
  dateOfBirth: NgbDateStruct;
  onBasicInfoSubmit() {
    console.log('--onBasicInfoSubmit--');
    if (this.editMode) {
      console.log('--update basicInfo--');
      this.walletOwnerSentForApprovalUpdate(SubscriberConstants.stage.BASIC_INFO);
      
    } else if (this.enrollMode) {
      this.navigateToStep2();
    } else {
      this.navigateToStep2();
    }
  }

  // ----------------------- Address -----------------------

  onAddressTabClicked() {
    if (!this.allAddresses) {
      this.viewSubscriberService.getAddresses(this.walletOwnerCode).subscribe(data => {
        if (data.resultCode === '0' || (data.resultCode === '1010' && this.enrollMode)) {
          this.unchangedAddress = data.addressList;
          this.addressErrorMessage = undefined;
          this.addressService.addressTypes.subscribe(addressTypeResponse => {
            this.addressTypes = [{ code: '', type: 'select  ' }, ...addressTypeResponse.addressTypeList];
          });
          this.countryService.countries.subscribe(countriesResponse => {
            if (countriesResponse.resultCode === '0') {
              this.countries = [{ code: '', name: 'select  ' }, ...countriesResponse.countryList];
              // this.countries = [{ code: '', name: 'select country' }];
              // this.countries.push(this.viewWalletOwnerService.getCountryOnCode(this.walletOwner.issuingCountryCode, countriesResponse.countryList));
              // this.countries.push(this.viewWalletOwnerService.getCountryOnCode(this.walletOwner.registerCountryCode, countriesResponse.countryList));
            }
          });
          if (data.resultCode === '0') {
            this.addresses = this.viewSubscriberService.createAddressForms(data.addressList, this.editMode);
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
            this.addresses = this.viewSubscriberService.createAddressForms([], this.enrollMode);
          }
          this.allAddresses = new FormGroup({ addresses: this.addresses });
        } else {
          this.addressErrorMessage = data.resultDescription;
        }
      });
    }
  }

  onAddAddressForm() {
    (this.allAddresses.get('addresses') as FormArray).push(this.viewSubscriberService.blankAddressForm);
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
      this.walletOwnerSentForApprovalUpdate(SubscriberConstants.stage.ADDRESS);
      
    }
    else if (!this.editMode) {
      this.navigateToStep5();

    }else if (this.enrollMode && this.sequenceNumber === 2) {
      console.log('--add address--', this.allAddresses.value);
      this.viewSubscriberService.updateAddressData(this.walletOwnerCode, this.allAddresses.getRawValue(), true)
        .subscribe(addressdata => {
          if (addressdata.resultCode === '0') {
            this.sequenceNumber = 3;
            this.addressErrorMessage = undefined;
            this.addressSuccessMessage = '';
    this.translate.languageText('SUBSCRIBER.addressSuccesfully', data=> {  
    this.addressSuccessMessage=data;
  });

            setTimeout(() => {
              this.addressSuccessMessage = undefined;
              // this.navigateToStep3();
            }, 5000);
          } else {
            this.addressErrorMessage = addressdata.resultDescription;
          }
        });
    } else {
      // this.navigateToStep3();
    }
  }

  // ----------------------- Bank Details -----------------------

  // onBankDetailsTabClicked() {
  //   if (!this.bankDetailsForm) {
  //     this.bankDetailsService.settelementOptions.subscribe(settlementOptionsData => {
  //       if (settlementOptionsData.resultCode === '0') {
  //         this.bankDetailsService.settlementOptionsResponse = settlementOptionsData;
  //         this.settlementOptions = settlementOptionsData.finInstitutionTypeList;
  //       }
  //     });
  //     this.viewSubscriberService.getBankDetails(this.walletOwnerCode).subscribe(data => {
  //       this.bankDetailsService.bankNames(this.walletOwner.issuingCountryCode, this.walletOwner.registerCountryCode)
  //         .subscribe(bankNameResponse => {
  //           if(bankNameResponse.resultCode === '0') {
  //             this.bankNames = [{ code: '', type: 'select bank' }, ...bankNameResponse.finInstitutionList];
  //           }
  //         });
  //       this.bankDetailsService.accountTypes.subscribe(accountTypesData => {
  //         if (accountTypesData.resultCode === '0') {
  //           this.bankDetailsService.accountTypeResponse = accountTypesData;
  //           this.accountTypes = [{ code: '', type: 'select account type' }, ...accountTypesData.accountTypeList];
  //         }
  //       });
  //       if (data.resultCode === '0') {
  //         this.unchangedBankDetails = data.settlementAccount;
  //         this.bankDetailsCode = data.settlementAccount.code;
  //         this.selectedSettlementOption = {
  //           code: data.settlementAccount.finInstitutionTypeCode,
  //           type: data.settlementAccount.finInstitutionTypeName
  //         };
  //         this.bankDetailsForm = this.viewSubscriberService.createBankDetails(data.settlementAccount, this.editMode);
  //       } else if (this.enrollMode && data.resultCode === '1010') {
  //         // this.enrolled = true;
  //         this.selectedSettlementOption = {
  //           code: SubscriberConstants.identifiers.BANK_DETAILS_BANK_CODE,
  //           type: SubscriberConstants.kyc.formFieldName.BANK
  //         };
  //         this.bankDetailsForm = this.viewSubscriberService.createBankDetails([], this.enrollMode);
  //       } else {
  //         this.bankErrorMessage = data.resultDescription;
  //       }
  //     });
  //   }
  // }

  settlementOptionChanged(changedOption: any) {
    this.selectedSettlementOption = { code: changedOption.code, type: changedOption.type }
  }

  // onBankDetailsSubmit() {
  //   // console.log('--onBankDetailsSubmit--');
  //   this.addSubscriberService.walletOwnerId = this.walletOwnerCode;
  //   if (this.editMode && this.bankDetailsCode) {
  //     this.walletOwnerSentForApprovalUpdate(SubscriberConstants.stage.BANK);
     
  //   } else if (this.enrollMode && this.sequenceNumber === 3) {
  //     this.bankDetailsService.submitBankDetailsForm(this.bankDetailsForm.value).subscribe(data => {
  //       if (data.resultCode === '0') {
  //         this.bankSuccessMessage = 'Bank Info Added Successfully';
  //         this.sequenceNumber = 4;
  //         setTimeout(() => {
  //           this.bankSuccessMessage = undefined;
  //           this.navigateToStep4();
  //         }, 5000);
  //       } else {
  //         this.bankErrorMessage = data.resultDescription;
  //       }
  //     });
  //   } else {
  //     this.navigateToStep4();
  //   }
    
  // }
  
  onTemplateClicked(){
    console.log('onTemplateClicked');
    // this.navigateToStep6();
  }
  displaytable: boolean = false;
  walletErrorMessage: string;
 
  viewUser(user: any) {
    user["walletOwnerCategoryCode"] = this.walletOwner.walletOwnerCategoryCode;
    const modalRef = this.modalService.open(viewModalComponent);
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
   
    this.subscriberService.getWalletWalletOwnerByCode(this.walletOwnerCode).subscribe(res => {
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

 
  done() {
    this.subscriberService.getWalletOwnerByCode(this.walletOwnerCode)
      .subscribe(walletOwnerData => {
        if (walletOwnerData.resultCode === '0') {
          this.addSubscriberService.walletOwnerDone(this.walletOwnerCode, walletOwnerData.walletOwner)
            .subscribe(updated => {
              if (updated.resultCode === '0') {
                if (this.subscriberService.approvalRequired) {
                  this.walletOwnerSentForApproval(walletOwnerData.walletOwner);
                } else {
                  this.router.navigate(['/subscriber-owner'], { relativeTo: this.route, queryParams: { status: 'added' } });
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

  // navigateToStep3() {
  //   document.getElementById('step-3-tab').click();
  // }

  // navigateToStep4() {
  //   document.getElementById('step-4-tab').click();
  // }
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
    this.addSubscriberService.walletOwnerApproval(walletOwnerData).subscribe(approvalResponse => {
      if (approvalResponse.resultCode === '0') {
        this.router.navigate(['/subscriber-owner'], { relativeTo: this.route, queryParams: { status: '1' } });
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
    console.log('--subscriberSentForApprovalUpdate--', stage);
    if(this.subscriberService.approvalRequired){
    let dataApprovalRequest: any;
    let updatedInformation: any;
    let entityData: any;
    if (stage === SubscriberConstants.stage.BASIC_INFO) {
      entityData = this.unchangedBasicInfo;
      updatedInformation = this.viewSubscriberService
        .prepareBasicInfoUpdatedData(this.unchangedBasicInfo, this.basicInfoForm.getRawValue());
      if (updatedInformation && (Object.keys(updatedInformation).length === 0)) {
     
          this.translate.languageText('SUBSCRIBER.noDataUpdated', data=> {  
    this.basicInfoErrorMessage=data;
  });

        setTimeout(() => { this.basicInfoErrorMessage = undefined; }, 5000);
        return;
      }
    } else if (stage === SubscriberConstants.stage.ADDRESS) {
      entityData = this.unchangedAddress;
      updatedInformation = this.viewSubscriberService
        .prepareAddressUpdatedData(this.unchangedAddress, this.allAddresses.getRawValue(), this.walletOwnerCode);
      if (updatedInformation && (Object.keys(updatedInformation).length === 0)) {
              this.translate.languageText('SUBSCRIBER.noDataUpdated', data=> {  
    this.basicInfoErrorMessage=data;
  });
        setTimeout(() => { this.addressErrorMessage = undefined; }, 5000);
        return;
      }
    } 
    // else if (stage === SubscriberConstants.stage.BANK) {
    //   entityData = this.unchangedBankDetails;
    //   updatedInformation = this.viewSubscriberService
    //     .prepareBankDetailsUpdatedData(this.unchangedBankDetails, this.bankDetailsForm.getRawValue());
    //   if (updatedInformation && (Object.keys(updatedInformation).length === 0)) {
    //     this.bankErrorMessage = 'No data updated';
    //     setTimeout(() => { this.bankErrorMessage = undefined; }, 5000);
    //     return;
    //   }
    // }

    dataApprovalRequest = this.viewSubscriberService
      .prepareDataApprovalRequest(stage, this.walletOwner.code, this.walletOwner.ownerName, updatedInformation, entityData);
    console.log('--dataApprovalRequest--', dataApprovalRequest);

    this.viewSubscriberService.makeApprovalEntry(dataApprovalRequest)
      .subscribe(data => {
        if (data.resultCode === '0') {
          this.basicInfoSucessMessage = undefined;
          this.router.navigate(['/subscriber-owner'], { relativeTo: this.route, queryParams: { status: '2' } });
        } else {
          if (stage === SubscriberConstants.stage.BASIC_INFO) {
            this.basicInfoErrorMessage = data.resultDescription;
          } else if (stage === SubscriberConstants.stage.ADDRESS) {
            this.addressErrorMessage = data.resultDescription;
          } 
          // else if (stage === SubscriberConstants.stage.BANK) {
          //   this.bankErrorMessage = data.resultDescription;
          // }
        }
      });
    }else{
      //No Approval Required
      if (stage === SubscriberConstants.stage.BASIC_INFO) {
           console.log('this.bankDetailsForm.getRawValue()');
           this.basicInfoService.updateWalletOwner(this.prepareRequest(this.basicInfoForm.getRawValue()),this.walletOwner.code)
           .subscribe(data =>{
            if (data.resultCode === '0') {
            this.router.navigate(['/subscriber-owner'], { relativeTo: this.route, queryParams: { status: '2' } });
            } else{
              this.basicInfoErrorMessage  =  data.resultDescription;
            }


           });
      } 
      if (stage === SubscriberConstants.stage.ADDRESS) {
       
           this.addSubscriberService.updateAddress(this.prepareRequest(this.allAddresses.getRawValue()),this.walletOwner.code)
           .subscribe(data =>{
            if (data.resultCode === '0') {
            this.router.navigate(['/subscriber-owner'], { relativeTo: this.route, queryParams: { status: '2' } });
            } else{
              this.basicInfoErrorMessage  =  data.resultDescription;
            }
          });
      }
      if (stage === SubscriberConstants.stage.BANK) {
           
           this.bankDetailsService.updateBankDetailsForm(this.prepareRequest(this.bankDetailsForm.getRawValue()),this.walletOwner.code)
           .subscribe(data =>{
            if (data.resultCode === '0') {
            this.router.navigate(['/subscriber-owner'], { relativeTo: this.route, queryParams: { status: '2' } });
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
  onServiceClicked(){
    this.walletOwnerCode = 'TST001';
    
    this.getServiceProviderMaster(this.walletOwnerCode);
   
    this.displaytable = false;
    this.serviceErrorMessage = '';
    console.log('walletOwner' + this.walletOwnerCode);
    this.subscriberService.getEWALLETSERVICE().subscribe(res => {
      if (res["resultCode"] === '0') {
        this.serviceList  =  res["ewalletServiceList"];
        
         
      } 
      });
   
 
  }
  onSaveService(){
    this.submitted = true;
    this.seriveSuccessmessage= '';
    this.serviceErrorMessage='';
    console.log('this.serviceProviderForm ',this.serviceProviderForm.invalid ,this.serviceProviderForm.getRawValue());
    if(this.serviceProviderForm.invalid){
      return ;
    }
 
     
    this.subscriberService.addServiceProvider(this.serviceProviderForm.getRawValue()).subscribe(res => {
      if (res["resultCode"] === '0') {
        this.seriveSuccessmessage  = res["resultDescription"];
       
        this.getServiceProviderMaster(this.walletOwnerCode);
        this.loadServiceForm();
      } 
      });
    
  }
  onchangeService(event : any){
   
    this.subscriberService.getSeriviceCategoryByService(event.target.value).subscribe(res => {
      if (res["resultCode"] === '0') {
        this.serviceCategoryList  = res["serviceCategoryList"];
      } 
      });
  }
  getServiceProviderMaster(code: string){
    this.submitted = false;
    console.log('getServiceProviderMaster wallet code' + code);
    this.displaytable = false;
    this.subscriberService.getServiceProviderMaster(code).subscribe(res => {
      console.log('res',res);
      if (res["resultCode"] === '0') {
      
        this.serviceProviderMaster  =  res["serviceProviderMaster"].code;
        this.serviceProviderMasterName = res["serviceProviderMaster"].nameEn;
        console.log('this.serviceProviderMaster '+ this.serviceProviderMaster );
        this.subscriberService.getServiceProviderList(this.serviceProviderMaster).subscribe(res => {
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
  get fservice(){
    return this.serviceProviderForm.controls;

  }
  loadServiceForm(){
   
    this.serviceProviderForm = this.formBuilder.group({
      serviceCode : ['',[Validators.required]],
      serviceCategoryCode : ['',[Validators.required]],
      serviceProviderMasterCode : [this.serviceProviderMaster],
      name : [this.serviceProviderMasterName]
    })
  }
  viewService(data: any){
    const modalRef = this.modalService.open(ViewModalServiceComponent);
    modalRef.componentInstance.data = data;
  }
  editService(data: any){
    console.log('editservice',data);
    
     this.router.navigate(['../../editservice'], { queryParams: data, skipLocationChange: true, relativeTo: this.route });
 
   }

}
