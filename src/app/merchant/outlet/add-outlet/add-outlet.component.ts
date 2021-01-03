import { Component, OnInit, Inject } from '@angular/core';
import { MerchantService } from '../../merchant.service';
import { FormGroup, FormArray } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
 
import { DOCUMENT } from '@angular/common';
import { OutletAddressService } from './address/address.service';
import { AddOuletService } from './add-outlet-service';
 
import { WalletOwnerConstants } from '../../wallet-owner.constants';
import { MerchantModel } from '../../merchant.model';
import { TranslatelanguageService } from '../../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.css']
})
export class AddOutletComponent implements OnInit {

  getcurrentLang:any;
  walletOwnerForm: FormGroup;
  basicInformationForm: FormGroup;
  walletOwner: MerchantModel;
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
  nextClicked: boolean;

  constructor(private walletOwnerService: MerchantService,
    private route: ActivatedRoute,
    private translate : TranslatelanguageService,
    private addressService: OutletAddressService,
    @Inject(DOCUMENT) document,
    private addOuletService: AddOuletService,
    private router: Router) { 
      this.getcurrentLang=this.translate.getcurrentLang();
    }

  ngOnInit() {
    this.sequenceNumber = 1;
 
    this.category =  WalletOwnerConstants.category.OUTLET_CODE //'100012';
    this.fetchFields();

     

    this.addressService.createAllAddress();
    this.allAddress = this.addressService.allAddress;
  }

  fetchFields() {
    this.addOuletService.fetchFields(this.category).subscribe(formFields => {
      this.addOuletService.formFields = formFields;
      this.formFieldsLoaded = true;
    });
  }

  
  addressLoaded() {
    this.sequenceNumber = this.sequenceNumber > 2 ? this.sequenceNumber : 2;
    if (this.addOuletService.formFields && this.allAddress.value.adresses.length === 0) {
      this.onAddAddressForm();
    }
  }

  /**
   * method is to validate all address and hit add address API
   */
  allAddressSubmit() {
    
    if (this.allAddressSaved(this.addressService.savedAddress)) {
      this.addOuletService.submitAddress(this.addressService.savedAddress)
        .subscribe((response) => {
          if (response.resultCode === '0') {
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
              // this.navigateToStep3();
            }, 5000);
          } else {
            this.addressErrorMessage = response.resultDescription;
          }
        });
    } else {
      this.savedAllAddress = false;
    }
    // document.querySelector('#errmsgadd').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

   
  get addressSubmitDisabled() {
    if (this.addressFormSubmitted) {
      return true;
    } else {
      // this indicates wheather the walletOwnerId generaated or not means basic info is done or not.
      return !this.addOuletService.walletOwnerId;
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

  // ----------------------- Bank Details -----------------------

  /**
   * submit bank details section
   */
  // submitBankDetailsForm() {
    
  //   if(this.bankDetailsService.bankDetailsForm.invalid){
  //     console.log("invalid");
  //     this.bankFormSubmitted = true;
  //     //this.bankErrorMessage ="Please Enter all mandatory fields * ";
  //     return;
  //   }
  //   if(this.bankDetailsService.bankDetailsForm.value.accountNumber!=this.bankDetailsService.bankDetailsForm.value.confirmAccountNumber)
  //       { 
  //       this.bankErrorMessage = "AccountNumber and  confirmAccountNumber must be same"
  //       return;
  //     }
  //   this.bankDetailsService.submitBankDetailsForm().subscribe(response => {
  //     if (response.resultCode === '0') {
  //       this.sequenceNumber = 4;
  //       this.bankErrorMessage = undefined;
  //       this.bankFormSubmitted = true;
  //       this.nextClicked=true;
  //       this.bankSuccessMessage = 'Bank Information added successfully';
  //       setTimeout(() => {
  //         this.bankSuccessMessage = undefined;
  //         this.navigateToStep4();
  //       }, 5000);
        
  //     } else {
  //       this.bankErrorMessage = response.resultDescription;
  //     }
  //   });
  //   // document.querySelector('#errmsgbank').scrollIntoView({ behavior: 'smooth', block: 'center' });
  // }

  // ----------------------- Documents -----------------------

  get displayDone(): boolean {
    if (this.addressFormSubmitted && this.bankFormSubmitted) {
      return true;
    }
    return false;
  }

  finalSubmit() {
    if(!this.savedAllAddress){
 
      return;
    }
    this.walletOwnerService.getWalletOwnerByCode(this.addOuletService.walletOwnerId)
      .subscribe(walletOwnerData => {
        if (walletOwnerData.resultCode === '0') {
          this.addOuletService.walletOwnerDone(this.addOuletService.walletOwnerId, walletOwnerData.walletOwner)
            .subscribe(updated => {
              if (updated.resultCode === '0') {
                // if (this.addOuletService.approvalRequired) {
                  if (this.walletOwnerService.approvalRequired) {
                  
                  this.walletOwnerSentForApproval(walletOwnerData.walletOwner);
                } else {
                 this.router.navigate(['/merchant'], { relativeTo: this.route, queryParams: { status: '3' } });
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

  // navigateToStep3() {
  //   this.loadBank = true;
  //   document.getElementById('step-3-tab').click();
  // }

  // navigateToStep4() {
  //   document.getElementById('step-4-tab').click();
  // }

  walletOwnerSentForApproval(walletOwnerData: any) {
    this.addOuletService.walletOwnerApproval(walletOwnerData).subscribe(approvalResponse => {
      if(approvalResponse.resultCode === '0') {
        this.router.navigate(['/merchant'], { relativeTo: this.route, queryParams: { status: '4' } });

        // this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: '1' } });
      } else {
        this.documentErrorMessage = approvalResponse.resultDescription;
        console.log('--error in wallet owner approval--');
      }
    });
  }
}
