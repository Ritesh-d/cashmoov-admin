import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../user/user.service';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  serviceCategory: any;
  multiCountry: FormGroup;
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
    productAllowed: true,
    status: true,

  };
  constructor(private formBuilder: FormBuilder, private detailService: DetailsService, private approvalService: ApprovalService) { }

  errorMessage: string;
  serviceCountryList: any;
  settings: any = {
    singleSelection: false,
    idField: 'code',
    textField: 'name',
    limitSelection: -1,
    clearSearchFilter: true,
    noDataAvailablePlaceholderText: '',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: true,
    defaultOpen: false
  };
  ngOnInit() {


    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log(' approvalData.updatedInfo ', this.updatedInfo);
    console.log(' approvalData.actionType ', this.approvalData.actionType);

    this.serviceCategory = this.approvalData.entity;
    console.log("approvalData.entity ", this.serviceCategory);
    if (this.serviceCategory.serviceCountryList) {
      this.serviceCountryList = this.serviceCategory.serviceCountryList;

    }
    this.multiCountry = this.formBuilder.group({
      country: new FormControl(this.serviceCategory.serviceCountryList)
    });



    this.getdetail();

  }
  get f1() {
    return this.multiCountry.controls;
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

      if (this.updatedInfo.name && this.serviceCategory.name != this.updatedInfo.name) {
        this.unchanged.name = false;
      }
      console.log('this.serviceCategory.productAllowed != this.updatedInfo.productAllowed' + this.serviceCategory.productAllowed != this.updatedInfo.productAllowed);
      if (this.serviceCategory.productAllowed != this.updatedInfo.productAllowed) {
        this.unchanged.productAllowed = false;
      }
      console.log('this.unchanged.productAllowed' + this.unchanged.productAllowed);

    }

  }

}
