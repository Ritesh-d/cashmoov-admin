import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../../details.service';
import { ApprovalService } from '../../../approval.service';
import { ApprovalConstants } from '../../../approval.constants';
import { CommonHelperService } from '../../../../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewServiceComponent } from './service-view/viewservicetemplate.component';
@Component({
  selector: 'app-servicetemplatecategory',
  templateUrl: './servicetemplatecategory.component.html',
  styleUrls: ['./servicetemplatecategory.component.css']
})
export class ServiceTemplateCategoryComponent implements OnInit {


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

  constructor(private modalService: NgbModal, private commonHelperService: CommonHelperService, private detailService: DetailsService, private approvalService: ApprovalService) { }

  errorMessage: string;

  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log(' this.updatedInfo', this.updatedInfo);
    console.log(' this.approvalData', this.approvalData.actionType);
    this.getDetail();
  }
  categoryType: string;
  async getDetail() {

    this.data = this.approvalData.entity.template;
    if (this.approvalData.entity) {
      this.categoryType = this.approvalData.entity.template.templateCategoryCode;
      console.log('categoryType', this.categoryType);

      this.serviceList = this.approvalData.entity.serviceTemplateList;


    }
    this.dtOption = this.commonHelperService.settingDataTable();



  }

  viewForm(template: any) {

    const modalRef = this.modalService.open(ViewServiceComponent);
    modalRef.componentInstance.data = template;
    modalRef.componentInstance.oldValue = template;
  }
}
