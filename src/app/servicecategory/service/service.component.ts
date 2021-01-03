import { Component, OnInit } from '@angular/core';
 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
 import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ServiceCategoryModalComponent } from '../servicecategory-modal/servicecategory-modal.component';
import { ServiceCategoryService } from '../servicecategory.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  fetchingData = true;
  dtOption: any = {};
  eWalletServiceList: any[];
  EWALLETSERVICE : string=  'EWALLETSERVICE';
  setPermission : any;
  constructor(private serviceCategoryService: ServiceCategoryService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private formBuilder: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.setPermission =  this.serviceCategoryService.setPermission;
    this.showMessage();

    this.serviceCategoryService.getTemplateMasters(this.EWALLETSERVICE).subscribe((data: any) => {
   
        this.eWalletServiceList = data.ewalletServiceList  == undefined?'':data.ewalletServiceList;
        this.fetchingData = false;
   }, error => {
    this.fetchingData = false;
     console.log('error', error)
   });

  }
 
  viewCategory(code: string) {
    const modalRef = this.modalService.open(ServiceCategoryModalComponent);
    modalRef.componentInstance.code = code;
  }

  addCategory(code: any) {
    this.router.navigate(['./category/add', code], { relativeTo: this.route });
  }

  private showMessage() {
    this.successMessage = this.serviceCategoryService.getMessage;
    if (this.successMessage) {
      setTimeout(() => {
        this.successMessage = undefined;
        this.serviceCategoryService.setMessage = undefined;
      }, 10 * 1000);
    }
    document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  navigateToAdd() {
    this.router.navigate(['./category/add'], { relativeTo: this.route });
  }
  // private showMessage() {
  //   if (this.route.snapshot.queryParamMap.get('status')) {
  //     if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
  //       this.successMessage = 'User Added successfully, sent for approval';
  //     } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
  //       this.successMessage = 'User Updation sent for approval successfully.';
  //     }
  //     setTimeout(() => {
  //       this.successMessage = undefined;
  //     }, 10 * 1000);
  //   }
  // }
}
