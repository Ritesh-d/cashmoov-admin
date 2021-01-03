import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../../details.service';
import { ApprovalService } from '../../../approval.service';
import { ApprovalConstants } from '../../../approval.constants';

import { CommonHelperService } from '../../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewTransactionLimitTemplateComponent } from './service-view/viewservicetemplate.component';
@Component({
  selector: 'app-transactionlimittemplatecategory',
  templateUrl: './transactionlimittemplate.component.html',
  styleUrls: ['./transactionlimittemplate.component.css']
})
export class TransactionLimitTemplateComponent implements OnInit {



  @Input() approvalData: any;
  data: any;
  updatedInfo: any;
  serviceList: any;
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
    console.log('fee this.updatedInfo', this.updatedInfo);
    console.log('fee this.approvalData', this.approvalData.actionType);
    this.getDetail();
  }

  async getDetail() {

    this.data = this.approvalData.entity.template;
    if (this.approvalData.entity) {

      this.serviceList = this.approvalData.entity.transactionLimitTemplateList;

    }
    this.dtOption = this.commonHelperService.settingDataTable();



  }
  viewForm(template: any) {

    const modalRef = this.modalService.open(ViewTransactionLimitTemplateComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = template;

  }

}
