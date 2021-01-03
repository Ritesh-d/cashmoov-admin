import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';

import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewFeeComponent } from '../template/feetemplatecategory/service-view/viewservicetemplate.component';
@Component({
  selector: 'app-feetemplate',
  templateUrl: './feetemplate.component.html',
  styleUrls: ['./feetemplate.component.css']
})
export class FeeTempComponent implements OnInit {



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
  feeEntityeList: any;
  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log(' this.updatedInfo', this.updatedInfo);
    console.log(' this.approvalData', this.approvalData.actionType);
    this.getDetail();
  }

  async getDetail() {
console.log('entity info' , this.approvalData.entity);
    this.data = this.approvalData.entity.template;
    if (this.approvalData.entity) {

      this.serviceList = this.approvalData.updatedInformation.feeTemplateList;
      this.feeEntityeList = this.approvalData.entity.feeTemplateList;

    }
    this.dtOption = this.commonHelperService.settingDataTable();



  }

  viewForm(template: any) {

    const modalRef = this.modalService.open(ViewFeeComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = this.showOldValue(template);

  }
  showOldValue(data: any) {
    let oldvalue: any;
    let oldvalueList: any[] = [];

    oldvalueList = this.feeEntityeList.filter(ele => {
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
