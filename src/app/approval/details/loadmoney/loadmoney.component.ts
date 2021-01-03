import { Component, Input, OnInit } from '@angular/core';
import { LoadMoneyService } from '../../../loadmoney/loadmoneyservice.service';
import { ApprovalConstants } from '../../approval.constants';
import { ApprovalService } from '../../approval.service';
import { DetailsService } from '../details.service';

@Component({
  selector: 'app-loadmoney',
  templateUrl: './loadmoney.component.html',
  styleUrls: ['./loadmoney.component.css']
})
export class LoadMoneyComponent implements OnInit {
	@Input() approvalData: any;
	@Input() entityCode: string;
	updatedInfo: any;
	statusName: string;
	walletOperation: any;
	errorMessage: string;
	unchanged = {
		walletOwnerCode: true,
		currencyCode: true,
		amount: true,
		channelTypeCode: true,
		status: true,
		bankReferenceNo : true,
		comments: true
	};

	constructor(
		private loadMoneyService: LoadMoneyService,
		private approvalService: ApprovalService,
		private detailService: DetailsService
	) {}

	ngOnInit() {
		this.updatedInfo = this.approvalData.updatedInformation;
		console.log(" this.updatedInfo", this.updatedInfo);
		console.log(" this.approvalData", this.approvalData.actionType);
		this.walletOperation = this.approvalData.entity;
		console.log("Entity----", this.walletOperation);
		this.getLoad();
	}

	async getLoad() {
		this.walletOperation = this.approvalData.entity;
		if (this.approvalData.actionType == ApprovalConstants.status.text.UPDATED || this.approvalData.actionType == ApprovalConstants.status.text.CLAIMED) {
			this.compareChanges();
		}
	}

	compareChanges() {
		if (this.updatedInfo) {
			if (this.updatedInfo.status) {
				this.statusName = this.approvalService.getValueOnCode(this.updatedInfo.status	);
			}

			if (this.updatedInfo.status && this.walletOperation.status != this.updatedInfo.status) {
				this.unchanged.status = false;
			}

			if (this.updatedInfo.walletOwnerCode && this.walletOperation.walletOwnerCode != this.updatedInfo.walletOwnerCode) {
				this.unchanged.walletOwnerCode = false;
			}
			if (this.updatedInfo.currencyCode && this.walletOperation.currencyCode != this.updatedInfo.currencyCode) {
				this.unchanged.currencyCode = false;
			}

			if (this.updatedInfo.amount && this.walletOperation.amount != this.updatedInfo.amount	) {
				this.unchanged.amount = false;
			}
			if (this.updatedInfo.channelTypeCode && this.walletOperation.channelTypeCode != this.updatedInfo.channelTypeCode) {
				this.unchanged.channelTypeCode = false;
			}
			if (this.updatedInfo.bankReferenceNo && this.walletOperation.bankReferenceNo != this.updatedInfo.bankReferenceNo) {
				this.unchanged.bankReferenceNo = false;
			}
			if (this.updatedInfo.comments && this.walletOperation.comments != this.updatedInfo.comments) {
				this.unchanged.comments = false;
			}
			if (this.updatedInfo.status && this.walletOperation.status != this.updatedInfo.status) {
				this.unchanged.status = false;
			}
		}
	}
}












  

