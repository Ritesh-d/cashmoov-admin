import { Component, OnInit } from '@angular/core'; 
 import {TranslatelanguageService} from './../shared/services/translatelanguage.service';
 import {CommonService} from './../shared/services/common.service'; 
 import { Endpoints } from './../shared/endpoints';  
 import { CommonHelperService } from './../shared/services/common-helper-service';
 import { SubscriberService } from './../subscriber/subscriber.service';
 import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 import { Router, Params, ActivatedRoute } from '@angular/router';
import { SubscriberModel } from './subscriber-model';
import { AddSubscriberService } from './add-subscriber/add-subscriber.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ViewSubscriberComponent } from './view-subscriber/view-subscriber.component';
import { SubscriberConstants } from './subscriber.constants';
import { isArguments } from 'lodash';
 
@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.scss']
})
export class SubscriberComponent implements OnInit {

  walletOwners: SubscriberModel[];
  dtOptions: any = {};
  errorMessage: string;
  successMessage: string;
  walletOwnerSearchForm: FormGroup;
  categories: any[];
  walletOwnerView: string;
  walletOwnerInfo: any;
  dtTrigger: any; 
  setPermission: any;
  public category_I = SubscriberConstants.category.SUBSCRIBER;
 

  constructor(private subscriberService: SubscriberService,
    private route: ActivatedRoute,
    private router: Router,
    private addSubscriberService: AddSubscriberService,
    private commonHelperService: CommonHelperService,
    private formBuilder: FormBuilder,
    private translate: TranslatelanguageService, 
    private modalService: NgbModal) {

  }

  ngOnInit() {
    this.setPermission =  this.subscriberService.setPermission;
    this.walletOwnerView = SubscriberConstants.category.SUBSCRIBERTEXT;
    this.addSubscriberService.walletOwnerId = undefined;
    this.walletOwnerInfo = undefined;
    this.showSuccessMessage();
    this.createWalletOwnerSearchForm();

    this.route.params.subscribe((params: Params) => {
 

         this.showInstitutions();
      
    });

  }
  isSpinner : boolean =true;
  showInstitutions() {
    
            this.subscriberService.fetchWalletOwnerOnCategory(SubscriberConstants.category.SUBSCRIBER).subscribe(
              data => {
                if (data.resultCode === '0') {
                  this.isSpinner = false;
                  this.walletOwners = data.walletOwnerList;
                } else {
                  this.isSpinner = false;
 this.translate.languageText('SUBSCRIBER.subscriberNotFound', data=> {  
    this.errorMessage=data;
  });

                   
                }
                this.dtOptions = this.commonHelperService.settingDataTable();
                this.dtOptions  = {... this.dtOptions , order:[[7, 'desc']] };
              } , error => {
                this.isSpinner = false;
                this.errorMessage = error.error.resultDescription;
              }
            );
       
  }

  
  showSuccessMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === '1') {
        if(this.subscriberService.approvalRequired){
        this.successMessage = '';
         this.translate.languageText('SUBSCRIBER.addedAndApproval', data=> {  
    this.successMessage=data;
  });

        }else{
         
   this.translate.languageText('SUBSCRIBER.addedAndSuccess', data=> {  
    this.successMessage=data;
  });

        }
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === '2') {
        if(this.subscriberService.approvalRequired){ 
 this.translate.languageText('SUBSCRIBER.updatedSuccessApproval', data=> {  
    this.successMessage=data;
  });

        }else{
        
 this.translate.languageText('SUBSCRIBER.updatedSuccess', data=> {  
    this.successMessage=data;
  });

        }
      } else {
      
 this.translate.languageText('MASTER.transactionSuccessful', data=> {  
    this.successMessage=data;
  });

      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
    }
  }

  viewWalletOwner(walletOwnerCode: string) {
    
      this.router.navigate(['view', walletOwnerCode], { relativeTo: this.route });
    
  }

  viewUsers(walletOwnerCode: string) {
      this.router.navigate(['users', walletOwnerCode], { relativeTo: this.route });
  }

  editWalletOwner(walletOwnerCode: number) {
       this.router.navigate(['edit', walletOwnerCode], { relativeTo: this.route });
   }



 

  addChild(walletOwnerCode: string, type: string) {
    let category = this.subscriberService.getCategoryCode(type);
       this.router.navigate(['add', walletOwnerCode, category], { relativeTo: this.route });
 

  }

  viewChild(walletOwnerCode: string) {
    
      this.router.navigate(['owner', walletOwnerCode], { relativeTo: this.route });
    
  }



  navigateToAdd(categorytype : string) {
   
    console.log('navigateToAdd category' , categorytype);

    this.router.navigate(['add','', categorytype], { relativeTo: this.route });
  
  }

  addUser(walletOwnerCode: string) {
    
      this.router.navigate(['addUser', walletOwnerCode], { relativeTo: this.route });
    
  }

  advanceSearchOption(event: any) {
    var x = document.getElementById("advSearchOpt");
    if (x.style.display === "none") {
      x.style.display = "block";
      event.srcElement.classList.remove("fa-plus-circle");
      event.srcElement.classList.add("fa-minus-circle");
    } else {
      x.style.display = "none";
      event.srcElement.classList.remove("fa-minus-circle");
      event.srcElement.classList.add("fa-plus-circle");
    }
  }

  createWalletOwnerSearchForm() {
    this.walletOwnerSearchForm = new FormGroup({
      code: new FormControl(''),
      name: new FormControl(''),
      mobileNumber: new FormControl(''),
      // status: new FormControl(''),
      category: new FormControl('')
    });
  }

  enrolledWalletOwner(walletOwnerCode: number, state: string, stage: string) {
    console.log('--enrolledWalletOwner--', stage);
      this.router.navigate(['enroll', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage } });
      
  }

  searchData() {
    let params = new URLSearchParams();
    if (this.walletOwnerSearchForm.get("code").value) {
      params.append('code', this.walletOwnerSearchForm.get("code").value);
    }
    if (this.walletOwnerSearchForm.get("name").value) {
      params.append('ownerName', this.walletOwnerSearchForm.get("name").value);
    }
    if (this.walletOwnerSearchForm.get("mobileNumber").value) {
      params.append('mobileNumber', this.walletOwnerSearchForm.get("mobileNumber").value);
    }
    if (this.walletOwnerSearchForm.get("category").value) {
      params.append('walletOwnerCategoryCode', this.walletOwnerSearchForm.get("category").value);
    }
    

    params.append("offset", '0');
    params.append("limit", '500');
    console.log('params' + params);
    this.walletOwners = undefined;
    this.subscriberService.allWalletOwners(params).subscribe(data => {
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.walletOwners = data.walletOwnerList;
      } else {
        this.walletOwners = [];
        this.errorMessage = data.resultDesceiption;
      }
    });
  }

}
