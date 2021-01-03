
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import{ CreateTemplateService} from '../create-template.service'
import { Router, ActivatedRoute } from '@angular/router';
import{ TemplatesService } from '../../templates.service'
import { ServiceProfileTemplateServie } from './service-profile-template.service';
import { setMastersService } from '../../../shared/services/set-masters.service';
import { MastersViewModelBuilder } from '../../../shared/masters-view-model.builder';
import { TemplatesConstants } from '../../templates.constants';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewServiceComponent } from './service-view/viewservicetemplate.component';
import { ApprovalConstants } from '../../../approval/approval.constants';
import { ApprovalService } from '../../../approval/approval.service';
import { WalletOwnerConstants } from '../../../wallet-owner/wallet-owner.constants';
import { AddTemplateService } from '../../add-template/add-template.service';
import {TranslatelanguageService} from '../../../shared/services/translatelanguage.service'; 


@Component({
  selector: 'app-service-profile-template',
  templateUrl: './service-profile-template.component.html',
  styleUrls: ['./service-profile-template.component.css']
})
export class ServiceProfileTemplateComponent implements OnInit {

  constructor(private addTemplate : AddTemplateService, 
    private approvalService : ApprovalService,
    private modalService: NgbModal,
    private commonHelperService: CommonHelperService,
    private translate: TranslatelanguageService,
    private mastersViewModel: MastersViewModelBuilder,private serviceProfileTemplateService : ServiceProfileTemplateServie ,private tempService:TemplatesService,private createTemplateService:CreateTemplateService, private route: ActivatedRoute,private router:Router) {
  
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
  tranTypeList: any;
  templateCategoryName: string;
  walletOwnerCategoryName: string;
  editMode : boolean =false;
  display: string;
  walletOwnerCategoryCode:string;
  templateCategoryCode:string;
  transTemplateCategories;tempcode;tempname;templatestate;
  fetchingData : boolean= false;
  rediretedFrom:string;
  tempDataWallet: any;
  ngOnInit() {
      console.log('approval required ' + this.tempService.approvalRequired);
      console.log('display :: '+this.route.snapshot.queryParamMap.get('display'));
      this.display = this.route.snapshot.queryParamMap.get('display');
      console.log(this.route.snapshot.queryParamMap.get('temp'))
      if (this.route.snapshot.queryParamMap.get('temp'))
      var tmp=  JSON.parse(this.route.snapshot.queryParamMap.get('temp')); 
      this.tempDataWallet = tmp;
      this.servtempEntity=tmp.template;
      console.log('-- tmp' ,tmp);
      this.tempcode=tmp.code;
      this.tempname=tmp.name;
      this.templatestate=tmp.state;
      this.rediretedFrom=tmp.redirectedFrom; ;
      // this.templatestate = 'Approved';
      this.templateCategoryName= tmp.templateCategoryName;
      this.walletOwnerCategoryName = tmp.walletOwnerCategoryName;
      this.walletOwnerCategoryCode = tmp.walletOwnerCategoryCode;
      this.templateCategoryCode=tmp.templateCategoryCode;

      console.log('this.walletOwnerCategoryCode' ,this.walletOwnerCategoryCode ,this.tempcode,this.tempname);
      const groupMasterString = TemplatesConstants.masters.TRANTYPE + ',' + TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;
      // const groupMasterString =   TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;

      this.serviceProfileTemplateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
      console.log('data from master ',data.ewalletServiceList);
         this.channelTypeList =  data.channelTypeList == undefined?'': data.channelTypeList;
         this.eWalletServiceList = data.ewalletServiceList  == undefined?'':data.ewalletServiceList;
         this.tranTypeList = data.transTypeList == undefined?'':data.transTypeList;
    //     this.channelTypeList=this.mastersViewModel.channelTypeListData;
    //  this.eWalletServiceList = this.mastersViewModel.ewalletServiceListData;
    }, error => console.log('error', error));
    this.createFormGroup();
    this.callOnLoad();
    this.showMessage();

  }
  users: any;
  displaytable: boolean=false;;
  dtOption: any = {};
  serviceTemplateList: any;
callOnLoad(){
  this.displaytable = false;
   
  this.serviceProfileTemplateService.getAllDetail(this.tempcode).subscribe(result=>{
    this.serviceTemplateList=result["serviceTemplateList"];
    console.log('serviceTemplateList' ,this.serviceTemplateList);
    this.dtOption = this.commonHelperService.settingDataTable();
    this.displaytable = true;
    
  },error => console.log('error', error) )

}
 
  get f() { return this.serviceTemplateForm.controls; }
servtempEntity;
  submitted : boolean= false;
  errorMessges: string;
  successMessage:string;
 
  public createTemplate() {
      this.submitted = true;
      if(this.serviceTemplateForm.invalid){
        return;
      }
      console.log('request for create service ' ,);
      
      if(this.tempService.approvalRequired){
    
      this.serviceProfileTemplateService.createServiceProfileTemplate(this.serviceTemplateForm.getRawValue() ).subscribe(result=>{
        console.log('result.serviceTemplate', result.serviceTemplate);
        
        if (result.resultCode === '0') {

        this.errorMessges =  undefined;
        this.successMessage=  result.resultDescription;
        if(this.templatestate == 'Approved'){
     
        // this.serviceProfileTemplateService.serviceTemplateList.push(this.serviceTemplateForm.getRawValue());
        this.serviceProfileTemplateService.serviceTemplateList.push( result.serviceTemplate);
        console.log(' serviceTemplateList for  approval ' +JSON.stringify(this.serviceProfileTemplateService.serviceTemplateList));
  
      }
  
       
        this.callOnLoad();
       } else {
        this.errorMessges = result.resultDescription;
      }
      })
    }else{
      let request = {
        ...this.serviceTemplateForm.getRawValue(),
        status : ApprovalConstants.status.code.ACTIVE,
        state : ApprovalConstants.state.code.APPROVED
      }
      this.serviceProfileTemplateService.createServiceProfileTemplate(request ).subscribe(result=>{
        console.log('result.serviceTemplate', result.serviceTemplate);
        
        if (result.resultCode === '0') {

        this.errorMessges =  undefined;
        this.successMessage=  result.resultDescription;
        
  
       
        this.callOnLoad();
       } else {
        this.errorMessges = result.resultDescription;
      }
      })
    }
 
     
  }

  public SaveTemplate() {
  console.log('this.templatestate'+ this.templatestate);
  if(this.tempService.approvalRequired){
  console.log(this.servtempEntity);
  if(this.templatestate != 'Approved'){
  this.serviceProfileTemplateService.makeEntryToApproval(this.servtempEntity, this.tempname,this.tempcode,ApprovalConstants.featureCode.TEMPLATE).subscribe(approvalData => {
 
    if (approvalData === null) {
     // this.errorMessges = "There is some error, Please try after some time.";
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
  console.log('updated info to approved serviceTemplateList',this.serviceProfileTemplateService.serviceTemplateList);
  // const updatedInfo = this.serviceProfileTemplateService.preparedUpdatedDataForApproval(this.oldTemplate, this.serviceTemplateForm.getRawValue());
  // console.log('updatedInfo', updatedInfo);
  // this.serviceProfileTemplateService.modifyServiceProfileTemplate(this.prepareDataForUpdateStatus(this.oldTemplate), this.tempcode).subscribe(result => {
  //   console.log(result);
  //   if (result.resultCode === '0') {
     
      const updatedInfo = {
        'serviceTemplateList': this.serviceProfileTemplateService.serviceTemplateList
      };
      console.log('updatedInfo', updatedInfo);
      this.serviceProfileTemplateService.makeEntryToApproval( this.serviceTemplateList,this.tempname,this.tempcode, ApprovalConstants.featureCode.SERVICETEMPLATE,updatedInfo).subscribe(approvalData => {

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
  } else{
   
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
        this.router.navigate(['../'], { relativeTo: this.route, queryParams: { status: 'serviceadded' } });
      }else{
        this.router.navigate(['../'], { relativeTo: this.route, queryParams: { status: 'serviceupdated' } });
      }
  
     } else {
      this.errorMessges = result["resultDescription"];
    }
    });
  
   
   
  }
}

  navigateBack() {
    console.log('this.rediretedFrom' + this.rediretedFrom);
    if(this.rediretedFrom && this.rediretedFrom == WalletOwnerConstants.redirectedFrom.WALLETOWNER){
      if(this.tempDataWallet.editMode){
      this.router.navigate(['../../wallet-owner/edit/'+this.walletOwnerCategoryCode], { relativeTo: this.route ,skipLocationChange : true,  queryParams:  {stage : 'Template' } });
      }
      else {
        this.router.navigate(['../../wallet-owner/view/'+this.walletOwnerCategoryCode], { relativeTo: this.route ,skipLocationChange : true,  queryParams:  {stage : 'Template' } });
        }
    }else{
    this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
  serviceCategoryList: any;
  serviceProviderList :any;
  onChangeService(event){
     
    this.serviceProfileTemplateService.getServiceCategoryList(event.target.value).subscribe(result=>{
      this.serviceCategoryList=result["serviceCategoryList"];
      // this.serviceCategoryList = this.serviceCategoryList.filter(m=>{
      //   return m.status = ApprovalConstants.status.text.ACTIVE;
      // })
     }
     ,error => console.log('error', error) )
     }
  onChangeServiceCategory(event){
    this.serviceProfileTemplateService.getServiceProviderList(event.target.value).subscribe(result=>{
      this.serviceProviderList=result["serviceProviderList"];
      // this.serviceProviderList = this.serviceProviderList.filter(m=>{
      //   return m.status = ApprovalConstants.status.text.ACTIVE;
      // })

    },error => console.log('error', error) )
  }  
  channelCode : string='';
  serviceCode : string='';
  serviceCategoryCode : string='';
  serviceProviderCode : string='';
  transTypeCode : string='';
  minTransValue : string;
  maxTransValue: string;
  createFormGroup(){
    
    this.serviceTemplateForm = new FormGroup({
      templateCode: new FormControl(this.tempcode),
      channelTypeCode: new FormControl(this.channelCode ),
      serviceCode: new FormControl(this.serviceCode,[Validators.required]),
      serviceCategoryCode: new FormControl(this.serviceCategoryCode,[Validators.required]),
      serviceProviderCode: new FormControl(this.serviceProviderCode,[Validators.required]),
      transTypeCode: new FormControl(this.transTypeCode,[Validators.required]),
      minTransValue: new FormControl(this. minTransValue),
      maxTransValue: new FormControl(this.maxTransValue )
    });
  }
  editForm(template :any){
  
    this.clearMsg();

    var tmp={code: this.tempcode,name :  this.tempname,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,
      templateCategoryCode: this.templateCategoryCode,walletOwnerCategoryCode: this.walletOwnerCategoryCode,state:this.templatestate};
   
    this.router.navigate(['../editServiceTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(template), temp:JSON.stringify(tmp)}});
 
  }
  clearMsg(){
    this.errorMessage='';
    this.successMessage='';
  }
  viewForm(template :any){
 
   const modalRef = this.modalService.open(ViewServiceComponent);
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
          //this.successMessage = 'Service Added successfully ';
          this.translate.languageText('TEMPLATE.serviceAddedsuccessfully', data=> {
            this.successMessage =data;
            });
        }
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        if(this.tempService.approvalRequired){
          //this.successMessage = 'Service Updation added for approval successfully.';
          this.translate.languageText('TEMPLATE.serviceUpdationaddedforapprovalsuccessfully', data=> {
            this.successMessage =data;
            });
          }else{
            //this.successMessage = 'Service Updated successfully ';
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
