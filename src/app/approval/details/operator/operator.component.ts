import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../user/user.service';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';
@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit {

  operator: any;
  users: any;
  groups: any;
  roles: any;
  groupName: string;
  statusName: string;
  roleName: string;
  @Input() entityCode: string;
  @Input() approvalData: any;
  updatedInfo: any;
  unchanged = {

    name: true,
  
    status: true,
    serviceProviderName:true,
  };
  constructor(private detailService: DetailsService, private approvalService: ApprovalService) { }

  errorMessage: string;

  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log(' approvalData.updatedInfo ', this.updatedInfo);
    console.log(' approvalData.actionType ', this.approvalData.actionType);
  
    this.operator = this.approvalData.entity;
    console.log("approvalData.entity ", this.operator);
    this.getdetail();

  }

  async getdetail() {

    if (this.approvalData.actionType == ApprovalConstants.status.text.UPDATED || this.approvalData.actionType == ApprovalConstants.status.text.CLAIMED) {
      this.compareChanges();
    }

  }
  compareChanges() {
    if (this.updatedInfo) {
      if (this.updatedInfo.status) {
        this.statusName = this.approvalService.getValueOnCode(this.updatedInfo.status);
      }

      if (this.updatedInfo.name && this.operator.name != this.updatedInfo.name) {
        this.unchanged.name = false;
      }
      
      if (this.updatedInfo.serviceProviderName && this.operator.serviceProviderName != this.updatedInfo.serviceProviderName) {
        this.unchanged.serviceProviderName = false;
      }
      
      
 
    }

  }

}
