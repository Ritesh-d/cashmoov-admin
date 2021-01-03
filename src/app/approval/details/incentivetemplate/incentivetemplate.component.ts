import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';

import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewIncentiveComponent } from '../template/incentivetemplatecategory/service-view/viewservicetemplate.component';
import { ViewDistributionTemplateComponent } from '../template/incentivetemplatecategory/distribution-view/viewdistribution.component';
@Component({
  selector: 'app-incentivetemplate',
  templateUrl: './incentivetemplate.component.html',
  styleUrls: ['./incentivetemplate.component.css']
})
export class IncentiveTempComponent implements OnInit {

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
  incentiveEntityeList: any;
  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log(' this.updatedInfo', this.updatedInfo);
    console.log(' this.approvalData', this.approvalData.actionType);
    this.getDetail();
  }

  async getDetail() {

    this.data = this.approvalData.entity.template;
    if (this.approvalData.entity) {

      this.serviceList = this.approvalData.updatedInformation.incentiveTemplateList;
      this.incentiveEntityeList = this.approvalData.entity.incentiveTemplateList;

    }
    this.dtOption = this.commonHelperService.settingDataTable();



  }

  viewForm(template: any) {

    console.log("TEMPLATE : " + JSON.stringify(template));

    const modalRef = this.modalService.open(ViewIncentiveComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = this.showOldValue(template);

  }
  showOldValue(data: any) {
    let oldvalue: any;
    let oldvalueList: any[] = [];

    oldvalueList = this.incentiveEntityeList.filter(ele => {
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
  viewdistributionForm(template: any) {

    const modalRef = this.modalService.open(ViewDistributionTemplateComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = template;
    
  }
}
