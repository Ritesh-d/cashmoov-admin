import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
 
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ViewWalletOwnerService } from '../view-wallet-owner.service';
import { WalletOwnerService } from '../../wallet-owner.service';
import { ApprovalConstants } from '../../../approval/approval.constants';
import { TranslatelanguageService } from '../../../shared/services/translatelanguage.service';
 

@Component({
  selector: 'app-editmainmodal',
  templateUrl: './editmainmodal.component.html',
  styleUrls: ['./editmainmodal.component.css']
})
export class EditMainModalComponent {
  @Input() wallet;
  @ViewChild("mainAlertValue",{static: false}) mainAlertValue: ElementRef;
  @ViewChild("mainMinValue",{static: false}) mainMinValue: ElementRef;
  @ViewChild("mainMaxValue",{static: false}) mainMaxValue: ElementRef;
  employeeId : string;
  showDateOptions: boolean= false;
  // mainAlertValue : string;
  // mainMinValue : string;
  // mainMaxValue : string;
  constructor(private translate : TranslatelanguageService,public activeModal: NgbActiveModal,private walletOwnerService: WalletOwnerService,private viewWalletOwnerService: ViewWalletOwnerService,   private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute) {


    this.ngOnInit();

  }

  ngOnInit() {

    if (this.wallet) {
      console.log('walletOwner', this.wallet);
    }
  }
  
  navigateToSytemUserCreation() {

    this.router.navigate(['../../'], { relativeTo: this.route });

  }


  onCancel() {


    this.router.navigate(['../../'], { relativeTo: this.route });

  }
  
 
 
successMessage: string;
errorMessage: string;
  onSubmit(){
 
 if(this.walletOwnerService.approvalRequired){
    let updatedInformation = {
      "minValue": this.mainMinValue.nativeElement.value,
      "maxValue": this.mainMaxValue.nativeElement.value,
      "alertValue":this.mainAlertValue.nativeElement.value
    }
    this.wallet = {
      ...this.wallet,
      walletTypeCode : '100008'
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
  }else{
    let request = {
      minValue: this.mainMinValue.nativeElement.value,
      maxValue: this.mainMaxValue.nativeElement.value,
      alertValue:this.mainAlertValue.nativeElement.value,
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
    });
  }
  }

}