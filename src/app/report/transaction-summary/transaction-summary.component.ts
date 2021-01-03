import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ReportService } from '../report.service';
import { Endpoints } from '../../shared/endpoints';
import { ReportType } from '../report-type';
import { Constants } from '../report.constant';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';

@Component({
	selector: 'app-transaction-summary',
	templateUrl: './transaction-summary.component.html',
	styleUrls: ['./transaction-summary.component.css']
})

export class TransactionSummaryReportComponent implements OnInit {
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
			setupName: ["report_cashmov_transaction_summary"],
			fromDate : [, [Validators.required]],
			toDate : [, [Validators.required]],
			walletOwnerCode:[, [Validators.required]],
			transType:[, [Validators.required]],
			trxLimit:["10000"]
		});
	}

	get f() {
		return this.createForm.controls;
	}

	// private formatDatePicker(date: any) {
	// 	return formatDate(date.day+'/'+ date.month+'/'+ date.year, "dd/MM/yyyy", "en") ;
	
	//   }

	onSubmit() {
		console.log("submitted::" + this.createForm.invalid);
		this.submitted = true;

		this.errorMessage = "";
		if (this.createForm.invalid) {
			return;
		} else {
			//this.createReportForm();
			// let dateTo = this.reportservice.formatDatePicker(this.createForm.value.toDate)
			// let dateFrom = this.reportservice.formatDatePicker(this.createForm.value.fromDate)
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
					ReportType.TRANSACTIONSUMMARYREPORT,
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
