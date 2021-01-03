import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Endpoints } from '../../shared/endpoints';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ReportType } from '../report-type';
import { ReportService } from '../report.service';


 @Component({
    selector: 'app-agent-balance',
    templateUrl: './agent-balance.component.html',
    styleUrls: ['./agent-balance.component.css']
  })

 export class AgentBalanceReportComponent implements OnInit {
    successMessage: string = "";
	reportArr: any = [];
	createForm: FormGroup;
	submitted: boolean = false;
    errorMessage: string = "";
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

        this.reportservice.getWalletOwner().subscribe(x => {
			this.walletOwners = x["walletOwnerList"];
		});
	
	 }
	 
	
     createReportForm() {
		this.createForm = this.formBuilder.group({
			reportType: ["Simple"],
			viewFormat: ["HTML"],
			setupName: ["report_cashmoov_agentbalancereport"],
			code:["all"],
			distributor:["all"],
			//profileType:[],
			status:["all"],
			currency:["USD"],
			activityDate:["all"],
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
			this.createReportForm();
			this.reportservice
				.fetchReport(
					this.createForm.value,
					this.endpoints.E_WALLET_SIMPLE_REPORT_URL,
					ReportType.AGENTBALANCEREPORT,
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

	
     
 }