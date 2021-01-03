
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import{ CreateTemplateService} from '../../create-template.service'
import { Router, ActivatedRoute } from '@angular/router';
import{ TemplatesService } from '../../../templates.service'

import { setMastersService } from '../../../../shared/services/set-masters.service';
import { MastersViewModelBuilder } from '../../../../shared/masters-view-model.builder';
import { TemplatesConstants } from '../../../templates.constants';
import { CommonHelperService } from '../../../../shared/services/common-helper-service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApprovalConstants } from '../../../../approval/approval.constants';
import { ApprovalService } from '../../../../approval/approval.service';
import { FeeCommisionTemplateService } from '../../fee-commision-template/fee-template.service';
import { ViewIncentiveTemplateComponent } from '../viewincentive/viewincentive-template.component';
import { IncentiveTemplateService } from '../incentive-template.service';
import { ViewIncentiveComponent } from '../service-view/viewservicetemplate.component';
import { ViewDistributionComponent } from '../distributionchild-view/viewdistributionchildtemplate.component';
import { EditDistributionTemplateComponent } from '../editdistributiontemplate/editdistribution-template.component';
import {TranslatelanguageService} from '../../../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-viewdistribution',
  templateUrl: './viewdistribution.component.html',
  styleUrls: ['./viewdistribution.component.css']
})
export class ViewDistributionTemplateComponent implements OnInit {
  @Input() data;
  catgorycode: any;
  templateCode: string;
  public items =[];
  serviceEditList: any[];
  distrIns: any;
  distrbranch: any;
  distrAgent: any;
  
  constructor( private approvalService : ApprovalService,
    private modalService: NgbModal,
    private commonHelperService: CommonHelperService,
    private mastersViewModel: MastersViewModelBuilder,
    private translate: TranslatelanguageService,
    private templateService : IncentiveTemplateService ,private tempService:TemplatesService,private createTemplateService:CreateTemplateService, private route: ActivatedRoute,private router:Router,public activeModal: NgbActiveModal) {
  
   }
  errorMessage : '';
  public serviceTemplateForm: FormGroup;
  public multiselectform: FormGroup;
  public updateform: FormGroup;
  public loadContent: boolean = false;
  //public data =[];
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
  taxAccountlist :any;
  ngOnInit() {
  
      console.log(' display :: '+this.route.snapshot.queryParamMap.get('display'));
      this.display = this.route.snapshot.queryParamMap.get('display');
      console.log(this.route.snapshot.queryParamMap.get('temp'))
      if (this.route.snapshot.queryParamMap.get('temp'))
      var tmp=  JSON.parse(this.route.snapshot.queryParamMap.get('temp')); 
      console.log('-- tmp' ,tmp);
      this.tempcode=tmp.code;
      this.tempname=tmp.name;
      this.templatestate=tmp.state;
      this.templateCategoryName= tmp.templateCategoryName;
      this.walletOwnerCategoryName = tmp.walletOwnerCategoryName;
      this.walletOwnerCategoryCode = tmp.walletOwnerCategoryCode;
      this.templateCategoryCode=tmp.templateCategoryCode;
      this.templatedata=  JSON.parse(this.route.snapshot.queryParamMap.get('data')); 
      //this.templatedata= this.data;
     
      console.log(' this.templatedata', this.templatedata);
      console.log(this.tempcode,this.tempname);
      const groupMasterString =   TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;

      this.templateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
        
         this.channelTypeList =  data.channelTypeList == undefined?'': data.channelTypeList;
         this.eWalletServiceList = data.ewalletServiceList  == undefined?'':data.ewalletServiceList;
   
    }, error => console.log('error', error));
    
 
    this.createFormGroup();
    this.callOnLoad();
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
    this.templateService.fetchWalletOwnerOnCategory('100007').subscribe(result=>{
      this.taxAccountlist=result["walletOwnerList"];
  
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
     
  
    this.multiselectform = new FormGroup({
      taxTypeCode: new FormControl(this.taxTypeCode,[Validators.required]),
    });
}
   get f1(){
     return  this.multiselectform.controls;
   }
  
  calculationTypeList : any;
  taxTypeList : any;
  walletOwnerList: any;
  walletOwnerCategoryList: any;
  users: any;
  displaytable: boolean=false;;
  dtOption: any = {};
  serviceTemplateList: any;
  
  callInLoad(){

    this.serviceProviderCode=this.serviceTemplateForm.get("serviceProviderCode").value;
    this.displaytable = false;
    if(this.serviceTemplateForm.valid)  { 
    let item=this.items.push(this.serviceTemplateForm.getRawValue());
     this.serviceEditList=this.items;
     }
     this.dtOption = this.commonHelperService.settingDataTable();
      this.displaytable = true;
   }
callOnLoad(){
  this.displaytable = false;
   
  this.templateService.getAll().subscribe(result=>{

    if (result["resultCode"] === '0') {
    this.serviceTemplateList=result["incentiveDistributionTemplateList"];
    this.serviceTemplateList = this.serviceTemplateList.filter(m=>{
      return  m.incentiveTemplateCode == this.data.code;
     })
      console.log('incentiveDistributionTemplateList' ,this.serviceTemplateList);
    }
    
    else {
      console.log('result ' ,this.tempcode,  result["resultCode"]);
       
    }
    this.dtOption = this.commonHelperService.settingDataTable();
    this.displaytable = true;
    
  },error => console.log('error', error) )
   

}
 
  get f() { return this.serviceTemplateForm.controls; }

  submitted : boolean= false;
  errorMessges: string;
  successMessage:string;
 
  public createTemplate() {
    this.clearMsg();
    this.distrAgent='';this.distrbranch='';this.distrIns='';
    console.log('createTemplate');
    this.submitted = true;
    //if (this.serviceTemplateForm.invalid || this.multiselectform.invalid) {
    //  return;
    //}
     if(this.serviceEditList){
       return;
     }
     else{
       if(this.serviceTemplateList.length>0)
         return;
     }
     
    let taxtylevalues = '';
    let taxTypeList: any[] = this.multiselectform.get("taxTypeCode").value;
   if(taxTypeList){
    taxTypeList.forEach(element => {
      if (taxtylevalues) {
        taxtylevalues = taxtylevalues + ",";
      }
      taxtylevalues = taxtylevalues.concat(element.code);


    });
  }
    console.log('taxtylevalues', taxtylevalues);
    this.serviceTemplateForm.get("taxTypeCode").setValue(taxtylevalues);
   
    console.log('request for create service ', this.serviceTemplateForm.getRawValue());
    // console.log('selected taxTypeCodes '+ this.serviceTemplateForm.get("taxTypeCode").value);
    // for()

   // this.serviceTemplateForm.get("fromDate").setValue(this.formattedFromDate);
   // this.serviceTemplateForm.get("toDate").setValue(this.formattedToDate);

   // this.templateService.createIncentiveProfileTemplate(this.serviceTemplateForm.getRawValue()).subscribe(result => {
     // console.log('result.incentiveTemplate', result.incentiveDistributionTemplate);
     // if (result.resultCode === '0') {
     
      //  setTimeout(() => {
      //    this.successMessage = undefined;
        
        //this.errorMessges = undefined;
       // this.successMessage = result.resultDescription;
      ///}, 10 * 1000);
        if (this.templatestate == 'Approved') {

          // this.templateService.serviceTemplateList.push(this.serviceTemplateForm.getRawValue());
         // this.templateService.serviceTemplateList.push(result.incentiveDistributionTemplate);
          console.log(' serviceTemplateList for  approval ' + JSON.stringify(this.templateService.serviceTemplateList));

        }
       // this.submitted = false;
      //  this.serviceTemplateForm.get("minValue").setValue('');
       // this.serviceTemplateForm.get("maxValue").setValue('');
       // this.serviceTemplateForm.get("fixedIncentiveValue").setValue('');
        this.serviceTemplateForm.get("percentComiValue").setValue('');
     // this.templateCode=result.incentiveDistributionTemplate.templateCode;
       // this.callOnLoad()
       this.callInLoad();

     // } 
      //else {
       // this.errorMessges = result.resultDescription;
     // }
    //})


  }
  public save(commsions:any,walletownerCode:any){
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
      ...this.serviceTemplateForm.getRawValue()
      //status: ApprovalConstants.status.code.ACTIVE,
    //  state: ApprovalConstants.state.code.APPROVED
    }
    this.templateService.createIncentiveProfileTemplate(this.serviceTemplateForm.getRawValue()).subscribe(result => {
       console.log('result.incentiveTemplate', result.incentiveDistributionTemplate);
       if (result.resultCode === '0') {
  
      this.errorMessges =  undefined;
      this.successMessage=  result.resultDescription;
     
  
      this.submitted = false;
      if (this.templatestate == 'Approved') {

        // this.templateService.serviceTemplateList.push(this.serviceTemplateForm.getRawValue());
        this.templateService.serviceTemplateList.push(result.incentiveDistributionTemplate);
        console.log(' serviceTemplateList for  approval ' + JSON.stringify(this.templateService.serviceTemplateList));

      }
     
     } // this.serviceTemplateForm.get("percentComiValue").setValue('0');
      this.templateCode=result.incentiveDistributionTemplate.templateCode;
       this.callOnLoad()
       
     });
  }
  public SaveAll(){
    this.clearMsg();
    console.log('this.templatestate'+ this.templatestate);
    if(!this.distrIns || !this.distrbranch || !this.distrAgent)
    {
      this.errorMessges ='Please Enter Distribution Value[ % ]';
       return
    }
    var distrIns=this.distrIns;
    var distrbranch=this.distrbranch;
    var distrAgent=this.distrAgent;

   var total=distrIns+distrbranch+distrAgent;
  if((total>0 && total <100) || total>100 )
  {
    this.errorMessges ='Distribution Value[ % ] sum  must be equals to 100';
    return;
  }
   if(distrIns)
   this.save(distrIns,'100000');
   if(distrbranch)
   this.save(distrbranch,'100001');
   if(distrAgent)
   this.save(distrAgent,'100002');
  this.serviceEditList.pop();
  //this.serviceTemplateList='';
 // console.log('incentiveDistributionTemplateList' ,this.serviceTemplateList);
  distrAgent='';distrbranch='';distrIns='';
   // this.callOnLoad();
   // this.templateService.serviceTemplateList.push(this.serviceTemplateList);
  }
  public SaveTemplate() {
    this.clearMsg();
    console.log('this.templatestate'+ this.templatestate);

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
  if(this.templatestate != 'Approved'){
  this.templateService.makeEntryToApproval( this.serviceTemplateList, this.tempname,this.tempcode,ApprovalConstants.featureCode.TEMPLATE).subscribe(approvalData => {
 
    if (approvalData === null) {
      //this.errorMessges = "There is some error, Please try after some time.";
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
        'incentiveTemplateList': this.templateService.serviceTemplateList
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
   
}

  navigateBack() {
    this.router.navigate(['../'], {skipLocationChange: true, relativeTo: this.route });
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
      channelTypeCode: new FormControl(this.data.channelTypeCode ),
      serviceCode: new FormControl(this.templatedata.serviceCode,[Validators.required]),
      serviceCategoryCode: new FormControl(this.templatedata.code,[Validators.required]),
      serviceProviderCode: new FormControl(this.data.serviceProviderCode,[Validators.required]),
      fixedComiValue: new FormControl(this.fixedComiValue),
      percentComiValue: new FormControl(this.percentComiValue,[Validators.pattern('^[1-9][0-9]?$|^100$')] ),
      walletOwnerCategoryCode : new FormControl(this.walletOwnerCategoryCode,[Validators.required]),
      taxTypeCode :  new FormControl(this.taxTypeCode),
      incentiveTemplateCode: new FormControl(this.data.code),
      serviceCategoryName: new FormControl(this.data.serviceCategoryName),
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
  viewForm(template :any){
 
   const modalRef = this.modalService.open(ViewDistributionComponent);
    modalRef.componentInstance.data = template;
  }
  editFormchild(template: any) {

        
    const modalRef = this.modalService.open(EditDistributionTemplateComponent);
    modalRef.componentInstance.data = template;
         //this.clearMsg();
     
        // var tmp = {
         //  code: this.tempcode, name: this.tempname, walletOwnerCategoryName: this.walletOwnerCategoryName, templateCategoryName: this.templateCategoryName,
         //  templateCategoryCode: this.templateCategoryCode, walletOwnerCategoryCode: this.walletOwnerCategoryCode, state: this.templatestate
        // };
     
         //this.router.navigate(['../editIncentiveTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(template), temp: JSON.stringify(tmp) } });
     
       }
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
       // this.successMessage = 'Service Added successfully, sent for approval';
       this.translate.languageText('TEMPLATE.serviceAddedsuccessfullysentforapproval', data=> {
        this.successMessage =data;
        });
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
       // this.successMessage = 'Service Updation added for approval successfully.';
       this.translate.languageText('TEMPLATE.serviceUpdationaddedforapprovalsuccessfully', data=> {
        this.successMessage =data;
        });
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
    }
  }
}
