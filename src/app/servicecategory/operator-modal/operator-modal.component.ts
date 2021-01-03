import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
 import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ServiceCategoryService } from '../servicecategory.service';

@Component({
  selector: 'app-operator-modal',
  templateUrl: './operator-modal.component.html',
  styleUrls: ['./operator-modal.component.css']
})
export class OperatorModalComponent {

  @Input() code: string;
  eWalletServiceList: any;
  operatorList: any;
  selectedService: any = {
    name : '',
    code : ''
  };
  fetchingData = true;
  editMode = false;
  errorMessage: string;
  dtOption: any = {};
  categoryCode : string;
  categoryName : string;
  EWALLETSERVICE : string=  'EWALLETSERVICE';
  setPermission: any;
  constructor(public activeModal: NgbActiveModal,private modalService: NgbModal,
    private serviceCategoryService: ServiceCategoryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedrouter: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private route: ActivatedRoute) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.setPermission =  this.serviceCategoryService.setPermission;

    if (this.code) {
      this.serviceCategoryService.getTemplateMasters(this.EWALLETSERVICE).subscribe(data => {
        if (data["resultCode"] === '0') {
          this.errorMessage = undefined;
          this.eWalletServiceList = data["ewalletServiceList"]  == undefined?'': data["ewalletServiceList"];
          this.eWalletServiceList =  this.eWalletServiceList.filter(m => {
            return m.code == this.code;
          })
        
             
       
          if(this.eWalletServiceList){
          this.selectedService =  this.eWalletServiceList[0];
          }
  
          console.log(' this.eWalletServiceList',  this.eWalletServiceList)
          // this.country = data.country;
           
          this.dtOption = this.commonHelperService.settingDataTable();
        } else {
          
          this.errorMessage = data["resultDescription"];
        }
      }, error => {
        this.fetchingData =false;
        this.errorMessage = error.error.resultDescription;
      });
     this.categoryCode =  this.serviceCategoryService.category.code;
     this.categoryName =  this.serviceCategoryService.category.name;
      this.serviceCategoryService.category.name;
      this.serviceCategoryService.getOperator(this.serviceCategoryService.category.code).subscribe((data: any) => {
           if (data.resultCode === '0') {
             this.operatorList = data.operatorList  == undefined?'':data.operatorList;
             this.fetchingData = false;
          }else{

            this.operatorList=[];
            this.fetchingData = false;
          }
        });
    }
  }
  serviceCategoryList:any;
  editOperator(code: string,operatorCode: string,operatorName:string,status:string,serviceProvidercode:string ,serviceProviderName:string) {
    this.activeModal.close('Close click');
    this.serviceCategoryService.category.name =  this.categoryName;
    this.serviceCategoryService.category.code = this.categoryCode;
    this.serviceCategoryService.operator.code = operatorCode;
    this.serviceCategoryService.operator.name = operatorName;
    this.serviceCategoryService.operator.serviceProviderCode = serviceProvidercode;
    this.serviceCategoryService.operator.serviceProviderName = serviceProviderName;

    
    this.serviceCategoryService.operator.status = status;
 
    this.router.navigate(['/service/operator', 'edit', code]);
  }

  
  addOperater(code: string){
    this.activeModal.close('Close click');
    this.serviceCategoryService.category.name = this.categoryName;
    this.serviceCategoryService.category.code = this.categoryCode;
    this.router.navigate(['/service/operator', 'add', code]);
  }
 

}