import { Component, OnInit } from '@angular/core';
 
import { MerchantModel } from '../merchant.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
 
import { AddWalletOwnerService } from '../add-wallet-owner/add-wallet-owner-service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { WalletOwnerConstants } from '../wallet-owner.constants';
import { isArguments } from 'lodash';
import { MerchantService } from '../merchant.service';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.css']
})
export class OutletsComponent implements OnInit {

  getcurrentLang:any;
  walletOwners: MerchantModel[];
  dtOptions: any = {};
  errorMessage: string;
  successMessage: string;
  walletOwnerSearchForm: FormGroup;
  categories: any[];
  walletOwnerView: string;
  walletOwnerInfo: any;
  categoryName : string;
  category: string;
  setPermission: any;
  constructor(private walletOwnerService: MerchantService,
    private route: ActivatedRoute,
    private router: Router,
    private translate : TranslatelanguageService,
    private addWalletOwnerService: AddWalletOwnerService,
    private commonHelperService: CommonHelperService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {
      this.getcurrentLang=this.translate.getcurrentLang();
  }

  ngOnInit() {
    this.setPermission =  this.walletOwnerService.setPermission;

    this.addWalletOwnerService.walletOwnerId = undefined;
    this.walletOwnerInfo = undefined;
    this.showSuccessMessage();
    // this.createWalletOwnerSearchForm();
    this.categoryName = WalletOwnerConstants.category.OUTLET;
    this.category = WalletOwnerConstants.category.OUTLET_CODE; //100012
   
    this.showData();
  }
  walletOwnerCode: string;
  showData() {
     
    this.route.params.subscribe((params: Params) => {
      if (params.walletOwnerCode) {
        this.walletOwnerCode = params.walletOwnerCode;
            this.walletOwnerService.fetchWaletOwnerDetails(params.walletOwnerCode).subscribe(
              data => {
                // if (data.resultCode === '0') {
                //   this.walletOwners = data.walletOwnerList;
                // } else {
                //   this.errorMessage = data.resultDescription;
                // }
                if (data.resultCode === '0') {
                  if (data.walletOwner.walletOwnerChildList) {
                    this.walletOwners = data.walletOwner.walletOwnerChildList;
                  } else {
                    this.walletOwners = [];
                  }
                }
                else {
                  this.errorMessage = data.resultDescription;
                  this.walletOwners = [];
                }
                this.dtOptions = this.commonHelperService.settingDataTable();
                this.dtOptions  = {... this.dtOptions , order:[[6, 'desc']] };
              }
            );
            }
          });
  }

 

  showSuccessMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === '1') {
        if (this.walletOwnerService.approvalRequired) {
          //this.successMessage = 'Outlet Added successfully and sent for approval';
          this.translate.languageText('OUTLET.outletAddedsuccessfullyandsentforapproval', data=> {
            this.successMessage =data;
            });
          }else{
            //this.successMessage = 'Outlet Added successfully ';
            this.translate.languageText('OUTLET.outletAddedsuccessfully', data=> {
              this.successMessage =data;
              });
          }
       } else if (this.route.snapshot.queryParamMap.get('status').toString() === '2') {
    
        if (this.walletOwnerService.approvalRequired) {
          //this.successMessage = 'Outlet Updated successfully and sent for approval';
          this.translate.languageText('OUTLET.outletUpdatedsuccessfullyandsentforapproval', data=> {
            this.successMessage =data;
            });
          }else{
           // this.successMessage = 'Outlet Updated successfully ';
           this.translate.languageText('OUTLET.outletUpdatedsuccessfully', data=> {
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

showSuccessMessage1() {
    this.route.params.subscribe((params: Params) => { 

 if(params.status){
      if (params.status.toString() === '1') {
       // this.successMessage = 'Outlet Added successfully and sent for approval';
       this.translate.languageText('OUTLET.outletAddedsuccessfullyandsentforapproval', data=> {
        this.successMessage =data;
        });

      } else if (params.status.toString() === '2') {
        //this.successMessage = 'Outlet Updated successfully and sent for approval';
        
        this.translate.languageText('OUTLET.outletUpdatedsuccessfullyandsentforapproval', data=> {
          this.successMessage =data;
          });
      } else {
        //this.successMessage = 'invalid status';
        
         this.translate.languageText('MASTER.invalidstatus', data=> {
        this.successMessage =data;
        });
        setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
      }
      
 }
     });

  }

  viewWalletOwner(walletOwnerCode: string, serviceBlock : string) {
       this.router.navigate(['../../viewOutlet', walletOwnerCode], { relativeTo: this.route, skipLocationChange: true , queryParams: {'services' : serviceBlock}});
  
  }

  

  editWalletOwner(walletOwnerCode: number) {
     
    this.router.navigate(['../../editOutlet', walletOwnerCode], { relativeTo: this.route });
  }

  

  viewType(view: string) {
    return this.walletOwnerView === view;
  }

  

 
 

  navigateToAdd(categorytype : string) {
     console.log('navigateToAdd category' , categorytype);
     
      this.router.navigate(['../../addOutlet',this.walletOwnerCode], { relativeTo: this.route });
     
  }


  // advanceSearchOption(event: any) {
  //   var x = document.getElementById("advSearchOpt");
  //   if (x.style.display === "none") {
  //     x.style.display = "block";
  //     event.srcElement.classList.remove("fa-plus-circle");
  //     event.srcElement.classList.add("fa-minus-circle");
  //   } else {
  //     x.style.display = "none";
  //     event.srcElement.classList.remove("fa-minus-circle");
  //     event.srcElement.classList.add("fa-plus-circle");
  //   }
  // }

  // createWalletOwnerSearchForm() {
  //   this.walletOwnerSearchForm = new FormGroup({
  //     code: new FormControl(''),
  //     name: new FormControl(''),
  //     mobileNumber: new FormControl(''),
  //     // status: new FormControl(''),
  //     category: new FormControl('')
  //   });
  // }

  // searchData() {
  //   let params = new URLSearchParams();
  //   if (this.walletOwnerSearchForm.get("code").value) {
  //     params.append('code', this.walletOwnerSearchForm.get("code").value);
  //   }
  //   if (this.walletOwnerSearchForm.get("name").value) {
  //     params.append('ownerName', this.walletOwnerSearchForm.get("name").value);
  //   }
  //   if (this.walletOwnerSearchForm.get("mobileNumber").value) {
  //     params.append('mobileNumber', this.walletOwnerSearchForm.get("mobileNumber").value);
  //   }
  //   // if (this.walletOwnerSearchForm.get("category").value) {
  //   //   params.append('walletOwnerCategoryCode', this.walletOwnerSearchForm.get("category").value);
  //   // }
  //   // if (this.walletOwnerSearchForm.get("status").value) {
  //   //   params.append('status', this.walletOwnerSearchForm.get("status").value);
  //   // }

  //   params.append("offset", '0');
  //   params.append("limit", '50');
  //   console.log('params' + params);
  //   this.walletOwners = undefined;
  //   this.walletOwnerService.allWalletOwners(params).subscribe(data => {
  //     if (data.resultCode === '0') {
  //       this.errorMessage = undefined;
  //       this.walletOwners = data.walletOwnerList;
  //     } else {
  //       this.walletOwners = [];
  //       this.errorMessage = data.resultDesceiption;
  //     }
  //   });
  // }
 

}