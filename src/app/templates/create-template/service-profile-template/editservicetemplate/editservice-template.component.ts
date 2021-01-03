
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ServiceProfileTemplateServie } from '../service-profile-template.service';
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
export class EditServiceTemplateComponent implements OnInit {

  constructor(  private commonHelperService: CommonHelperService,private tempService:TemplatesService, private serviceProfileTemplateService: ServiceProfileTemplateServie, 
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
  minTransValue: string;
  maxTransValue: string;
  templateName: string;
  oldTemplate : any;
  serviceTemplateCode: string;
  templatestate: string;
  status: string;
  state: string;
   tempcode; tempname;walletOwnerCategoryCode;templateCategoryCode; 
  ngOnInit() {
 
     if (this.activatedrouter.snapshot.queryParamMap.get('temp'))
       var tmp=  JSON.parse(this.activatedrouter.snapshot.queryParamMap.get('temp')); 
       console.log('this.tmp' , tmp);
       this.walletOwnerCategoryName = tmp.walletOwnerCategoryName;
       this.templateCategoryName = tmp.templateCategoryName;
       this.templateCategoryCode = tmp.templateCategoryCode;
       this.walletOwnerCategoryCode = tmp.walletOwnerCategoryCode;
       this.templatestate = tmp.state;
    // this.activatedrouter.queryParams.subscribe((params: Params) => {
      if (this.activatedrouter.snapshot.queryParamMap.get('data')){
      var params=  JSON.parse(this.activatedrouter.snapshot.queryParamMap.get('data')); 
      console.log('params ssf' + JSON.stringify(params));
      this.oldTemplate = params;
      this.serviceTemplateCode = params.code;
      this.tempcode= params.templateCode;
      this.templateName = params.templateName;
      this.channelCode= params.channelTypeCode;
      this.serviceCode= params.serviceCode;
      this.serviceCategoryCode= params.serviceCategoryCode;
      this.serviceProviderCode= params.serviceProviderCode;
      this.transTypeCode= params.transTypeCode;
      this.minTransValue= params.minTransValue;
      this.maxTransValue= params.maxTransValue;
      this.status =  params.status;
      this.state =  params.state;
      this.textChannelType = params.channelTypeName;
      this.textTranType = params.transTypeName;
      this.textServiceProvider = params.serviceProviderName;
      this.textServiceCategory = params.serviceCategoryName;
      this.textService = params.serviceName;
    };

    const groupMasterString = TemplatesConstants.masters.TRANTYPE + ',' + TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;

    // const groupMasterString = TemplatesConstants.masters.TRANTYPE + ',' + TemplatesConstants.masters.CHANNELTYPE+','+TemplatesConstants.masters.EWALLETSERVICE ;
    // const groupMasterString = TemplatesConstants.masters.CHANNELTYPE + ',' + TemplatesConstants.masters.EWALLETSERVICE;

    this.serviceProfileTemplateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
      console.log('data from master ', data.ewalletServiceList);
      this.channelTypeList = data.channelTypeList == undefined ? '' : data.channelTypeList;
      this.eWalletServiceList = data.ewalletServiceList == undefined ? '' : data.ewalletServiceList;
      this.tranTypeList = data.transTypeList == undefined ? '' : data.transTypeList;
      //this.channelTypeList=this.mastersViewModel.channelTypeListData;
      //this.eWalletServiceList = this.mastersViewModel.ewalletServiceListData;
      }, error => console.log('error', error));

      this.serviceProfileTemplateService.getServiceCategoryList(this.serviceCode).subscribe(result => {
        this.serviceCategoryList = result["serviceCategoryList"];
      }
        , error => console.log('error', error))
        this.serviceProfileTemplateService.getServiceProviderApiData('all').subscribe(result => {
          this.serviceProviderList = result["serviceProviderList"];
        }
          , error => console.log('error', error))
    

      this.createFormGroup();
    // this.callOnLoad();
  }
  // users: any;
  // displaytable: boolean = false;;
  // dtOption: any = {};
  // serviceTemplateList: any;
  // callOnLoad() {
  //   this.displaytable = false;
  //   this.serviceProfileTemplateService.getAllDetail(this.tempcode).subscribe(result => {
  //     this.serviceTemplateList = result["serviceTemplateList"];
  //     this.dtOption = this.commonHelperService.settingDataTable();
  //     this.displaytable = true;

  //   }, error => console.log('error', error))

  // }
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
      transTypeName : this.textTranType,
      serviceProviderName : this.textServiceProvider,
      serviceCategoryName : this.textServiceCategory,
      serviceName : this.textService,
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
  textTranType: string;
  textChannelType: string;
  onChangeGetServiceName($event){
      this.textService = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onChangeGetServiceCategoryName($event){
      this.textServiceCategory = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onChangeGetServiceProviderName($event){
      this.textServiceProvider = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onChangeGetTranTypeName($event){
      this.textTranType = $event.target.options[$event.target.options.selectedIndex].text;
      console.log('textTranType' + this.textTranType)
  }
  onChangeGetChannelTypeName($event){
      this.textChannelType = $event.target.options[$event.target.options.selectedIndex].text;
  }
  public updateTemplate() {
    this.submitted = true;
    if (this.serviceTemplateForm.invalid) {
      return;
    }
    if(this.tempService.approvalRequired){
   console.log(this.oldTemplate.code,'this.prepareDataForUpdateStatus(this.oldTemplate)' +JSON.stringify(this.prepareDataForUpdateStatus(this.oldTemplate)))
    this.serviceProfileTemplateService.modifyServiceProfileTemplate(this.prepareDataForUpdateStatus(this.oldTemplate), this.oldTemplate.code).subscribe(result => {
        console.log(result);
        if (result.resultCode === '0') {
          console.log('this.dataForupdatedInformation()',this.dataForupdatedInformation(this.serviceTemplateForm.getRawValue()));
          this.serviceProfileTemplateService.serviceTemplateList.push(this.dataForupdatedInformation(this.serviceTemplateForm.getRawValue()));
          console.log( 'shared Date ' ,this.serviceProfileTemplateService.serviceTemplateList);
          var tmp={code: this.tempcode,name :  this.templateName,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,state: this.templatestate};
          this.router.navigate(['../createServiceTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) ,display:'block',status: 'updated'} });    
        }
      });
    }else{
      let request = {
        ...this.serviceTemplateForm.getRawValue(),
        status : ApprovalConstants.status.code.ACTIVE,
        state : ApprovalConstants.state.code.APPROVED
      }
      console.log('rawvalues Form' , request);
      this.serviceProfileTemplateService.modifyServiceProfileTemplate(request ,this.oldTemplate.code).subscribe(result=>{
        if (result.resultCode === '0') {
          this.errorMessges =  undefined;
          this.successMessage=  result.resultDescription;
          var tmp={code: this.tempcode,name :  this.templateName,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,state: this.templatestate};
          this.router.navigate(['../createServiceTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) ,display:'block',status: 'updated'} });    
        } else {
          this.errorMessges = result.resultDescription;
        }
      })
    }   
  }

  navigateBack() {
 
    var tmp={code: this.tempcode,name :  this.templateName,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,
      templateCategoryCode: this.templateCategoryCode,walletOwnerCategoryCode: this.walletOwnerCategoryCode};
 
    this.router.navigate(['../createServiceTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) ,display:'block'} });    
  }
  serviceCategoryList: any;
  serviceProviderList: any;
  onChangeService(event) {
    this.onChangeGetServiceName(event);
    this.serviceProfileTemplateService.getServiceCategoryList(event.target.value).subscribe(result => {
      this.serviceCategoryList = result["serviceCategoryList"];
    }
      , error => console.log('error', error))
  }
  onChangeServiceCategory(event) {
    this.onChangeGetServiceCategoryName(event);
    this.serviceProfileTemplateService.getServiceProviderList(event.target.value).subscribe(result => {
      this.serviceProviderList = result["serviceProviderList"];

    }, error => console.log('error', error))
  }
 
  createFormGroup() {

    this.serviceTemplateForm = new FormGroup({
      
      code : new  FormControl(this.tempcode),
      templateName : new FormControl(this.templateName),
      templateCode: new FormControl(this.tempcode),
      channelTypeCode: new FormControl(this.channelCode),
      serviceCode: new FormControl(this.serviceCode, [Validators.required]),
      serviceCategoryCode: new FormControl(this.serviceCategoryCode, [Validators.required]),
      serviceProviderCode: new FormControl(this.serviceProviderCode, [Validators.required]),
      transTypeCode: new FormControl(this.transTypeCode, [Validators.required]),
      minTransValue: new FormControl(this.minTransValue),
      maxTransValue: new FormControl(this.maxTransValue)
    });
  }

  clearMsg() {
    this.errorMessage = '';
    this.successMessage = '';
  }

}
