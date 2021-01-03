import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
 
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ViewWalletOwnerService } from '../view-wallet-owner.service';
import { ApprovalConstants } from '../../../approval/approval.constants';
import { WalletOwnerService } from '../../wallet-owner.service';
import { TranslatelanguageService } from '../../../shared/services/translatelanguage.service';
 

@Component({
  selector: 'app-editcommmodal',
  templateUrl: './editcommmodal.component.html',
  styleUrls: ['./editcommmodal.component.css']
})
export class EditCommissionModalComponent {
  @Input() wallet;
 
  employeeId : string;
  showDateOptions: boolean= false;
  successMessage: string;
  errorMessage: string;

  @ViewChild("commisionAlertValue",{static: false}) commisionAlertValue: ElementRef;
  @ViewChild("commisionMinValue",{static: false}) commisionMinValue: ElementRef;
  @ViewChild("commisionMaxValue",{static: false}) commisionMaxValue: ElementRef;
  constructor(public activeModal: NgbActiveModal,private walletOwnerService: WalletOwnerService, private viewWalletOwnerService: ViewWalletOwnerService,  private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute,private translate : TranslatelanguageService) {


    this.ngOnInit();

  }

  ngOnInit() {

    
  }
  
  navigateToSytemUserCreation() {

    this.router.navigate(['../../'], { relativeTo: this.route });

  }


  onCancel() {


    this.router.navigate(['../../'], { relativeTo: this.route });

  }
  onSubmit(){
    
    if(this.walletOwnerService.approvalRequired){
    let updatedInformation = {
      "minValue": this.commisionMinValue.nativeElement.value,
      "maxValue": this.commisionMaxValue.nativeElement.value,
      "alertValue":this.commisionAlertValue.nativeElement.value
    }
    this.wallet = {
      ...this.wallet,
      walletTypeCode : '100009'
    }
   let dataApprovalRequest =   this.viewWalletOwnerService.prepareDataApprovalRequest('Wallet',this.wallet.code,this.wallet.walletOwnerName,updatedInformation,this.wallet)
    console.log('main dataApprovalRequest'+ dataApprovalRequest);
    this.viewWalletOwnerService.makeApprovalEntry(dataApprovalRequest)
      .subscribe(data => {
        if (data.resultCode === '0') {
           
          this.translate.languageText("WALLET.walletupdatemsg1", (data)=> { 
            this.successMessage =data;
            }); 
         
         } else {
            this.errorMessage = data.resultDescription;
        }
      });
    } 
      else{
    let request = {
      minValue: this.commisionMinValue.nativeElement.value,
      maxValue: this.commisionMaxValue.nativeElement.value,
      alertValue:this.commisionAlertValue.nativeElement.value,
      status: ApprovalConstants.status.code.ACTIVE,
      state : ApprovalConstants.state.code.APPROVED
    };
    this.viewWalletOwnerService.putWallet(request,this.wallet.code).subscribe(data => {
      if (data.resultCode === '0' || data.resultCode == '') {
        this.translate.languageText("WALLET.walletupdatemsg2", (data)=> { 
          this.successMessage =data;
          }); 
      } else {
          this.errorMessage = data.resultDescription;
      }
    });;
  } 
    
  }

}