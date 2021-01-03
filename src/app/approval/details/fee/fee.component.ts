import { Component, OnInit, Input } from '@angular/core';
  
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';

@Component({
  selector: 'app-fee',  
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.css']
})
export class feeComponent implements OnInit {

  @Input()  
  approvalData: any;
  fee: any;
  showOldValue: boolean;
  updatedInfo: any;
  oldname :string ;
  oldstatus :string;
  earlierfee: any;
  errorMessage: string;
  featuresList: any[];
  isPermission = false;
  unchanged = {
    name: true,
    status: true,
    code: true
  };

  constructor(
    private approvalService: ApprovalService) { }

  ngOnInit() {
    this.getfee();
console.log();
    if(this.approvalData.actionType == ApprovalConstants.status.text.APPROVED){
      this.unchanged.name=true;
      this.unchanged.status=true;
    }
  }
feelist;
  getfee() {
    // this.feeService.getPermissionByfeeCode(this.approvalData.entityCode).subscribe(feeData => {
      // let feeData = this.approvalData.entity;
      // this.earlierfee = { ...feeData.fee };
      // this.fee = feeData.fee;
      this.oldname = this.approvalData.entity.name;
      this.oldstatus = this.approvalData.entity.status;
     
      this.fee = this.approvalData;
      this.feelist=this.fee.entity.feeList;
      this.isPermission = this.approvalData.featureName === ApprovalConstants.featureName.PERMISSION;
      if(this.isPermission){
        //commented for  get feature list from fee api 
      // this.featuresList = feeData.fee.featuresList ? feeData.fee.featuresList : [];
      this.featuresList = this.approvalData.entity.featuresList;
      }
      console.log('this.approvalData.updatedInformation' ,this.approvalData.updatedInformation);
      if (this.isPermission && this.approvalData.updatedInformation != '{}'&& this.approvalData.updatedInformation
        && (this.approvalData.actionType === ApprovalConstants.status.text.UPDATED
          || this.approvalData.actionType === ApprovalConstants.status.text.CLAIMED)) {
          // this.featuresList = JSON.parse(this.approvalData.updatedInformation).featuresList;
         this.featuresList = this.approvalData.updatedInformation.featuresList;

      }
      if (!this.isPermission && this.approvalData.actionType !== ApprovalConstants.status.text.CREATED) {
        if(this.approvalData.updatedInformation != undefined && this.approvalData.updatedInformation != {})
        this.showUpdatedInfo();
      }
    // });
  }

  showUpdatedInfo() {
    console.log('updatedInformation' , this.approvalData.updatedInformation);
    this.updatedInfo =  this.approvalData.updatedInformation;
    if (this.updatedInfo.name) {
      this.fee.name = this.updatedInfo.name;
      this.unchanged.name = false;
    }
    if (this.updatedInfo.status) {
      this.fee.status = this.approvalService.getValueOnCode(this.updatedInfo.status);
      this.unchanged.status = false;
    }
  }

}
