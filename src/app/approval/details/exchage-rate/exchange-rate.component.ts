import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';
import { ExchangerateService } from '../../../exchangerate/ExchangerateService.service';
import { Constants } from '../../../exchangerate/exchangerate.constant';
@Component({
  selector: 'app-exchangerate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.css']
})
export class ExchangeRateComponent implements OnInit {

  
  @Input() entityCode :string;
  @Input() approvalData : any;
  data : any;
  updatedInfo : any;
  countries :any ;
  sendingCurrencyName :string ;
  receivingCurrencyName :string ;
  sendingCountryName :string ;
  receivingContryName :string ;
  sendingAgentName :string ;
  receivingAgentName :string ;
  sendingBranchName :string ;
  receivingBranchName :string ;
  sendingInstituteName : string;
  receivingInstitureName: string;

  unchanged = {
    name: true,
    value: true,
    sendCurrencyCode: true,
    receiveCurrencyCode: true ,
    sendCountryCode: true,
    receiveCountryCode: true,
    remitAgentCode:true ,
    payAgentCode: true,
    remitBranchCode: true,
    payBranchCode: true,
    status: true,
    remitInstituteCode : true,
    payInstituteCode: true

      
  };
  constructor(private  detailService : DetailsService,private approvalService: ApprovalService,private exchangerateService : ExchangerateService,) { }
 
  errorMessage: string;
  
  ngOnInit() {
       this.updatedInfo = (this.approvalData.updatedInformation);
      console.log(' this.updatedInfo' , this.updatedInfo);
      console.log(' this.approvalData' , this.approvalData.actionType);
      this.getDetail();
  }

  async getDetail() {
    
    this.data = this.approvalData.entity;
 console.log('data from approval' ,this.data);
      if(this.approvalData.actionType== ApprovalConstants.status.text.UPDATED || this.approvalData.actionType==  ApprovalConstants.status.text.CLAIMED ){
       this.compareChanges();
      }
      // else{
      //   this.getValueByCode(this.data.sendCurrencyCode,this.data.receiveCurrencyCode,this.data.receiveCountryCode,this.data.sendCountryCode,
      //     this.data.remitAgentCode ,this.data.payAgentCode,this.data.remitBranchCode,this.data.payBranchCode);

      // }
 
    
   }
  compareChanges(){
      if(this.updatedInfo)  {
          if(this.updatedInfo.status){
          this.updatedInfo.status = this.approvalService.getValueOnCode(this.updatedInfo.status);
          }
          if(this.updatedInfo.name && this.data.name != this.updatedInfo.name){
            this.unchanged.name= false;
           }
           if(this.updatedInfo.sendCurrencyCode && this.data.sendCurrencyCode != this.updatedInfo.sendCurrencyCode){
            this.unchanged.sendCurrencyCode= false;
           }
           if(this.updatedInfo.receiveCurrencyCode && this.data.receiveCurrencyCode != this.updatedInfo.receiveCurrencyCode){
            this.unchanged.receiveCurrencyCode= false;
           }
           if(this.updatedInfo.sendCountryCode && this.data.sendCountryCode != this.updatedInfo.sendCountryCode){
            this.unchanged.sendCountryCode= false;
           }
           if(this.updatedInfo.receiveCountryCode && this.data.receiveCountryCode != this.updatedInfo.receiveCountryCode){
            this.unchanged.receiveCountryCode= false;
           }
           if(this.updatedInfo.remitAgentCode && this.data.remitAgentCode != this.updatedInfo.remitAgentCode){
            this.unchanged.remitAgentCode= false;
           }
           if(this.updatedInfo.payAgentCode && this.data.name != this.updatedInfo.payAgentCode){
            this.unchanged.payAgentCode= false;
           }

           if(this.updatedInfo.remitBranchCode && this.data.name != this.updatedInfo.remitBranchCode){
            this.unchanged.remitBranchCode= false;
           }
           if(this.updatedInfo.payBranchCode && this.data.payBranchCode != this.updatedInfo.payBranchCode){
            this.unchanged.payBranchCode= false;
           }
           if(this.updatedInfo.value && this.data.value != this.updatedInfo.value){
            this.unchanged.value= false;
           }      

           this.getValueByCode(this.updatedInfo.sendCurrencyCode,this.updatedInfo.receiveCurrencyCode,this.updatedInfo.receiveCountryCode,this.updatedInfo.sendCountryCode,
            this.updatedInfo.remitAgentCode ,this.updatedInfo.payAgentCode,this.updatedInfo.remitBranchCode,this.updatedInfo.payBranchCode,
            this.updatedInfo.remitInstituteCode,this.updatedInfo.payInstituteCode);
      
        }
    }

    getValueByCode(sendCurrencyCode,receiveCurrencyCode,receiveCountryCode,sendCountryCode,
      remitAgentCode ,payAgentCode,remitBranchCode,payBranchCode,remitInstituteCode,payInstituteCode){

        console.log('sendCurrencyCode'+sendCurrencyCode);
        console.log('receiveCurrencyCode'+receiveCurrencyCode);
        console.log('receiveCountryCode'+receiveCountryCode);
        console.log('sendCountryCode'+sendCountryCode);
        console.log('remitAgentCode'+remitAgentCode);
        console.log('payAgentCode'+payAgentCode);
        console.log('remitBranchCode'+remitBranchCode);
        console.log('payBranchCode'+payBranchCode);

      this.detailService.getByCode(ApprovalConstants.featureName.CURRENCY, sendCurrencyCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.sendingCurrencyName = response.currency.name;
        } else {
          this.sendingCurrencyName = '';
        }   
       
      });
      this.detailService.getByCode(ApprovalConstants.featureName.CURRENCY, receiveCurrencyCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.receivingCurrencyName = response.currency.name;
        } else {
          this.receivingCurrencyName = '';
        }
      });
      this.detailService.getByCode(ApprovalConstants.featureName.COUNTRY, receiveCountryCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.receivingContryName = response.country.name;
        } else {
          this.receivingContryName = '';
        }
      });
      this.detailService.getByCode(ApprovalConstants.featureName.COUNTRY, sendCountryCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.sendingCountryName = response.country.name;
        } else {
          this.sendingCountryName = '';
        }
      });
      this.detailService.getByCode(ApprovalConstants.featureName.WALLET_OWNER, remitAgentCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.sendingAgentName = response.walletOwner.ownerName;
        } else {
          this.sendingAgentName = '';
        }
      });
     
      this.detailService.getByCode(ApprovalConstants.featureName.WALLET_OWNER, payAgentCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.receivingAgentName = response.walletOwner.ownerName;
        } else {
          this.receivingAgentName = '';
        }
      });
      this.detailService.getByCode(ApprovalConstants.featureName.WALLET_OWNER, remitBranchCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.sendingBranchName = response.walletOwner.ownerName;
        } else {
          this.sendingBranchName = '';
        }
      });
      this.detailService.getByCode(ApprovalConstants.featureName.WALLET_OWNER, payBranchCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.receivingBranchName = response.walletOwner.ownerName;
        } else {
          this.receivingBranchName = '';
        }
      });
      this.detailService.getByCode(ApprovalConstants.featureName.WALLET_OWNER, remitInstituteCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.sendingInstituteName = response.walletOwner.ownerName;
        } else {
          this.sendingInstituteName = '';
        }
      });
      this.detailService.getByCode(ApprovalConstants.featureName.WALLET_OWNER, payInstituteCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.receivingInstitureName = response.walletOwner.ownerName;
        } else {
          this.receivingInstitureName = '';
        }
      });

    }
  }
