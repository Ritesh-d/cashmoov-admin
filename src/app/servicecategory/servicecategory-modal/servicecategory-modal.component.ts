import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
 import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ServiceCategoryService } from '../servicecategory.service';
import { OperatorModalComponent } from '../operator-modal/operator-modal.component';
import { takeUntil } from 'rxjs/operators';
// import {SubSink} from 'subsink';
@Component({
  selector: 'app-servicecategory-modal',
  templateUrl: './servicecategory-modal.component.html',
  styleUrls: ['./servicecategory-modal.component.css']
})
export class ServiceCategoryModalComponent {

  @Input() code: string;
  eWalletServiceList: any;
  selectedService: any = {
    name : '',
    code : ''
  };
  fetchingData = true;
  editMode = false;
  errorMessage: string;
  dtOption: any = {};
  EWALLETSERVICE : string=  'EWALLETSERVICE';
  setPermission: any;
  // private subs = new SubSink();
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
      this.serviceCategoryService.getServiceCategory(this.code).subscribe((data: any) => {
           if (data.resultCode === '0') {
             this.serviceCategoryList = data.serviceCategoryList  == undefined?'':data.serviceCategoryList;
             this.fetchingData = false;
          }else{

            this.serviceCategoryList=[];
            this.fetchingData = false;
          }
        });
    }
  }
  serviceCategoryList:any;
  editCategory(code: string, categoryName: string, categorycode: string,productAllowed:boolean,serviceCountryList:any) {
    this.activeModal.close('Close click');
    this.serviceCategoryService.category.name = categoryName;
    this.serviceCategoryService.category.code = categorycode;
    this.serviceCategoryService.category.productAllowed = productAllowed;
    this.serviceCategoryService.category.serviceCountryList= serviceCountryList;
    this.router.navigate(['/service/category', 'edit', code]);
  }

  addCategory(code: string) {
    this.activeModal.close('Close click');
    this.router.navigate(['/service/category', 'add', code]);
  }
  addOperater(code: string, categoryName: string, categorycode: string){
    this.activeModal.close('Close click');
    this.serviceCategoryService.category.name = categoryName;
    this.serviceCategoryService.category.code = categorycode;
    this.router.navigate(['/service/operator', 'add', code]);
  }
  viewOperater(code: string, categoryName: string, categorycode: string){
    this.activeModal.close('Close click');
    this.serviceCategoryService.category.name = categoryName;
    this.serviceCategoryService.category.code = categorycode;
    const modalRef = this.modalService.open(OperatorModalComponent);
    modalRef.componentInstance.code = code;
  }
  // ngOnDestroy(){
  //   this.subs.unsubscribe();
  // }

}