import { Component, OnInit } from '@angular/core';
import { WalletOwnerService } from './wallet-owner.service';
import { WalletOwnerModel } from './wallet-owner.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WalletOwnerModule } from './wallet-owner.module';
import { AddWalletOwnerService } from './add-wallet-owner/add-wallet-owner-service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewWalletOwnerComponent } from './view-wallet-owner/view-wallet-owner.component';
import { CommonHelperService } from '../shared/services/common-helper-service';
import { WalletOwnerConstants } from './wallet-owner.constants';
import { isArguments } from 'lodash';
import { WalletOwnerCurrencyComponent } from './wallet-owner-configuration/wallet-owner-currency/wallet-owner-currency.component';
import { BasicInfoService } from './add-wallet-owner/basic-info/basic-info.service';
import {TranslatelanguageService} from '../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-wallet-owner',
  templateUrl: './wallet-owner.component.html',
  styleUrls: ['./wallet-owner.component.css']
})
export class WalletOwnerComponent implements OnInit {

  walletOwners: WalletOwnerModel[];
  dtOptions: any = {};
  errorMessage: string;
  successMessage: string;
  walletOwnerSearchForm: FormGroup;
  categories: any[];
  walletOwnerView: string;
  walletOwnerInfo: any;
  setPermission: any;

  public category_I = WalletOwnerConstants.category.INSTITUTION;
  public category_A = WalletOwnerConstants.category.AGENT;
  public category_B = WalletOwnerConstants.category.BRANCH;
  public code_I = WalletOwnerConstants.category.INSTITUTION_CODE;
  public code_A = WalletOwnerConstants.category.AGENT_CODE;
  public code_B = WalletOwnerConstants.category.BRANCH_CODE;

  constructor(private walletOwnerService: WalletOwnerService,
    private route: ActivatedRoute,private basicInfoService: BasicInfoService,
    private router: Router,
    private addWalletOwnerService: AddWalletOwnerService,
    private commonHelperService: CommonHelperService,
    private translate: TranslatelanguageService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {

  }

  ngOnInit() {
    this.setPermission = this.walletOwnerService.setPermission;
    this.addWalletOwnerService.walletOwnerId = undefined;
    this.walletOwnerInfo = undefined;
    this.showSuccessMessage();
    this.createWalletOwnerSearchForm();

    this.route.params.subscribe((params: Params) => {
      if (params.institutionCode) {
        if (params.agentCode) {
          // show Branch
          this.walletOwnerView = this.category_B;
          this.showChildren(params.agentCode)
          this.walletOwnerService.categories.subscribe(data => {
            if (data.resultCode === '0') {
              this.walletOwnerService.categoryResponse = data;
      
              this.categories = data.categoryList;
              this.categories = this.categories.filter(s => {
          
                // if(s.code !="100006" && s.code !="100007" && s.code !="100008"){
                  if(s.code =="100000" || s.code =="100001" || s.code =="100002"){
                  return s;
                }
              });
            }
          });
        } else {
          // show Agents
          this.walletOwnerView = this.category_A;
          this.showChildren(params.institutionCode)
          this.walletOwnerService.categories.subscribe(data => {
            if (data.resultCode === '0') {
              this.walletOwnerService.categoryResponse = data;
      
              this.categories = data.categoryList;
              this.categories = this.categories.filter(s => {
          
                // if(s.code !="100006" && s.code !="100007" && s.code !="100008"){
                  if(s.code =="100000" || s.code =="100001" || s.code =="100002"){
                  return s;
                }
              });
            }
          });
        }
      } else {
        // show institution
        this.walletOwnerView = this.category_I;
        this.showInstitutions();
      }
    });

  }

  showInstitutions() {
    this.walletOwnerService.categories.subscribe(data => {
      if (data.resultCode === '0') {
        console.log('category.data' , data);
        this.walletOwnerService.categoryResponse = data;

        this.categories = data.categoryList;
        this.categories = this.categories.filter(s => {
    
          // if(s.code !="100006" && s.code !="100007" && s.code !="100008"){
            if(s.code =="100000" || s.code =="100001" || s.code =="100002"){
            return s;
          }
        });

        this.categories.forEach(category => {
     
          if (category.code === WalletOwnerConstants.category.INSTITUTION_CODE) {
            // TODO: tobe deleted
            this.walletOwnerService.fetchWalletOwnerOnCategory(category.code).subscribe(
              institutions => {
                if (institutions.resultCode === '0') {
                  this.walletOwners = institutions.walletOwnerList;
                  this.isSpinner = false;
                } else {
                  this.errorMessage = institutions.resultDescription;
                  this.isSpinner = false;
                }
                this.dtOptions = this.commonHelperService.settingDataTable();
                this.dtOptions  = {... this.dtOptions , order:[[5, 'desc']] };
              }
            );
          }
        });
     
         
               
      } else {
        this.errorMessage = data.resultDescription;
      }
    }, error => {
      this.errorMessage = error.error.resultDescription;
    });
  }

  showChildren(walletOwnerCode: string) {
    console.log('--showChildren of--', walletOwnerCode);
    this.walletOwnerService.fetchWaletOwnerDetails(walletOwnerCode).subscribe(
      agentsData => {
        if (agentsData.resultCode === '0') {
          this.walletOwnerInfo = agentsData.walletOwner;
          if (agentsData.walletOwner.walletOwnerChildList) {
            this.walletOwners = agentsData.walletOwner.walletOwnerChildList;
            this.isSpinner = false;
          } else {
            this.walletOwners = [];
            this.isSpinner = false;
          }
        } else {
          this.errorMessage = agentsData.resultDescription;
        }
        this.dtOptions = this.commonHelperService.settingDataTable();
        this.dtOptions  = {... this.dtOptions , order:[[5, 'desc']] };
      });
  }

  showSuccessMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === '1') {
        if(this.walletOwnerService.approvalRequired){
          //this.successMessage = 'Wallet Owner Added successfully and sent for approval';
          this.translate.languageText('WALLET.walletOwnerAddedsuccessfullyandsentforapproval', data=> {
            this.successMessage =data;
            });
        }else{
          //this.successMessage = "Wallet Owner Added successfully";
          this.translate.languageText('WALLET.walletOwnerAddedsuccessfully', data=> {
            this.successMessage =data;
            });
        }
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === '2') {
        if(this.walletOwnerService.approvalRequired){
        //this.successMessage = 'Wallet Owner Updated successfully and sent for approval';
        this.translate.languageText('WALLET.walletOwnerUpdatedsuccessfullyandsentforapproval', data=> {
          this.successMessage =data;
          });
        }else{
          //this.successMessage = "Wallet Owner Updated successfully";
          this.translate.languageText('WALLET.walletOwnerUpdatedsuccessfully', data=> {
            this.successMessage =data;
            });
        }
      } else {
        //this.successMessage = 'invalid status';
        this.translate.languageText('MASTER.invalidstatus', data=> {
          this.successMessage =data;
          });
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
    }
  }

  viewWalletOwner(walletOwnerCode: string, categoryCode : string) {
    console.log('categoryCode'+ categoryCode);
    this.addWalletOwnerService.selectedCategoryCode = categoryCode;
    if (this.walletOwnerView === this.category_I) {
      this.router.navigate(['view', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_A) {
      this.router.navigate(['../../viewAgent', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_B) {
      this.router.navigate(['../../../viewBranch', walletOwnerCode], { relativeTo: this.route });
    }
  }
  
  viewUsers(walletOwnerCode: string) {
    if (this.walletOwnerView === this.category_I) {
      this.router.navigate(['users', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_A) {
      this.router.navigate(['../../users', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_B) {
      this.router.navigate(['../../../users', walletOwnerCode], { relativeTo: this.route });
    }
  }

  editWalletOwner(walletOwnerCode: number, categoryCode : string) {
    this.addWalletOwnerService.selectedCategoryCode = categoryCode;
    if (this.walletOwnerView === this.category_I) {
      this.addWalletOwnerService.selectedCategoryCode=this.code_I;
      this.router.navigate(['edit', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_A) {
      this.addWalletOwnerService.selectedCategoryCode=this.code_A;
      this.router.navigate(['../../editAgent', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_B) {
      this.addWalletOwnerService.selectedCategoryCode=this.code_B;
      this.router.navigate(['../../../editBranch', walletOwnerCode], { relativeTo: this.route });
    }
  }

  enrolledWalletOwner(walletOwnerCode: number, state: string, stage: string) {
    console.log('--enrolledWalletOwner--', stage);
    if (state === WalletOwnerConstants.state.ENROLLED) {
      if (this.walletOwnerView === this.category_I) {
        this.router.navigate(['enroll', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage,code:this.code_I } });
      } else if (this.walletOwnerView === this.category_A) {
        this.router.navigate(['../../enroll', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage,code:this.code_A } });
      } else if (this.walletOwnerView === this.category_B) {
        this.router.navigate(['../../../enroll', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage ,code:this.code_B} });
      }
    }
  }

  viewType(view: string) {
    return this.walletOwnerView === view;
  }

  // addChild(walletOwnerCode: string, type: string) {
  //   let category = this.walletOwnerService.getCategoryCode(type);
  //   if (this.walletOwnerView === this.category_I) {
  //     this.router.navigate(['add', walletOwnerCode, category], { relativeTo: this.route });
  //   } else if (this.walletOwnerView === this.category_A) {
  //     this.router.navigate(['../../addAgent', walletOwnerCode, category], { relativeTo: this.route });
  //   } else {
  //     console.log('--else--');
  //   }

  // }

  viewChild(walletOwnerCode: string) {
    if (this.walletOwnerView === this.category_I) {
      this.router.navigate(['owner', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_A) {
      this.router.navigate([walletOwnerCode], { relativeTo: this.route });
    } else {
      console.log('--else--');
    }
  }

  showInfo() {
    if (this.walletOwnerInfo && this.walletOwnerView === this.category_A
      || this.walletOwnerView === this.category_B) {
      return true;
    }
    return false;
  }

  addWalletOwner() {
    let category = this.walletOwnerService.getCategoryCode(this.walletOwnerView);
    if (this.walletOwnerView === this.category_I) {
      
      console.log('adding institute'  );
      this.router.navigate(['add'], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_A) {

      console.log('adding agent'  );
     this.router.navigate(['../../addAgent', this.walletOwnerInfo.code, category], { relativeTo: this.route });
 
      
    } else if (this.walletOwnerView === this.category_B) {
      console.log('adding branch'  );
      this.router.navigate(['../../../addBranch', this.walletOwnerInfo.code, category], { relativeTo: this.route });
    }
  }
  // navigateToAdd() {
  //   let category = this.walletOwnerService.getCategoryCode(this.walletOwnerView);
  //   if (this.walletOwnerView === this.category_I) {
  //     this.router.navigate(['add'], { relativeTo: this.route });
  //   } else if (this.walletOwnerView === this.category_A) {
  //     this.router.navigate(['../../add', this.walletOwnerInfo.code, category], { relativeTo: this.route });
  //   } else if (this.walletOwnerView === this.category_B) {
  //     this.router.navigate(['../../../add', this.walletOwnerInfo.code, category], { relativeTo: this.route });
  //   }
  // }

  showbreadCrumb(link: string) {
    if ((this.walletOwnerView === this.category_I
      || this.walletOwnerView === this.category_A
      || this.walletOwnerView === this.category_B) && link === 'institution') {
      return true;
    } else if ((this.walletOwnerView === this.category_A
      || this.walletOwnerView === this.category_B) && link === 'agent') {
      return true;
    } else if (this.walletOwnerView === this.category_B && link === 'branch') {
      return true;
    }
    return false;
  }

  navigateTo(link: string) {
    if (link === 'institution') {
      if (this.walletOwnerView === this.category_A) {
        this.router.navigate(['../../'], { relativeTo: this.route });
      } else if (this.walletOwnerView === this.category_B) {
        this.router.navigate(['../../../'], { relativeTo: this.route });
      }
    } else if (link === 'agent') {
      if (this.walletOwnerView === this.category_B) {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    }
  }

  addUser(walletOwnerCode: string) {
    if (this.walletOwnerView === this.category_I) {
      this.addWalletOwnerService.selectedCategoryCode=this.code_I;
      this.router.navigate(['addUser', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_A) {
      this.addWalletOwnerService.selectedCategoryCode=this.code_A;
      this.router.navigate(['../../addUser', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_B) {
      this.addWalletOwnerService.selectedCategoryCode=this.code_B;
      this.router.navigate(['../../../addUser', walletOwnerCode], { relativeTo: this.route });
    }
  }

  getCategoryOnCode(walletOwnerCategoryCode: string): string {
    console.log('getCategoryOnCode called' , walletOwnerCategoryCode,this.walletOwnerView)
    let categoryName: string;
    this.walletOwnerService.categories.subscribe(data => {
      if (data.resultCode === '0') {
        for (let i = 0; i < data.categoryList.length; i++) {
          if (walletOwnerCategoryCode == data.categoryList[i].code) {
            categoryName = data.categoryList[i].name;
            break;
          }
        }
      }
    });
    return categoryName;
  }

  configuration(walletOwnerCode: string, walletOwner: any ) {
    console.log('walletOwner' , walletOwner);
    if (this.walletOwnerView === this.category_I) {
  
      this.router.navigate(['configuration' ,walletOwnerCode],  { queryParams:  walletOwner, skipLocationChange: true, relativeTo: this.route });
      
    } else if (this.walletOwnerView === this.category_A) {
      this.router.navigate(['../../configuration', walletOwnerCode], { queryParams:  walletOwner, skipLocationChange: true,relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_B) {
      this.router.navigate(['../../../configuration', walletOwnerCode], {queryParams:  walletOwner, skipLocationChange: true, relativeTo: this.route });
    }
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
    // if (this.walletOwnerSearchForm.get("category").value) {
    //   params.append('walletOwnerCategoryCode', this.walletOwnerSearchForm.get("category").value);
    // }
    let categoryCode= this.walletOwnerSearchForm.get("category").value;
    if(!categoryCode|| categoryCode==undefined){
      categoryCode = this.code_I
    }
    // if (this.walletOwnerSearchForm.get("status").value) {
    //   params.append('status', this.walletOwnerSearchForm.get("status").value);
    // }

    params.append("offset", '0');
    params.append("limit", '50');
    console.log('params' + params);
    this.walletOwners = undefined;
    this.walletOwnerService.allWalletOwners(categoryCode,params).subscribe(data => {
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.isSpinner = false;
        this.walletOwners = data.walletOwnerList;
      } else {
        this.walletOwners = [];
        this.errorMessage = data.resultDesceiption;
        this.isSpinner = false;
      }
    });
  }
  isSpinner : boolean =true;
}