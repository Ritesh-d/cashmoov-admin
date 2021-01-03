
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators, FormArray } from "@angular/forms";
import{ CreateTemplateService} from '../../create-template.service'
import { Router, ActivatedRoute } from '@angular/router';
import{ TemplatesService } from '../../../templates.service'
import { FeeCommisionTemplateService } from '../fee-template.service';
import { setMastersService } from '../../../../shared/services/set-masters.service';
import { MastersViewModelBuilder } from '../../../../shared/masters-view-model.builder';
import { TemplatesConstants } from '../../../templates.constants';
import { CommonHelperService } from '../../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewFeeCommisionComponent } from '../service-view/viewservicetemplate.component';
import { ApprovalConstants } from '../../../../approval/approval.constants';
import { ApprovalService } from '../../../../approval/approval.service';
import { AddTemplateService } from '../../../add-template/add-template.service';
import {TranslatelanguageService} from '../../../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-viewfeecommision',
  templateUrl: './viewfeecommision.component.html',
  styleUrls: ['./viewfeecommision.component.css']
})
export class ViewFeeCommTemplateComponent implements OnInit {
  changeValue: any;
  commisionbranch: any;
  commisionAgent: any;
  servicesettings: {
    singleSelection: boolean;
    // idField: 'item_id',
    // textField: 'item_text',    
    idField: string; textField: string;
    // allowSearchFilter: true,
    limitSelection: number; clearSearchFilter: boolean;
    // searchPlaceholderText: 'Tax Type',
    noDataAvailablePlaceholderText: string; closeDropDownOnSelection: boolean; showSelectedItemsAtTop: boolean; defaultOpen: boolean;
  };
  total: any;
  commisionIns: any;
  changeServiceProvidercode: any;
  serviceProviderNotcreated: any;

  constructor(private addTemplate : AddTemplateService, private approvalService : ApprovalService,
    private modalService: NgbModal,private commonHelperService: CommonHelperService,
    private mastersViewModel: MastersViewModelBuilder,private templateService : FeeCommisionTemplateService ,
    private translate: TranslatelanguageService,
    private tempService:TemplatesService,private createTemplateService:CreateTemplateService,
     private route: ActivatedRoute,private router:Router) {
  
   }
  errorMessage : '';
  public serviceTemplateForm: FormGroup;
  public multiselectform: FormGroup;
  public updateform: FormGroup;
  public loadContent: boolean = false;
  public data =[];
  public settings = {};
  public updatedata =[];
  public updatesettings = {};
  public selectedItems = [];
  channelTypeList : any;
  eWalletServiceList : any;
  // tranTypeList: any;
  templateCategoryName: string;
  walletOwnerCategoryName: string;
  editMode : boolean =false;
  display: string;
  walletOwnerCategoryCode:string;
  templateCategoryCode:string;
  transTemplateCategories;tempcode;tempname;templatestate;
  fetchingData : boolean= false;
  templatedata: any;
  redirectedFrom : string;
 tempDataWallet : any;
 public items =[];
 submitted : boolean= false;
  errorMessges: string;
  successMessage:string;
  ngOnInit() {
  
      console.log(' display :: '+this.route.snapshot.queryParamMap.get('display'));
      this.display = this.route.snapshot.queryParamMap.get('display');
      console.log(this.route.snapshot.queryParamMap.get('temp'))
      if (this.route.snapshot.queryParamMap.get('temp'))
      var tmp=  JSON.parse(this.route.snapshot.queryParamMap.get('temp')); 
      console.log('-- tmp' ,tmp);
      this.tempDataWallet = tmp;
      this.tempcode=tmp.code;
      this.tempname=tmp.name;
      this.templatestate=tmp.state;
      this.templateCategoryName= tmp.templateCategoryName;
      this.walletOwnerCategoryName = tmp.walletOwnerCategoryName;
      this.walletOwnerCategoryCode = tmp.walletOwnerCategoryCode;
      this.templateCategoryCode=tmp.templateCategoryCode;
      this.redirectedFrom = tmp.redirectedFrom
      this.templatedata=  JSON.parse(this.route.snapshot.queryParamMap.get('data')); 
      console.log(' this.templatedata', this.templatedata);
      console.log(this.tempcode,this.tempname);
      const groupMasterString =   TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;

      this.templateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
        
         this.channelTypeList =  data.channelTypeList == undefined?'': data.channelTypeList;
         this.eWalletServiceList = data.ewalletServiceList  == undefined?'':data.ewalletServiceList;
   
    }, error => console.log('error', error));
    
 
    this.createFormGroup();
  //  this.callOnLoad();
    this.callInload();
    this.showMessage();
    this.templateService.getServiceProviderList(this.templatedata.code).subscribe(result=>{
      this.serviceProviderList=result["serviceProviderList"];
     

    },error => console.log('error', error) )
    this.templateService.getTaxType().subscribe((data: any) => {
      if (data["resultCode"] === '0') {
        this.taxTypeList= data["taxTypeList"];
      }

    }, error => console.log('error', error));
    // this.templateService.fetchWalletOwnerOnCategory().subscribe((data: any) => {
    //   if (data["resultCode"] === '0') {
    //     this.walletOwnerList= data["walletOwnerList"];
    //   }

    // }, error => console.log('error', error));
    this.templateService.fetchWalletOwnerOnCategoryCode('100007').subscribe(result=>{
      this.walletOwnerCategoryList=result["walletOwnerList"];
  
    },error => console.log('error', error) )

    this.templateService.getWalletCategoryMasters().subscribe(result=>{
       
      this.walletOwnerList = result["categoryList"];
      this.walletOwnerList =  this.walletOwnerList.filter(m=>{
        return m.code != '100006' && m.code != '100007'

      });
    })
    this.settings = {
      singleSelection: false,
      // idField: 'item_id',
      // textField: 'item_text',    
      idField : 'code',
      textField:'typeEn',
      // allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,     
      // searchPlaceholderText: 'Tax Type',
      noDataAvailablePlaceholderText: 'NA',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };
     
    this.servicesettings = {
      singleSelection: false,
      // idField: 'item_id',
      // textField: 'item_text',    
      idField : 'code',
      textField:'name',
      // allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,     
      // searchPlaceholderText: 'Tax Type',
      noDataAvailablePlaceholderText: 'NA',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };
  
    this.multiselectform = new FormGroup({
      taxTypeCode: new FormControl(this.taxTypeCode,[Validators.required]),
      serviceProviderCode:new FormControl(this.taxTypeCode,[Validators.required])
    });
}
   
  
  calculationTypeList : any;
  taxTypeList : any;
  walletOwnerList: any;
  walletOwnerCategoryList: any;
  users: any;
  displaytable: boolean=false;;
  dtOption: any = {};
  
  walletCodeIns:any;
  serviceTemplateOrginalList:any;
 
  public serviceTemplateList: any[] = [];
  callInload(){
    this.displaytable = false;
   
  this.templateService.getAllDetail(this.tempcode).subscribe(result=>{

   if (result["resultCode"] === '0') {
    this.serviceTemplateOrginalList=result["feeCommissionTemplateList"];
    
    //var retrievedObject = localStorage.getItem('savetemplate');
    
   
   this.serviceTemplateOrginalList = this.serviceTemplateOrginalList.filter(m=>{
      return  m.serviceCategoryCode == this.templatedata.code;
     })
      console.log('feeCommissionTemplateList' ,this.serviceTemplateOrginalList);
    }else {
      console.log('result ' ,this.tempcode,  result["resultCode"]);
       
    }
    this.dtOption = this.commonHelperService.settingDataTable();
    this.displaytable = true;
    
  },error => console.log('error', error) )
   

  }
callOnLoad(){
  this.displaytable = false;
   
  //this.templateService.getAllDetail(this.tempcode).subscribe(result=>{

   // if (result["resultCode"] === '0') {
    //this.serviceTemplateList=result["feeCommissionTemplateList"];
    
   // var retrievedObject = localStorage.getItem('savetemplate');
    
   if(this.serviceTemplateForm.valid) 
   { 
   // localStorage.setItem('savetemplate', JSON.stringify(this.serviceTemplateForm.getRawValue()));
    let a=this.items.push(this.serviceTemplateForm.getRawValue());
   this.serviceTemplateList=this.items;
   }
   // this.serviceTemplateList = this.serviceTemplateList.filter(m=>{
   //   return  m.serviceCategoryCode == this.templatedata.code;
    // })
      console.log('feeCommissionTemplateList' ,this.serviceTemplateList);
    //}else {
    //  console.log('result ' ,this.tempcode,  result["resultCode"]);
       
    //}
    this.dtOption = this.commonHelperService.settingDataTable();
    this.displaytable = true;
    
 // },error => console.log('error', error) )
   

}
 
  get f() { return this.serviceTemplateForm.controls; }
  get f1() { return this.multiselectform.controls; }



checkforValidation(){
  let checkforcommision=false;
    this.serviceTemplateList.forEach(element => {
    this.commisionIns=element.commisionIns==undefined||NaN||null||0?0:element.commisionIns;
    this.commisionbranch=element.commisionbranch==undefined||NaN||null||0?0:element.commisionbranch;
    this.commisionAgent=element.commisionAgent ==undefined||NaN||null||0?0:element.commisionAgent;
    this.total=this.commisionIns+this.commisionbranch+this.commisionAgent;
 if(this.commisionIns===0|| this.commisionAgent===0 || this.commisionbranch===0  || !this.commisionIns || !this.commisionAgent ||  !this.commisionbranch )
   checkforcommision=true;
if((this.total>0 && this.total <100) || this.total>100 ){
  checkforcommision=true;
}
});
return checkforcommision;
}
duplicateRecords(){
  let duplicateRecordIs=false;
  let duplicateRecordAs=false;
  let duplicateRecordBs=false;
  let duplicateRecords=false;

  let commisionInst='';
 let commisionbranchs='';
 let commisionAgents ='';
 
 let localarr=[];
 if(this.serviceTemplateOrginalList){
  this.serviceTemplateOrginalList.forEach(element => {
 //console.log("serviceProviderCode=:"+this.changeServiceProvidercode);
 //this.changeServiceProvidercode=this.changeServiceProvidercode+','+this.changeServiceProvidercode+1;
   if(this.changeServiceProvidercode.includes(','))
   {
     localarr=this.changeServiceProvidercode.split(',')
     for(var i=0;i<localarr.length;i++){
      if(element.walletOwnerCategoryCode=='100000' && element.serviceProviderCode == localarr[i])
      commisionInst=element.percentComiValue==undefined||NaN||null||0?0:element.commisionIns;
      if(element.walletOwnerCategoryCode=='100001' && element.serviceProviderCode == localarr[i])
      commisionbranchs=element.commisionbranch==undefined||NaN||null||0?0:element.commisionbranch;
      if(element.walletOwnerCategoryCode=='100002' && element.serviceProviderCode == localarr[i])
      commisionAgents=element.commisionAgent ==undefined||NaN||null||0?0:element.commisionAgent;
       else{
         this.serviceProviderNotcreated = localarr[i]+',';
         this.serviceProviderNotcreated= this.serviceProviderNotcreated.concat(localarr[i]);
       }
     
     }

   
   }else{
    if(element.walletOwnerCategoryCode=='100000' && element.serviceProviderCode == this.changeServiceProvidercode)
    commisionInst=element.percentComiValue==undefined||NaN||null||0?0:element.commisionIns;
    if(element.walletOwnerCategoryCode=='100001' && element.serviceProviderCode == this.changeServiceProvidercode)
    commisionbranchs=element.commisionbranch==undefined||NaN||null||0?0:element.commisionbranch;
    if(element.walletOwnerCategoryCode=='100002' && element.serviceProviderCode == this.changeServiceProvidercode)
    commisionAgents=element.commisionAgent ==undefined||NaN||null||0?0:element.commisionAgent;
  
    this.serviceProviderNotcreated = element.serviceProviderCode ;
   
   }

});

 
    if(this.changeServiceProvidercode.includes(this.serviceProviderNotcreated))
    return duplicateRecords=true;

} 
}
  public createTemplate() {      
     this.clearMsg();
      this.submitted = true;
      if(this.serviceTemplateForm.invalid || this.multiselectform.invalid){
        return;
      }
     
     if(this.checkforValidation()){
      this.translate.languageText('TEMPLATE.commisionValuesumErr', data=> {
      this.errorMessges =data;
      });
      document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
  }
     let serviceCodevalues = '';
     let serviceCodevaluesList :any[] =  this.multiselectform.get("serviceProviderCode").value;
     serviceCodevaluesList.forEach(element => {
      if(serviceCodevalues){
        serviceCodevalues = serviceCodevalues + ",";
      }
      serviceCodevalues= serviceCodevalues.concat(element.code);
      this.changeServiceProvidercode=serviceCodevalues;
      this.changeValue=element.name;
      });
    
    
  if(this.duplicateRecords()){
    this.translate.languageText('Commision[ %] already exist, Please select other provider', data=> {
     this.errorMessges =data;
     });
     document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
   return;
 }
 
     
 this.serviceTemplateForm.get("serviceProviderCode").setValue(serviceCodevalues) ;
      let taxtylevalues = '';
      let taxTypeList :any[] =  this.multiselectform.get("taxTypeCode").value;
      taxTypeList.forEach(element => {
       if(taxtylevalues){
        taxtylevalues = taxtylevalues + ",";
       }
        taxtylevalues= taxtylevalues.concat(element.code);   
      });
      console.log('taxtylevalues' ,taxtylevalues);
      this.serviceTemplateForm.get("taxTypeCode").setValue(taxtylevalues) ;

        console.log('request for create service '+ JSON.stringify(this.serviceTemplateForm.getRawValue()));
     if(this.tempService.approvalRequired){
      //this.templateService.createServiceProfileTemplate(this.serviceTemplateForm.getRawValue() ).subscribe(result=>{
       // console.log('result.feeCommissionTemplate',+ JSON.stringify(result.feeCommissionTemplate ));
        //if (result.resultCode === '0') {

       // this.errorMessges =  undefined;
       // this.successMessage=  result.resultDescription;
       // if(this.templatestate == 'Approved'){
     
          // this.templateService.serviceTemplateList.push(this.serviceTemplateForm.getRawValue());
         // this.templateService.serviceTemplateList.push( result.feeCommissionTemplate);
         // console.log(' serviceList for  approval ' +JSON.stringify(this.templateService.serviceTemplateList));
        
       // }
    
        this.submitted = false;
        this.serviceTemplateForm.get("percentComiValue").setValue('0');
        if(this.serviceProviderNotcreated){
       if(this.serviceProviderNotcreated.includes(','))
       {
          let arr=[];
          arr=this.serviceProviderNotcreated.split(',');
          arr.forEach(element => {
          this.callOnLoad();
        });
       }
      }
      else{
        this.callOnLoad();
      }
        
       

       //} else {
        //this.errorMessges = result.resultDescription;
     // }
     // })
    }else{


      let request ={
        ...this.serviceTemplateForm.getRawValue(),
        status: ApprovalConstants.status.code.ACTIVE,
        state: ApprovalConstants.state.code.APPROVED
      }
     // this.templateService.createServiceProfileTemplate(request).subscribe(result=>{
     //   console.log('result.feeCommissionTemplate',+ JSON.stringify(result.feeCommissionTemplate ));
       // if (result.resultCode === '0') {

        this.errorMessges =  undefined;
       // this.successMessage=  result.resultDescription;
       
    
        this.submitted = false;
        this.serviceTemplateForm.get("percentComiValue").setValue('0');
        this.callOnLoad();

     //  } else {
      //  this.errorMessges = result.resultDescription;
     // }
      //})
    }
     
  }
public save(commsions:any,walletownerCode:any){
  let temp=false;
  if(walletownerCode=='100000'){
  this.serviceTemplateForm.get("percentComiValue").setValue(commsions);
  this.serviceTemplateForm.get("walletOwnerCategoryCode").setValue(walletownerCode);
}
  if(walletownerCode=='100001'){
  this.serviceTemplateForm.get("percentComiValue").setValue(commsions);
  this.serviceTemplateForm.get("walletOwnerCategoryCode").setValue(walletownerCode);
}
  if(walletownerCode=='100002'){
  this.serviceTemplateForm.get("percentComiValue").setValue(commsions);
  this.serviceTemplateForm.get("walletOwnerCategoryCode").setValue(walletownerCode);
}
  
  let request ={
    ...this.serviceTemplateForm.getRawValue(),
    //status: ApprovalConstants.status.code.ACTIVE,
    //state: ApprovalConstants.state.code.APPROVED
  }
 this.templateService.createServiceProfileTemplate(request).subscribe(result=>{
   //console.log('result.feeCommissionTemplate',+ JSON.stringify(result.feeCommissionTemplate ));
   if (result.resultCode === '0') {

    this.errorMessges =  undefined;
    this.successMessage=  result.resultDescription;
    this.submitted = false;
    temp=true;
   } 
   if (result.resultCode === '1139') {
    this.errorMessges =  undefined;
   this.errorMessges=  result.resultDescription;
    this.submitted = false;
    temp=false;
  } 
   });
   return temp
}

  public SaveTemplate() {
    this.submitted = true;
    let temp=false;
    
    this.checkforValidation();
    if(this.checkforValidation()){
    this.translate.languageText('TEMPLATE.commisionValuesumErr', data=> {
     this.errorMessges =data;
     
     });
     document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
   return;
   }
   if(this.duplicateRecords()){
    this.translate.languageText('Commision[ %] already exist, Please try different value', data=> {
     this.errorMessges =data;
    
     });
     document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
   return;
 }
    
   for(var i=0;i<this.serviceTemplateList.length;i++){
        this.commisionIns=this.serviceTemplateList[i].commisionIns;
        this.commisionbranch=this.serviceTemplateList[i].commisionbranch;
        this.commisionAgent=this.serviceTemplateList[i].commisionAgent;
        this.total=this.commisionIns+this.commisionbranch+this.commisionAgent;
    
   if(this.commisionIns){
    if(!this.save(this.commisionIns,'100000')){
     // temp=true;
     //  break;
   }
  }
   if(this.commisionbranch){
    if(!this.save(this.commisionbranch,'100001')){
     // temp=true;
     // break;
    }
    } 
   if(this.commisionAgent){
    if(!this.save(this.commisionAgent,'100002')){
   //temp =true;
   // break;
   }
     
  }
}
    this.clearMsg();
    console.log('this.templatestate'+ this.templatestate);
   
    if(temp)  
    return;
  
  //   let serviceTemplateListSelected : any;
  //   console.log('serviceTemplateList svev' , this.serviceTemplateList);
  //   serviceTemplateListSelected = this.serviceTemplateList.filter(function(ele) {
  
  //     return (this.approvalService.getDataApprovalStatus(ele.state) === ApprovalConstants.status.code.CREATED);
  // }); 
  // if(serviceTemplateListSelected){
  //   this.errorMessges = "No records found for approval";
  //   return;
  // }
  // console.log('serviceTemplateListSelected' ,serviceTemplateListSelected);
  this.tempService.approvalRequired=true;
  if(this.tempService.approvalRequired){
  if(this.templatestate != 'Approved'){
  this.templateService.makeEntryToApproval( this.serviceTemplateList, this.tempname,this.tempcode,ApprovalConstants.featureCode.TEMPLATE).subscribe(approvalData => {
 
    if (approvalData === null) {
     // this.errorMessges = "There is some error, Please try after some time.";
     this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
      this.errorMessges =data;
      });
    } else {
       if (approvalData.resultCode === '0') {

        this.errorMessges = '';
        this.router.navigate(['../'], { relativeTo: this.route, skipLocationChange: true,queryParams: { status: 'serviceadded' } });

 
       } else {
        this.errorMessges = approvalData.resultDescription;
      }
    }
  });
}else{
  console.log('updated info to approved serviceList',this.templateService.serviceTemplateList);
  // const updatedInfo = this.templateService.preparedUpdatedDataForApproval(this.oldTemplate, this.serviceTemplateForm.getRawValue());
  // console.log('updatedInfo', updatedInfo);
  // this.templateService.modifyServiceProfileTemplate(this.prepareDataForUpdateStatus(this.oldTemplate), this.tempcode).subscribe(result => {
  //   console.log(result);
  //   if (result.resultCode === '0') {
     
      const updatedInfo = {
        'feeCommissionTemplateList': this.templateService.serviceTemplateList
      };
      this.templateService.serviceTemplateList = [];
 
      this.templateService.makeEntryToApproval( this.serviceTemplateList,this.tempname,this.tempcode, ApprovalConstants.featureCode.FEECOMMISION,updatedInfo).subscribe(approvalData => {

        if (approvalData === null) {
          //this.errorMessges = "There is some error, Please try after some time.";
          this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
            this.errorMessges =data;
            });
        } else {
           if (approvalData.resultCode === '0') {

            this.errorMessges = undefined;
            this.router.navigate(['../'], { relativeTo: this.route,skipLocationChange: true, queryParams: { status: 'serviceupdated' } });
            // var tmp={code: this.tempcode,name :  this.templateName,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName};

            // this.router.navigate(['../createServiceTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) ,display:'block',status: 'updated'} });    

           } else {
            this.errorMessges = approvalData.resultDescription;
          }
        }
      });

}
}else{
  const updateTemplateRequset = {

    "name": this.tempname,
    "templateCategoryCode":this.templateCategoryCode,
    "walletOwnerCategoryCode": this.walletOwnerCategoryCode,
    "status": ApprovalConstants.status.code.ACTIVE,
    "state" : ApprovalConstants.state.code.APPROVED
 }

 this.addTemplate.modifyTemplate(updateTemplateRequset, this.tempcode).subscribe(result=>{
  console.log('result updatetemplate', result);
  
  if (result["resultCode"] === '0') {

  this.errorMessges =  undefined;
  this.successMessage=  result["resultDescription"];
  if(this.templatestate != 'Approved'){
    this.router.navigate(['../'], { relativeTo: this.route, skipLocationChange: true,queryParams: { status: 'serviceadded' } });
  } else{
    this.router.navigate(['../'], { relativeTo: this.route,skipLocationChange: true, queryParams: { status: 'serviceupdated' } });

  }

 } else {
  this.errorMessges = result["resultDescription"];
}
});
 

}
}

  navigateBack() {
    // this.router.navigate(['../'], {skipLocationChange: true, relativeTo: this.route });

    var tmp={code: this.tempcode,name :  this.tempname,state:this.templatestate,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,
      walletOwnerCategoryCode:this.walletOwnerCategoryCode,templateCategoryCode:this.templateCategoryCode,
      redirectedFrom: this.redirectedFrom,
      editMode : this.tempDataWallet.editMode};
  
     this.router.navigate(['../createFeeCommisionTemplate'], { relativeTo: this.route, skipLocationChange: true,queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) ,display: this.display} });    

  }
  serviceCategoryList: any;
  serviceProviderList :any;
  // onChangeService(event){
     
  //   this.templateService.getServiceCategoryList(event.target.value).subscribe(result=>{
  //     this.serviceCategoryList=result["serviceCategoryList"];
  //    }
  //    ,error => console.log('error', error) )
  //    }
  // onChangeServiceCategory(event){
  //   this.templateService.getServiceProviderList(event.target.value).subscribe(result=>{
  //     this.serviceProviderList=result["serviceProviderList"];

  //   },error => console.log('error', error) )
  // }  
  channelCode : string='';
  serviceCode : string='';
  serviceCategoryCode : string='';
  serviceProviderCode : string='';
  fixedComiValue : string='0';
  percentComiValue: string='0';
  calculationTypeCode: string='';
  percentFeeValue: string;
  fixedFeeValue: string;
  taxTypeCode: string='';
  taxAccountCode: string='';
  createFormGroup(){
    
    this.serviceTemplateForm = new FormGroup({
      templateCode: new FormControl(this.tempcode),
      channelTypeCode: new FormControl(this.channelCode ),
      serviceCode: new FormControl(this.templatedata.serviceCode,[Validators.required]),
      serviceCategoryCode: new FormControl(this.templatedata.code,[Validators.required]),
      serviceProviderCode: new FormControl(this.serviceProviderCode),
      fixedComiValue: new FormControl(this.fixedComiValue),
      percentComiValue: new FormControl(this.percentComiValue),
      walletOwnerCategoryCode : new FormControl(this.walletOwnerCategoryCode),
      taxTypeCode :  new FormControl(this.taxTypeCode),
      taxAccount : new FormControl(this.taxAccountCode )
     });
  }
  editForm(template :any){
  
    this.clearMsg();

    var tmp={code: this.tempcode,name :  this.tempname,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,
      templateCategoryCode: this.templateCategoryCode,walletOwnerCategoryCode: this.walletOwnerCategoryCode,state:this.templatestate};
   
    this.router.navigate(['../editFeeCommisionTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(template), temp:JSON.stringify(tmp)}});
 
  }
  clearMsg(){
    this.errorMessage='';
    this.successMessage='';
  }
  onChangeTemplate(){

     
     
   // template.controls["templateNameName"].setValue(templateName);
    // template.controls["templateNameOld"].setValue(templateName);
    

  }
  viewForm(template :any){
 
   const modalRef = this.modalService.open(ViewFeeCommisionComponent);
   modalRef.componentInstance.data = template;
  }
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
        if(this.tempService.approvalRequired){
       // this.successMessage = 'Service Added successfully, sent for approval';
       this.translate.languageText('TEMPLATE.serviceAddedsuccessfullysentforapproval', data=> {
        this.successMessage =data;
        });
        }else{
          //this.successMessage = 'Service Added successfully';
          this.translate.languageText('TEMPLATE.serviceAddedsuccessfully', data=> {
            this.errorMessage =data;
            });
        }
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        if(this.tempService.approvalRequired){
        //this.successMessage = 'Service Updation added for approval successfully.';
        this.translate.languageText('TEMPLATE.serviceUpdationaddedforapprovalsuccessfully', data=> {
          this.successMessage =data;
          });
          
          
        }else{
          //this.successMessage = 'Service Updated successfully.';
          this.translate.languageText('TEMPLATE.serviceUpdatedsuccessfully', data=> {
            this.successMessage =data;
            });
            


        }
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
    }
  }
}
