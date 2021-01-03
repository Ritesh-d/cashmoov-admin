import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';
import { ExchangerateService } from '../../../exchangerate/ExchangerateService.service';
import { Constants } from '../../../exchangerate/exchangerate.constant';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewServiceComponent } from '../template/servicetemplatecategory/service-view/viewservicetemplate.component';
@Component({
  selector: 'app-servicetemplate',
  templateUrl: './servicetemplate.component.html',
  styleUrls: ['./servicetemplate.component.css']
})
export class ServiceTemplateComponent implements OnInit {


  @Input() entityCode: string;
  @Input() approvalData: any;
  data: any;
  updatedInfo: any;
  statusName: string;
  status: string;
  name: string;
  walletOwnerCategoryName: string;
  serviceList: any;
  dtOption: any;
  unchanged = {

    name: true,

    walletOwnerCategoryName: true,
    status: true,


  };

  constructor(private modalService: NgbModal, private commonHelperService: CommonHelperService, private detailService: DetailsService, private approvalService: ApprovalService, private exchangerateService: ExchangerateService,) { }

  errorMessage: string;

  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log(' this.updatedInfo', this.updatedInfo);
    console.log(' this.approvalData', this.approvalData.actionType);
    this.getDetail();
  }
  serviceEntityeList: any;
  async getDetail() {

    this.data = this.approvalData.entity.template;
    this.serviceList = this.approvalData.updatedInformation.serviceTemplateList;
    this.serviceEntityeList = this.approvalData.entity.serviceTemplateList;
    this.dtOption = this.commonHelperService.settingDataTable();



  }


  viewForm(template: any) {

    const modalRef = this.modalService.open(ViewServiceComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = this.showOldValue(template);
  }


  showOldValue(data: any) {
    let oldvalue: any;
    let oldvalueList: any[] = [];

    oldvalueList = this.serviceEntityeList.filter(ele => {
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
