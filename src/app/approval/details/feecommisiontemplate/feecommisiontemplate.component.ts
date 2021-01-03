import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';

import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewFeeCommisionComponent } from '../template/feecommisiontemplatecategory/service-view/viewservicetemplate.component';
@Component({
  selector: 'app-feecommisiontemplate',
  templateUrl: './feecommisiontemplate.component.html',
  styleUrls: ['./feecommisiontemplate.component.css']
})
export class FeeCommisionComponent implements OnInit {



  @Input() approvalData: any;
  data: any;
  updatedInfo: any;
  serviceList: any;
  feeCommissionEntityList: any;
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

    this.data = this.approvalData.entity.template;
    if (this.approvalData.entity) {

      this.serviceList = this.approvalData.updatedInformation.feeCommissionTemplateList;
      this.feeCommissionEntityList = this.approvalData.entity.feeCommissionTemplateList;
    }
    this.dtOption = this.commonHelperService.settingDataTable();


  }
  viewForm(template: any) {

    const modalRef = this.modalService.open(ViewFeeCommisionComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = this.showOldValue(template);
  }
  showOldValue(data: any) {
    let oldvalue: any;
    let oldvalueList: any[] = [];

    oldvalueList = this.feeCommissionEntityList.filter(ele => {
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
