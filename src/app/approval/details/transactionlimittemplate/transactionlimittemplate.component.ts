import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';

import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewFeeCommisionComponent } from '../template/feecommisiontemplatecategory/service-view/viewservicetemplate.component';
import { ViewTransactionLimitTemplateComponent } from '../template/transactionlimittemplate/service-view/viewservicetemplate.component';
@Component({
  selector: 'app-transactionlimittemplate',
  templateUrl: './transactionlimittemplate.component.html',
  styleUrls: ['./transactionlimittemplate.component.css']
})
export class TransactionLimitTemplateUpdateComponent implements OnInit {
  transactionLimitTemplate


  @Input() approvalData: any;
  data: any;
  updatedInfo: any;
  serviceList: any;
  transactionLimitTemplateEntityList: any;
  statusName: string;
  status: string;
  name: string;
  walletOwnerCategoryName: string;

  dtOption: any;
  unchanged = {

    name: true,

    walletOwnerCategoryName: true,
    status: true,


  };

  constructor(private modalService: NgbModal, private commonHelperService: CommonHelperService, private detailService: DetailsService, private approvalService: ApprovalService) { }

  errorMessage: string;

  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log(' this.updatedInfo', this.updatedInfo);
    console.log(' this.approvalData', this.approvalData.actionType);
    this.getDetail();
  }

  async getDetail() {
  console.log('this.approvalData',this.approvalData)
    this.data = this.approvalData.entity.template;
    if (this.approvalData.entity) {

      this.serviceList = this.approvalData.updatedInformation.transactionLimitTemplate;
      this.transactionLimitTemplateEntityList = this.approvalData.entity.transactionLimitTemplateList;
    }
    this.dtOption = this.commonHelperService.settingDataTable();


  }
  viewForm(template: any) {

    const modalRef = this.modalService.open(ViewTransactionLimitTemplateComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = this.showOldValue(template);
  }
  showOldValue(data: any) {
    let oldvalue: any;
    let oldvalueList: any[] = [];

    oldvalueList = this.transactionLimitTemplateEntityList.filter(ele => {
      return (ele.code == data.code);
    })

    if (oldvalueList) {
      oldvalue = oldvalueList[0];
    } else {
      oldvalue = data;
    }

    console.log('oldvalue', oldvalue);

    return oldvalue;

  }

}
