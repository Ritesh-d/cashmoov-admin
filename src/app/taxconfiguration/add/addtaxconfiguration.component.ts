import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
 
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaxConfigurationService } from '../taxconfiguration.service';
import { ViewTaxConfigurationComponent } from '../view/viewtaxconfiguration.component';
 import { FormGroup, FormControl, FormBuilder,Validator, Validators } from "@angular/forms";
import { FeeTemplateService } from '../../templates/create-template/fee-template/fee-template.service';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';
import {CommonService} from '../../shared/services/common.service';

@Component({
  selector: 'app-addtaxconfiguration',
  templateUrl: './addtaxconfiguration.component.html',
  styleUrls: ['./addtaxconfiguration.component.css']
})

export class AddTaxConfigurationComponent implements OnInit {
 
 public multiselectform: FormGroup;
  displaytable: boolean = false;
  loader: Boolean = false;
  successMessage;
  errorMessges ;
  taxTypeList: any;
  calculationTypeList: any;
  taxConfigurationList: any;
  createAddForm : FormGroup;
  minValue : string='';
  maxValue : string='';
  value:string='';
  calculationTypeCode : string='';
  taxTypeCode : string='';
  status : string='';
  display: string;
  submitted: Boolean ;
  typeEn :string='';
  templatestate: any;
  getcurrentLang:any;
  errorMessages: any=[];

  constructor( private taxConfigurationService: TaxConfigurationService, private modalService: NgbModal,
    private activatedrouter: ActivatedRoute,
     private formBuilder: FormBuilder,
     private commonService:CommonService, 
    private translate : TranslatelanguageService,
    private router: Router ,private commonHelperService: CommonHelperService) {

      this.getcurrentLang=this.translate.getcurrentLang();
  }

 ngOnInit() { 
  this.activatedrouter.queryParams.subscribe((params: Params) => {
    this.taxTypeCode = params.code;
    this.display = params.display;
    this.typeEn =params.typeEn ;
    this.templatestate =params.state;
    if(params.status){
      this.showMessage(params.status); 
    }
   
  });

 
  this.createForm();
  this.onLoad();
  this.getRelatedList(this.taxTypeCode);
   this.multiselectform = new FormGroup({
      taxTypeCode: new FormControl(this.taxTypeCode,[Validators.required]),
      typeEn: new FormControl(this.typeEn,[Validators.required])
    });
  
  }
  get f(){
    return this.createAddForm.controls;
  }
  get f1(){
     return  this.multiselectform.controls;
   }
     
  
  
  walletOwnerList: any;
  walletOwnerCategoryList: any;
  users: any;

  dtOption: any = {};
  serviceTemplateList: any;
callOnLoad(){
  
    this.dtOption = this.commonHelperService.settingDataTable();
    this.displaytable = true;
  
}
  getRelatedList(code : string){
    this.displaytable= false;
    this.loader= true
    this.taxConfigurationService.getAllByCriteria(code).subscribe(x => {
      
      this.taxConfigurationList = x.taxConfigurationList;
      this.displaytable = true;
      this.loader= false;
    },error => console.log('err',error)); 
  }
  onLoad(){
    this.taxConfigurationService.getAllCalculationType().subscribe(x => {
      
      this.calculationTypeList = x.calculationTypeList;
   
    },error => console.log('err',error)); 
    this.taxConfigurationService.getAllTaxType().subscribe(x => {
      
      this.taxTypeList = x.taxTypeList;
  
    },error => console.log('err',error)); 
   
 
  }
 
  createForm(){

    this.errorMessages = {     
      'taxTypeCode': [  { type: 'required', message: '' }  ],
      'calculationTypeCode': [  { type: 'required', message: '' } ],   
      'minValue': [  { type: 'required', message: '' }  ],      
      'maxValue': [  { type: 'required', message: '' } ],
      'value': [  { type: 'required', message: '' } ],
      'percentValue': [  { type: 'required', message: '' } ]
       
   }



    this.createAddForm = this.formBuilder.group({
   
      taxTypeCode: [this.taxTypeCode, [Validators.required]],
      calculationTypeCode: [this.calculationTypeCode, [Validators.required]],
      minValue: [this.minValue ,[Validators.required]],
      maxValue: [this.maxValue,[Validators.required] ],
      value: [this.value,[Validators.required] ],
      //fixedFeeValue:['',[Validators.required] ],
      percentValue:['',[Validators.required]]
      // status: [this.status],
      

    });
  }

  errorLanguage(){

        var _this=this; 
       _this.translate.languageText("TAXCONFIGURATION", function(data) {
        _this.errorMessages.taxTypeCode[0].message=data.pleaseselecttaxtype;
        _this.errorMessages.calculationTypeCode[0].message=data.pleaseselectcalculationtype;
        _this.errorMessages.minValue[0].message=data.pleaseenterminimumvalue;
        _this.errorMessages.maxValue[0].message=data.pleaseentermaximumvalue;
   
    });
   
  }

  onSubmit(){

    if (this.submitted || this.submitted==undefined) {
 
      this.errorLanguage();
    this.commonService.validateAllFields(this.createAddForm);
    //this.errorMessges='please enter required fields*'
    this.translate.languageText('TAXCONFIGURATION.pleaseenterrequiredfields', data=> {
      this.errorMessges =data;
      });
 }else{
 
 

                  this.submitted= true;
                  this.errorMessges=''
                  this.successMessage = '';
                  console.log('this.createAddForm.getRawValue()' ,this.createAddForm.getRawValue());
                //  this.taxConfigurationService.createTaxConfiguration(this.createAddForm.getRawValue()).subscribe(result=>{
                  // if (result.resultCode === '0') {

                    // this.errorMessges = undefined;
                    // this.successMessage = result.resultDescription;

                      //this.getRelatedList(this.taxTypeCode);
                      if(this.templatestate != 'Approved'){
                      this.taxConfigurationService.makeEntryToApproval(this.taxConfigurationList,this.typeEn,this.taxTypeCode).subscribe(approvalData => {
                        console.log('approvalData', approvalData)
                        if (approvalData === null) {
                          //this.errorMessges = "There is some error, Please try after some time.";
                          this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
                            this.errorMessges =data;
                            });
                        } else {
                          if (approvalData["resultCode"] == "0") {
                            this.errorMessges = undefined;
                            this.successMessage = approvalData["resultDescription"];
                            this.router.navigate(['../'], { relativeTo: this.activatedrouter, queryParams: { status: 'added' } });
                          } else {
                            this.errorMessges = approvalData["resultDescription"];
                          }
                        }
                      });
                      this.submitted= false;
                    }
                    else{
                      
                console.log('updated info to approved serviceTemplateList',this.taxConfigurationList);
              
                  
                const updatedInfo = {
                'feeTemplateList': this.taxConfigurationList
                };
                //this.templateService.serviceTemplateList =  [];
              
                this.taxConfigurationService.makeEntryToApproval(this.taxConfigurationList,this.typeEn,this.taxTypeCode,updatedInfo).subscribe(approvalData => {

                  if (approvalData === null) {
                    //this.errorMessges = "There is some error, Please try after some time.";
                    this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
                      this.errorMessges =data;
                      });
                  } else {
                    if (approvalData.resultCode === '0') {

                      this.errorMessges = undefined;
                      this.router.navigate(['../'], { relativeTo: this.activatedrouter, queryParams: { status: 'updated' } });
                      

                    } else {
                      this.errorMessges = approvalData.resultDescription;
                    }
                  }
                });
                    }
                  // } else {
                    //  this.errorMessges = result.resultDescription;
                  //  }
                // });
      }
  }
  onCancel(){
    this.router.navigate(['../'], { relativeTo: this.activatedrouter });
  }
  edit(data: any){
    this.router.navigate(['../edit'], { queryParams: data, skipLocationChange: true, relativeTo: this.activatedrouter });

  }
  view(data: any){
    const modalRef = this.modalService.open(ViewTaxConfigurationComponent);
    modalRef.componentInstance.data = data;
  }
  private showMessage(msg:string) {
    
      if (msg === 'added') {
        //this.successMessage = 'Tax Configuration Added successfully';
        this.translate.languageText('TAXCONFIGURATION.taxConfigurationAddedsuccessfully', data=> {
          this.successMessage =data;
          });
      } else if (msg === 'updated') {
        //this.successMessage = 'Tax Configuration Updated successfully.';
        this.translate.languageText('TAXCONFIGURATION.taxConfigurationUpdatedsuccessfully', data=> {
          this.successMessage =data;
          });
          
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
     
  }
  

 public createTemplate() {
console.log('createTemplate');
      
      if(this.createAddForm.invalid || this.multiselectform.invalid){
        return;
      }
      this.submitted = true;
      let taxtylevalues = '';
      let taxTypeList :any[] =  this.multiselectform.get("taxTypeCode").value;
      let typeEn :any[]= this.multiselectform.get("typeEn").value;
     
      console.log('taxtylevalues' ,taxtylevalues);
      this.createAddForm.get("taxTypeCode").setValue(taxTypeList) ;
     console.log('request for create service ' ,);
      // this.submitted = false;
      this.taxConfigurationService.createTaxConfiguration(this.createAddForm.getRawValue()).subscribe(result=>{
        if (result.resultCode === '0') {
          this.errorMessges = undefined;
          this.successMessage = result.resultDescription;
          this.submitted = false;
          this.createAddForm.get("minValue").setValue('');
        this.createAddForm.get("maxValue").setValue('');
       
        //this.createAddForm.get("value").setValue('');
          this.getRelatedList(this.taxTypeCode);
          
        } else {
          this.errorMessges = result.resultDescription;
        }
      });
        
 }

 selectChangeHandler(event: any, field: string) {
  switch (field) {
    case 'calculationType':
      //this.regions = this.createAddForm.regions(event.target.value);
      if(event.target.value=="100001"){
      this.createAddForm.get('value').enable();
      //this.createAddForm.get('fixedFeeValue').setValue('');
      this.createAddForm.get('percentValue').setValue(0);
      this.createAddForm.get('percentValue').disable();
      }
      if(event.target.value=="100002")
      {
        this.createAddForm.get('percentValue').enable();
      this.createAddForm.get('value').setValue(0);
      this.createAddForm.get('percentValue').setValue('');
      this.createAddForm.get('value').disable();
      }
      if(event.target.value=="100003")
      {
        this.createAddForm.get('percentValue').enable();
        this.createAddForm.get('percentValue').setValue('');
      this.createAddForm.get('value').setValue('');
      this.createAddForm.get('value').enable();
      }
      break;
    default:
      break;
  }
}
  
}
