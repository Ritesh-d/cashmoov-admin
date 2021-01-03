import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadMoneyService } from '../loadmoneyservice.service';
import { LoadMoneyModel } from '../loadmoney.model';
import { ApprovalConstants } from '../../approval/approval.constants';
import { CreateLoadMoneyRequestModel } from '../load-money-request.model';
@Component({
  selector: 'app-createloadmoney',
  templateUrl: './createloadmoney.component.html',
  styleUrls: ['./createloadmoney.component.css']
})

export class CreateLoadMoneyComponent implements OnInit {
  
  createLoadMoneyRequestModel :CreateLoadMoneyRequestModel;
  errorMessage: string = '';
  displaytable: boolean = true;
  fetchingData: boolean = false;
  dtOption: any = {};
  countries: any;
  control_account: string = ''; currency: string = ''; account: string = '';
  channel :string ='';
  amount: number;
  createForm: FormGroup;
  loadMoneyModel: LoadMoneyModel = new LoadMoneyModel();
  editMode = false;
  code: string = "";
  status: string;
  submitted: boolean = false;
  exchRateData: any;
  currencies :any ;
  walletOwners :any ;
  category: any[];
  categories:any[];
 

  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loadMoneyService: LoadMoneyService,
    private router: Router) {

  }
  ngOnInit() {


    this.editMode = this.loadMoneyService.prepareUserAction();
    console.log("------editMode-----",this.editMode);
    this.route.queryParams.subscribe((params: Params) => {
    console.log('params', params);
      if (params && this.editMode) {
        this.control_account = this.control_account;
        this.account = this.account;
        this.currency = this.currency;
        this.amount = this.amount;
        this.channel =this.channel;
        this.status = this.status == "Active" ? "Y" : "N";
      }
      this.createLoadMoneyForm();
    });
    
    this.loadMoneyService.callGetWalletOwnerCategory().subscribe(x => {
      this.categories = x["categoryList"];
      if(this.categories)
      this.categories = this.categories.filter(s => s.code =="100006" || s.code =="100007" || s.code =="100008");
    });  

  }

  getWalletAccount(event: any): any[] {
    this.loadMoneyService.callGetWalletOwner(event.target.value).subscribe(x => {
    this.walletOwners = x["walletOwnerList"];
    });
    return this.walletOwners
  }

  getWalletOwnerCurrency(event: any): any[] {
    this.loadMoneyService.callGetCurrency(event.target.value).subscribe(x => {
    this.currencies = x["walletOwnerCountryCurrencyList"];
    });
    return this.currencies
  }

  onCancel() {
    const firstPath = window.location.pathname.split('/')[1];
    this.router.navigate(['/loadmoney'], { relativeTo: this.route });
  }
   



    /*
    async onSubmit(){
      console.log("submitted#####"+this.createForm.invalid);
      this.submitted=true;
    
      this.errorMessage = "";
      if (this.createForm.invalid) {
        return;
      }

      var controlAccount = this.createForm.value.control_account;
      var account = this.createForm.value.account;
      var currency = this.createForm.value.currency;
      var amount = this.createForm.value.amount;
      var channel= this.createForm.value.channel;
    
      this.createLoadMoneyRequestModel = {controlAccount, account, currency, amount,channel}

      console.log('Request :: save ::'+JSON.stringify(this.createLoadMoneyRequestModel));

      if(!this.editMode) {
        let data = await this.loadMoneyService.createLoadMoney(this.createLoadMoneyRequestModel);
        console.log('data::',data);
        if(data == null){
          this.errorMessage = "There is some error, Please try after some time.";
        }
        else if (data["resultCode"] == "0") {
          this.loadMoneyService.makeEntryToApproval(data.exchangeRate).subscribe(approvalData => {
            console.log('approvalData', approvalData);
            if (approvalData === null) {
              this.errorMessage = "There is some error, Please try after some time.";
            } else {
              if (approvalData["resultCode"] == "0") {
                this.errorMessage = undefined;
                this.router.navigate(['/loadmoney'], { relativeTo: this.route, queryParams: { status: 'added' } });
              } else {
                this.errorMessage = approvalData["resultDescription"];
              }
            }
          });
        } else {
          this.errorMessage = data["resultDescription"];
        }
  
      } else {
        const updatedInfo = this.loadMoneyService.preparedUpdatedDataForApproval(this.exchRateData, this.createForm.value);
        console.log('updatedInfo', updatedInfo);
        let data = await this.loadMoneyService.modifyLoadMoney(this.prepareDataForUpdateStatus(this.exchRateData), this.code);
        console.log('res ', data);
        if (data == null) {
          this.errorMessage = "There is some error, Please try after some time.";
        }
        else if (data["resultCode"] == "0") {
          this.loadMoneyService.makeEntryToApproval(this.exchRateData, updatedInfo).subscribe(approvalData => {
            console.log('--approvalData--', approvalData);
            if (approvalData === null) {
              this.errorMessage = "There is some error, Please try after some time.";
            } else {
              if (approvalData.resultCode === '0') {
                this.errorMessage = undefined;
                this.router.navigate(['/loadmoney'], { relativeTo: this.route, queryParams: { status: 'updated' } });
              } else {
                this.errorMessage = approvalData.resultDescription;
              }
            }
          });
  
        } else {
          this.errorMessage = data["resultDescription"];
        }
  
      }
    

    }
     */

     
  // async onSubmit() {
  //   this.submitted = true;
  //   console.log("sumbmitted++" + this.createForm.value);
  //   this.errorMessage = "";
  //   // if (this.createForm.invalid) {
  //   //   return;
  //   // }

  //   return;
  //   console.log('request :: save ::' + JSON.stringify(this.loadMoneyModel));

  //   if (!this.editMode) {

  //     let data = await this.loadMoneyService.createExchangeRate(this.loadMoneyModel);
  //     console.log('res ', data);
  //     if (data == null) {
  //       this.errorMessage = "There is some error, Please try after some time.";
  //     }
    //   else if (data["resultCode"] == "0") {
    //     this.loadMoneyService.makeEntryToApproval(data.exchangeRate).subscribe(approvalData => {
    //       console.log('approvalData', approvalData)
    //       if (approvalData === null) {
    //         this.errorMessage = "There is some error, Please try after some time.";
    //       } else {
    //         if (approvalData["resultCode"] == "0") {
    //           this.errorMessage = undefined;
    //           this.router.navigate(['/loadmoney'], { relativeTo: this.route, queryParams: { status: 'added' } });
    //         } else {
    //           this.errorMessage = approvalData["resultDescription"];
    //         }
    //       }
    //     });
    //   } else {
    //     this.errorMessage = data["resultDescription"];
    //   }

    // } else {

    //   const updatedInfo = this.loadMoneyService.preparedUpdatedDataForApproval(this.exchRateData, this.loadMoneyModel);
    //   console.log('updatedInfo', updatedInfo);

    //   let data = await this.loadMoneyService.modifyExchangeRate(this.prepareDataForUpdateStatus(this.exchRateData), this.code);
    //   console.log('res ', data);
    //   if (data == null) {
    //     this.errorMessage = "There is some error, Please try after some time.";
    //   }
    //   else if (data["resultCode"] == "0") {
    //     this.loadMoneyService.makeEntryToApproval(this.exchRateData, updatedInfo).subscribe(approvalData => {
    //       console.log('--approvalData--', approvalData);
    //       if (approvalData === null) {
    //         this.errorMessage = "There is some error, Please try after some time.";
    //       } else {
    //         if (approvalData.resultCode === '0') {

    //           this.errorMessage = undefined;
    //           this.router.navigate(['/loadmoney'], { relativeTo: this.route, queryParams: { status: 'updated' } });
    //         } else {
    //           this.errorMessage = approvalData.resultDescription;
    //         }
    //       }
    //     });

    //   } else {
    //     this.errorMessage = data["resultDescription"];
    //   }

    // }
  
  // }

  get f() {
    return this.createForm.controls;
  }

  referenceNumber: string='';
  comment: string='';
  createLoadMoneyForm() {
    this.createForm = this.formBuilder.group({
      control_account: [this.control_account, [Validators.required]],
      account: [this.account, [Validators.required]],
      currency: [this.currency, [Validators.required]],
      amount: [this.amount],
      comment: [this.comment],
      referenceNumber: [this.referenceNumber],
      channel:[this.channel],
      status: [this.status]
    }
    );
  }



  prepareDataForUpdateStatus(data) {
    return {
      ...data,
      status: ApprovalConstants.status.code.INACTIVE,
      state: ApprovalConstants.status.code.UPDATED
    }

  }


}