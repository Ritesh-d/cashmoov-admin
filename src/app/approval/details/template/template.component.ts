import { Component, OnInit, Input } from '@angular/core';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';
import { ExchangerateService } from '../../../exchangerate/ExchangerateService.service';
import { Constants } from '../../../exchangerate/exchangerate.constant';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {


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

  constructor(private commonHelperService: CommonHelperService, private detailService: DetailsService, private approvalService: ApprovalService, private exchangerateService: ExchangerateService,) { }

  errorMessage: string;

  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);

    this.getDetail();
  }
  categoryType: string;
  async getDetail() {

    this.data = this.approvalData.entity.template;
    console.log('entity' + JSON.stringify( this.approvalData));

    if (this.approvalData.entity) {
      this.categoryType = this.approvalData.entity.template.templateCategoryCode;
      console.log('categoryType', this.categoryType);

    }



  }

}
