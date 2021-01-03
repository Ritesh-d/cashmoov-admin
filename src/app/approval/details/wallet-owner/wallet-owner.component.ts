import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { DetailsWalletOwnerService } from './details-wallet-owner.service';
import { ApprovalConstants } from '../../approval.constants';

@Component({
  selector: 'app-wallet-owner',
  templateUrl: './wallet-owner.component.html',
  styleUrls: ['./wallet-owner.component.css']
})
export class WalletOwnerComponent implements OnInit {

  @Input()
  approvalData: any;
  formFields: any;
  basicInfoFormFields: any[];
  addressFormFields: any[];
  bankDetailsFormFields: any[];
  basicInfoForm: FormGroup;
  allAddresses: FormGroup;
  bankDetailsForm: FormGroup;
  updatedBasicInfo: any[];
  updatedAddress: any[];
  updatedBank: any[];
  documents: any[];
  documentsForm: FormGroup;
  documentErrorMessage: string;
  
  constructor(private detailsWalletOwnerService: DetailsWalletOwnerService) { }
  displaydocument : boolean = true;
  displaybank : boolean = true;
  ngOnInit() {
    console.log('--approvalData--', this.approvalData.entity);
    // console.log('--walletOwnerCategoryCode--', this.approvalData.entity.walletOwnerCategoryCode);
    if( this.approvalData.entity.walletOwnerCategoryCode == undefined){
      this.approvalData.entity.walletOwnerCategoryCode = '100009';
    }
   if( this.approvalData.entity.walletOwnerCategoryCode == "100006"  ||
    this.approvalData.entity.walletOwnerCategoryCode == "100007" ||
    this.approvalData.entity.walletOwnerCategoryCode == "100008" || 
    this.approvalData.entity.walletOwnerCategoryCode == "100009"||
    this.approvalData.entity.walletOwnerCategoryCode =='100010'|| 
    this.approvalData.entity.walletOwnerCategoryCode =='100012'|| 
    this.approvalData.entity.walletOwnerCategoryCode == undefined)
    {
      this.displaydocument= false; 
      if( this.approvalData.entity.walletOwnerCategoryCode == "100007" ||  this.approvalData.entity.walletOwnerCategoryCode == "100008" ||
      this.approvalData.entity.walletOwnerCategoryCode =='100012'
      ||this.approvalData.entity.walletOwnerCategoryCode =='100010' ||   this.approvalData.entity.walletOwnerCategoryCode == undefined){
        this.displaybank= false; 
      }
    }
    if (this.approvalData.status === ApprovalConstants.status.text.CREATED) {
      console.log('--created--');
      this.createdWalletOwner();
    } else if (this.approvalData.status === ApprovalConstants.status.text.UPDATED) {
      console.log('--updated--');
      this.upDatedWalletOwner();
    } else if (this.approvalData.status === ApprovalConstants.status.text.IN_PROGRESS
      && this.approvalData.updatedInformation === {} || this.approvalData.updatedInformation === undefined) {
      console.log('--IN_PROGRESS created--');
      this.createdWalletOwner();
    } else if (this.approvalData.status === ApprovalConstants.status.text.IN_PROGRESS
      && this.approvalData.updatedInformation !== {} && this.approvalData.updatedInformation !== undefined) {
      console.log('--IN_PROGRESS updated--');
      this.upDatedWalletOwner();
    } else {
      console.log('--else--', this.approvalData.status);
    }
  }

  createdWalletOwner() {
    this.detailsWalletOwnerService.fetchFormFields(this.approvalData.entity.walletOwnerCategoryCode)
      .subscribe(formFields => {
        this.formFields = formFields;
        // console.log('--formFields--', this.formFields);
        if (this.formFields.resultCode === '0') {
          this.basicInfoFormFields = this.formFields.genInfoKycList;
          this.addressFormFields = this.formFields.addressKycList;
          this.bankDetailsFormFields = this.formFields.bankKycList;
          console.log(this.approvalData.entity);
   
          this.basicInfoForm = this.detailsWalletOwnerService.createBasicInfoForm(this.basicInfoFormFields, this.approvalData.entity);
          // console.log('--basicInfoForm--', this.basicInfoForm.getRawValue());
        }
      });
  }

  upDatedWalletOwner() {
    if (this.approvalData.featureCode === ApprovalConstants.featureCode.WALLET_OWNER) {
      this.detailsWalletOwnerService.fetchFormFields(this.approvalData.entity.walletOwnerCategoryCode)
        .subscribe(formFields => {
          if (formFields.resultCode === '0') {
            this.basicInfoFormFields = formFields.genInfoKycList;
            this.basicInfoForm = this.detailsWalletOwnerService.createBasicInfoForm(this.basicInfoFormFields, this.approvalData.entity);
            this.showBasicUpdatedInfo();
          }
        });
    
      const walletOwnerCode = this.approvalData.entity.walletOwnerCode;
      this.detailsWalletOwnerService.getWalletOwnerByCode(this.approvalData.entity.walletOwnerCode)
        .subscribe(walletOwner => {
          if (walletOwner.resultCode === '0') {
            console.log('--walletOwner--', walletOwner.walletOwner.walletOwnerCategoryCode);
            this.detailsWalletOwnerService.fetchFormFields(walletOwner.walletOwner.walletOwnerCategoryCode)
              .subscribe(formFields => {
                if (formFields.resultCode === '0') {
                  this.addressFormFields = formFields.addressKycList;
                  this.bankDetailsFormFields = formFields.bankKycList;

                  if (this.approvalData.featureCode === ApprovalConstants.featureCode.WALLET_OWNER_ADDRESS) {
                    this.navigateToStep2();
                    this.showAddressUpdatedInfo();
                  }

                  if (this.approvalData.featureCode === ApprovalConstants.featureCode.WALLET_OWNER_BANK) {
                    this.navigateToStep3();
                    this.showBankUpdatedInfo();
                  }
                }
              });
          }
        });
    }

  }

  clickable(step: string) {
    if (this.approvalData.actionType === ApprovalConstants.status.text.CREATED) {
      return false;
    } else if (this.approvalData.actionType === ApprovalConstants.status.text.UPDATED) {
      if (step === 'BasicInfo' && this.approvalData.featureCode === ApprovalConstants.featureCode.WALLET_OWNER) {
        return false;
      } else if (step === 'Address' && this.approvalData.featureCode === ApprovalConstants.featureCode.WALLET_OWNER_ADDRESS) {
        return false;
      } else if (step === 'Bank' && this.approvalData.featureCode === ApprovalConstants.featureCode.WALLET_OWNER_BANK) {
        return false;
      } else if (step === 'Documents' && this.approvalData.featureCode === ApprovalConstants.featureCode.WALLET_OWNER_DOCUMENT) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  // ----------------------- BasicInfo -----------------------
  showBasicUpdatedInfo() {

    console.log('updatedInformation', this.approvalData.updatedInformation);
    this.updatedBasicInfo = this.detailsWalletOwnerService.updatedBasicInfoData(this.approvalData);
    if (this.approvalData.updatedInformation.businessName) {
      this.basicInfoForm.patchValue({ businessName: this.approvalData.updatedInformation.businessName });
    }
    if (this.approvalData.updatedInformation.businessTypeCode) {
      this.basicInfoForm.patchValue({ businessTypeCode: this.approvalData.updatedInformation.businessTypeCode });
    }
    if (this.approvalData.updatedInformation.email) {
      this.basicInfoForm.patchValue({ email: this.approvalData.updatedInformation.email });
    }
    if (this.approvalData.updatedInformation.gender) {
      this.basicInfoForm.patchValue({ gender: this.approvalData.updatedInformation.gender });
    }
    if (this.approvalData.updatedInformation.groupCode) {
      this.basicInfoForm.patchValue({ groupCode: this.approvalData.updatedInformation.groupCode });
    }
    if (this.approvalData.updatedInformation.idExpiryDate) {
      this.basicInfoForm.patchValue({ idExpiryDate: this.approvalData.updatedInformation.idExpiryDate });
    }
    if (this.approvalData.updatedInformation.idProofNumber) {
      this.basicInfoForm.patchValue({ idProofNumber: this.approvalData.updatedInformation.idProofNumber });
    }
    if (this.approvalData.updatedInformation.idProofTypeCode) {
      this.basicInfoForm.patchValue({ idProofTypeCode: this.approvalData.updatedInformation.idProofTypeCode });
    }
    if (this.approvalData.updatedInformation.issuingCountryCode) {
      this.basicInfoForm.patchValue({ issuingCountryCode: this.approvalData.updatedInformation.issuingCountryCode });
    }
    if (this.approvalData.updatedInformation.lineOfBusiness) {
      this.basicInfoForm.patchValue({ lineOfBusiness: this.approvalData.updatedInformation.lineOfBusiness });
    }
    if (this.approvalData.updatedInformation.mobileNumber) {
      this.basicInfoForm.patchValue({ mobileNumber: this.approvalData.updatedInformation.mobileNumber });
    }
    if (this.approvalData.updatedInformation.ownerName) {
      this.basicInfoForm.patchValue({ ownerName: this.approvalData.updatedInformation.ownerName });
    }
    if (this.approvalData.updatedInformation.registerCountryCode) {
      this.basicInfoForm.patchValue({ registerCountryCode: this.approvalData.updatedInformation.registerCountryCode });
    }
    console.log('--updatedBasicInfo--', this.updatedBasicInfo);
  }
  // ----------------------- Address -----------------------
  onAddressTabClicked() {
    console.log('--addressFormFields--', this.addressFormFields);
    this.detailsWalletOwnerService.getAddressDetails(this.approvalData.entity.code).subscribe(addressData => {
      if (addressData.resultCode === '0') {
        const addresses = this.detailsWalletOwnerService.createAddressForms(this.addressFormFields, addressData.addressList);
        this.allAddresses = new FormGroup({ addresses: addresses });
        console.log('--allAddresses--', this.allAddresses);
      }
    });
  }
  get getAddressesControl() {
    return (this.allAddresses.get('addresses') as FormArray).controls;    // Typecasting to FormArray
  }
  showAddressUpdatedInfo() {
    console.log('-a--', this.approvalData.entityCode);
    const newAddresses = [];
    this.approvalData.updatedInformation.addressList.forEach(element => {
      if(element.addTypeCode) {
        this.detailsWalletOwnerService.prepareNewAddressMaster();
        newAddresses.push(element);
      }
    });
    console.log('--newAddresses--', newAddresses);

    this.detailsWalletOwnerService.getAddressDetails(this.approvalData.entityCode)
      .subscribe(adressData => {
        if (adressData.resultCode === '0') {
          const addresses = this.detailsWalletOwnerService.createAddressForms(this.addressFormFields, adressData.addressList, newAddresses);
          this.allAddresses = new FormGroup({ addresses: addresses });
          this.updatedAddress = this.detailsWalletOwnerService.updatedAddressData(this.approvalData);
          console.log('--allAddresses--', this.allAddresses.getRawValue());
          console.log('--updatedAddress--', this.updatedAddress);
          if (this.approvalData.updatedInformation && this.approvalData.updatedInformation.addressList &&
            this.approvalData.updatedInformation.addressList.length > 0) {
            const _addresses = [];
            for (let j = 0; j < this.approvalData.updatedInformation.addressList.length; j++) {
              let _address: any = {};
              if (this.approvalData.updatedInformation.addressList[j].addressLine1) {
                _address.addressLine1 = this.approvalData.updatedInformation.addressList[j].addressLine1;
              }
              if (this.approvalData.updatedInformation.addressList[j].addressLine2) {
                _address.addressLine2 = this.approvalData.updatedInformation.addressList[j].addressLine2;
              }
              if (this.approvalData.updatedInformation.addressList[j].location) {
                _address.location = this.approvalData.updatedInformation.addressList[j].location;
              }
              if (this.approvalData.updatedInformation.addressList[j].countryCode) {
                _address.countryCode = this.approvalData.updatedInformation.addressList[j].countryCode;
                // console.log('--countryCode--', _address.countryCode);
              }
              if (this.approvalData.updatedInformation.addressList[j].regionCode) {
                _address.regionCode = this.approvalData.updatedInformation.addressList[j].regionCode;
                // console.log('--regionCode--', _address.regionCode);
              }
              if (this.approvalData.updatedInformation.addressList[j].city) {
                _address.city = this.approvalData.updatedInformation.addressList[j].city;
              }
              _addresses.push(_address);
            }
            // console.log('--', _addresses);
            this.allAddresses.patchValue({ addresses: _addresses });
          }

        } else {
          console.log(adressData.resultDescription);
        }
      });
  }

  // ----------------------- Bank -----------------------
  onBankDetailsTabClicked() {
    console.log('--bankDetailsFormFields--', this.bankDetailsFormFields);
    this.detailsWalletOwnerService.getBankDetails(this.approvalData.entity.code)
      .subscribe(bankData => {
        if (bankData.resultCode === '0') {
          console.log('--bankData--', bankData);
          this.bankDetailsForm = this.detailsWalletOwnerService.createBankDetailsForm(this.bankDetailsFormFields, bankData.settlementAccount);
          //console.log('--bankDetailsForm--', this.bankDetailsForm.getRawValue());
        }
      });
  }
  showBankUpdatedInfo() {
    this.detailsWalletOwnerService.getBankDetails(this.approvalData.entityCode)
      .subscribe(bankData => {
        if (bankData.resultCode === '0') {
          this.bankDetailsForm = this.detailsWalletOwnerService.createBankDetailsForm(this.bankDetailsFormFields, bankData.settlementAccount);
          console.log('updatedInformation', this.approvalData.updatedInformation);
          this.updatedBank = this.detailsWalletOwnerService.updatedBankData(this.approvalData);
          console.log('--updatedBank--', this.updatedBank);
          if (this.approvalData.updatedInformation.accountName) {
            this.bankDetailsForm.patchValue({ accountName: this.approvalData.updatedInformation.accountName });
          }
          if (this.approvalData.updatedInformation.accountNumber) {
            this.bankDetailsForm.patchValue({ accountNumber: this.approvalData.updatedInformation.accountNumber });
          }
          if (this.approvalData.updatedInformation.accountType) {
            this.bankDetailsForm.patchValue({ accountType: this.approvalData.updatedInformation.accountType });
          }
          if (this.approvalData.updatedInformation.branchName) {
            this.bankDetailsForm.patchValue({ branchName: this.approvalData.updatedInformation.branchName });
          }
          if (this.approvalData.updatedInformation.finInstitutionCode) {
            this.bankDetailsForm.patchValue({ finInstitutionCode: this.approvalData.updatedInformation.finInstitutionCode });
          }
          if (this.approvalData.updatedInformation.routingNo) {
            this.bankDetailsForm.patchValue({ routingNo: this.approvalData.updatedInformation.routingNo });
          }
        } else {
          console.log(bankData.resultDescription);
        }
      });
  }
  // ----------------------- Documents -----------------------
  onDocumentsTabClicked() {
    this.detailsWalletOwnerService.getDocumentsOfWalletOwner(this.approvalData.entity.code)
      .subscribe(data => {
        if (data.resultCode === '0') {
          this.documents = data.documentUploadList;
          this.documentsForm = new FormGroup({ documents: this.detailsWalletOwnerService.createDocumentForm(data.documentUploadList) });
        } else {
          console.log('--error in docs--');
          this.documentErrorMessage = data.resultDescription;
        }
      });
  }

  get getDocControl() {
    return (this.documentsForm.get('documents') as FormArray).controls;    // Typecasting to FormArray
  }
  onDownload(fileName: string): string {
    return this.detailsWalletOwnerService.onDownload(fileName, this.approvalData.entity.code);
  }
  // ----------------------------------------------

  navigateToStep2() {
    document.getElementById('step-2-tab').click();
  }

  navigateToStep3() {
    document.getElementById('step-3-tab').click();
  }

  showOrNot(step: string, feild: string, index?: number) {
    if (step === '1') {
      return this.detailsWalletOwnerService.showField(feild, this.updatedBasicInfo);
    } else if (step === '2') {
      // console.log(index, this.updatedAddress);
      return this.detailsWalletOwnerService.showField(feild, this.updatedAddress[index]);
      // return true;
    } else if (step === '3') {
      return this.detailsWalletOwnerService.showField(feild, this.updatedBank);
    }
    return true;
  }
}
