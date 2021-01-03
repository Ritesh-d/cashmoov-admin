import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../../details.service';
import { ApprovalService } from '../../../approval.service';
import { ApprovalConstants } from '../../../approval.constants';

import { CommonHelperService } from '../../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewFeeCommisionComponent } from './service-view/viewservicetemplate.component';
@Component({
  selector: 'app-feecommisiontemplatecategory',
  templateUrl: './feecommisiontemplatecategory.component.html',
  styleUrls: ['./feecommisiontemplatecategory.component.css']
})
export class FeeCommisionTemplateComponent implements OnInit {



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

      this.serviceList = this.approvalData.entity.feeCommissionTemplateList;

    }
    this.dtOption = this.commonHelperService.settingDataTable();



  }
  viewForm(template: any) {

    const modalRef = this.modalService.open(ViewFeeCommisionComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = template;

  }

}
