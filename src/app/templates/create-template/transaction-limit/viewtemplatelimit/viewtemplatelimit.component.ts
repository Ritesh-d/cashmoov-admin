
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import{ CreateTemplateService} from '../../create-template.service'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import{ TemplatesService } from '../../../templates.service'
import { TemplateLimitService } from '../template-limit.service';
import { setMastersService } from '../../../../shared/services/set-masters.service';
import { MastersViewModelBuilder } from '../../../../shared/masters-view-model.builder';
import { TemplatesConstants } from '../../../templates.constants';
import { CommonHelperService } from '../../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewserviceTemplateLimit } from '../service-view/viewservicetemplate.component';
import { ApprovalConstants } from '../../../../approval/approval.constants';
import { ApprovalService } from '../../../../approval/approval.service';
import { AddTemplateService } from '../../../add-template/add-template.service';
import {TranslatelanguageService} from '../../../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-viewfee-template',
  templateUrl: './viewtemplatelimit.component.html',
  styleUrls: ['./viewtemplatelimit.component.css']
})
export class ViewTemplateLimit implements OnInit {

  constructor( private addTemplate : AddTemplateService,
    private approvalService : ApprovalService,
    private modalService: NgbModal,
    private commonHelperService: CommonHelperService,
    private mastersViewModel: MastersViewModelBuilder,
    private templateService : TemplateLimitService ,
    private translate: TranslatelanguageService,
    private tempService:TemplatesService,private createTemplateService:CreateTemplateService, private route: ActivatedRoute,private router:Router) {
  
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
  datatemplate : any;
  walletOwnerList: any;
  calculationCycleTypeList: any;
  calculationCycleList: any;
  profileTypeList: any;
  redirectedFrom : string;
  tempDataWallet : any;
      
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
      // this.templatestate = 'Approved';
      this.templateCategoryName= tmp.templateCategoryName;
      this.walletOwnerCategoryName = tmp.walletOwnerCategoryName;
      this.walletOwnerCategoryCode = tmp.walletOwnerCategoryCode;
      this.templateCategoryCode=tmp.templateCategoryCode;
      this.redirectedFrom = tmp.redirectedFrom;
      console.log(this.tempcode,this.tempname);
      this.datatemplate=  JSON.parse(this.route.snapshot.queryParamMap.get('data')); 
      console.log('-- data' ,this.datatemplate);
      // const groupMasterString = TemplatesConstants.masters.TRANTYPE + ',' + TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;
      const groupMasterString =   TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE+','+TemplatesConstants.masters.CALCULATIONCYCLE+','+
                                  TemplatesConstants.masters.CALCULATIONCYCLETYPE +','+TemplatesConstants.masters.PROFILETYPE ;

      this.templateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
        
         this.channelTypeList =  data.channelTypeList == undefined?'': data.channelTypeList;
         this.eWalletServiceList = data.ewalletServiceList  == undefined?'':data.ewalletServiceList;
         this.calculationCycleList = data["calculationCycleList"] == undefined?'':data["calculationCycleList"];
         this.calculationCycleTypeList = data["calculationCycleTypeList"] == undefined?'':data["calculationCycleTypeList"];
         this.profileTypeList = data["profileTypeList"] == undefined?'':data["profileTypeList"];

         //  this.tranTypeList = data.tranTypeList == undefined?'':data.tranTypeList;
  
    }, error => console.log('error', error));
    
   
   
    this.callOnLoad();
    this.showMessage();
    this.createFormGroup();
 
    
    this.templateService.getServiceProviderList(this.datatemplate.code).subscribe(result=>{
      this.serviceProviderList=result["serviceProviderList"];
  
    },error => console.log('error', error) )   
   
  }

  calculationTypeList : any;
  taxTypeList : any;
  users: any;
  displaytable: boolean=false;;
  dtOption: any = {};
  serviceTemplateList: any;
  callOnLoad(){
  this.displaytable = false;
   
  this.templateService.getAllDetail(this.tempcode).subscribe(result=>{

    if (result["resultCode"] === '0') {
    this.serviceTemplateList=result["transactionLimitTemplateList"];
    this.serviceTemplateList = this.serviceTemplateList.filter(m=>{
     return  m.serviceCategoryCode == this.datatemplate.code;
    })
    
      console.log('transactionLimitTemplate' ,this.serviceTemplateList);
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
    this.clearMsg();

    console.log('createTemplate');
      this.submitted = true;
      if(this.serviceTemplateForm.invalid  ){
        return;
      }
      
   
      if(this.tempService.approvalRequired){
      console.log('request for create service ' ,this.serviceTemplateForm.getRawValue());
 
      this.templateService.createTemplate(this.serviceTemplateForm.getRawValue() ).subscribe(result=>{
        console.log('result.transactionLimitTemplate', result.transactionLimitTemplate);
        if (result.resultCode === '0') {

        this.errorMessges =  undefined;
        this.successMessage=  result.resultDescription;
        if(this.templatestate == 'Approved'){
     
          this.templateService.serviceTemplateList.push( result.transactionLimitTemplate);
          console.log(' transactionLimitTemplateList for  approval ' +JSON.stringify(this.templateService.serviceTemplateList));
        
        }
        this.submitted = false;
        this.serviceTemplateForm.get("value").setValue('');
 
        this.callOnLoad()

       } else {
        this.errorMessges = result.resultDescription;
      }
      })
    }else{
      let request ={
        ...this.serviceTemplateForm.getRawValue(),
        status: ApprovalConstants.status.code.ACTIVE,
        state: ApprovalConstants.state.code.APPROVED
      }
      console.log('request for create service ' ,request);

      this.templateService.createTemplate(request ).subscribe(result=>{
        console.log('result.transactionLimitTemplate', result.transactionLimitTemplate);
        if (result.resultCode === '0') {

        this.errorMessges =  undefined;
        this.successMessage=  result.resultDescription;
      
        this.submitted = false;
        this.serviceTemplateForm.get("value").setValue('');
 
        this.callOnLoad()

       } else {
        this.errorMessges = result.resultDescription;
      }
      })
    }
     
  }
  saveclicked : Boolean = false;
  public SaveTemplate() {
    this.clearMsg();
    this.saveclicked = true;
    console.log('this.templatestate'+ this.templatestate);
 if(this.tempService.approvalRequired){
  if(this.templatestate != 'Approved'){
    console.log('this.templateList',this.serviceTemplateList);
  this.templateService.makeEntryToApproval(this.serviceTemplateList, this.tempname,this.tempcode,ApprovalConstants.featureCode.TEMPLATE).subscribe(approvalData => {
 
    if (approvalData === null) {
      //this.errorMessges = "There is some error, Please try after some time.";
      this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
        this.errorMessges =data;
        });
    } else {
       if (approvalData.resultCode === '0') {

        this.errorMessges = '';
        this.router.navigate(['../'], { relativeTo: this.route,skipLocationChange: true, queryParams: { status: 'serviceadded' } });

 
       } else {
        this.errorMessges = approvalData.resultDescription;
      }
    }
  });
}else{
  console.log('updated info to approved serviceTemplateList',this.templateService.serviceTemplateList);
 
     
      const updatedInfo = {
        'transactionLimitTemplate': this.templateService.serviceTemplateList
      };
      this.templateService.serviceTemplateList =  [];
     
      this.templateService.makeEntryToApproval(this.serviceTemplateList, this.tempname,this.tempcode, ApprovalConstants.featureCode.TRANSACTIONLIMIT,updatedInfo).subscribe(approvalData => {

        if (approvalData === null) {
          //this.errorMessges = "There is some error, Please try after some time.";
          this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
            this.errorMessges =data;
            });
        } else {
           if (approvalData.resultCode === '0') {

            this.errorMessges = undefined;
            this.router.navigate(['../'], { relativeTo: this.route,skipLocationChange: true, queryParams: { status: 'serviceupdated' } });
            

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
    this.router.navigate(['../'], { relativeTo: this.route,skipLocationChange: true, queryParams: { status: 'serviceadded' } });

  }else{
    this.router.navigate(['../'], { relativeTo: this.route,skipLocationChange: true, queryParams: { status: 'serviceupdated' } });

  }

 } else {
  this.errorMessges = result["resultDescription"];
}
});

  

}
}

  navigateBack() {
     var tmp={code: this.tempcode,name :  this.tempname,state:this.templatestate,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,
      walletOwnerCategoryCode:this.walletOwnerCategoryCode,templateCategoryCode:this.templateCategoryCode,
      redirectedFrom : this.redirectedFrom ,
      editMode : this.tempDataWallet.editMode};
  
     this.router.navigate(['../tranLimitTemplate'], { relativeTo: this.route, skipLocationChange: true,queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) ,display: this.display} });    
   
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
  calculationCycleCode: string='';
  calculationCycleTypeCode: string='';
  profileTypeCode: string='';
  value: string='';
 
  createFormGroup(){
    
    this.serviceTemplateForm = new FormGroup({
      templateCode: new FormControl(this.tempcode),
      channelTypeCode: new FormControl(this.channelCode ,[Validators.required]),
      serviceCode: new FormControl(this.datatemplate.serviceCode,[Validators.required]),
      serviceCategoryCode: new FormControl(this.datatemplate.code,[Validators.required]),
      serviceProviderCode: new FormControl(this.serviceProviderCode,[Validators.required]),
      calculationCycleCode: new FormControl(this.calculationCycleCode,[Validators.required]),

      calculationCycleTypeCode: new FormControl(this.calculationCycleTypeCode,[Validators.required]),

      profileTypeCode: new FormControl(this.profileTypeCode,[Validators.required]),

      value: new FormControl(this.value,[Validators.required] ),
     });
  }
  editForm(template :any){
  
    this.clearMsg();

    var tmp={code: this.tempcode,name :  this.tempname,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,
      templateCategoryCode: this.templateCategoryCode,walletOwnerCategoryCode: this.walletOwnerCategoryCode,state:this.templatestate};
   
    this.router.navigate(['../editTemplateLimit'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(template), temp:JSON.stringify(tmp)}});
 
  }
  clearMsg(){
    this.errorMessage='';
    this.successMessage='';
  }
  viewForm(template :any){
 
   const modalRef = this.modalService.open(ViewserviceTemplateLimit);
   modalRef.componentInstance.data = template;
  }
  ngOnDestroy()
  {
    
    // if(!this.saveclicked){
     
    //     if(window.confirm('Do you want to process for approval ?')){
    //       console.log('ok');
    //       this.SaveTemplate();

    //     }else{
    //       console.log('exit');
          
    //     }
    // } 
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
  // addSlabs(event: any) {

  //   var x = document.getElementById("addslab");
  //   if (x.style.display === "none") {
  //     x.style.display = "block";
  //   }
  // }
  viewFee(){
    
  }
}
