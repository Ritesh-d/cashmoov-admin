import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../../details.service';
import { ApprovalService } from '../../../approval.service';
import { ApprovalConstants } from '../../../approval.constants';

import { CommonHelperService } from '../../../../shared/services/common-helper-service';
// import { ViewFeeComponent } from './service-view/viewservicetemplate.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewIncentiveComponent } from './service-view/viewservicetemplate.component';
import { ViewDistributionTemplateComponent } from './distribution-view/viewdistribution.component';
@Component({
  selector: 'app-incentivetemplatecategory',
  templateUrl: './incentivetemplatecategory.component.html',
  styleUrls: ['./incentivetemplatecategory.component.css']
})
export class IncentiveTemplateComponent implements OnInit {



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
    console.log('incentive this.updatedInfo', this.updatedInfo);
    console.log('incentive this.approvalData', this.approvalData.actionType);
    this.getDetail();
  }

  async getDetail() {

    this.data = this.approvalData.entity.template;
    if (this.approvalData.entity) {

      this.serviceList = this.approvalData.entity.incentiveTemplateList;

    }
    this.dtOption = this.commonHelperService.settingDataTable();



  }
  viewForm(template: any) {

    const modalRef = this.modalService.open(ViewIncentiveComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = template;

  }
  viewdistributionForm(template: any) {

    const modalRef = this.modalService.open(ViewDistributionTemplateComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = template;
    
  }

}
