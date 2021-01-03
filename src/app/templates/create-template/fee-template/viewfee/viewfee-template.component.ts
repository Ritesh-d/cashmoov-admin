
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import{ CreateTemplateService} from '../../create-template.service'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import{ TemplatesService } from '../../../templates.service'
import { FeeTemplateService } from '../fee-template.service';
import { setMastersService } from '../../../../shared/services/set-masters.service';
import { MastersViewModelBuilder } from '../../../../shared/masters-view-model.builder';
import { TemplatesConstants } from '../../../templates.constants';
import { CommonHelperService } from '../../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewFeeComponent } from '../service-view/viewservicetemplate.component';
import { ApprovalConstants } from '../../../../approval/approval.constants';
import { ApprovalService } from '../../../../approval/approval.service';
import { AddTemplateService } from '../../../add-template/add-template.service';
import {TranslatelanguageService} from '../../../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-viewfee-template',
  templateUrl: './viewfee-template.component.html',
  styleUrls: ['./viewfee-template.component.css']
})
export class ViewFeeTemplateComponent implements OnInit {

  constructor( private addTemplate : AddTemplateService, 
    private approvalService : ApprovalService,
    private modalService: NgbModal,
    private commonHelperService: CommonHelperService,
    private mastersViewModel: MastersViewModelBuilder,
    private templateService : FeeTemplateService ,
    private tempService:TemplatesService,
    private translate: TranslatelanguageService,
    private createTemplateService:CreateTemplateService, private route: ActivatedRoute,private router:Router) {
  
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
  datatemplate : any;
  walletOwnerList: any;
  bearerList: any;
  redirectedFrom: string
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
      this.redirectedFrom = tmp.redirectedFrom

      console.log(this.tempcode,this.tempname);
      this.datatemplate=  JSON.parse(this.route.snapshot.queryParamMap.get('data')); 
      console.log('-- data' ,this.datatemplate);
      // const groupMasterString = TemplatesConstants.masters.TRANTYPE + ',' + TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;
      const groupMasterString =   TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;

      this.templateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
        
         this.channelTypeList =  data.channelTypeList == undefined?'': data.channelTypeList;
         this.eWalletServiceList = data.ewalletServiceList  == undefined?'':data.ewalletServiceList;
        //  this.tranTypeList = data.tranTypeList == undefined?'':data.tranTypeList;
  
    }, error => console.log('error', error));
     this.templateService.getCalculationType().subscribe((data: any) => {
      if (data["resultCode"] === '0') {
        this.calculationTypeList= data["calculationTypeList"];
      }

    }, error => console.log('error', error));
    this.templateService.getTaxType().subscribe((data: any) => {
      if (data["resultCode"] === '0') {
        this.taxTypeList= data["taxTypeList"];
      }

    }, error => console.log('error', error));
   
    this.callOnLoad();
    this.showMessage();
    this.createFormGroup();
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
    
    this.templateService.getServiceProviderList(this.datatemplate.code).subscribe(result=>{
      this.serviceProviderList=result["serviceProviderList"];
  
    },error => console.log('error', error) )
    this.templateService.fetchWalletOwnerOnCategory('100007').subscribe(result=>{
      this.walletOwnerList=result["walletOwnerList"];
  
    },error => console.log('error', error) )
    
    this.templateService.getWalletCategoryMasters().subscribe(result=>{
       
      this.bearerList = result["categoryList"];
      this.bearerList =  this.bearerList.filter(m=>{
        return m.code != '100006' && m.code != '100007'

      });

    })
    
    this.serviceTemplateForm.get("calculationTypeCode").valueChanges.subscribe(x => {
     
      if(this.serviceTemplateForm.get("calculationTypeCode").value == '100001'){  // fixed
        console.log('cal type' +this.serviceTemplateForm.get("calculationTypeCode").value);
          this.serviceTemplateForm.get("fixedFeeValue").enable();
          this.serviceTemplateForm.get("fixedFeeValue").setValue('');
          this.serviceTemplateForm.get("percentFeeValue").setValue("0") ;
          this.serviceTemplateForm.get("percentFeeValue").disable();
      }
      else if (this.serviceTemplateForm.get("calculationTypeCode").value == '100002'){
         console.log('cal type' +this.serviceTemplateForm.get("calculationTypeCode").value);
        this.serviceTemplateForm.get("percentFeeValue").enable();
        this.serviceTemplateForm.get("percentFeeValue").setValue('');
        this.serviceTemplateForm.get("fixedFeeValue").setValue("0") ;
        this.serviceTemplateForm.get("fixedFeeValue").disable();
      }
        else if (this.serviceTemplateForm.get("calculationTypeCode").value == '100003'){
         console.log('cal type' +this.serviceTemplateForm.get("calculationTypeCode").value);
        this.serviceTemplateForm.get("percentFeeValue").enable();
        this.serviceTemplateForm.get("percentFeeValue").setValue('');
        this.serviceTemplateForm.get("fixedFeeValue").enable();
        this.serviceTemplateForm.get("fixedFeeValue").setValue('');
      }
    });
    this.multiselectform = new FormGroup({
      taxTypeCode: new FormControl('', Validators.required)
    });
   
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
    this.serviceTemplateList=result["feeTemplateList"];
    this.serviceTemplateList = this.serviceTemplateList.filter(m=>{
     return  m.serviceCategoryCode == this.datatemplate.code;
    })
    
      console.log('feeTemplateList' ,this.serviceTemplateList);
    }else {
      console.log('result ' ,this.tempcode,  result["resultCode"]);
       
    }
    this.dtOption = this.commonHelperService.settingDataTable();
    this.displaytable = true;
    
  },error => console.log('error', error) )


}
  get f1() { return this.multiselectform.controls; }
 
  get f() { return this.serviceTemplateForm.controls; }

  submitted : boolean= false;
  errorMessges: string;
  successMessage:string;
 
  public createTemplate() {
    this.clearMsg();

    console.log('createTemplate');
      this.submitted = true;
      if(this.serviceTemplateForm.invalid || this.multiselectform.invalid){
        return;
      }
      
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
      console.log('request for create service ' ,this.serviceTemplateForm.getRawValue());
      // console.log('selected taxTypeCodes '+ this.serviceTemplateForm.get("taxTypeCode").value);
      // for()
      if(this.tempService.approvalRequired){
      this.templateService.createServiceProfileTemplate(this.serviceTemplateForm.getRawValue() ).subscribe(result=>{
        console.log('result.feeTemplate', result.feeTemplate);
        if (result.resultCode === '0') {

        this.errorMessges =  undefined;
        this.successMessage=  result.resultDescription;
        if(this.templatestate == 'Approved'){
     
          // this.templateService.serviceTemplateList.push(this.serviceTemplateForm.getRawValue());
          this.templateService.serviceTemplateList.push( result.feeTemplate);
          console.log(' serviceTemplateList for  approval ' +JSON.stringify(this.templateService.serviceTemplateList));
        
        }
        this.submitted = false;
        this.serviceTemplateForm.get("minValue").setValue('');
        this.serviceTemplateForm.get("maxValue").setValue('');
        this.serviceTemplateForm.get("fixedFeeValue").setValue('');
        this.serviceTemplateForm.get("percentFeeValue").setValue('');
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
      this.templateService.createServiceProfileTemplate( request ).subscribe(result=>{
        console.log('result.feeTemplate', result.feeTemplate);
        if (result.resultCode === '0') {

        this.errorMessges =  undefined;
        this.successMessage=  result.resultDescription;
      
        this.submitted = false;
        this.serviceTemplateForm.get("minValue").setValue('');
        this.serviceTemplateForm.get("maxValue").setValue('');
        this.serviceTemplateForm.get("fixedFeeValue").setValue('');
        this.serviceTemplateForm.get("percentFeeValue").setValue('');
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
    console.log('this.serviceTemplateList',this.serviceTemplateList);
  this.templateService.makeEntryToApproval(this.serviceTemplateList, this.tempname,this.tempcode,ApprovalConstants.featureCode.TEMPLATE).subscribe(approvalData => {
 
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
  console.log('updated info to approved serviceTemplateList',this.templateService.serviceTemplateList);
 
     
      const updatedInfo = {
        'feeTemplateList': this.templateService.serviceTemplateList
      };
      this.templateService.serviceTemplateList =  [];
     
      this.templateService.makeEntryToApproval(this.serviceTemplateList, this.tempname,this.tempcode, ApprovalConstants.featureCode.FEETEMPLATE,updatedInfo).subscribe(approvalData => {

        if (approvalData === null) {
          //this.errorMessges = "There is some error, Please try after some time.";
          this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
            this.errorMessges =data;
            });
        } else {
           if (approvalData.resultCode === '0') {

            this.errorMessges = undefined;
            this.router.navigate(['../'], { relativeTo: this.route, queryParams: { status: 'serviceupdated' } });
            

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
      this.router.navigate(['../'], { relativeTo: this.route, queryParams: { status: 'serviceadded' } });
    } else{
      this.router.navigate(['../'], { relativeTo: this.route, queryParams: { status: 'serviceupdated' } });

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
      redirectedFrom: this.redirectedFrom,
      editMode : this.tempDataWallet.editMode};
  
     this.router.navigate(['../createFeeTemplate'], { relativeTo: this.route, skipLocationChange: true,queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) ,display: this.display} });    
   
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
  minValue : string='';
  maxValue: string='';
  calculationTypeCode: string='';
  percentFeeValue: string='';
  fixedFeeValue: string='';
  taxTypeCode: string='';
  taxAccountCode: string='';
  bearer: string='';
  taxAccountList: any;
  createFormGroup(){
    
    this.serviceTemplateForm = new FormGroup({
      templateCode: new FormControl(this.tempcode),
      channelTypeCode: new FormControl(this.channelCode ,[Validators.required]),
      serviceCode: new FormControl(this.datatemplate.serviceCode,[Validators.required]),
      serviceCategoryCode: new FormControl(this.datatemplate.code,[Validators.required]),
      serviceProviderCode: new FormControl(this.serviceProviderCode,[Validators.required]),
      minValue: new FormControl(this.minValue,[Validators.required]),  //Validators.pattern('/^-?(0|[1-9]\d*)?$/')
      maxValue: new FormControl(this.maxValue,[Validators.required] ), //Validators.pattern('/^-?(0|[1-9]\d*)?$/')
      calculationTypeCode: new FormControl(this.calculationTypeCode,[Validators.required] ),
      fixedFeeValue: new FormControl(this.fixedFeeValue ,[Validators.required]),
      percentFeeValue: new FormControl(this.percentFeeValue,[Validators.required] ),
      taxTypeCode: new FormControl(this.taxTypeCode  ),
      taxAccount : new FormControl(this.taxAccountCode ),
      bearer : new FormControl(this.bearer ),
    });
  }
  editForm(template :any){
  
    this.clearMsg();

    var tmp={code: this.tempcode,name :  this.tempname,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,
      templateCategoryCode: this.templateCategoryCode,walletOwnerCategoryCode: this.walletOwnerCategoryCode,state:this.templatestate};
   
    this.router.navigate(['../editFeeTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(template), temp:JSON.stringify(tmp)}});
 
  }
  clearMsg(){
    this.errorMessage='';
    this.successMessage='';
  }
  viewForm(template :any){
 
   const modalRef = this.modalService.open(ViewFeeComponent);
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
          //this.successMessage = 'Service Added successfully, sent for approval';
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
         // this.successMessage = 'Service Updation added for approval successfully.';
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
  // addSlabs(event: any) {

  //   var x = document.getElementById("addslab");
  //   if (x.style.display === "none") {
  //     x.style.display = "block";
  //   }
  // }
  viewFee(){
    
  }
}
