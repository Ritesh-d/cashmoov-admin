import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../user/user.service';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: any;
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
    serviceCategoryName : true,
    productTypeName: true,
    operatorName : true,
    value: true,
    description: true,
    minValue: true,
    maxValue: true,
    status: true,
  };
  constructor(private detailService: DetailsService, private approvalService: ApprovalService) { }

  errorMessage: string;

  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log(' approvalData.updatedInfo ', this.updatedInfo);
    console.log(' approvalData.actionType ', this.approvalData.actionType);
  
    this.product = this.approvalData.entity;
    console.log("approvalData.entity ", this.product);
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

      if (this.updatedInfo.name && this.product.name != this.updatedInfo.name) {
        this.unchanged.name = false;
      }
      if (this.updatedInfo.productTypeName && this.product.productTypeName != this.updatedInfo.productTypeName) {
        this.unchanged.productTypeName = false;
      }
      if (this.updatedInfo.serviceCategoryName && this.product.serviceCategoryName != this.updatedInfo.serviceCategoryName) {
        this.unchanged.serviceCategoryName = false;
      }
      if (this.updatedInfo.operatorName && this.product.operatorName != this.updatedInfo.operatorName) {
        this.unchanged.operatorName = false;
      }
      if (this.updatedInfo.value && this.product.value != this.updatedInfo.value) {
        this.unchanged.value = false;
      }
      if (this.updatedInfo.minValue && this.product.minValue != this.updatedInfo.minValue) {
        this.unchanged.minValue = false;
      }
      if (this.updatedInfo.maxValue && this.product.maxValue != this.updatedInfo.maxValue) {
        this.unchanged.maxValue = false;
      }
      if (this.updatedInfo.description && this.product.description != this.updatedInfo.description) {
        this.unchanged.description = false;
      }
 
    }

  }

}
