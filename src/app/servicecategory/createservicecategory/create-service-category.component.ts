import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApprovalConstants } from '../../approval/approval.constants';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ServiceCategoryService } from '../servicecategory.service';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-create-service-category',
  templateUrl: './create-service-category.component.html',
  styleUrls: ['./create-service-category.component.css']
})
export class CreateServiceCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  multiCountryForm: FormGroup;
  editMode = false;
  fetchingData = true;
  eWalletServiceList: any[];
  serviceCode: string;
  twoStep = false;
  errorMessage: string;
  categoryCode: string;
  submitted: Boolean = false;
  EWALLETSERVICE : string=  'EWALLETSERVICE';
  getcurrentLang:any;
  countryList: any;
  settings: any;
  serviceCountryList : any;
  countryListClone: any;
  constructor(private serviceCategoryService: ServiceCategoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedrouter: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private translate : TranslatelanguageService,
    private route: ActivatedRoute) { }

  get f1(){
    return this.multiCountryForm.controls;
  }

  createForm() {
    let productAllowed :Boolean  = false;
    let serviceCode: string = '',
        categoryName: string = '';
        
    if (this.serviceCode) {
      serviceCode = this.serviceCode;
    }
    if (this.commonHelperService.isEditMode) {
      this.editMode = true;
      categoryName = this.serviceCategoryService.category.name;
      this.categoryCode = this.serviceCategoryService.category.code;
      productAllowed = this.serviceCategoryService.category.productAllowed;
      this.serviceCountryList = this.serviceCategoryService.category.serviceCountryList;
    }
    console.log('this.serviceCountryList' , this.serviceCountryList );
    this.categoryForm = this.formBuilder.group({
      serviceCode: new FormControl({ value: serviceCode, disabled: this.serviceCode != undefined },[Validators.required]),
      // serviceCode: new FormControl(  serviceCode,[Validators.required]),
      code: new FormControl({value: this.categoryCode, disabled : this.editMode} ,[Validators.required,,Validators.minLength(4)]),
      serviceCountryList : new FormControl(this.serviceCountryList ),
      name: new FormControl(categoryName,[Validators.required,,Validators.minLength(4),Validators.pattern(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)]),
      productAllowed : new FormControl(productAllowed)
    });
    this.multiCountryForm = this.formBuilder.group({
      country : new FormControl(this.serviceCountryList )
    });
  }

  ngOnInit() {
    console.log('approvalRequired' , this.serviceCategoryService.approvalRequired);
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.serviceCode = params.id;
      }
    });
      this.serviceCategoryService.getTemplateMasters(this.EWALLETSERVICE).subscribe((data: any) => {
        if (data.resultCode === '0') {
          this.eWalletServiceList = data.ewalletServiceList  == undefined?'':data.ewalletServiceList;
          this.fetchingData = false;
          this.twoStep = this.router.url.indexOf('add/') > -1 || this.router.url.indexOf('edit/') > -1;
         
        }
      });
      
      this.serviceCategoryService.getCurrency().subscribe((data: any) => {
        if (data.resultCode === '0') {
          this.countryList = data.countryList  == undefined?'':data.countryList;
          this.countryList = [{code:'ALL', name:"All"},...this.countryList];
          this.countryListClone = this.countryList;
          // this.countryList = [{code:'ALL', name:"All"}];
          this.fetchingData = false;
          

        }
      });
      this.settings = {
        singleSelection: false,
        enableCheckAll: false,
        
        idField : 'code',
        textField:'name',
        // allowSearchFilter: true,
        limitSelection: -1,
        clearSearchFilter: true,     
        // searchPlaceholderText: '',
        noDataAvailablePlaceholderText: 'NA',
        closeDropDownOnSelection: false,
        showSelectedItemsAtTop: false,
        selectAllText:"All",
       
        defaultOpen: false
      };
      this.createForm();
    
  }

//   handleLimitSelection(selectAll: boolean) {
//     if (selectAll) {
//         this.settings = Object.assign({}, this.settings, { singleSelection: true,  closeDropDownOnSelection: false, });
//     } else {
//         this.settings = Object.assign({}, this.settings, { singleSelection: false,  closeDropDownOnSelection: false, });
//     }
// }
selectedIems : any;
 onSelected(event:any){

 if(event.code=='ALL'){
  this.multiCountryForm.get('country').setValue([event])
  this.countryList =[event]
  }
 }
 onDeSelected(event:any){
  if(event.code=='ALL'){
    this.countryList = this.countryListClone;
  }
  }
 onSelectAll(event){
   console.log('hjhjk',event);
  //  this.multiCountryForm.reset();
  // this.multiCountryForm = this.formBuilder.group({
  //   country : new FormControl([{code:'ALL', name:"All"}])
  // });
  this.countryList = [];
  this.multiCountryForm.reset();
  // this.multiCountryForm.get('country').setValue([{code:'ALL', name:"All"}])
 }
 onDeSelectAll(event){
  console.log('deselectall');
 }
  onSubmit() {
    let taxtylevalues = '';
    let countryList :any[] =  this.multiCountryForm.get("country").value;
    // countryList.forEach(element => {
    //  if(taxtylevalues){
    //   taxtylevalues = taxtylevalues + ",";
    //  }
    //   taxtylevalues= taxtylevalues.concat(element.code);
    
      
    // });
    console.log('countryList' ,countryList);
    this.categoryForm.get("serviceCountryList").setValue(countryList) ;
    console.log('--onSubmit--',this.categoryCode, this.categoryForm.getRawValue());

    this.submitted = true;
    if(this.editMode) {
      if(this.categoryForm.valid){
        if(this.serviceCategoryService.approvalRequired){
        const updatedInfo = this.serviceCategoryService.preparedUpdatedDataForApproval(this.categoryForm.getRawValue());
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
      console.log('this.serviceCategoryService.category',this.serviceCategoryService.category);
      this.serviceCategoryService.makeEntryToApproval(this.serviceCategoryService.category, ApprovalConstants.featureCode.SERVICE,updatedInfo).subscribe(approvalData => {
        console.log('--approvalData--', approvalData);
        if (approvalData === null) {
          this.errorMessage = approvalData.resultDescription;
        } else {
          if (approvalData.resultCode === '0') {
            this.errorMessage = undefined;
            //this.serviceCategoryService.setMessage = 'Category updated successfully,sent for approval';

            this.translate.languageText('ROLE.categoryupdatedsuccessfullysentforapproval', data=> {
              this.serviceCategoryService.setMessage =data;
              });
            this.onCancel();
           } else {
            this.errorMessage = approvalData.resultDescription;
          }
        }
      });
    }else{
      // no approval required  
          let request = {
            ...this.categoryForm.getRawValue(),
            // status: ApprovalConstants.status.code.ACTIVE,
            state : ApprovalConstants.state.code.APPROVED
          }
          this.serviceCategoryService.updateCategory(request, this.serviceCode, this.categoryCode).subscribe(data => {
            if(data.resultCode === '0') {
              this.errorMessage = undefined;
              //this.serviceCategoryService.setMessage = 'Category updated successfully';
              this.translate.languageText('ROLE.categoryupdatedsuccessfully', data=> {
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
       if( this.serviceCategoryService.approvalRequired){
      this.serviceCategoryService.createCategory(this.categoryForm.getRawValue() ).subscribe(data => {
        if(data.resultCode === '0') {
          console.log('data.serviceCategory',data.serviceCategory);
          this.serviceCategoryService.makeEntryToApproval(data.serviceCategory,ApprovalConstants.featureCode.SERVICE).subscribe(approvalData => {
            console.log('approvalData', approvalData)
            if (approvalData === null) {
              this.errorMessage = approvalData["resultDescription"];
            } else {
              if (approvalData["resultCode"] == "0") {
                this.errorMessage = undefined;
                //this.serviceCategoryService.setMessage = 'Category added successfully,sent for approval';
                this.translate.languageText('ROLE.categoryaddedsuccessfullysentforapproval', data=> {
                  this.serviceCategoryService.setMessage=data;
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
    }else{
      //no approval required
      let request = {
        ...this.categoryForm.getRawValue(),
        status: ApprovalConstants.status.code.ACTIVE,
        state : ApprovalConstants.state.code.APPROVED
      }
      this.serviceCategoryService.createCategory(request ).subscribe(data => {
        if(data.resultCode === '0') {
          this.errorMessage = undefined;
          //this.serviceCategoryService.setMessage = 'Category added successfully';
          this.translate.languageText('ROLE.categoryaddedsuccessfully', data=> {
            this.serviceCategoryService.setMessage =data;
            });
            
          this.onCancel();
        }else{
          this.errorMessage = data["resultDescription"];
        }
      }, error => {
        this.errorMessage = error.error.resultDescription;
      });
    }
    }
  }
  document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });

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
