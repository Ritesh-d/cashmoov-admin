import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ReportService } from '../report.service';
import { CreateReportRequestModel } from '../report-request.model';
import { Endpoints } from '../../shared/endpoints';
import { ReportType } from '../report-type';
import { Constants } from '../report.constant';
import { all } from '../../../../node_modules/@types/q';


@Component({
	selector: 'app-view-data',
	templateUrl: './view-data.component.html',
	styleUrls: ['./view-data.component.css']
})

export class ViewDataReportComponent implements OnInit {
	createreportRequestModel = new CreateReportRequestModel();
	successMessage: string = "";
	searchForm: FormGroup;
	fetchingData: boolean = true;
	dtOption: any = {};
	reportArr: any = [];
	columns: any = [];
	datagrid: any;
	createForm: FormGroup;
	submitted: boolean = false;
	errorMessage: string = "";
	showMessages: boolean = false;
	isShow: boolean = false;
	data: any;
	reportByName:any;
	

	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private commonHelperService: CommonHelperService,
		private reportservice: ReportService,
		private router: Router,
		private endpoints: Endpoints,
	) {

	}

	ngOnInit() {
		let params = new URLSearchParams();
		params.append("offset", Constants.offset);
		params.append("limit", Constants.limit);
		this.datagrid = this.reportArr["reportArr"];
		this.fetchingData = false;
		
		if (this.reportservice.data == undefined || this.reportservice.data == null) {
			console.log("DATA IS NULL In VIEW REPORT");
			this.errorMessage = "There is some error, Please try after some time.";

		} else {
			this.reportArr = this.reportservice.data.reportArray;

			if (this.reportservice.data.glbSetup != null && this.reportservice.data.glbSetup != undefined
				&& this.reportservice.data.glbSetup.columnLblHash != null && this.reportservice.data.glbSetup.columnLblHash != undefined) {

				let allColumns = [];
				allColumns = this.reportservice.data.glbSetup.columnLblHash;
				this.reportByName=this.reportservice.data.reportName;
				for (let i = 0; i < allColumns.length; i++) {
					if (this.reportservice.lang != undefined && this.reportservice.lang != null && this.reportservice.lang == "FR") {
						this.columns.push({ data: allColumns[i].data, title: allColumns[i].titleFR });
					} else {
						this.columns.push({ data: allColumns[i].data, title: allColumns[i].title });
					}
				}

				console.log(" Column " + JSON.stringify(this.columns));
				console.log(" Data " + JSON.stringify(this.reportArr));
				console.log('>>>>>>>>>>>',this.reportByName);
				
				
				
				this.dtOption = this.commonHelperService.getDataTableOptions(this.reportArr, this.columns,this.reportByName);
				//console.log('this.DTOPTIONSSSSSSSS',this.dtOption)
				this.isShow = true;
			}
		}
	}
}
