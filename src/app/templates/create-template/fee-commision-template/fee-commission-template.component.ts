
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import{ CreateTemplateService} from '../create-template.service'
import { Router, ActivatedRoute } from '@angular/router';
import{ TemplatesService } from '../../templates.service'
import { FeeCommisionTemplateService } from './fee-template.service';
import { setMastersService } from '../../../shared/services/set-masters.service';
import { MastersViewModelBuilder } from '../../../shared/masters-view-model.builder';
import { TemplatesConstants } from '../../templates.constants';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewFeeCommisionComponent } from './service-view/viewservicetemplate.component';
import { ApprovalConstants } from '../../../approval/approval.constants';
import { ApprovalService } from '../../../approval/approval.service';
import { WalletOwnerConstants } from '../../../wallet-owner/wallet-owner.constants';
import {TranslatelanguageService} from '../../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-fee-commission-template',
  templateUrl: './fee-commission-template.component.html',
  styleUrls: ['./fee-commission-template.component.css']
})
export class FeeCommTemplateComponent implements OnInit {

  constructor( private approvalService : ApprovalService,private modalService: NgbModal,
    private commonHelperService: CommonHelperService,
    private mastersViewModel: MastersViewModelBuilder,
    private templateService : FeeCommisionTemplateService ,
    private tempService:TemplatesService,
    private translate: TranslatelanguageService,
    private createTemplateService:CreateTemplateService,
     private route: ActivatedRoute,private router:Router) {
  
   }
  errorMessage : '';
  public serviceTemplateForm: FormGroup;
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
   rediretedFrom : string;
  
   tempDataWallet: any;
  ngOnInit() {
  
      console.log('display :: '+this.route.snapshot.queryParamMap.get('display'));
      this.display = this.route.snapshot.queryParamMap.get('display');
      console.log(this.route.snapshot.queryParamMap.get('temp'))
      if (this.route.snapshot.queryParamMap.get('temp'))
      var tmp=  JSON.parse(this.route.snapshot.queryParamMap.get('temp')); 
      console.log('-- tmp' ,tmp);
       this.tempDataWallet = tmp;
      this.tempcode=tmp.code;
      this.tempname=tmp.name;
      this.templatestate=tmp.state;
      this.rediretedFrom=tmp.redirectedFrom; 
      console.log('from edit templatestate' + this.templatestate);
      // this.templatestate = 'Approved';
      this.templateCategoryName= tmp.templateCategoryName;
      this.walletOwnerCategoryName = tmp.walletOwnerCategoryName;
      this.walletOwnerCategoryCode = tmp.walletOwnerCategoryCode;
      this.templateCategoryCode=tmp.templateCategoryCode;

      console.log(this.tempcode,this.tempname);
      const groupMasterString =   TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;

      this.templateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
        
         this.channelTypeList =  data.channelTypeList == undefined?'': data.channelTypeList;
         this.eWalletServiceList = data.ewalletServiceList  == undefined?'':data.ewalletServiceList;
   
    }, error => console.log('error', error));
    
 
    this.createFormGroup();
    this.callOnLoad();
    this.showMessage();

  }
  
  calculationTypeList : any;
  taxTypeList : any;
  users: any;
  displaytable: boolean=false;;
  dtOption: any = {};
  serviceTemplateList: any;
callOnLoad(){
  this.displaytable = false;
   
  // this.templateService.getAllDetail(this.tempcode).subscribe(result=>{

  //   if (result["resultCode"] === '0') {
  //   this.serviceTemplateList=result["feeCommissionTemplateList"];
  //     console.log('feeCommissionTemplateList' ,this.serviceTemplateList);
  //   }else {
  //     console.log('result ' ,this.tempcode,  result["resultCode"]);
       
  //   }
  //   this.dtOption = this.commonHelperService.settingDataTable();
  //   this.displaytable = true;
    
  // },error => console.log('error', error) )
  this.templateService.getServiceCategoryList('all').subscribe(result=>{

    

    if (result["resultCode"] === '0') {
    this.serviceTemplateList=result["serviceCategoryList"];
      console.log('serviceCategoryList' ,this.serviceTemplateList);
    }else {
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
      this.submitted = true;
      if(this.serviceTemplateForm.invalid){
        return;
      }
      console.log('request for create service '+ JSON.stringify(this.serviceTemplateForm.getRawValue()));
     
      this.templateService.createServiceProfileTemplate(this.serviceTemplateForm.getRawValue() ).subscribe(result=>{
        console.log('result.feeCommissionTemplate', result.feeCommissionTemplate);
        if (result.resultCode === '0') {

        this.errorMessges =  undefined;
        this.successMessage=  result.resultDescription;
        if(this.templatestate == 'Approved'){
     
          // this.templateService.serviceTemplateList.push(this.serviceTemplateForm.getRawValue());
          this.templateService.serviceTemplateList.push( result.feeCommissionTemplate);
          console.log(' serviceList for  approval ' +JSON.stringify(this.templateService.serviceTemplateList));
        
        }
        this.callOnLoad();

       } else {
        this.errorMessges = result.resultDescription;
      }
      })
 
     
  }

  public SaveTemplate() {
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
  this.templateService.makeEntryToApproval('',this.tempname,this.tempcode,ApprovalConstants.featureCode.TEMPLATE).subscribe(approvalData => {
 
    if (approvalData === null) {
      //this.errorMessges = "There is some error, Please try after some time.";
      this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
        this.errorMessges =data;
        });
        
    } else {
       if (approvalData.resultCode === '0') {

        this.errorMessges = '';
        this.router.navigate(['../'], { relativeTo: this.route, queryParams: { status: 'serviceadded' } });

 
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
        'serviceTemplateList': this.templateService.serviceTemplateList
      };
      this.templateService.serviceTemplateList = [];
 
      this.templateService.makeEntryToApproval( '',this.tempname,this.tempcode, ApprovalConstants.featureCode.FEECOMMISION,updatedInfo).subscribe(approvalData => {

        if (approvalData === null) {
          //this.errorMessges = "There is some error, Please try after some time.";
          this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
            this.errorMessges =data;
            });
            
        } else {
           if (approvalData.resultCode === '0') {

            this.errorMessges = undefined;
            this.router.navigate(['../'], { relativeTo: this.route, queryParams: { status: 'serviceupdated' } });
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
    
    if(this.rediretedFrom && this.rediretedFrom == WalletOwnerConstants.redirectedFrom.WALLETOWNER){
      if( this.tempDataWallet.editMode){
      this.router.navigate(['../../wallet-owner/edit/'+this.walletOwnerCategoryCode], { relativeTo: this.route ,skipLocationChange : true,  queryParams:  {stage : 'Template'} });
      }else{
        this.router.navigate(['../../wallet-owner/view/'+this.walletOwnerCategoryCode], { relativeTo: this.route ,skipLocationChange : true,  queryParams:  {stage : 'Template'} });

      }
    }else{
    this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
  serviceCategoryList: any;
  serviceProviderList :any;
  onChangeService(event){
     
    this.templateService.getServiceCategoryList(event.target.value).subscribe(result=>{
      this.serviceCategoryList=result["serviceCategoryList"];
     }
     ,error => console.log('error', error) )
     }
  onChangeServiceCategory(event){
    this.templateService.getServiceProviderList(event.target.value).subscribe(result=>{
      this.serviceProviderList=result["serviceProviderList"];

    },error => console.log('error', error) )
  }  
  channelCode : string='';
  serviceCode : string='';
  serviceCategoryCode : string='';
  serviceProviderCode : string='';
  fixedComiValue : string;
  percentComiValue: string;
  calculationTypeCode: string='';
  percentFeeValue: string;
  fixedFeeValue: string;
  taxTypeCode: string='';
  createFormGroup(){
    
    this.serviceTemplateForm = new FormGroup({
      templateCode: new FormControl(this.tempcode),
      channelTypeCode: new FormControl(this.channelCode ),
      serviceCode: new FormControl(this.serviceCode,[Validators.required]),
      serviceCategoryCode: new FormControl(this.serviceCategoryCode,[Validators.required]),
      serviceProviderCode: new FormControl(this.serviceProviderCode,[Validators.required]),
      fixedComiValue: new FormControl(this.fixedComiValue),
      percentComiValue: new FormControl(this.percentComiValue ),
      walletOwnerCategoryCode : new FormControl(this.walletOwnerCategoryCode)
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
  // viewForm(template :any){
 
  //  const modalRef = this.modalService.open(ViewFeeCommisionComponent);
  //  modalRef.componentInstance.data = template;
  // }
  viewFee(template :any){
    
    var tmp={code: this.tempcode,name :  this.tempname,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,
     templateCategoryCode: this.templateCategoryCode,walletOwnerCategoryCode: this.walletOwnerCategoryCode,state:this.templatestate,
     redirectedFrom : this.rediretedFrom,
     editMode : this.tempDataWallet.editMode};
  
    this.router.navigate(['../viewFeeCommisionTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(template), temp:JSON.stringify(tmp),display:this.display}});

 }
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
        //this.successMessage = 'Service Added successfully, sent for approval';
        this.translate.languageText('TEMPLATE.serviceAddedsuccessfullysentforapproval', data=> {
          this.successMessage =data;
          });
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        //this.successMessage = 'Service Updation added for approval successfully.';
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
