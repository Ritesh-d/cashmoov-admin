
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Endpoints } from '../../shared/endpoints';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ReportType } from '../report-type';
import { ReportService } from '../report.service';


 @Component({
    selector: 'app-hierarchy-transaction',
    templateUrl: './hierarchy-transaction.component.html',
    styleUrls: ['./hierarchy-transaction.component.css']
  })

 export class HierarchyTransactionReportComponent implements OnInit {
    successMessage: string = "";
	createForm: FormGroup;
	submitted: boolean = false;
	errorMessage: string = "";
	todate : any;
	fromdate: any;
	trans_type: any;
	walletOwners: any;
    
    constructor(
		private formBuilder: FormBuilder,
		private commonHelperService: CommonHelperService,
		private reportservice: ReportService,
		private router: Router,
		private endpoints: Endpoints, 
        ) {}
        
     ngOnInit() {
		this.createReportForm();
		
		this.reportservice.getTransType().subscribe(x => {
			this.trans_type = x["transactionTypeList"];
		});
	
		this.reportservice.getWalletOwner().subscribe(x => {
			this.walletOwners = x["walletOwnerList"];
		});
	
	 }
	 
	
     createReportForm() {
		this.createForm = this.formBuilder.group({
			reportType: ["Simple"],
			viewFormat: ["HTML"],
			setupName: ["report_cashmov_hierarchy_transaction"],
			fromDate : [],
            toDate : [],
            walletOwnerCode:[],
            transType:["all"],
            status: ["", [Validators.required]],
			trxLimit:["1000"]
		});
	}

	get f() {
		return this.createForm.controls;
    }
    
    onSubmit() {
		console.log("submitted::" + this.createForm.invalid);
		this.submitted = true;

		this.errorMessage = "";
		if (this.createForm.invalid) {
			return;
		} else {
			let dateTo = this.convertDate(this.createForm.value.toDate)
			let dateFrom = this.convertDate(this.createForm.value.fromDate)
			console.log("dateTo",dateTo)
			console.log("dateTo1",dateFrom)
			this.createForm.controls["toDate"].setValue(dateTo);
            this.createForm.controls["fromDate"].setValue(dateFrom);
			console.log("controlFrom",+JSON.stringify(this.createForm.controls["fromDate"].setValue(dateFrom)))
			this.reportservice
				.fetchReport(
					this.createForm.value,
					this.endpoints.E_WALLET_SIMPLE_REPORT_URL,
					ReportType.HIERARCHYTRANSACTION,
					ReportType.DEFAULTFORMAT,
					ReportType.SIMPLE
				)
				.subscribe(data => {
					if (data == null) {
						this.errorMessage = "There is some error, Please try after some time.";
					} else {
						this.errorMessage = data["resultDescription"];
					}

					if (data != undefined && data != null && data.reportArray != undefined && data.reportArray != null) {
						this.reportservice.data = data;
						this.router.navigate(["/report/view-data"]);
					}
				});

		}
	}

	
   
	public convertDate(dateObj: { year: number; month: number; day: number }) {
		let dateformat= this.appendZeroIfNeeded(dateObj.day) + '/'
		  + this.appendZeroIfNeeded(dateObj.month) + '/' + dateObj.year.toString();
		return  dateformat;
	  }

	  private appendZeroIfNeeded(monthDate: number) {
		let monthDateStr: string = monthDate.toString();
		if (monthDate < 10) {
		  monthDateStr = '0' + monthDate.toString();
		}
		return monthDateStr.toString();
	  }
	
     
 }