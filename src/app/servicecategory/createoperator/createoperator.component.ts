import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApprovalConstants } from '../../approval/approval.constants';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ServiceCategoryService } from '../servicecategory.service';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-createoperator',
  templateUrl: './createoperator.component.html',
  styleUrls: ['./createoperator.component.css']
})
export class CreateOperatorComponent implements OnInit {

  categoryForm: FormGroup;
  editMode = false;
  fetchingData = true;
  eWalletServiceList: any[];
  serviceCategoryList: any[];
  serviceProviderList: any[];
  serviceCode: string;
  twoStep = false;
  errorMessage: string;
  categoryCode: string;
  submitted: Boolean = false;
  EWALLETSERVICE : string=  'EWALLETSERVICE';
  operatorName: string;
  operatorCode: string;
  serviceProviderCode: string;
  getcurrentLang:any;

  constructor(private serviceCategoryService: ServiceCategoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedrouter: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private translate : TranslatelanguageService,
    private route: ActivatedRoute) { }

  createForm() {
    let productAllowed :Boolean  = false;
    let serviceCode: string = '',
        categoryName: string = '';
 
    if (this.serviceCode) {
      serviceCode = this.serviceCode;
    }

    if (this.commonHelperService.isEditMode) {
      this.editMode = true;
      this.operatorName = this.serviceCategoryService.operator.name;
      this.operatorCode = this.serviceCategoryService.operator.code;
      this.serviceProviderCode = this.serviceCategoryService.operator.serviceProviderCode;
      this.textServiceProvider =  this.serviceCategoryService.operator.serviceProviderName;
    }
    categoryName = this.serviceCategoryService.category.name;
    this.categoryCode = this.serviceCategoryService.category.code;
    productAllowed = this.serviceCategoryService.category.productAllowed;
    console.log('this.serviceCod' + this.serviceCode, this.serviceCode!=undefined);
    this.categoryForm = this.formBuilder.group({
      serviceCode: new FormControl({ value: serviceCode, disabled: this.serviceCode != undefined },[Validators.required]),
      
      serviceCategoryCode: new FormControl({ value: this.categoryCode, disabled: this.categoryCode != undefined },[Validators.required,Validators.pattern(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)]),
      serviceProviderCode: new FormControl(this.serviceProviderCode),

      name: new FormControl(this.operatorName,[Validators.required,Validators.minLength(3),Validators.pattern(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)]),
 
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.serviceCode = params.id;
        this.getServiceCategories(this.serviceCode);
        this.getServiceProvider(this.serviceCategoryService.category.code);
    
      }
    });
      this.serviceCategoryService.getTemplateMasters(this.EWALLETSERVICE).subscribe((data: any) => {
        if (data.resultCode === '0') {
          this.eWalletServiceList = data.ewalletServiceList  == undefined?[]:data.ewalletServiceList;
          this.fetchingData = false;
      
        }
      });
      this.twoStep = this.router.url.indexOf('add/') > -1 || this.router.url.indexOf('edit/') > -1;
      this.createForm();
 

    }
    getServiceCategories(serviceCode:string){
      this.serviceCategoryService.getServiceCategory(serviceCode).subscribe((data: any) => {
        if (data.resultCode === '0') {
          this.serviceCategoryList = data.serviceCategoryList  == undefined?[]:data.serviceCategoryList;
        
      }else{

        this.serviceCategoryList=[];
    
      }
    });
    }
    
    getServiceProvider(code:string ){
      this.serviceCategoryService.getServiceProviderList(code).subscribe((data: any) => {
        if (data.resultCode === '0') {
          this.serviceProviderList = data.serviceProviderList  == undefined?[]:data.serviceProviderList;
          if(this.serviceProviderList && this.serviceProviderList.length > 0){

            this.categoryForm.get('serviceProviderCode').setValidators(Validators.required);
            this.categoryForm.updateValueAndValidity();

          }
        
      }else{

        this.serviceProviderList=[];
        this.categoryForm.get('serviceProviderCode').disable;
        this.categoryForm.updateValueAndValidity();
    
      }
    });
    }
    textServiceProvider:string;
    onChangeGetServiceProviderName($event){
      this.textServiceProvider = $event.target.options[$event.target.options.selectedIndex].text;
  }
  onSubmit() {
    console.log('--onSubmit--',this.categoryCode, this.categoryForm.getRawValue());
    
    this.submitted = true;
    if(this.editMode) {
      if(this.categoryForm.valid){
        if(this.serviceCategoryService.approvalRequired){
        const updatedInfo = this.serviceCategoryService.preparedUpdatedDataForOperatorApproval(this.dataForupdatedInformation(this.categoryForm.getRawValue()));
        console.log('updatedInfo', updatedInfo);
      // this.serviceCategoryService.updateCategory(this.categoryForm.value, this.serviceCode, this.categoryCode).subscribe(data => {
      //   if(data.resultCode === '0') {
      //     this.errorMessage = undefined;
      //     this.serviceCategoryService.setMessage = 'Category updated successfully,sent for approval';
      //     this.onCancel();
      //   } else {
      //     this.errorMessage = data.resultDescription;
      //   }
      // }, error => {
      //   this.errorMessage = error.error.resultDescription;
      // });
      this.serviceCategoryService.makeEntryToApproval(this.serviceCategoryService.operator, ApprovalConstants.featureCode.OPERATOR,updatedInfo).subscribe(approvalData => {
        console.log('--approvalData--', approvalData);
        if (approvalData === null) {
          this.errorMessage = approvalData.resultDescription;
        } else {
          if (approvalData.resultCode === '0') {
            this.errorMessage = undefined;
            //this.serviceCategoryService.setMessage = 'Operator updated successfully,sent for approval';
            this.translate.languageText('ROLE.operatorupdatedsuccessfullysentforapproval', data=> {
              this.serviceCategoryService.setMessage =data;
              });

            this.onCancel();
           } else {
            this.errorMessage = approvalData.resultDescription;
          }
        }
      });
    }else{
        let request = {
          ...this.categoryForm.getRawValue(),
          // status: ApprovalConstants.status.code.ACTIVE,
          state : ApprovalConstants.state.code.APPROVED
        }
        this.serviceCategoryService.updateOperator(request, this.serviceCode, this.operatorCode).subscribe(data => {
                if(data.resultCode === '0') {
                  this.errorMessage = undefined;
                  //this.serviceCategoryService.setMessage = 'Operator updated successfully';
                  this.translate.languageText('ROLE.operatorupdatedsuccessfully', data=> {
                    this.serviceCategoryService.setMessage =data;
                    });
                  this.onCancel();
                } else {
                  this.errorMessage = data.resultDescription;
                }
              }, error => {
                this.errorMessage = error.error.resultDescription;
              });
    }
  }
    } else {
      if(this.categoryForm.valid){
        if(this.serviceCategoryService.approvalRequired){
      this.serviceCategoryService.createOperator(this.categoryForm.getRawValue() ).subscribe(data => {
        if(data.resultCode === '0') {
          console.log('data.operator',data.operator);
          this.serviceCategoryService.makeEntryToApproval(data.operator,ApprovalConstants.featureCode.OPERATOR).subscribe(approvalData => {
            console.log('approvalData', approvalData)
            if (approvalData === null) {
              this.errorMessage = approvalData["resultDescription"];
            } else {
              if (approvalData["resultCode"] == "0") {
                this.errorMessage = undefined;
                //this.serviceCategoryService.setMessage = 'Operator added successfully,sent for approval';
                this.translate.languageText('ROLE.Operatoraddedsuccessfullysentforapproval', data=> {
                  this.serviceCategoryService.setMessage =data;
                  });
                this.onCancel();
               } else {
                this.errorMessage = approvalData["resultDescription"];
              }
            }
          });
        } else {
          this.errorMessage = data.resultDescription;
        }
      }, error => {
        this.errorMessage = error.error.resultDescription;
      });
    }
   else{
    let request = {
      ...this.categoryForm.getRawValue(),
      status: ApprovalConstants.status.code.ACTIVE,
      state : ApprovalConstants.state.code.APPROVED
    }
      this.serviceCategoryService.createOperator(request ).subscribe(data => {
        if(data.resultCode === '0') {
                this.errorMessage = undefined;
                //this.serviceCategoryService.setMessage = 'Operator added successfully';
                this.translate.languageText('ROLE.operatoraddedsuccessfully', data=> {
                  this.serviceCategoryService.setMessage =data;
                  });
                this.onCancel();
        } else {
          this.errorMessage = data.resultDescription;
        }
      }, error => {
        this.errorMessage = error.error.resultDescription;
      });
    }
   }
  }
  document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });

  }
  dataForupdatedInformation(data) {
    return {
      ...data,
      serviceProviderName :this.textServiceProvider
    }
  }
  onCancel() {
    this.twoStep
      ? this.router.navigate(['../../../'], { relativeTo: this.route })
      : this.router.navigate(['../../'], { relativeTo: this.route });
  }

  get f() {
    return this.categoryForm.controls;
 }

}
