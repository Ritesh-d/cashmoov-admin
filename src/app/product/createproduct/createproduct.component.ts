import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductService } from '../product.service';
import { ProductModel } from '../product.model';
import { Constants } from '../product.constant';
import { CompareMatch } from "./customvalidator.validator";
import { ApprovalConstants } from '../../approval/approval.constants';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css']
})

export class CreateProductComponent implements OnInit {

  getcurrentLang:any;
  errorMessage: string = '';
  displaytable: boolean = true;
  fetchingData: boolean = false;
  dtOption: any = {};


  productForm: FormGroup;
  productModel: ProductModel = new ProductModel();

  editMode = false;
  code: string = "";
  name: string = "";
  serviceCategoryCode: string = "";
  operatorCode: string = "";
  productTypeCode: string = "";
  description: string = "";
  remit_agent: string;
  remit_branch: string;
  paying_agent: string;
  paying_branch: string;
  value: string = "";
  maxValue:string;
  minValue:string;
  status: string;
  submitted: boolean = false;
  showagent: boolean = false;
  showbranch: boolean = false;
  showremitbranch: boolean = false;
  showremitagent: boolean = false;
  showpayingbranch: boolean = false;
  showpayingagent: boolean = false;
  productData: any;
  PRODUCTTYPE: string = 'PRODUCTTYPE';
  OPERATOR: string = 'OPERATOR';
  operatorList: any;
  productTypeList: any;
  serviceCategoryList: any;
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate : TranslatelanguageService,
    private productService: ProductService,
    private router: Router) {
      this.getcurrentLang=this.translate.getcurrentLang();
  }
 
  ngOnInit() {
    console.log('this.approvalRequired'+ this.productService.approvalRequired);
    const groupMasterString = this.PRODUCTTYPE  ;//+ ',' + this.OPERATOR;

    this.productService.getTemplateMasters(groupMasterString).subscribe((data: any) => {
      if (data.resultCode === '0') {
        // this.operatorList = data.operatorList == undefined ? '' : data.operatorList;
        this.productTypeList = data.productTypeList == undefined ? '' : data.productTypeList;
        this.fetchingData = false;
      }
    });
    this.productService.getServiceCategory().subscribe((data: any) => {
      if (data.resultCode === '0') {
        this.serviceCategoryList = data.serviceCategoryList == undefined ? '' : data.serviceCategoryList;
        this.fetchingData = false;
      }
    });
 
    this.editMode = this.productService.prepareUserAction();
    this.route.queryParams.subscribe((params: Params) => {
      console.log('params', params);
      if (params && this.editMode) {
        this.productData = params;
        this.code = params.code;
        this.name = params.name;
        this.operatorCode = params.operatorCode;
        this.productTypeCode = params.productTypeCode;
        this.serviceCategoryCode = params.serviceCategoryCode;
        this.operatorName = params.operatorName,
        this.productTypeName = params.productTypeName,
        this.serviceCategoryName = params.serviceCategoryName,
        this.value = params.value;
        this.minValue = params.minValue;
        this.maxValue = params.maxValue;
        this.description = params.description;
        this.status = params.status == "Active" ? "Y" : "N";
        this.getOperaors( params.serviceCategoryCode);
      }
      this.createForm();
    });
    // if (!this.editMode) {
 
      this.productForm.get("productTypeCode").valueChanges.subscribe(x => {
        if (this.productForm.get("productTypeCode").value =='100000') {
          // this.showagent = true;
          this.productForm.get("value").enable();
          this.productForm.get("minValue").disable();
          this.productForm.get("maxValue").disable();
          this.productForm.get("value").setValue("");
          this.productForm.get("minValue").setValue("");
          this.productForm.get("maxValue").setValue("");
          this.productForm.get("value").setValidators([Validators.required]);
          this.productForm.updateValueAndValidity();
        }
        if (this.productForm.get("productTypeCode").value =='100001') {
          // this.showagent = true;
          this.productForm.get("value").disable();
          this.productForm.get("minValue").enable();
          this.productForm.get("maxValue").enable();
          this.productForm.get("value").setValue("");
          this.productForm.get("minValue").setValue("");
          this.productForm.get("maxValue").setValue("");
          this.productForm.get("minValue").setValidators([Validators.required]);
          this.productForm.get("maxValue").setValidators([Validators.required]);
          this.productForm.updateValueAndValidity();
        }
      })

    // }

  }

  onCancel() {
    const firstPath = window.location.pathname.split('/')[1];
    this.router.navigate(['/product'], { relativeTo: this.route });
  }
  async onSubmit() {
    this.submitted = true;
    console.log("sumbmitted++" + this.productForm.invalid);
    this.errorMessage = "";
    if (this.productForm.invalid) {
      return;
    }


    if (!this.editMode) {
      console.log('this.productForm.value' , this.productForm.value);
      if(this.productService.approvalRequired){
      let data = await this.productService.createProduct(this.productForm.value);
      console.log('res ', data);
      if (data == null) {
        //this.errorMessage = "There is some error, Please try after some time.";
        this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
          this.errorMessage =data;
          });
      }
      else if (data["resultCode"] == "0") {
       
        this.productService.makeEntryToApproval(data.product).subscribe(approvalData => {
          console.log('approvalData', approvalData)
          if (approvalData === null) {
            //this.errorMessage = "There is some error, Please try after some time.";
            this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
              this.errorMessage =data;
              });
          } else {
            if (approvalData["resultCode"] == "0") {
              this.errorMessage = undefined;
              this.router.navigate(['/product'], { relativeTo: this.route, queryParams: { status: 'added' } });
            } else {
              this.errorMessage = approvalData["resultDescription"];
            }
          }
        });
     
      } else {
        this.errorMessage = data["resultDescription"];
      }
    }else{
       let request = {
         ...this.productForm.value,
         status : ApprovalConstants.status.code.ACTIVE,
         state: ApprovalConstants.state.code.APPROVED
       }
      let data = await this.productService.createProduct(request);
      console.log('res ', data);
      if (data["resultCode"] == "0") {
        this.errorMessage = undefined;
        this.router.navigate(['/product'], { relativeTo: this.route, queryParams: { status: 'added' } });
      }
      else {
        this.errorMessage = data["resultDescription"];
      }
    }
    
    } else {
      if(this.productService.approvalRequired){
      const updatedInfo = this.productService.preparedUpdatedDataForApproval(this.productData, this.getRequiredDetail(this.productForm.value));
      console.log('updatedInfo', updatedInfo);

      let data = await this.productService.updateProduct(this.prepareDataForUpdateStatus(this.productData), this.code);
      console.log('res ', data);
      if (data == null) {
        //this.errorMessage = "There is some error, Please try after some time.";
        this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
          this.errorMessage =data;
          });
      }
      else if (data["resultCode"] == "0") {
        this.productService.makeEntryToApproval(this.productData, updatedInfo).subscribe(approvalData => {
          console.log('--approvalData--', approvalData);
          if (approvalData === null) {
            //this.errorMessage = "There is some error, Please try after some time.";
            this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
              this.errorMessage =data;
              });
          } else {
            if (approvalData.resultCode === '0') {

              this.errorMessage = undefined;
              this.router.navigate(['/product'], { relativeTo: this.route, queryParams: { status: 'updated' } });
            } else {
              this.errorMessage = approvalData.resultDescription;
            }
          }
        });

      } else {
        this.errorMessage = data["resultDescription"];
      }

    }else{
      //  no approval required  for update
      let request = {
        ...this.productForm.value,
        // status : ApprovalConstants.status.code.ACTIVE,
        state: ApprovalConstants.state.code.APPROVED
      }
      let data = await this.productService.updateProduct(request, this.code);
      console.log('res ', data);
      if (data.resultCode === '0') {

        this.errorMessage = undefined;
        this.router.navigate(['/product'], { relativeTo: this.route, queryParams: { status: 'updated' } });
      } else {
        this.errorMessage = data.resultDescription;
      }
    }
  }

  }

  get f() {
    return this.productForm.controls;
  }
  serviceCategoryName: string;
  operatorName: string;
  productTypeName: string;
  onChangeGetServiceCategoryName($event){
   console.log('$event.target.value' + $event.target.value);
    this.serviceCategoryName = $event.target.options[$event.target.options.selectedIndex].text;
    this.getOperaors($event.target.value);
    
  }
  getOperaors(category:string){
    this.productService.getOperatorList(category).subscribe((data: any) => {
      if (data.resultCode === '0') {
        this.operatorList = data.operatorList == undefined ? [] : data.operatorList;
      
      }else{
        this.operatorList =[];
      }
    });
  }
  onChangeGetOperatorName($event){
    this.operatorName = $event.target.options[$event.target.options.selectedIndex].text;
  }
  minmaxshow : boolean = false;
  valueshow : boolean = true;

  onChangeGetProductTypeName($event){
      this.productTypeName = $event.target.options[$event.target.options.selectedIndex].text;
      if($event.target.value=='100001'){
          this.minmaxshow = true;
          this.valueshow = false;
      }else{
        this.valueshow = true;
        this.minmaxshow = false;
      }
  }
  createForm() {

    this.productForm = this.formBuilder.group({
      name: [this.name, [Validators.required, Validators.pattern('^[a-zA-Z0-9-\._ ]+$'), Validators.pattern(/^[^ ][\w\W ]*[^ ]/), Validators.minLength(3)]],
      serviceCategoryCode: [this.serviceCategoryCode,[Validators.required]],
      // operatorCode: [this.operatorCode, [Validators.required]],
      // productTypeCode: [this.productTypeCode, [Validators.required]],
      operatorCode: [this.operatorCode ],
      productTypeCode: [this.productTypeCode ],
      description: [this.description],
      status: [this.status],
      value: [this.value,[Validators.required] ],
      // minValue: [this.minValue, [  Validators.pattern('^[-+]?[0-9]+\.[0-9]+[1-9]+$'), Validators.pattern(/^[^ ][\w\W ]*[^ ]/)]],
      // maxValue: [this.maxValue, [  Validators.pattern('^[-+]?[0-9]+\.[0-9]+[1-9]+$'), Validators.pattern(/^[^ ][\w\W ]*[^ ]/)]],
      minValue: [this.minValue ],
      maxValue: [this.maxValue ],

    },

    );
  }


  prepareDataForUpdateStatus(data) {
    return {
      ...data,
      status: ApprovalConstants.status.code.INACTIVE,
      state: ApprovalConstants.status.code.UPDATED
    }

  }
 


getRequiredDetail(data) {
  return {
    ...data,
  
    operatorName : this.operatorName,
    productTypeName : this.productTypeName,
    serviceCategoryName : this.serviceCategoryName,
   
  }
  
}


}