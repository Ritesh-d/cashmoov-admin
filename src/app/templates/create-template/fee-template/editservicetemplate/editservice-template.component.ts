
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FeeTemplateService } from '../fee-template.service';
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
export class EditFeeTemplateComponent implements OnInit {

  constructor(  private commonHelperService: CommonHelperService,private tempService:TemplatesService, private templateService: FeeTemplateService, 
      private activatedrouter: ActivatedRoute, private router: Router,private approvalService : ApprovalService) {

  }  
  errorMessage: '';
  public serviceTemplateForm: FormGroup;
  public multiselectform : FormGroup;
  istaxtype : boolean = false;
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
  minValue: string;
  maxValue: string;
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
       console.log('edit  this.templatestate'+  this.templatestate);
    // this.activatedrouter.queryParams.subscribe((params: Params) => {
      if (this.activatedrouter.snapshot.queryParamMap.get('data')){
      this.params=  JSON.parse(this.activatedrouter.snapshot.queryParamMap.get('data')); 
      console.log('params' + JSON.stringify( this.params));
      this.oldTemplate =  this.params;
      this.serviceTemplateCode =  this.params.code;
      this.tempcode=  this.params.templateCode;
      this.templateName =  this.params.templateName;
      this.channelCode=  this.params.channelTypeCode;
      this.serviceCode=  this.params.serviceCode;
      this.serviceCategoryCode=  this.params.serviceCategoryCode;
      this.serviceProviderCode=  this.params.serviceProviderCode;
      // this.transTypeCode= params.transTypeCode;
      this.minValue=  this.params.minValue;
      this.maxValue=  this.params.maxValue;
      this.status =   this.params.status;  
      this.state =   this.params.state;
      this.textChannelType =  this.params.channelTypeName;
      // this.textTranType = params.transTypeName;
      this.textServiceProvider =  this.params.serviceProviderName;
      this.textServiceCategory =  this.params.serviceCategoryName;
      this.textService =  this.params.serviceName;
      this.calculationTypeCode =    this.params.calculationTypeCode;;
      this.percentFeeValue =   this.params.percentFeeValue;;
      this.fixedFeeValue =   this.params.fixedFeeValue;;
      this.taxTypeCode = this.params.taxTypeCode; //'100000,100001,100002'
      
      // [
      //   {
      //     "code": "100000",
      //     "typeEn": "VAT"
      //   },
      //   {
      //     "code": "100001",
      //     "typeEn": "CGST"
      //   }
      // ];
      this.textCalculationTypeName =  this.params.calculationTypeName;
      this.textTaxTypeName =  this.params.taxTypeName;
      this.taxAccount =  this.params.taxAccount;
      this.textTaxAccount =  this.params.taxAccountName;
      this.bearer =  this.params.bearer ;
    };
    this.createFormGroup();
    
    const groupMasterString = TemplatesConstants.masters.CHANNELTYPE + ',' + TemplatesConstants.masters.EWALLETSERVICE;

    this.templateService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
      console.log('data from master ', data.ewalletServiceList);
      this.channelTypeList = data.channelTypeList == undefined ? '' : data.channelTypeList;
      this.eWalletServiceList = data.ewalletServiceList == undefined ? '' : data.ewalletServiceList;
      // this.tranTypeList = data.tranTypeList == undefined ? '' : data.tranTypeList;
  
      }, error => console.log('error', error));
      this.templateService.fetchWalletOwnerOnCategory('100007').subscribe(result=>{
        this.walletOwnerList=result["walletOwnerList"];
    
      },error => console.log('error', error) )
      this.templateService.getServiceCategoryList('all').subscribe(result => {
        this.serviceCategoryList = result["serviceCategoryList"];
      }
        , error => console.log('error', error))
        this.templateService.getServiceProviderApiData('all').subscribe(result => {
          this.serviceProviderList = result["serviceProviderList"];
        }
          , error => console.log('error', error))
          this.templateService.getCalculationType().subscribe((data: any) => {
            if (data["resultCode"] === '0') {
              this.calculationTypeList= data["calculationTypeList"];
            }
      
          }, error => console.log('error', error));
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
            this.bearerList = result["categoryList"];
            this.bearerList =  this.bearerList.filter(m=>{
              return m.code != '100006' && m.code != '100007'
            });
          })
         
        
    
        this.serviceTemplateForm.get("calculationTypeCode").valueChanges.subscribe(x => {
        
          if(this.serviceTemplateForm.get("calculationTypeCode").value == '100001'){  // fixed
           
              this.serviceTemplateForm.get("fixedFeeValue").enable();
              this.serviceTemplateForm.get("percentFeeValue").setValue("") ;
              this.serviceTemplateForm.get("percentFeeValue").disable();
          }
          else if (this.serviceTemplateForm.get("calculationTypeCode").value == '100002'){
      
            this.serviceTemplateForm.get("percentFeeValue").enable();
            this.serviceTemplateForm.get("fixedFeeValue").setValue("") ;
            this.serviceTemplateForm.get("fixedFeeValue").disable();
          }
          else if (this.serviceTemplateForm.get("calculationTypeCode").value == '100003'){
            console.log('cal type' +this.serviceTemplateForm.get("calculationTypeCode").value);
            this.serviceTemplateForm.get("percentFeeValue").enable();
     
            this.serviceTemplateForm.get("fixedFeeValue").enable();
          }
        });
        
       
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
      taxAccountName : this.textTaxAccount,
      serviceProviderName : this.textServiceProvider,
      serviceCategoryName : this.textServiceCategory,
      serviceName : this.textService,
      calculationTypeName : this.textCalculationTypeName,
      taxTypeName : this.textTaxTypeName,
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
  onChangeGetTaxAccountName($event){
    this.textTaxAccount = $event.target.options[$event.target.options.selectedIndex].text;

  }

  onChangeGetServiceProviderName($event){
      this.textServiceProvider = $event.target.options[$event.target.options.selectedIndex].text;
  }
 
  onChangeGetChannelTypeName($event){
      this.textChannelType = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onChangeGetCalculationTypeName($event){
    this.textCalculationTypeName = $event.target.options[$event.target.options.selectedIndex].text;

  }
  onChangeGetTaxTypeName($event){
    this.textTaxTypeName = $event.target.options[$event.target.options.selectedIndex].text;

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
          this.router.navigate(['../viewFeeTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(params), temp:JSON.stringify(tmp) ,display:'block',status: 'updated'} });    
        }
      });
   
    }else{
      let request = {
        ...this.serviceTemplateForm.getRawValue(),
        status : ApprovalConstants.status.code.ACTIVE,
        state : ApprovalConstants.state.code.APPROVED
      }
      this.templateService.modifyServiceProfileTemplate(request ,this.oldTemplate.code).subscribe(result=>{
        if (result.resultCode === '0') {
          this.errorMessges =  undefined;
          this.successMessage=  result.resultDescription;
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
          this.router.navigate(['../viewFeeTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(params), temp:JSON.stringify(tmp) ,display:'block'} });    
        } else {
          this.errorMessges = result.resultDescription;
        }
      })
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
    this.router.navigate(['../viewFeeTemplate'], { relativeTo: this.activatedrouter, skipLocationChange: true,queryParams: { data: JSON.stringify(params), temp:JSON.stringify(tmp) ,display:'block'} });    
  }
  serviceCategoryList: any;
  serviceProviderList: any;
  calculationTypeList: any;
  taxTypeList: any;
  bearerList: any;
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
      minValue: new FormControl(this.minValue),
      maxValue: new FormControl(this.maxValue),
      calculationTypeCode: new FormControl(this.calculationTypeCode ,[Validators.required]),
      fixedFeeValue: new FormControl({value: this.fixedFeeValue , disabled : this.calculationTypeCode == '100002'} ),
      percentFeeValue: new FormControl({value: this.percentFeeValue , disabled : this.calculationTypeCode == '100001'} ),
      taxTypeCode: new FormControl(this.taxTypeCode ),
      taxAccount: new FormControl(this.taxAccount,[Validators.required] ),
      bearer: new FormControl(this.bearer ),
      
    });
  }

  clearMsg() {
    this.errorMessage = '';
    this.successMessage = '';
  }

}
