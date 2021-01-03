
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FeeCommisionTemplateService } from '../fee-template.service';
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
export class EditFeeCommisionTemplateComponent implements OnInit {

  constructor(  private tempService:TemplatesService,private commonHelperService: CommonHelperService, private templateService: FeeCommisionTemplateService, 
      private activatedrouter: ActivatedRoute, private router: Router,private approvalService : ApprovalService) {

  }  
  errorMessage: '';
  public serviceTemplateForm: FormGroup;
  public multiselectform : FormGroup;
  public data = [];
  public settings = {};
  public updatedata = [];
  istaxtype : boolean  = false;
  channelTypeList: any;
  eWalletServiceList: any;
   
  templateCategoryName: string;
  walletOwnerCategoryName: string;
  editMode: boolean = false;
  display: string;
  channelCode: string = '';
  serviceCode: string = '';
  serviceCategoryCode: string = '';
  serviceProviderCode: string = '';
  transTypeCode: string = '';
  fixedComiValue: string;
  percentComiValue: string;
  templateName: string;
  oldTemplate : any;
  serviceTemplateCode: string;
  templatestate: string;
  status: string;
  state: string;
  taxTypeCode: any;
  selected: any =  [];
  taxTypeList: any;
  walletOwnerList: any;
  walletOwnerCategoryList:any;
  taxAccount: string;
  textTaxAccount: string;
   tempcode; tempname;walletOwnerCategoryCode;templateCategoryCode; 
  async ngOnInit() {
    this.multiselectform = new FormGroup({
      taxTypeCode: new FormControl('', Validators.required)
    });
     if (this.activatedrouter.snapshot.queryParamMap.get('temp'))
       var tmp=  JSON.parse(this.activatedrouter.snapshot.queryParamMap.get('temp')); 
       console.log('this.tmp' , tmp);
       this.walletOwnerCategoryName = tmp.walletOwnerCategoryName;
       this.templateCategoryName = tmp.templateCategoryName;
       this.templateCategoryCode = tmp.templateCategoryCode;
       this.walletOwnerCategoryCode = tmp.walletOwnerCategoryCode;
       this.templatestate = tmp.state;
       console.log('in edit '+ this.templatestate);
    // this.activatedrouter.queryParams.subscribe((params: Params) => {
      if (this.activatedrouter.snapshot.queryParamMap.get('data')){
      var params=  JSON.parse(this.activatedrouter.snapshot.queryParamMap.get('data')); 
      console.log('params' + JSON.stringify(params));
      this.oldTemplate = params;
      this.serviceTemplateCode = params.code;
      this.tempcode= params.templateCode;
      this.templateName = params.templateName;
      this.channelCode= params.channelTypeCode;
      this.serviceCode= params.serviceCode;
      this.serviceCategoryCode= params.serviceCategoryCode;
      this.serviceProviderCode= params.serviceProviderCode;
    
      this.fixedComiValue= params.fixedComiValue;
      this.percentComiValue= params.percentComiValue;
      this.status =  params.status;
      this.state =  params.state;
      this.textChannelType = params.channelTypeName;
     
      this.textServiceProvider = params.serviceProviderName;
      this.textServiceCategory = params.serviceCategoryName;
      this.textService = params.serviceName;
      this.taxTypeCode = params.taxTypeCode; //'100000,100001,100002';//
      this.taxAccount =      params.taxAccount;
      this.textTaxAccount =  params.taxAccountName;
 
    };
    this.createFormGroup();
    const groupMasterString = TemplatesConstants.masters.CHANNELTYPE + ',' + TemplatesConstants.masters.EWALLETSERVICE;

    this.templateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
      console.log('data from master ', data.ewalletServiceList);
      this.channelTypeList = data.channelTypeList == undefined ? '' : data.channelTypeList;
      this.eWalletServiceList = data.ewalletServiceList == undefined ? '' : data.ewalletServiceList;
   
      }, error => console.log('error', error));

      this.templateService.getServiceCategoryList('all').subscribe(result => {
        this.serviceCategoryList = result["serviceCategoryList"];
      }
        , error => console.log('error', error))
        this.templateService.getServiceProviderApiData('all').subscribe(result => {
          this.serviceProviderList = result["serviceProviderList"];
        }
          , error => console.log('error', error))

          this.templateService.fetchWalletOwnerOnCategoryCode('100007').subscribe(result=>{
            this.walletOwnerCategoryList=result["walletOwnerList"];
        
          },error => console.log('error', error) )
      
         
          // this.templateService.getTaxType().subscribe((data: any) => {
          //   if (data["resultCode"] === '0') {
          //     this.taxTypeList= data["taxTypeList"];
          //   }
      
          // }, error => console.log('error', error));
          let data =  await  this.templateService.getTaxTypeMapped();

          if (data["resultCode"] === '0') {
            this.taxTypeList = data["taxTypeList"];
            let taxTypeCodeList = this.taxTypeCode.split(',');
           
            taxTypeCodeList.forEach(element => {
                  this.taxTypeList.forEach(element2 => {
                    if (element2.code === element) {
                      this.selected.push(element2);
                    }
                  });
            });
          }         
          
          this.multiselectform.get("taxTypeCode").setValue(this.selected);
                   
          this.istaxtype = true;
        
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
 
  }
  get f1() { return this.multiselectform.controls; }

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
       taxAccountName : this.textTaxAccount,
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
  onChangeGetServiceName($event){
      this.textService = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onChangeGetServiceCategoryName($event){
      this.textServiceCategory = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onChangeGetServiceProviderName($event){
      this.textServiceProvider = $event.target.options[$event.target.options.selectedIndex].text;
  }
 
  onChangeGetChannelTypeName($event){
      this.textChannelType = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onChangeGetTaxAccountName($event){
    this.textTaxAccount = $event.target.options[$event.target.options.selectedIndex].text;

  }
  public updateTemplate() {
    this.submitted = true;
    if (this.serviceTemplateForm.invalid) {
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
    
    this.serviceTemplateForm.get("taxTypeCode").setValue(taxtylevalues) ;
    console.log('rawvalues Form' , this.serviceTemplateForm.getRawValue());
   console.log(this.oldTemplate.code,'this.prepareDataForUpdateStatus(this.oldTemplate)' +JSON.stringify(this.prepareDataForUpdateStatus(this.oldTemplate)))
   if(this.tempService.approvalRequired){
   this.templateService.modifyServiceProfileTemplate(this.prepareDataForUpdateStatus(this.oldTemplate), this.oldTemplate.code).subscribe(result => {
        console.log(result);
        if (result.resultCode === '0') {
          console.log('this.dataForupdatedInformation()',this.dataForupdatedInformation(this.serviceTemplateForm.getRawValue()));
          this.templateService.serviceTemplateList.push(this.dataForupdatedInformation(this.serviceTemplateForm.getRawValue()));
          console.log( 'shared Date ' ,this.templateService.serviceTemplateList);
          var tmp=
          {
            code: this.tempcode,
            name: this.templateName,
            walletOwnerCategoryName: this.walletOwnerCategoryName,
            walletOwnerCategoryCode: this.walletOwnerCategoryCode,
            templateCategoryName: this.templateCategoryName,
            state: this.templatestate
          };
          
          var params ={
            code: this.serviceCategoryCode,
            name: this.oldTemplate.serviceCategoryName,
            serviceCode: this.oldTemplate.serviceCode,
            serviceName: this.oldTemplate.serviceName
          }

          this.router.navigate(['../viewFeeCommisionTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(params), temp:JSON.stringify(tmp) ,display:'block',status: 'updated'} });    
        }
      });
    }else{
      let request = {
        ...this.serviceTemplateForm.getRawValue(),
        status : ApprovalConstants.status.code.ACTIVE,
        state : ApprovalConstants.state.code.APPROVED
      }
      this.templateService.modifyServiceProfileTemplate(request , this.oldTemplate.code).subscribe(result => {
        console.log(result);
        if (result.resultCode === '0') {
          this.errorMessges =  undefined;
          this.successMessage=  result.resultDescription;
       
          var tmp=
          {
            code: this.tempcode,
            name: this.templateName,
            walletOwnerCategoryName: this.walletOwnerCategoryName,
            walletOwnerCategoryCode: this.walletOwnerCategoryCode,
            templateCategoryName: this.templateCategoryName,
            state: this.templatestate
          };
          
          var params ={
            code: this.serviceCategoryCode,
            name: this.oldTemplate.serviceCategoryName,
            serviceCode: this.oldTemplate.serviceCode,
            serviceName: this.oldTemplate.serviceName
          }

          this.router.navigate(['../viewFeeCommisionTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(params), temp:JSON.stringify(tmp) ,display:'block',status: 'updated'} });    
        }
      });
      
    }
  }

  navigateBack() {
 
    var tmp={code: this.tempcode,name :  this.templateName,walletOwnerCategoryName:this.walletOwnerCategoryName,templateCategoryName:this.templateCategoryName,
      templateCategoryCode: this.templateCategoryCode,walletOwnerCategoryCode: this.walletOwnerCategoryCode};
      var params ={
        code: this.serviceCategoryCode,
        name: this.oldTemplate.serviceCategoryName,
        serviceCode: this.oldTemplate.serviceCode,
        serviceName: this.oldTemplate.serviceName
      }
    this.router.navigate(['../viewFeeCommisionTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(params), temp:JSON.stringify(tmp) ,display:'block'} });    
  }
  serviceCategoryList: any;
  serviceProviderList: any;

  onChangeService(event) {
    this.onChangeGetServiceName(event);
    this.templateService.getServiceCategoryList(event.target.value).subscribe(result => {
      this.serviceCategoryList = result["serviceCategoryList"];
    }
      , error => console.log('error', error))
  }
  onChangeServiceCategory(event) {
    this.onChangeGetServiceCategoryName(event);
    this.templateService.getServiceProviderList(event.target.value).subscribe(result => {
      this.serviceProviderList = result["serviceProviderList"];

    }, error => console.log('error', error))
  }
 
  createFormGroup() {

    this.serviceTemplateForm = new FormGroup({
      
      code : new  FormControl(this.serviceTemplateCode),
      templateName : new FormControl(this.templateName),
      templateCode: new FormControl(this.tempcode),
      channelTypeCode: new FormControl(this.channelCode),
      serviceCode: new FormControl(this.serviceCode, [Validators.required]),
      serviceCategoryCode: new FormControl(this.serviceCategoryCode, [Validators.required]),
      serviceProviderCode: new FormControl(this.serviceProviderCode, [Validators.required]),
      fixedComiValue: new FormControl(this.fixedComiValue),
      percentComiValue: new FormControl(this.percentComiValue),
      walletOwnerCategoryCode : new FormControl(this.walletOwnerCategoryCode),
      taxTypeCode : new FormControl(this.taxTypeCode),
      taxAccount: new FormControl(this.taxAccount,[Validators.required] )
    });
  }

  clearMsg() {
    this.errorMessage = '';
    this.successMessage = '';
  }

}
