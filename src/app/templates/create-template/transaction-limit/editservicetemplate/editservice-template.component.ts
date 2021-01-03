
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TemplateLimitService } from '../template-limit.service';
import { TemplatesConstants } from '../../../templates.constants';
import { CommonHelperService } from '../../../../shared/services/common-helper-service';
import { ApprovalConstants } from '../../../../approval/approval.constants';
import { ApprovalService } from '../../../../approval/approval.service';
import { TemplatesService } from '../../../templates.service';
 

@Component({
  selector: 'app-editservice-template',
  templateUrl: './editservice-template.component.html',
  styleUrls: ['./editservice-template.component.css']
})
export class EditServiceTemplateLimit implements OnInit {

  constructor(  private commonHelperService: CommonHelperService, private tempService:TemplatesService,private templateService: TemplateLimitService, 
      private activatedrouter: ActivatedRoute, private router: Router,private approvalService : ApprovalService) {

  }  
  errorMessage: '';
  public serviceTemplateForm: FormGroup;
  
  public data = [];
  public settings = {};
  public updatedata = [];

  channelTypeList: any;
  eWalletServiceList: any;
  tranTypeList: any;
  templateCategoryName: string;
  walletOwnerCategoryName: string;
  editMode: boolean = false;
  display: string;
  channelCode: string = '';
  serviceCode: string = '';
  serviceCategoryCode: string = '';
  serviceProviderCode: string = '';
  transTypeCode: string = '';
 
  templateName: string;
  oldTemplate : any;
  serviceTemplateCode: string;
  templatestate: string;
  status: string;
  state: string;
  taxAccount: string;
  textTaxAccount: string;
  bearer: string;
  textCalculationTypeName :string;
  textTaxTypeName: string;
  params : any;
  walletOwnerList: any;
  calculationCycleList: any;
  calculationCycleTypeList: any;
  profileTypeList: any;
  calculationCycleCode: string;
  calculationCycleTypeCode: string;
  profileTypeCode: string;
  textCalculationCycle: string;
  textCalculationCycleType: string;
  textProfileType: string;
  value: string;
   tempcode; tempname;walletOwnerCategoryCode;templateCategoryCode; 
  async ngOnInit() {
 
     if (this.activatedrouter.snapshot.queryParamMap.get('temp'))
       var tmp=  JSON.parse(this.activatedrouter.snapshot.queryParamMap.get('temp')); 
       console.log('this.tmp' , tmp);
       this.walletOwnerCategoryName = tmp.walletOwnerCategoryName;
       this.templateCategoryName = tmp.templateCategoryName;
       this.templateCategoryCode = tmp.templateCategoryCode;
       this.walletOwnerCategoryCode = tmp.walletOwnerCategoryCode;
       this.templatestate = tmp.state;
       console.log('edit  this.templatestate'+  this.templatestate);
    // this.activatedrouter.queryParams.subscribe((params: Params) => {
      if (this.activatedrouter.snapshot.queryParamMap.get('data')){
      this.params=  JSON.parse(this.activatedrouter.snapshot.queryParamMap.get('data')); 
      console.log('params' + JSON.stringify( this.params));
      this.oldTemplate =  this.params;
      this.serviceTemplateCode =  this.params.code;
      this.value =  this.params.value;
      this.tempcode=  this.params.templateCode;
      this.templateName =  this.params.templateName;
      this.channelCode=  this.params.channelTypeCode;
      this.textChannelType =  this.params.channelTypeName;
      this.serviceCode=  this.params.serviceCode;
      this.textService =  this.params.serviceName;
      this.serviceCategoryCode=  this.params.serviceCategoryCode;
      this.textServiceCategory =  this.params.serviceCategoryName;
      this.serviceProviderCode=  this.params.serviceProviderCode;
      this.textServiceProvider =  this.params.serviceProviderName;
      this.calculationCycleCode =    this.params.calculationCycleCode;
      this.textCalculationCycle =    this.params.calculationCycleName;
      this.calculationCycleTypeCode =    this.params.calculationCycleTypeCode;
      this.textCalculationCycleType =    this.params.calculationCycleTypeName;
      this.profileTypeCode =    this.params.profileTypeCode;
      this.textProfileType =    this.params.profileTypeName;
      this.status =   this.params.status;
      this.state =   this.params.state;
 
    };
    this.createFormGroup();
    
    const groupMasterString =   TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE+','+TemplatesConstants.masters.CALCULATIONCYCLE+','+
                                  TemplatesConstants.masters.CALCULATIONCYCLETYPE +','+TemplatesConstants.masters.PROFILETYPE ;

      this.templateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
        
         this.channelTypeList =  data.channelTypeList == undefined?'': data.channelTypeList;
         this.eWalletServiceList = data.ewalletServiceList  == undefined?'':data.ewalletServiceList;
         this.calculationCycleList = data["calculationCycleList"] == undefined?'':data["calculationCycleList"];
         this.calculationCycleTypeList = data["calculationCycleTypeList"] == undefined?'':data["calculationCycleTypeList"];
         this.profileTypeList = data["profileTypeList"] == undefined?'':data["profileTypeList"];

   
    }, error => console.log('error', error));
 
      this.templateService.getServiceCategoryList('all').subscribe(result => {
        this.serviceCategoryList = result["serviceCategoryList"];
      }
        , error => console.log('error', error))
        this.templateService.getServiceProviderApiData('all').subscribe(result => {
          this.serviceProviderList = result["serviceProviderList"];
        } , error => console.log('error', error))
    
  }
 
  
  prepareDataForUpdateStatus(data) {
    return {
      ...data,
      createdBy: "",
      creationDate: "",
      status: this.approvalService.getDataApprovalStatus(data.status) ,
      state: ApprovalConstants.status.code.UPDATED
    }
    
  }
  dataForupdatedInformation(data) {
    return {
      ...data,
      channelTypeName : this.textChannelType,
      serviceProviderName : this.textServiceProvider,
      serviceCategoryName : this.textServiceCategory,
      serviceName : this.textService,
      calculationCycleName : this.textCalculationCycle,
      calculationCycleTypeName : this.textCalculationCycleType,
      profileTypeName : this.textProfileType,
      status:  this.status ,
      state: this.state
    }
    
  }
  get f() { return this.serviceTemplateForm.controls; }

  submitted: boolean = false;
  errorMessges: string;
  successMessage: string;
  textService: string;
  textServiceCategory: string;
  textServiceProvider: string;
  textChannelType: string;

  onChangeGetServiceProviderName($event){
      this.textServiceProvider = $event.target.options[$event.target.options.selectedIndex].text;
  }
 
  onChangeGetChannelTypeName($event){
      this.textChannelType = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onChangeGetCalculationCycleName($event){
    this.textCalculationCycle = $event.target.options[$event.target.options.selectedIndex].text;

  }
  onChangeGetCalculationCycleTypeName($event){
    this.textCalculationCycleType = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onChangeGetProfileTypeName($event){
    this.textProfileType = $event.target.options[$event.target.options.selectedIndex].text;
  }
 
  public updateTemplate() {
    this.submitted = true;
    if (this.serviceTemplateForm.invalid) {
      return;
    }
  if(this.tempService.approvalRequired){
    console.log('rawvalues Form' , this.serviceTemplateForm.getRawValue());
  //  console.log(this.oldTemplate.code,'this.prepareDataForUpdateStatus(this.oldTemplate)' +JSON.stringify(this.prepareDataForUpdateStatus(this.oldTemplate)))
    this.templateService.modifyServiceProfileTemplate(this.prepareDataForUpdateStatus(this.oldTemplate), this.oldTemplate.code).subscribe(result => {
        console.log(result);
        if (result.resultCode === '0') {
          // console.log('this.dataForupdatedInformation()',this.dataForupdatedInformation(this.serviceTemplateForm.getRawValue()));
          this.templateService.serviceTemplateList.push(this.dataForupdatedInformation(this.serviceTemplateForm.getRawValue()));
          console.log( 'shared Date ' ,this.templateService.serviceTemplateList);
        
          var tmp={
            code: this.tempcode,
            name: this.templateName,
            state : this.templatestate,
            walletOwnerCategoryName: this.walletOwnerCategoryName,
            templateCategoryName: this.templateCategoryName,
            templateCategoryCode: this.templateCategoryCode,
            walletOwnerCategoryCode: this.walletOwnerCategoryCode
          };
          var params ={
            code: this.serviceCategoryCode,
            name: this.params.serviceCategoryName,
            serviceCode: this.params.serviceCode,
            serviceName: this.params.serviceName
          }
          this.router.navigate(['../createTranLimitTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(params), temp:JSON.stringify(tmp) ,display:'block'} });    
        }
      });
   
    }else{
      let request = {
        ...this.serviceTemplateForm.getRawValue(),
        status : ApprovalConstants.status.code.ACTIVE,
        state : ApprovalConstants.state.code.APPROVED
      }
      console.log('rawvalues Form' , request);
         this.templateService.modifyServiceProfileTemplate(request, this.oldTemplate.code).subscribe(result => {
            console.log(result);
            if (result.resultCode === '0') {
               
              var tmp={
                code: this.tempcode,
                name: this.templateName,
                state : this.templatestate,
                walletOwnerCategoryName: this.walletOwnerCategoryName,
                templateCategoryName: this.templateCategoryName,
                templateCategoryCode: this.templateCategoryCode,
                walletOwnerCategoryCode: this.walletOwnerCategoryCode
              };
              var params ={
                code: this.serviceCategoryCode,
                name: this.params.serviceCategoryName,
                serviceCode: this.params.serviceCode,
                serviceName: this.params.serviceName
              }
              this.router.navigate(['../createTranLimitTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(params), temp:JSON.stringify(tmp) ,display:'block',status: 'updated'} });    
            }
          });
    }
   
  }

  navigateBack() {
 
    var tmp = {
      code: this.tempcode,
      name: this.templateName,
      walletOwnerCategoryName: this.walletOwnerCategoryName,
      templateCategoryName: this.templateCategoryName,
      templateCategoryCode: this.templateCategoryCode,
      walletOwnerCategoryCode: this.walletOwnerCategoryCode
    }
    var params = {
      code: this.serviceCategoryCode,
      name: this.params.serviceCategoryName,
      serviceCode: this.params.serviceCode,
      serviceName: this.params.serviceName
    }
    this.router.navigate(['../createTranLimitTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(params), temp:JSON.stringify(tmp) ,display:'block'} });    
  }
  serviceCategoryList: any;
  serviceProviderList: any;
  
  
 
  calculationTypeCode: string;
  percentFeeValue: string;
  fixedFeeValue: string;
  taxTypeCode: any;
  selected: any =  [];
  createFormGroup() {

    this.serviceTemplateForm = new FormGroup({
      
      code : new  FormControl(this.serviceTemplateCode),
      templateName : new FormControl(this.templateName),
      templateCode: new FormControl(this.tempcode),
      channelTypeCode: new FormControl(this.channelCode),
      serviceCode: new FormControl(this.serviceCode, [Validators.required]),
      serviceCategoryCode: new FormControl(this.serviceCategoryCode, [Validators.required]),
      serviceProviderCode: new FormControl(this.serviceProviderCode, [Validators.required]),
      calculationCycleCode: new FormControl(this.calculationCycleCode,[Validators.required]),

      calculationCycleTypeCode: new FormControl(this.calculationCycleTypeCode,[Validators.required]),

      profileTypeCode: new FormControl(this.profileTypeCode,[Validators.required]),

      value: new FormControl(this.value  ),
        
    });
  }

  clearMsg() {
    this.errorMessage = '';
    this.successMessage = '';
  }

}
