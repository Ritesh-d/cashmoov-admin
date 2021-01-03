import { Component, OnInit, PipeTransform, Pipe, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ProductService } from '../product.service';
import { Constants } from '../product.constant';
import { DataTableDirective } from 'angular-datatables';
import { ViewProductComponent } from '../product-model/viewproduct.component';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
    getcurrentLang:any;
    successMessage : string='';
    searchForm : FormGroup;
    fetchingData : boolean = true;
    dtOption: any = {};
    datagrid :any ;
    setPermission : any;
    // @ViewChild(DataTableDirective,{static:false}) dtElement: DataTableDirective;
    constructor(private modalService: NgbModal,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private commonHelperService: CommonHelperService,
      private translate : TranslatelanguageService,
      private productService : ProductService,
      private router: Router){
        this.getcurrentLang=this.translate.getcurrentLang();
    }
    ngOnInit(){   
        this.setPermission = this.productService.setPermission;
        this.callOnLoad();
        this.showMessage();
        // this.productService.callGetCountry().subscribe(x => {
      
        //   this.countries = x.countryList;
        // console.log(' this.countries', JSON.stringify(this.countries));
        // }); 
      
        
                
    }
     callOnLoad(){
          let params = new URLSearchParams();
          params.append("offset", Constants.offset);
          params.append("limit", Constants.limit);
          this.productService.callGetDetail(params).subscribe(x => {
   
                this.datagrid = x["productList"];
                this.fetchingData = false;
       
          });   
          this.dtOption = this.commonHelperService.settingDataTable();
          this.createForm();
    }

    createForm(){
        this.searchForm = this.formBuilder.group({
          code: [''  ],
          name: [ '' ],
          sending_currency: ['-1' ],
          receiving_currency : [ '-1'],
          sending_country: [ '-1' ],
          receiving_country : [  '-1' ],
          remit_agent :['-1'],
          remit_branch:['-1'],
          paying_agent:['-1' ],
          paying_branch:['-1' ],
          exchange_rate : [''  ]
        });
    }
    private showMessage() {
      this.successMessage = '';
      if (this.route.snapshot.queryParamMap.get('status')) {
        if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
          if(this.productService.approvalRequired){
          //this.successMessage = 'Product Added successfully, sent for approval';
          this.translate.languageText('PRODUCT.productAddedsuccessfullysentforapproval', data=> {
            this.successMessage =data;
            });
          }else{
           // this.successMessage = 'Product Added successfully';
           this.translate.languageText('PRODUCT.productAddedsuccessfully', data=> {
            this.successMessage =data;
            });
          }
         
        } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
          if(this.productService.approvalRequired){
          //this.successMessage = ' Product Updation sent for approval successfully.';
          this.translate.languageText('PRODUCT.productUpdationsentforapprovalsuccessfully', data=> {
            this.successMessage =data;
            });
          }else{
            //this.successMessage = 'Product Updated successfully';
            this.translate.languageText('PRODUCT.productUpdatedsuccessfully', data=> {
              this.successMessage =data;
              });
          }
        }
        setTimeout(() => {
          this.successMessage = undefined;
        }, 10 * 1000);
      }
    }
    viewUser(data: any) {
      const modalRef = this.modalService.open(ViewProductComponent);
      modalRef.componentInstance.data = data;
    }

    editUser(data: any) {
      this.router.navigate(['edit', data], { queryParams: data, skipLocationChange: true, relativeTo: this.route });
    }
    deleteUser(data: any) {
      const index: number = this.datagrid.indexOf(data);
      this.datagrid.splice(index, 1);
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
    searchData(){
      this.fetchingData = true;
      let name =  this.searchForm.get("name").value;console.log('name' + name);
      let sendingCurrency =  this.searchForm.get("sending_currency").value;
      let receivingCurrency =  this.searchForm.get("receiving_currency").value;
      let sendingCountry =  this.searchForm.get("sending_country").value;
      let receivingCountry =  this.searchForm.get("receiving_country").value;
      let remitAgent =  this.searchForm.get("remit_agent").value;
      let payingAgent =  this.searchForm.get("paying_agent").value;
      let remitBranch =  this.searchForm.get("remit_branch").value;
      let payingBranch =  this.searchForm.get("paying_branch").value;
  
      let params = new URLSearchParams();
      if (name != '') {
        params.append("name", name);
      } if (sendingCurrency != '-1') {
        params.append("sendCurrencyCode", sendingCurrency);
      } if (receivingCurrency != '-1') {
        params.append("receiveCurrencyCode", receivingCurrency);
      } if (sendingCountry != '-1') {
        params.append("sendCountryCode", sendingCountry);
      } if (receivingCountry != '-1') {
        params.append("receiveCountryCode", receivingCountry);
      } if (remitAgent != '-1') {
        params.append("remitAgentCode", remitAgent);
      } if (payingAgent != '-1') {
        params.append("payAgentCode", payingAgent);
      }
      if (remitBranch != '-1') {
        params.append("remitBranchCode", remitBranch);
      }
      if (payingBranch != '-1') {
        params.append("payBranchCode", payingBranch);
      }
      
      params.append("offset", Constants.offset);
      params.append("limit", Constants.limit);
      this.productService.callGetDetail(params).subscribe(x => {
        this.datagrid = x["exchangeRateList"];
        this.fetchingData = false;
      });   
    }
}