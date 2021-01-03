import { CommonHelperService } from './../../shared/services/common-helper-service';
import { CommonService } from './../../shared/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { TransactionreversalService } from '../transactionreversal.service';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import {TranslatelanguageService} from './../../shared/services/translatelanguage.service';
 import { ApprovalConstants } from './../../approval/approval.constants';
 import { Endpoints } from './../../shared/endpoints'; 
 import * as moment from 'moment';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  minDate:any;
 maxDate:any;
 currentForm:any={};
selectAll:boolean = false;
loaderTableData:boolean = false;
btnSubmit:boolean = false;
 setPermission: any;
  errorMessage:string='';
  successMessage:string='';
  transTypes:any=[{code:'all',name:'All'}];
  errorMessages:any = [];
  dataTable:any = [];
  dtOptions: DataTables.Settings = {};
  columnDefs:any =[ 
  { orderable: false,  targets: 0 },    
  { orderable: false,  targets: 1 },    
  { orderable: false,  targets: 7 },
    { orderable: true, targets: '_all' }  ]
 reversalForm: FormGroup; 
 public openPopupData:any = {};
selectAllBtn:boolean=false; 
loaderData:boolean=true;
  constructor(private modalService:NgbModal,
    private translate: TranslatelanguageService,
     private fb:FormBuilder,     
     private endpoints:Endpoints,     
     private transactionreversalService:TransactionreversalService,
     private commonHelperService:CommonHelperService,
     private commonService:CommonService) { }

  ngOnInit() {
    this.dtOptions = this.commonHelperService.settingDataTableNew(this.columnDefs);
 this.setPermission = this.transactionreversalService.setPermission;
 




  this.minDate=this.commonService.convertDatepicker(moment().subtract(3, "year"))
  this.maxDate=this.commonService.convertDatepicker(moment().subtract(0, "day"));
 


this.errorMessages = {     
    'transtype': [  { type: 'required', message: '' }    ],
    'fromdate': [  { type: 'required', message: '' }    ],
    'todate': [  { type: 'required', message: '' }  ],
    'transid': [  { type: 'required', message: '' }  ],
 
 }

 this.reversalForm=this.fb.group({  
       "transtype":['' ,[Validators.required ]],   
       "fromdate":null,   
       "todate":null,   
       "transid":null,   
        
      })


    this.onLoad();
   // this.getReversalFn();
    this.formErrorLanguage();
 
  }
  getReversalFn(transTypeCode='all',fromDate='',toDate='',transId=''){
this.loaderData=true;
this.loaderTableData=true;
this.dataTable=[];
   let params ;
   if(transTypeCode=='all' && fromDate=='' && toDate==''  && transId==''){ 
    params='';
     } else{
      params = new URLSearchParams(); 
     }
    
     if(transTypeCode=='all'){  
       
 
      }else{
         
         params.append('transTypeCode',transTypeCode);

      }

   if(fromDate){
     params.append('fromDate', fromDate);  
   }
      if(toDate){
   params.append('toDate', toDate);   
   }
      
     
      if(transId){
        params.append('transId', transId);  
      }
     

    this.transactionreversalService.getReversal(params).subscribe(res => {
 
    if (res.resultCode === '0') {
        this.errorMessage = undefined; 
         
    this.dataTable = res.transactionsList.map(data => {
      
  return {
            ...data,
            checked: false,            
            feeReverse: false             
          };

             

         
        }); 

      this.loaderData=false;
    }else {
      this.dataTable=[];
        //this.errorMessage = res.resultDescription;
          this.loaderData=false;
      }
  
    }, error => {
        console.log('--error--', error);
         this.loaderData=false;
        this.errorMessage = error.error.resultDescription;
       
      }); 
    }


    
    onLoad(){

 
  this.reversalForm.controls.transtype.setValue('all');
      this.transactionreversalService.getTranstype().subscribe(res => { 
      if (res.resultCode === '0') {
          this.errorMessage = undefined; 
            this.transTypes=[this.transTypes[0],...res.transTypeList]; 
      
      }else {
          this.errorMessage = res.resultDescription;
          
        }
      this.loaderData=false;
      }, error => {
          console.log('--error--', error);
          this.errorMessage = error.error.resultDescription;
         
        }); 
      }
    
openPopup(content,group) {
 
    this.openPopupData=group;

    this.modalService.open(content,{ size: 'lg' });
    return false;
  }

  formErrorLanguage(){
 
     this.translate.languageText("MASTER", (data)=> {
  

     });
    this.translate.languageText("REVERSAL", (data)=> {
     this.errorMessages.transtype[0].message=data.transtype;
     this.errorMessages.fromdate[0].message=data.fromdate;
     this.errorMessages.todate[0].message=data.todate;
     this.errorMessages.transid[0].message=data.transid;
   });
 


   }
reversalSubmit(gdata){
 this.errorMessage='';
 let fromdate='';
 if(gdata.fromdate){
   fromdate=this.commonService.convertDate(gdata.fromdate);
 }
let todate='';
if(gdata.todate){
 todate=this.commonService.convertDate(gdata.todate);
 }

 if(fromdate!='' || todate !=''){
      const fromdates = this.reversalForm.get('fromdate');
fromdates.setValidators([Validators.required]);
  fromdates.updateValueAndValidity(); 
    const todates = this.reversalForm.get('todate');
todates.setValidators([Validators.required]);
  todates.updateValueAndValidity(); 

 }else{
      const fromdates = this.reversalForm.get('fromdate');
fromdates.setValidators(null);
  fromdates.updateValueAndValidity(); 
    const todates = this.reversalForm.get('todate');
todates.setValidators(null);
  todates.updateValueAndValidity();  
 }
 if(fromdate!='' && todate !=''){
if(this.commonService.dateDiff(fromdate,todate) < 0){ 
 this.translate.languageText("REVERSAL.dateDiff", (data)=> { 
  this.errorMessage=data;
  }); 
 return false;
}
}



 if (this.reversalForm.invalid) {  
this.commonService.validateAllFields(this.reversalForm); 
 }else{
let transtype=gdata.transtype;

let transid=gdata.transid;
  this.currentForm={"transtype":transtype,
  "fromdate":fromdate,"todate":todate,"transid":transid}
 this.getReversalFn( transtype,fromdate,todate,transid);
 

}

}

   selectAllCheckbox() {
    this.selectAll = !this.selectAll;
    this.dataTable.forEach(data => {
      if ( data.status=='Enrolled') {
      if (this.selectAll) {
        data.checked = true;
      } else {
        data.checked = false;
      }
    }
    });  
  }


submitReversal(){

  this.errorMessage='';
 
  let newRes=[];
    const selectedReversal: any[] = [];
    this.dataTable.forEach(d => {

      if (d.checked && d.transactionReversed==false && d.status=='Enrolled') {
        selectedReversal.push({
      "transId" : d.transactionId,
      "feeReverse" : d.feeReverse, 
      "transactionReversed" : d.checked, 
      "status" : ApprovalConstants.status.code.APPROVED 
    });

const newDate = new Date(d.creationDate);
 d.creationDate=newDate.getTime();
d.transId= d.transactionId;
newRes.push({    
      "featureCode": ApprovalConstants.featureCode.TRANSACTIONREVERSAL,
      "entityCode":d.code,
      "entityName": "Reversal",
      "actionType": "Created",
      "updatedInformation": {  
          "feeReverse":d.feeReverse,
          "amount": d.transactionAmount
      },
      "comments": "",
      "status": "UP",
      "assignTo": "",
      "entity": d
    });


      }
    });


if(selectedReversal.length<1){ 
 this.translate.languageText("REVERSAL.transactionreversal", (data)=> { 
  this.errorMessage=data;
  }); 

this.commonService.scrollToElement('#head_wrap');
return false;
}
  
 

 
 if(!this.transactionreversalService.approvalRequired){
  var Parms= {
  "transactionReversalList": selectedReversal
}
 this.submitWithoutApproval(Parms);

 
 }else{

 this.dataApprovalList(newRes);
 }
 
 
return false; 
}




submitWithoutApproval(Parms){
this.btnSubmit=true; 
 this.commonService.postRequest(this.endpoints.TRANSACTION_REVERSALSEND,Parms).subscribe(res => {
  
if (res.resultCode === '0') {
  this.btnSubmit=false;
    this.errorMessage = undefined; 
 
        this.resetAll();
 this.commonService.scrollToElement('#head_wrap'); 
  this.translate.languageText("REVERSAL.transactionreverCreated", (data)=> {  
  this.successMessage=data;
  }); 
  setTimeout(()=> { 
 this.successMessage=''; 
}, 6000); 
  
}else {
  this.btnSubmit=false;
    this.errorMessage = res.resultDescription;
    
  }
 
}, error => {
  this.btnSubmit=false;
    console.log('--error--', error);
    this.errorMessage = error.error.resultDescription;
   
  }); 
}




dataApprovalList(res){
  this.successMessage = undefined;
 
let confirmParms=this.commonService.createjson({
    "dataApprovalList": res
} ); 
 

this.commonService.postRequest(this.endpoints.E_WALLET_DATA_APPROVAL_URL,confirmParms).subscribe(response => {
        //console.log('--create --', response); 
        if (response.resultCode === '0') {
          this.errorMessage = undefined;
      
      this.resetAll(); 

 this.commonService.scrollToElement('#head_wrap'); 
  this.translate.languageText("REVERSAL.transactionreverApproval", (data)=> {  
  this.successMessage=data;
  }); 
  setTimeout(()=> { 
 this.successMessage=''; 
}, 6000); 

        } else {
          this.errorMessage = response.resultDescription;
          this.commonService.scrollToElement('#head_wrap');
        }
      }, error => {
        this.errorMessage = error.error.resultDescription;
        this.commonService.scrollToElement('#head_wrap');
      });


} 


resetAll(){
 this.selectAll=true; 
 
 this.getReversalFn( this.currentForm.transtype,this.currentForm.fromdate,this.currentForm.todate,this.currentForm.transid);
 
 }



}
