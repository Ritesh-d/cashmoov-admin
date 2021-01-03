import { Component, OnInit } from '@angular/core';
import { WalletOwnerService } from './wallet-owner.service';
import { WalletOwnerModel } from './wallet-owner.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WalletManagementModule } from './wallet-owner.module';
import { AddWalletOwnerService } from './add-wallet-owner/add-wallet-owner-service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewWalletOwnerComponent } from './view-wallet-owner/view-wallet-owner.component';
import { CommonHelperService } from '../shared/services/common-helper-service';
import { WalletOwnerConstants } from './wallet-owner.constants';
import { isArguments } from 'lodash';
 
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
  public category_I = WalletOwnerConstants.category.TRUSTACCOUNT;
  public category_A = WalletOwnerConstants.category.TAXACCOUNT;
  public category_B = WalletOwnerConstants.category.SERVICEPROVIDER;

  constructor(private walletOwnerService: WalletOwnerService,
    private route: ActivatedRoute,
    private router: Router,
    private addWalletOwnerService: AddWalletOwnerService,
    private commonHelperService: CommonHelperService,
    private translate: TranslatelanguageService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {

  }

  ngOnInit() {
    this.setPermission =  this.walletOwnerService.setPermission;
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
        } else {
          // show Agents
          this.walletOwnerView = this.category_A;
          this.showChildren(params.institutionCode)
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
        this.walletOwnerService.categoryResponse = data;
        this.categories = data.categoryList;
        this.categories = this.categories.filter(s => {
          console.log('s', s) ;
          if(s.code =="100006" || s.code =="100007" || s.code =="100008"){
            return s;
          }
        });

        // this.categories.forEach(category => {
          // console.log('category' ,category.name);
          // if (category.code === WalletOwnerConstants.category.TRUSTACCOUNT) {
            // console.log('category code' ,category.name , category.code);
            // TODO: tobe deleted
            let categories = WalletOwnerConstants.category.TRUSTACCOUNT + ',' + WalletOwnerConstants.category.TAXACCOUNT +','   +  WalletOwnerConstants.category.SERVICEPROVIDER ;
            this.walletOwnerService.fetchWalletOwnerOnCategory(categories).subscribe(
              data => {
                if (data.resultCode === '0') {
                  this.walletOwners = data.walletOwnerList;
                } else {
                  this.errorMessage = data.resultDescription;
                }
                this.dtOptions = this.commonHelperService.settingDataTable();
              }
            );
          // }
        // });
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
          } else {
            this.walletOwners = [];
          }
        } else {
          this.errorMessage = agentsData.resultDescription;
        }
        this.dtOptions = this.commonHelperService.settingDataTable();
      });
  }

  showSuccessMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === '1') {
        if(this.walletOwnerService.approvalRequired){
        //this.successMessage = 'E-Money Added successfully and sent for approval';
        this.translate.languageText('EMONEY.e-MoneyCreatedsuccessfullysentforapproval', data=> {
          this.successMessage =data;
          });
        }else{
          //this.successMessage = 'E-Money Added successfully';
          this.translate.languageText('EMONEY.e-MoneyCreationAddedsuccessfully', data=> {
            this.successMessage =data;
            });
        }
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === '2') {
        if(this.walletOwnerService.approvalRequired){
          //this.successMessage = 'E-Money Updated successfully and sent for approval';
          this.translate.languageText('EMONEY.e-MoneyUpdationsentforapprovalsuccessfully', data=> {
            this.successMessage =data;
            });
        }else{
          //this.successMessage = 'E-Money Updated successfully';
          this.translate.languageText('EMONEY.e-MoneyUpdatedsuccessfully', data=> {
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

  viewWalletOwner(walletOwnerCode: string, serviceBlock : string) {
    // if (this.walletOwnerView === this.category_I) {
      this.router.navigate(['view', walletOwnerCode], { relativeTo: this.route, skipLocationChange: true , queryParams: {'services' : serviceBlock}});
    // } else if (this.walletOwnerView === this.category_A) {
    //   this.router.navigate(['../../view', walletOwnerCode], { relativeTo: this.route });
    // } else if (this.walletOwnerView === this.category_B) {
    //   this.router.navigate(['../../../view', walletOwnerCode], { relativeTo: this.route });
    // }
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

  editWalletOwner(walletOwnerCode: number) {
    /*if (state === WalletOwnerConstants.state.ENROLLED) {
      if (this.walletOwnerView === this.category_I) {
        this.router.navigate(['edit', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage } });
      } else if (this.walletOwnerView === this.category_A) {
        this.router.navigate(['../../edit', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage } });
      } else if (this.walletOwnerView === this.category_B) {
        this.router.navigate(['../../../edit', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage } });
      }
    } else {
      if (this.walletOwnerView === this.category_I) {
        this.router.navigate(['edit', walletOwnerCode], { relativeTo: this.route });
      } else if (this.walletOwnerView === this.category_A) {
        this.router.navigate(['../../edit', walletOwnerCode], { relativeTo: this.route });
      } else if (this.walletOwnerView === this.category_B) {
        this.router.navigate(['../../../edit', walletOwnerCode], { relativeTo: this.route });
      }
    }*/

    if (this.walletOwnerView === this.category_I) {
      this.router.navigate(['edit', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_A) {
      this.router.navigate(['../../edit', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_B) {
      this.router.navigate(['../../../edit', walletOwnerCode], { relativeTo: this.route });
    }
  }

  enrolledWalletOwner(walletOwnerCode: number, state: string, stage: string) {
    console.log('--enrolledWalletOwner--', stage);
    if (state === WalletOwnerConstants.state.ENROLLED) {
      if (this.walletOwnerView === this.category_I) {
        this.router.navigate(['enroll', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage } });
      } else if (this.walletOwnerView === this.category_A) {
        this.router.navigate(['../../enroll', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage } });
      } else if (this.walletOwnerView === this.category_B) {
        this.router.navigate(['../../../enroll', walletOwnerCode], { relativeTo: this.route, queryParams: { stage: stage } });
      }
    }
  }

  viewType(view: string) {
    return this.walletOwnerView === view;
  }

  addChild(walletOwnerCode: string, type: string) {
    let category = this.walletOwnerService.getCategoryCode(type);
    if (this.walletOwnerView === this.category_I) {
      this.router.navigate(['add', walletOwnerCode, category], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_A) {
      this.router.navigate(['../../add', walletOwnerCode, category], { relativeTo: this.route });
    } else {
      console.log('--else--');
    }

  }

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

  navigateToAdd(categorytype : string) {
    // let category = this.walletOwnerService.getCategoryCode(this.walletOwnerView);
    console.log('navigateToAdd category' , categorytype);
    // if (this.walletOwnerView === this.category_I) {
    //   this.router.navigate(['add'], { relativeTo: this.route });
    // } else if (this.walletOwnerView === this.category_A) {
    //   this.router.navigate(['../../add', this.walletOwnerInfo.code, category], { relativeTo: this.route });
    // } else if (this.walletOwnerView === this.category_B) {
    //   this.router.navigate(['../../../add', this.walletOwnerInfo.code, category], { relativeTo: this.route });
    // }
    // if (categorytype === this.category_I) {
      this.router.navigate(['add','', categorytype], { relativeTo: this.route });
    // } else if (categorytype === this.category_A) {
    //   this.router.navigate(['../../add', this.walletOwnerInfo.code, categorytype], { relativeTo: this.route });
    // } else if (categorytype === this.category_B) {
    //   this.router.navigate(['../../../add', this.walletOwnerInfo.code, categorytype], { relativeTo: this.route });
    // }
  }

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
      this.router.navigate(['addUser', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_A) {
      this.router.navigate(['../../addUser', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_B) {
      this.router.navigate(['../../../addUser', walletOwnerCode], { relativeTo: this.route });
    }
  }

  getCategoryOnCode(walletOwnerCategoryCode: string): string {
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
      this.router.navigate(['../../configuration', walletOwnerCode], { relativeTo: this.route });
    } else if (this.walletOwnerView === this.category_B) {
      this.router.navigate(['../../../configuration', walletOwnerCode], { relativeTo: this.route });
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
    if (this.walletOwnerSearchForm.get("category").value) {
      params.append('walletOwnerCategoryCode', this.walletOwnerSearchForm.get("category").value);
    }
    // if (this.walletOwnerSearchForm.get("status").value) {
    //   params.append('status', this.walletOwnerSearchForm.get("status").value);
    // }

    params.append("offset", '0');
    params.append("limit", '50');
    console.log('params' + params);
    this.walletOwners = undefined;
    this.walletOwnerService.allWalletOwners(params).subscribe(data => {
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