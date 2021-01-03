import { ApprovalConstants } from './../../approval/approval.constants';
import { Component, OnInit, PipeTransform, Pipe, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
 import {CommonService} from './../../shared/services/common.service';
 import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
 import { WallettransferService } from './../wallettransfer.service';
 import { Endpoints } from './../../shared/endpoints'; 
 import { DataTableDirective } from 'angular-datatables';
 import { CommonHelperService } from '../../shared/services/common-helper-service';
 import {TranslatelanguageService} from './../../shared/services/translatelanguage.service';
@Component({
  selector: 'app-createtransfer',
  templateUrl: './createtransfer.component.html',
  styleUrls: ['./createtransfer.component.css']
})
export class CreatetransferComponent implements OnInit { 
 wallettransferForm: FormGroup;  
 transactionBtn:boolean=false;
 amountDisplay:number=0;
 TrustAccount:string='100006' 
 loaderData: boolean = false;
 fetchingData: boolean = false;
 datagrid: any;
 dtOption: any = {};
  errorMessages: any=[];
 public openPopupData:any = {};
walletOwner:any=[];
taxConfigurationList:any=[]; 
  confirmArr: any=[];
successMessage:string='';  
errorMessage:string='';  
confirmShowHide:string='';
setPermission: any;
  sendingCurrencys: any=[{ currencyCode: '', currencyName: 'Select' }];
  receiverCurrencys: any=[{ currencyCode: '', currencyName: 'Select' }];
  trustaccountArr: any=[{ code: '', ownerName: 'Select' }];

receiverwalletOwnerCode:string=''; 
walletOwnerCode:string='';  //mahi  WLT9964//branch WLT8967 WLT9961 WLT8966/WLT9965
 
AgentCountryCode:string=''; //100102 100102 100016 //mahi
UserType:string=''; 
 institutionArr: any=[{ code: '', ownerName: 'Select' }];
 agentArr: any=[{ code: '', ownerName: 'Select' }];
 branchArr: any=[{ code: '', ownerName: 'Select' }];
receiverCurrencyValue:string='';
sendingCurrencyValue:string='';
sendingcurrencySymbol:string='';
receivercurrencySymbol:string='';
receiverOwnerName:string='';
senderOwnerName:string='';
exchangeRateCode:string='';
categories : any;
 
 
 


  constructor( 
    private modalService: NgbModal,
    private commonHelperService: CommonHelperService,
     private fb:FormBuilder, 
          private endpoints:Endpoints,  
    private commonService:CommonService,
    private translate:TranslatelanguageService,
    private wallettransferService:WallettransferService,
   ) {  

  }





  ngOnInit() {

    this.setPermission = this.wallettransferService.setPermission;
 console.log(this.wallettransferService.approvalRequired,"approvalRequired");
  this.dtOption = this.commonHelperService.settingDataTable();
console.log(this.dtOption);
//  this.getwalletOwner('100000,100009');
 this.viewList();
 
  this.errorMessages = {      
     'amount': [  { type: 'required', message: '' },{ type: 'pattern', message: '' }  ],
    'sendingcurrency': [  { type: 'required', message: '' } ],
    'receivercurrency': [  { type: 'required', message: '' } ], 
   'trustaccount': [  { type: 'required', message: '' } ],
   'institutions': [  { type: 'required', message: '' } ],
   

 }

 this.wallettransferForm=this.fb.group({ 
       "trustaccount":['', Validators.required], 
       "institutions":['', Validators.required],   
       "amount":['',[Validators.required,Validators.pattern('^[0-9.]+$') ]], 
       "sendingcurrency":['', Validators.required],   
       "receivercurrency":['', Validators.required],    
       "rate":'',   
       "amounttoPaid":''
      })

 

 this.walletFormErrorLanguage();

this.wallettransferService.getTrustAccount(this.TrustAccount).subscribe(data => {
 //console.log("sendingCurrencys",data);
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.trustaccountArr =[{ code: '', ownerName: 'Select' }, ...data["walletOwnerList"]] 
 
      }
 
       else {
   
        // this.errorMessage = data.resultDescription;
         this.commonService.scrollToElement('#transfer_wrap');
      }
    }, error => {
      console.log('--error--', error);
 
      // this.errorMessage = error.error.resultDescription;
       this.commonService.scrollToElement('#transfer_wrap');
    });

    this.wallettransferService.callGetWalletOwnerCategory().subscribe(x => {
			this.categories = x["categoryList"];
			if (this.categories)
				// this.categories = this.categories.filter(s => s.code == "100006" || s.code == "100008");
				this.categories =  this.categories.filter(m=>{
					return m.transferAllowed
				})
		});
 

  }
 
  getWalletAccount(event: any): any[] {
     
    console.log('event.target.value'+ event.target.value);
		this.wallettransferService.callGetWalletOwner(event.target.value).subscribe(x => {
      if(x["resultCode"]=='0'){
        this.institutionArr = x["walletOwnerList"];
      }else{
        this.institutionArr=[];
      }
    });
    this.institutionArr=[{code:"",ownerName:"Select"},...this.institutionArr];  
		return this.institutionArr;
	}


 viewList(){ 
   this.loaderData = true;
   this.fetchingData = false;

 this.wallettransferService.getListWalletTransfer().subscribe(data => {
 //console.log("getListWalletTransfer",data);
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.loaderData = false;
             this.datagrid = data["walletTransferList"];

      this.fetchingData = true;



      }
 
       else {
   
        this.errorMessage = data.resultDescription;
         this.commonService.scrollToElement('#transfer_wrap');
      }
    }, error => {
      console.log('--error--', error);
 
      this.errorMessage = error.error.resultDescription;
       this.commonService.scrollToElement('#transfer_wrap');
    });


}
  

onChangeSelect($event,type){
  let code=$event.target.value; 

     let selectEl = $event.target; 

     let registerCountryCode =selectEl.options[selectEl.selectedIndex].getAttribute('registerCountryCode')
     if(registerCountryCode){ 
     	if(type=='institution'){
     	this.receiverCurrencyValue= registerCountryCode;   
     this.receiverOwnerName=selectEl.options[selectEl.selectedIndex].getAttribute('ownerName')
     
     if(code){
 this.receiverCurrencyCode(code);  
 
  } 

 }else{
this.sendingCurrencyValue= registerCountryCode;   
     this.senderOwnerName=selectEl.options[selectEl.selectedIndex].textContent;	
      if(code){
  this.senderCurrencyCode(code); 
 
  } 

 }
     


     }

 

 

}

senderCurrencyCode(walletOwnerCode){
  this.wallettransferForm.controls.sendingcurrency.setValue('');
this.walletOwnerCode=walletOwnerCode;
   this.wallettransferService.getByCodeCurrency(walletOwnerCode).subscribe(data => {
  //console.log("sendingCurrencys",data);
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.sendingCurrencys =[{ currencyCode: '', currencyName: 'Select' }, ...data["walletOwnerCountryCurrencyList"]] 
 
      }
 
       else {
   
        this.errorMessage = data.resultDescription;
         this.commonService.scrollToElement('#transfer_wrap');
      }
    }, error => {
      console.log('--error--', error);
 
      this.errorMessage = error.error.resultDescription;
       this.commonService.scrollToElement('#transfer_wrap');
    });

}
receiverCurrencyCode(walletOwnerCode){
  this.wallettransferForm.controls.receivercurrency.setValue('');
this.receiverwalletOwnerCode=walletOwnerCode;
   this.wallettransferService.getByCodeCurrency(walletOwnerCode).subscribe(data => {
  //console.log("receiverCurrencys",data);
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.receiverCurrencys =[{ currencyCode: '', currencyName: 'Select' }, ...data["walletOwnerCountryCurrencyList"]] 
 
      }
 
       else {
   
        this.errorMessage = data.resultDescription;
         this.commonService.scrollToElement('#transfer_wrap');
      }
    }, error => {
      console.log('--error--', error);
 
      this.errorMessage = error.error.resultDescription;
       this.commonService.scrollToElement('#transfer_wrap');
    });

}
 
 


 
 

getwalletOwner(walletOwners){
  //  this.wallettransferService.walletOwnerCategoryCode(walletOwners).subscribe(data => {
    this.wallettransferService.walletOwnerallCategoryCode().subscribe(data => {
    
 console.log("getwalletOwner",data);
      if (data.resultCode === '0') {
        this.errorMessage = undefined; 
 var walletOwner=data["walletOwnerList"];
//  console.log('walletOwner' , walletOwner);
 walletOwner = walletOwner.filter(s => {
  console.log('walletOwnerCategoryCode' , s.walletOwnerCategoryCode);
  if(s.walletOwnerCategoryCode =="100009" || s.walletOwnerCategoryCode =="100000"  ){
    return s;
  }
});
// if(walletOwners=='100000'){
this.institutionArr=[{code:"",ownerName:"Select",registerCountryCode:""},...walletOwner];  
 
// } 
      }
 
       else {
   
        this.errorMessage = data.resultDescription;
        this.commonService.scrollToElement('#transfer_wrap');
      }
    }, error => {
      console.log('--error--', error);
 
      this.errorMessage = error.error.resultDescription;
      this.commonService.scrollToElement('#transfer_wrap');
    });

}
 

onSearchChange(event,type){
  var _this=this;
   const selectEl = event.target;
 if(type=="receivercurrency"){ 
 
this.receivercurrencySymbol= selectEl.options[selectEl.selectedIndex].getAttribute('currencySymbol');
 


 }

  if(type=="sendingcurrency"){ 

this.sendingcurrencySymbol= selectEl.options[selectEl.selectedIndex].getAttribute('currencySymbol');
 

 }

 
 if((this.wallettransferForm.get('sendingcurrency').value!='') && (this.wallettransferForm.get('receivercurrency').value!='') && (this.wallettransferForm.get('amount').value!='') )
    
{  
    let params = new URLSearchParams();
 
 
       params.append("sendCurrencyCode", this.wallettransferForm.get('sendingcurrency').value);
     params.append("receiveCurrencyCode", this.wallettransferForm.get('receivercurrency').value);
  params.append("sendCountryCode", this.sendingCurrencyValue);
      params.append("receiveCountryCode", this.receiverCurrencyValue);
      params.append("currencyValue", this.wallettransferForm.get('amount').value);  

 
  this.wallettransferService.currencyConverter(params).subscribe(currencyData => {
     // console.log('currencyConverter' ,currencyData);
   if (currencyData.resultCode === '0') {
 
     this.exchangeRateCode='';
        this.errorMessage = undefined; 
 
if(currencyData.exchangeRate){
this.exchangeRateCode=currencyData.exchangeRate.code
}
  

 this.wallettransferForm.controls.rate.setValue(currencyData.exchangeRate.value) 

 
 this.wallettransferForm.controls.amounttoPaid.setValue(this.commonService.fixedTo(currencyData.exchangeRate.currencyValue,2));
 this.transactionBtn=false; 
        } else {
          this.errorMessage = currencyData.resultDescription;
          this.commonService.scrollToElement('#transfer_wrap');
 this.transactionBtn=true;
        }
      }, error => {
 
        this.errorMessage = error.error.resultDescription;
        this.commonService.scrollToElement('#transfer_wrap');
         this.transactionBtn=true;
      });



}


 }


 wallettransferSubmit(gdata){ 
    let _this=this;
 
 
 
 if (this.wallettransferForm.invalid) {
 
    
this.commonService.validateAllFields(this.wallettransferForm);
 
 }else{  
 
  let confirmParms=this.commonService.createjson({ 
  "srcWalletOwnerCode": this.walletOwnerCode,
  "desWalletOwnerCode":this.receiverwalletOwnerCode,
  "srcCurrencyCode": this.wallettransferForm.get('sendingcurrency').value,
  "desCurrencyCode":  this.wallettransferForm.get('receivercurrency').value ,  
  "value":  this.wallettransferForm.get('amount').value ,
  "exchangeRateCode":this.exchangeRateCode
} ); 
  
 if(!this.wallettransferService.approvalRequired){
confirmParms.status=ApprovalConstants.status.code.APPROVED; 
 }

        
 this.commonService.postRequest(this.endpoints.E_WALLET_WALLETTRANSFER,confirmParms).subscribe(response => {
        //console.log('--create --', response);
        if (response.resultCode === '0') {
          this.errorMessage = undefined;
  _this.confirmArr=response;

_this.confirmShowHide='hide';  
_this.commonService.scrollToElement('#transfer_wrap');
  _this.successMessage=response.resultDescription;
 let walletTransfer=response.walletTransfer;
this.wallettransferForm.reset();
this.wallettransferForm.controls.trustaccount.setValue('');
this.wallettransferForm.controls.institutions.setValue('');
this.wallettransferForm.controls.sendingcurrency.setValue('');
this.wallettransferForm.controls.receivercurrency.setValue(''); 
this.viewList();
if(this.wallettransferService.approvalRequired){
 this.dataApprovalList(walletTransfer);

}else{
  this.confirmShowHide='hide';  
this.commonService.scrollToElement('#transfer_wrap'); 
 
  this.translate.languageText('WALLETTRANSFER_ERROR.walletSuccessMsg1', data=> {  
    this.successMessage=data;
  });

}


        } else {
          _this.errorMessage = response.resultDescription;
          this.commonService.scrollToElement('#transfer_wrap');
        }
      }, error => {
        _this.errorMessage = error.error.resultDescription;
        this.commonService.scrollToElement('#transfer_wrap');
      });
 
 
 }






}

dataApprovalList(walletTransfer){
	this.successMessage = undefined;
  let confirmParms=this.commonService.createjson({
    "dataApprovalList": [
        {
            "featureCode": "100031",
            "entityCode": walletTransfer.code,
            "entityName": this.receiverOwnerName,
            "actionType": "Created",
            "comments": "",
            "status": "U",
            "assignTo": "",
            "entity": {
                "code": walletTransfer.code,
                "srcWalletCode":walletTransfer.srcWalletCode,
                "desWalletCode":walletTransfer.desWalletCode,
                "srcWalletOwnerCode":walletTransfer.srcWalletOwnerCode,
                "srcWalletTypeCode":walletTransfer.srcWalletTypeCode,
                "desWalletTypeCode":walletTransfer.desWalletTypeCode,
                "srcCurrencyCode":walletTransfer.srcCurrencyCode,
                "desCurrencyCode":walletTransfer.desCurrencyCode,
                "value":walletTransfer.value,
                "finalAmount":walletTransfer.finalAmount,
                "status":walletTransfer.status,
                "createdBy":walletTransfer.createdBy,
            }
        }
    ]
} ); 
 this.commonService.postRequest(this.endpoints.E_WALLET_DATAAPPROVAL,confirmParms).subscribe(response => {
        //console.log('--create --', response);
        if (response.resultCode === '0') {
          this.errorMessage = undefined;
          
  
this.confirmShowHide='hide';  
this.commonService.scrollToElement('#transfer_wrap');
 // this.successMessage='Wallet Transfer successfully and sent for approval.';
 
  this.translate.languageText('WALLETTRANSFER_ERROR.walletSuccessMsg', data=> {  
    this.successMessage=data;
  });
 


        } else {
          this.errorMessage = response.resultDescription;
          this.commonService.scrollToElement('#transfer_wrap');
        }
      }, error => {
        this.errorMessage = error.error.resultDescription;
        this.commonService.scrollToElement('#transfer_wrap');
      });


}
 
walletFormErrorLanguage(){ 

  this.translate.languageText('WALLETTRANSFER_ERROR', data=> {  
  this.errorMessages.amount[0].message=data.amount;
  this.errorMessages.amount[1].message=data.numberErrorTxt;
  this.errorMessages.sendingcurrency[0].message=data.sendingcurrency;
  this.errorMessages.receivercurrency[0].message=data.receivercurrency; 
  this.errorMessages.trustaccount[0].message=data.trustaccount;
  this.errorMessages.institutions[0].message=data.institutions; 
  }); 
  
}
 
 viewUser(content: any,group) {
 
    this.openPopupData=group;

    this.modalService.open(content,{ size: 'lg' });
    return false;
  }


}
