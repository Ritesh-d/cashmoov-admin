import { Component, OnInit, Inject } from '@angular/core';
import { SubscriberService } from '../subscriber.service';
import { FormGroup, FormArray } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { SubscriberModel } from './../subscriber-model';
import { DOCUMENT } from '@angular/common';
import { AddressService } from './address/address.service';
import { AddSubscriberService } from './add-subscriber.service';
import { BankDetailsService } from './bank-details/bank-details.service';
import { SubscriberConstants } from './../subscriber.constants';
import { Observable } from 'rxjs';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-add-subscriber',
  templateUrl: './add-subscriber.component.html',
  styleUrls: ['./add-subscriber.component.scss']
})
export class AddSubscriberComponent implements OnInit {

  subscriberForm: FormGroup;
  basicInformationForm: FormGroup;
  subscriber: SubscriberModel;
  formAddresses = new FormArray([]);
  allAddress: FormGroup;
  bankformSubmitEnabled = false;
  savedAllAddress = true;
  savedAllAddressSpace = true;
  addressFormSubmitted = false;
  bankFormSubmitted = false;
  addressErrorMessage: string;
  addressSuccessMessage: string;
  documentErrorMessage: string;
  bankErrorMessage: string;
  bankSuccessMessage: string;
  sequenceNumber: number; 
  categories: any[];
  category = '';
  formFieldsLoaded = false;
  parent: string;
  loadBank = false;
  checkSpace="1";

  constructor(private subscriberService: SubscriberService,
    private route: ActivatedRoute,
    private addressService: AddressService,
    @Inject(DOCUMENT) document,
    private addSubscriberService: AddSubscriberService,
    private translate: TranslatelanguageService,
    private bankDetailsService: BankDetailsService,
    private router: Router) {  

     }

  ngOnInit() {

    this.sequenceNumber = 1;
    this.route.params.subscribe((params: Params) => {
      
        if (  params.category) {

        // console.log('--parentId--', params.walletOwnerCode);
        console.log('--categoryId--', params.category);
        // this.parent = params.walletOwnerCode;
        this.category = params.category;               
        this.fetchFields();
      } else {
        this.category = SubscriberConstants.category.SUBSCRIBER;
        this.fetchFields();
      }
    });

    this.subscriberService.categories.subscribe(categories => {
      this.categories = categories.categoryList;
    });

    this.addressService.createAllAddress();
    this.allAddress = this.addressService.allAddress;

  }

  fetchFields() {
    this.addSubscriberService.fetchFields(this.category).subscribe(formFields => {
      this.addSubscriberService.formFields = formFields;
      this.formFieldsLoaded = true;
    });
  }

  addressLoaded() {
    this.sequenceNumber = this.sequenceNumber > 2 ? this.sequenceNumber : 2;
    if (this.addSubscriberService.formFields && this.allAddress.value.adresses.length === 0) {
      this.onAddAddressForm();
    }
  }

  /**
   * method is to validate all address and hit add address API
   */
  allAddressSubmit() {
     
    this.checkSpace="1";
    console.log("space validation before =="+this.checkSpace);
    if(this.checkBlankSpaceAddress(this.addressService.savedAddress)==="2"){     
      this.savedAllAddress = false;
     // this.addressErrorMessage = "Only blank space is not allowed in address";
     this.translate.languageText('MASTER.onlyblankspaceisnotallowedinaddress', data=> {
      this.addressErrorMessage =data;
      });
      console.log("space validation after =="+this.checkSpace)
    }
    else if (this.allAddressSaved(this.addressService.savedAddress)) {
      this.addSubscriberService.submitAddress(this.addressService.savedAddress)
        .subscribe((response) => {
          if (response.resultCode === '0') {
            this.sequenceNumber = 3;
            this.addressErrorMessage = undefined;
            this.addressFormSubmitted = true;
            this.bankformSubmitEnabled = true;
            this.savedAllAddress = true;
            //this.addressSuccessMessage = 'Address added successfully';
            this.translate.languageText('MASTER.addressaddedsuccessfully', data=> {
              this.addressSuccessMessage=data;
              });
            setTimeout(() => {
              this.addressSuccessMessage = undefined;
              // this.navigateToStep3();
              this.router.navigate(['/subscriber-owner'], { relativeTo: this.route, queryParams: { status: '1' } });
            }, 5000);
          } else {
            this.addressErrorMessage = response.resultDescription;
          }
        });
    } else {
      this.savedAllAddress = false;
    }
  }

  /**
   * method is to next for address step is enabled or disabled
   */
  get addressSubmitDisabled() {
    if (this.addressFormSubmitted) {
      return true;
    } else {
      // this indicates wheather the walletOwnerId generaated or not means basic info is done or not.
      return !this.addSubscriberService.walletOwnerId;
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
   * method is to find out wheather the user saved all blank space address or not
   * @param savedAddress : saved address  
   */
  checkBlankSpaceAddress(savedAddress: any[]): string {

    this.checkSpace="1"; 
    savedAddress.forEach(element => {
     
      if(/^\s+$/.test(element.address.addressLine1)){  
             this.checkSpace="2";       
      }
      else if(/^\s+$/.test(element.address.addressLine2)){
        this.checkSpace="2";
      }
      else if(/^\s+$/.test(element.address.city)){
        this.checkSpace="2";
      }
      else if(/^\s+$/.test(element.address.location)){
        this.checkSpace="2";
      }
            
     });
    
     return this.checkSpace;
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

  // ----------------------- Bank Details -----------------------

  /**
   * submit bank details section
   */
  submitBankDetailsForm() {
    this.bankDetailsService.submitBankDetailsForm().subscribe(response => {
      if (response.resultCode === '0') {
        this.sequenceNumber = 4;
        this.bankErrorMessage = undefined;
        this.bankFormSubmitted = true;
        //this.bankSuccessMessage = 'Bank INformation added successfully';
        this.translate.languageText('MASTER.bankInformationaddedsuccessfully', data=> {
          this.bankSuccessMessage =data;
          });
          
        setTimeout(() => {
          this.bankSuccessMessage = undefined;
          this.navigateToStep4();
        }, 5000);
      } else {
        this.bankErrorMessage = response.resultDescription;
      }
    });
  }

  // ----------------------- Documents -----------------------

  get displayDone(): boolean {
    if (this.addressFormSubmitted && this.bankFormSubmitted) {
      return true;
    }
    return false;
  }

  finalSubmit() {
    console.log('finalSubmit');
    if(!this.savedAllAddress){
        return;
    }
    this.subscriberService.getWalletOwnerByCode(this.addSubscriberService.walletOwnerId)
      .subscribe(walletOwnerData => {
        if (walletOwnerData.resultCode === '0') {
          this.addSubscriberService.walletOwnerDone(this.addSubscriberService.walletOwnerId, walletOwnerData.walletOwner)
            .subscribe(updated => {
              if (updated.resultCode === '0') {
                if (this.addSubscriberService.approvalRequired) {
                if (this.subscriberService.approvalRequired) {
                  
                  this.walletOwnerSentForApproval(walletOwnerData.walletOwner);
                } else {
                 this.router.navigate(['/subscriber-owner'], { relativeTo: this.route, queryParams: { status: '1' } });
                }
              } else {
                this.documentErrorMessage = updated.resultDescription;
              }}
            });
        } else {
          this.documentErrorMessage = walletOwnerData.resultDescription;
        }
      });
  }
  // ----------------------------------------------

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
    this.addSubscriberService.walletOwnerApproval(walletOwnerData).subscribe(approvalResponse => {
      if(approvalResponse.resultCode === '0') {
        this.router.navigate(['/subscriber-owner'], { relativeTo: this.route, queryParams: { status: '1' } });

        // this.router.navigate(['/wallet-owner'], { relativeTo: this.route, queryParams: { status: '1' } });
      } else {
        this.documentErrorMessage = approvalResponse.resultDescription;
        console.log('--error in wallet owner approval--');
      }
    });
  }

  onAddAddressForm() {
    this.addressService.onAddAddressForm();
  }

}
