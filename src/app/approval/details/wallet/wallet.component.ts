import { Component, OnInit, Input } from '@angular/core';
 
 

 import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { ApprovalService } from '../../approval.service';
import { DetailsService } from '../details.service';
 @Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {



  @Input() approvalData: any;
  data: any;
  updatedInfo: any;
  wallet: any;
  
 
 
  // unchanged = {

  //   name: true,

  //   walletOwnerCategoryName: true,
  //   status: true,


  // };

  constructor(private modalService: NgbModal, private commonHelperService: CommonHelperService, private detailService: DetailsService, private approvalService: ApprovalService) { }

  errorMessage: string;

  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log('fee this.updatedInfo', this.updatedInfo);
    console.log('fee this.approvalData', this.approvalData.actionType);
    console.log('this.approvalData', this.approvalData);
    this.getDetail();
  }

  async getDetail() {

     
    if (this.approvalData.entity) {

      this.wallet = this.approvalData.entity;

    }
    console.log('this.wallet',this.wallet);
  



  }
  

}
