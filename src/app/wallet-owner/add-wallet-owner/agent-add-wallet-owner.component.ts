import { Component, OnInit, Inject } from '@angular/core';
import { WalletOwnerService } from '../wallet-owner.service';
import { FormGroup, FormArray } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { WalletOwnerModel } from '../wallet-owner.model';
import { DOCUMENT } from '@angular/common';
import { AddressService } from './address/address.service';
import { AddWalletOwnerService } from './add-wallet-owner-service';
import { BankDetailsService } from './bank-details/bank-details.service';
import { WalletOwnerConstants } from '../wallet-owner.constants';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 


@Component({
  selector: 'agent-app-add-wallet-owner',
  templateUrl: './agent-add-wallet-owner.component.html',
  styleUrls: ['./agent-add-wallet-owner.component.css']
})
export class AddAgentWalletOwnerComponent implements OnInit {

  walletOwnerForm: FormGroup;
  basicInformationForm: FormGroup;
  walletOwner: WalletOwnerModel;
  formAddresses = new FormArray([]);
  allAddress: FormGroup;
  bankformSubmitEnabled = false;
  savedAllAddress = true;
  addressFormSubmitted = false;
  bankFormSubmitted = false;
  addressErrorMessage: string;
  addressSuccessMessage: string;
  documentErrorMessage: string;
  bankErrorMessage: string;
  bankSuccessMessage: string;
  sequenceNumber: number;

  // fetchingCategory = true;
  categories: any[];
  category = '';
  formFieldsLoaded = false;
  parent: string;
  loadBank = false;
  conditionCheck = false;
  constructor(private walletOwnerService: WalletOwnerService,
    private route: ActivatedRoute,
    private addressService: AddressService,
    @Inject(DOCUMENT) document,
    private addWalletOwnerService: AddWalletOwnerService,
    private translate: TranslatelanguageService,
    private bankDetailsService: BankDetailsService,
    private router: Router) { }

  ngOnInit() {
    this.sequenceNumber = 1;
    this.route.params.subscribe((params: Params) => {
      if (params.walletOwnerCode && params.category) {
        console.log('--parentId--', params.walletOwnerCode);
        console.log('--categoryId--', params.category);
        this.parent = params.walletOwnerCode;
        this.category = params.category;
        this.addWalletOwnerService.walletOwnerParent = params.walletOwnerCode;
        this.addWalletOwnerService.selectedCategoryCode = params.category;
        this.fetchFields();
      } else {
        this.category = WalletOwnerConstants.category.INSTITUTION_CODE;
        this.fetchFields();
      }
    });

    this.walletOwnerService.categories.subscribe(categories => {
      this.categories = categories.categoryList;
    });

    this.addressService.createAllAddress();
    this.allAddress = this.addressService.allAddress;
  }

  fetchFields() {
    this.addWalletOwnerService.fetchFields(this.category).subscribe(formFields => {
      this.addWalletOwnerService.formFields = formFields;
      this.formFieldsLoaded = true;
    });
  }

  // ----------------------- Basic INFO -----------------------

  // ----------------------- Address -----------------------

  /**
   * method is to populate address form
   */
  addressLoaded() {
    this.sequenceNumber = this.sequenceNumber > 2 ? this.sequenceNumber : 2;
    if (this.addWalletOwnerService.formFields && this.allAddress.value.adresses.length === 0) {
      this.onAddAddressForm();
    }
  }

  /**
   * method is to validate all address and hit add address API
   */
  allAddressSubmit() {
    if (this.addressFormSubmitted) {
      this.navigateToStep3();
      return;
    }
    console.log('allAddressSubmit clled ');
    if (this.allAddressSaved(this.addressService.savedAddress)) {
      console.log('allAddressSubmit savedAddress ');
      // if(!this.addressSubmitDisabled){
      this.addWalletOwnerService.submitAddress(this.addressService.savedAddress)
        .subscribe(response => {
          console.log('response  ' ,response);
          if (response.resultCode === '0') {
            console.log('response.resultCode 0  ' ,response.resultCode);
            this.sequenceNumber = 3;
            this.addressErrorMessage = undefined;
            this.addressFormSubmitted = true;
            this.bankformSubmitEnabled = true;
            this.savedAllAddress = true;
            //this.addressSuccessMessage = 'Address added successfully';
            this.translate.languageText('MASTER.addressaddedsuccessfully', data=> {
              this.addressSuccessMessage =data;
              });
            setTimeout(() => {
              this.addressSuccessMessage = undefined;
              this.navigateToStep3();
            }, 5000);
          }else   if (response.resultCode === '400') {
            console.log('response.resultCode 400  ' ,response.resultCode);
            this.addressErrorMessage = response["resultDescription"];
          }
           else {
            console.log('addressErrorMessage' + this.addressErrorMessage);
            this.addressErrorMessage = response["resultDescription"];
          }
        },err => {
        this.addressErrorMessage =err.error.resultDescription;
        console.log('err',err.error.resultDescription)});
      // }else{
      //   this.addressSuccessMessage = undefined;
      //   this.navigateToStep3();
      // }
    } else {
      this.savedAllAddress = false;
    }
    document.querySelector('#addresserror').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * method is to next for address step is enabled or disabled
   */
  get addressSubmitDisabled() {
    if (this.addressFormSubmitted) {
      return true;
    } else {
      // this indicates wheather the walletOwnerId generaated or not means basic info is done or not.
      return !this.addWalletOwnerService.walletOwnerId;
    }

  }
  

  /**
   * method is to find out wheather the user saved all opened address or not
   * @param savedAddress : saved address
   */
  private allAddressSaved(savedAddress: any[]): boolean {
    for (let i = 0; i < savedAddress.length; i++) {
      if (!savedAddress[i].saved)
        return false;
    }
    return true;
  }

  /**
   * receive event that address form is saved
   * @param event 
   */
  recieveSaveAddressEvent(event: any) {
    this.savedAllAddress = event;
  }

  get getAddressesControl() {
    return this.addressService.getAddressesControl;
  }

  onAddAddressForm() {
    this.addressService.onAddAddressForm();
  }

  /**
   * submit bank details section
   */
submitBankDetailsForm() {
  if(this.bankFormSubmitted){
    this.navigateToStep4();
    return;
   }
  if(this.bankDetailsService.bankDetailsForm.invalid){
    console.log("invalid");
    this.bankFormSubmitted = true;
    //this.bankErrorMessage ="Please Enter all mandatory fields * ";
    return;
  }
  if(this.bankDetailsService.bankDetailsForm.value.accountNumber!=this.bankDetailsService.bankDetailsForm.value.confirmAccountNumber)
      { 
      //this.bankErrorMessage = "AccountNumber and  confirmAccountNumber must be same"
      this.translate.languageText('MASTER.accountNumberandconfirmAccountNumbermustbesame', data=> {
        this.bankErrorMessage =data;
        });
      return;
    }
    
  this.bankDetailsService.submitBankDetailsForm().subscribe(response => {
    if (response.resultCode === '0') {
      this.sequenceNumber = 4;
      this.bankErrorMessage = undefined;
      this.bankFormSubmitted = true;
      //this.bankSuccessMessage = 'Bank Information added successfully';
      this.translate.languageText('MASTER.bankInformationaddedsuccessfully', data=> {
        this.bankSuccessMessage =data;
        });
      setTimeout(() => {
        this.bankSuccessMessage = undefined;
       
        this.bankDetailsService.bankDetailsForm.disable();
        this.navigateToStep4();
      }, 5000);
    } else {
      this.bankErrorMessage = response.resultDescription;
    }
  });
  document.querySelector('#bankerror').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

  
  // ----------------------- Documents -----------------------

  get displayDone(): boolean {
    if (this.addressFormSubmitted && this.bankFormSubmitted) {
      return true;
    }
    return false;
  }

  finalSubmit() {
    this.walletOwnerService.getWalletOwnerByCode(this.addWalletOwnerService.walletOwnerId)
      .subscribe(walletOwnerData => {
        if (walletOwnerData.resultCode === '0') {
          this.addWalletOwnerService.walletOwnerDone(this.addWalletOwnerService.walletOwnerId, walletOwnerData.walletOwner,this.addWalletOwnerService.selectedCategoryCode)
            .subscribe(updated => {
              if (updated.resultCode === '0') {
                // if (this.addWalletOwnerService.approvalRequired) {
                  if(this.walletOwnerService.approvalRequired){
                  this.walletOwnerSentForApproval(walletOwnerData.walletOwner);
                } else {
                  this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: '1' } });
                }
              } else {
                this.documentErrorMessage = updated.resultDescription;
              }
            });
        } else {
          this.documentErrorMessage = walletOwnerData.resultDescription;
        }
      });
  }
  // ----------------------------------------------

  navigateToWalletOwners() {
  }

  navigateToStep1() {
    document.getElementById('step-1-tab').click();
  }

  navigateToStep2() {
    document.getElementById('step-2-tab').click();
    this.addressLoaded();
  }

  navigateToStep3() {
    this.loadBank = true;
    document.getElementById('step-3-tab').click();
  }

  navigateToStep4() {
    document.getElementById('step-4-tab').click();
  }

  walletOwnerSentForApproval(walletOwnerData: any) {
    this.addWalletOwnerService.walletOwnerApproval(walletOwnerData).subscribe(approvalResponse => {
      if(approvalResponse.resultCode === '0') {
        this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: '1' } });
      } else {
        this.documentErrorMessage = approvalResponse.resultDescription;
        console.log('--error in wallet owner approval--');
      }
    });
  }
}
