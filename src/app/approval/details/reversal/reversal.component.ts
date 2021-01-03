  import { Component, Input, OnInit } from '@angular/core';
  import { LoadMoneyService } from '../../../loadmoney/loadmoneyservice.service';
  import { ApprovalConstants } from '../../approval.constants';
  import { ApprovalService } from '../../approval.service';
  import { DetailsService } from '../details.service';
  
  @Component({
    selector: 'app-reversal',
    templateUrl: './reversal.component.html' 
  })
  export class ReversalComponent implements OnInit {
    @Input() approvalData: any;
    @Input() entityCode: string;
    updatedInfo: any;
    statusName: string;
    walletOperation: any;
    errorMessage: string;
    unchanged = {
      transTypeName: true,
     transactionId: true,
     srcWalletOwnerCode: true,
     desWalletOwnerCode: true,
     srcWalletCode: true,
     desWalletCode: true,
     srcWalletOwnerName: true,
     desWalletOwnerName: true,
     transactionAmount: true,
     fee: true, 
     status: true
    };
  
    constructor(
      private loadMoneyService: LoadMoneyService,
      private approvalService: ApprovalService,
      private detailService: DetailsService
    ) {}
  
    ngOnInit() {
      this.updatedInfo = this.approvalData.updatedInformation;
      console.log(" this.updatedInfo", this.updatedInfo);
      console.log(" this.approvalData", this.approvalData.actionType);
      this.walletOperation = this.approvalData.entity;
      console.log("Entity----", this.walletOperation);
      this.getLoad();
    }
  
    async getLoad() {
      this.walletOperation = this.approvalData.entity;
      if (this.approvalData.actionType == ApprovalConstants.status.text.UPDATED || this.approvalData.actionType == ApprovalConstants.status.text.CLAIMED) {
        this.compareChanges();
      }
    }
  
    compareChanges() {
      if (this.updatedInfo) {
        if (this.updatedInfo.status) {
          this.statusName = this.approvalService.getValueOnCode(this.updatedInfo.status	);
        }
  
        if (this.updatedInfo.status && this.walletOperation.status != this.updatedInfo.status) {
          this.unchanged.status = false;
        }
  
        if (this.updatedInfo.transTypeName && this.walletOperation.transTypeName != this.updatedInfo.transTypeName) {
          this.unchanged.transTypeName = false;
        } 
        if (this.updatedInfo.transactionId && this.walletOperation.transactionId != this.updatedInfo.transactionId) {
          this.unchanged.transactionId = false;
        } 

        if (this.updatedInfo.srcWalletOwnerCode && this.walletOperation.srcWalletOwnerCode != this.updatedInfo.srcWalletOwnerCode) {
          this.unchanged.srcWalletOwnerCode = false;
        } 


        if (this.updatedInfo.desWalletOwnerCode && this.walletOperation.desWalletOwnerCode != this.updatedInfo.desWalletOwnerCode) {
          this.unchanged.desWalletOwnerCode = false;
        } 
        if (this.updatedInfo.srcWalletCode && this.walletOperation.srcWalletCode != this.updatedInfo.srcWalletCode) {
          this.unchanged.srcWalletCode = false;  
        } 

        if (this.updatedInfo.desWalletCode && this.walletOperation.desWalletCode != this.updatedInfo.desWalletCode) {
          this.unchanged.desWalletCode = false;
        } 


        if (this.updatedInfo.srcWalletOwnerName && this.walletOperation.srcWalletOwnerName != this.updatedInfo.srcWalletOwnerName) {
          this.unchanged.srcWalletOwnerName = false;
        } 


        if (this.updatedInfo.desWalletOwnerName && this.walletOperation.desWalletOwnerName != this.updatedInfo.desWalletOwnerName) {
          this.unchanged.desWalletOwnerName = false;
        } 
        if (this.updatedInfo.transactionAmount && this.walletOperation.transactionAmount != this.updatedInfo.transactionAmount) {
          this.unchanged.transactionAmount = false;
        } 

        if (this.updatedInfo.fee && this.walletOperation.fee != this.updatedInfo.fee) {
          this.unchanged.fee = false;
        }

     
 






      }
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
    
  
  