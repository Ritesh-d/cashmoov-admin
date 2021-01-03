import { Component, OnInit, PipeTransform, Pipe, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ViewLoadMoneyComponent } from '../vieweloadmoney-model/viewloadmoney.component';
import { LoadMoneyService } from '../loadmoneyservice.service';
import { Constants } from '../loadmoney.constant';
import { DataTableDirective } from 'angular-datatables';
import { ApprovalConstants } from '../../approval/approval.constants';
import { CreateLoadMoneyRequestModel } from '../load-money-request.model';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-searchloadmoney',
  templateUrl: './searchloadmoney.component.html',
  styleUrls: ['./searchloadmoney.component.css']
})

export class LoadMoneyComponent implements OnInit {
	createLoadMoneyRequestModel: CreateLoadMoneyRequestModel;
	successMessage: string = "";
	searchForm: FormGroup;
	fetchingData: boolean = true;
	dtOption: any = {};
	datagrid: any;
	countries: any;
	currencies: any;
	walletOwners: any;
	users: any;
	categories: any[];
	category: any[];
	approvalEnabled = true;
	createForm: FormGroup;
	submitted: boolean = false;
	errorMessage: string = "";
	 
	editMode = false;
	showMessages: boolean = false;
	setPermission : any;
	getcurrentLang:any;
	info : string;
	constructor(
		private modalService: NgbModal,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private commonHelperService: CommonHelperService,
		private loadMoneyService: LoadMoneyService,
		private translate : TranslatelanguageService,
		private router: Router
	) {
		this.getcurrentLang=this.translate.getcurrentLang();
	}

	ngOnInit() {

		  if(this.getcurrentLang==="en"){
			this.fileName="Choose File";
		   }
		   if(this.getcurrentLang==="fr"){
			this.fileName="Choisissez Fichier";
		   }

		this.setPermission =  this.loadMoneyService.setPermission;
		this.showMessage();
		this.callOnLoad();

		this.loadMoneyService.callGetWalletOwnerCategory().subscribe(x => {
			this.categories = x["categoryList"];
			if (this.categories)
				// this.categories = this.categories.filter(s => s.code == "100006" || s.code == "100008");
				this.categories =  this.categories.filter(m=>{
					return m.emoneyAllowed
				})
		});
		this.createLoadMoneyForm();
		this.info = this.loadMoneyService.getNote;
	}
	
	getWalletAccount(event: any): any[] {
		this.loadMoneyService.callGetWalletOwner(event.target.value).subscribe(x => {
			this.walletOwners = x["walletOwnerList"];
		});
		return this.walletOwners;
	}

	getWalletOwnerCurrency(event: any): any[] {
		this.loadMoneyService.callGetCurrency(event.target.value).subscribe(x => {
			this.currencies = x["walletOwnerCountryCurrencyList"];
		});
		return this.currencies;
	}
	bankReferenceNo : string='';
	comments : string=''
	createLoadMoneyForm() {
		this.createForm = this.formBuilder.group({
			walletOwnerCategoryCode: ['', [Validators.required]],
			walletOwnerCode: ['', [Validators.required]],
			currencyCode: ['', [Validators.required]],
			// amount: [, [Validators.required,Validators.pattern('^[0-9]*$')]],
			amount: [, [Validators.required ]],
			channelTypeCode: ["100000"],
			comments : [this.comments ],
			bankReferenceNo : [this.bankReferenceNo ],
			documentType: [''],
			receiptFile: [''],
 
			status: []
		});
	}

	get f() {
		return this.createForm.controls;
	}
	fileName : string= "Choose File";
	fileToUpload : File;
	fileErr: string ;
	onFileSelected(fileInput: any, index: number) {
		this.fileErr = undefined;
		console.log('fileInput' , fileInput);
		// this.filesNInfo[index].fileSelected = true;
		// this.filesNInfo[index].file = fileInput.target.files[0];
		this.fileName = fileInput.target.files[0].name;
		this.fileToUpload = fileInput.target.files[0];

		const validFile = this.loadMoneyService.validFile(fileInput.target.files[0]);
		if(! validFile.valid){
		  this.fileErr = validFile.message;
		  
		};
	  }

	async onSubmit() {
		console.log("submitted::" + this.createForm.invalid);
		this.submitted = true;

		this.errorMessage = "";
		if (this.createForm.invalid) {
			return;
		}
		// var walletOwnerCategoryCode = this.createForm.value.walletOwnerCategoryCode;		
		var walletOwnerCode = this.createForm.value.walletOwnerCode;
		var currencyCode = this.createForm.value.currencyCode;
		var amount = this.createForm.value.amount;
		var channelTypeCode = this.createForm.value.channelTypeCode;
		var bankReferenceNo = this.createForm.value.bankReferenceNo;
		var comments = this.createForm.value.comments;
		// var status = this.createForm.value.status;
 

		this.createLoadMoneyRequestModel = {
		
			walletOwnerCode,
			currencyCode,
			amount,
			channelTypeCode,
			bankReferenceNo,
			comments,
		    //status

		};

		if(!this.loadMoneyService.approvalRequired){ 
			console.log('approvalRequiredapprovalRequiredapprovalRequired'); 
			this.createLoadMoneyRequestModel.status = ApprovalConstants.status.code.APPROVED ;
		 }


		console.log("Request :: save ::" + JSON.stringify(this.createLoadMoneyRequestModel));

		if (!this.editMode) {
			let data = await this.loadMoneyService.createLoadMoney(this.createLoadMoneyRequestModel);
			console.log("data::", data);
			if (data == null) {
				//this.errorMessage = "There is some error, Please try after some time.";
				this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
					this.errorMessage=data;
				  });
			} else if (data["resultCode"] == "0") {
				// let request : any  ={
				// 	transactionCode : data.walletOperation.code,
				// 	file: this.createForm.value.receiptFile //this.fileToUpload
				// };
				// console.log("request:fiel uplaod:", request);
				if(this.fileToUpload != null && this.fileToUpload ){
				this.loadMoneyService.uploadReceipt(this.fileToUpload,data.walletOperation.code).subscribe(response => {
					console.log("response Sfrom file uplaod", response);
					if (response["resultCode"] == "0") {
						console.log('file uploaded successflluy ');
					}
				});
				}
				if(this.loadMoneyService.approvalRequired){
				this.loadMoneyService.makeEntryToApproval(ApprovalConstants.featureCode.EMONEYCREATION,data.walletOperation).subscribe(approvalData => {
				console.log("approvalData", approvalData);
				if (approvalData === null) {
				//this.errorMessage = "There is some error, Please try after some time.";
				this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
					this.errorMessage=data;
				  });
				} else {
				if (approvalData["resultCode"] == "0") {
				this.errorMessage = undefined;
				//this.successMessage ="E-Money Created successfully, sent for approval";
				
				this.translate.languageText('EMONEY.e-MoneyCreatedsuccessfullysentforapproval', data=> {

					this.successMessage=data;
				});
  

				this.createForm.reset();
				this.fetchingData= true;
				this.callOnLoad();
				// this.successMessage = approvalData["resultDescription"];
                // this.router.navigate(["./"], {relativeTo: this.route,	queryParams: { status: "added" }});
                // this.showMessages=true;
                // if(this.showMessages){
				//   console.log("-----",this.showMessage)
				//   this.showMessage();
                //    }
                
				} else {
					this.errorMessage = approvalData["resultDescription"];
				}
            }
            
					});
				}else{
					this.errorMessage = undefined;
					//this.successMessage ="E-Money Creation Added successfully";
					this.translate.languageText('EMONEY.e-MoneyCreationAddedsuccessfully', data=> {
						this.successMessage=data;
					  });
					  
					this.fetchingData= true;
					this.callOnLoad();

				}
		
				}
       
      else {
				this.errorMessage = data["resultDescription"];
      }
      
		}
		setTimeout(() => {
			this.successMessage = undefined;
			this.errorMessage = undefined;
		}, 10 * 1000);
		
	}

	callOnLoad() {
		this.submitted = false;
		// let params = new URLSearchParams();
		// params.append("offset", Constants.offset);
		// params.append("limit", Constants.limit);
		this.loadMoneyService.callGetDetail().subscribe(x => {
			this.datagrid = x["walletOperationList"];
			this.fetchingData = false;
		});
		this.dtOption = this.commonHelperService.settingDataTable();
	}
   
	private showMessage() {
		if (this.route.snapshot.queryParamMap.get("status")) {
			if (this.route.snapshot.queryParamMap.get("status").toString() === "added") {
				//this.successMessage ="E-Money Creation Added successfully, sent for approval";
				this.translate.languageText('EMONEY.e-MoneyCreatedsuccessfullysentforapproval', data=> {
					this.successMessage=data;
				});
			} else if (this.route.snapshot.queryParamMap.get("status").toString() === "updated") {
				//this.successMessage = "E-Money   Updation sent for approval successfully.";
				this.translate.languageText('EMONEY.e-MoneyUpdationsentforapprovalsuccessfully', data=> {
					this.successMessage=data;
				  });
			}
			setTimeout(() => {
				this.successMessage = undefined;
			}, 10 * 1000);
			
		}
	}

	viewUser(data: any) {
		const modalRef = this.modalService.open(ViewLoadMoneyComponent);
		modalRef.componentInstance.data = data;
	}

	editUser(data: any) {
		this.router.navigate(["edit", data], {
			queryParams: data,
			skipLocationChange: true,
			relativeTo: this.route
		});
	}

	deleteUser(data: any) {
		const index: number = this.datagrid.indexOf(data);
		this.datagrid.splice(index, 1);
	}

	onCancel() {
		const firstPath = window.location.pathname.split("/")[1];
		this.router.navigate(["../dashboard"], { relativeTo: this.route });
	}
}