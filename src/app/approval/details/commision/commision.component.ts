import { Component, OnInit, Input } from '@angular/core';
  
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';

@Component({
  selector: 'app-commision',  
  templateUrl: './commision.component.html',
  styleUrls: ['./commision.component.css']
})
export class commisionComponent implements OnInit {

  @Input()  
  approvalData: any;
  commision: any;
  showOldValue: boolean;
  updatedInfo: any;
  oldname :string ;
  oldstatus :string;
  earliercommision: any;
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
    this.getcommision();
console.log();
    if(this.approvalData.actionType == ApprovalConstants.status.text.APPROVED){
      this.unchanged.name=true;
      this.unchanged.status=true;
    }
  }
commisionlist;
  getcommision() {
    // this.commisionService.getPermissionBycommisionCode(this.approvalData.entityCode).subscribe(commisionData => {
      // let commisionData = this.approvalData.entity;
      // this.earliercommision = { ...commisionData.commision };
      // this.commision = commisionData.commision;
      this.oldname = this.approvalData.entity.name;
      this.oldstatus = this.approvalData.entity.status;
     
      this.commision = this.approvalData;
      this.commisionlist=this.commision.entity.commisionList;
      this.isPermission = this.approvalData.featureName === ApprovalConstants.featureName.PERMISSION;
      if(this.isPermission){
        //commented for  get feature list from commision api 
      // this.featuresList = commisionData.commision.featuresList ? commisionData.commision.featuresList : [];
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
      this.commision.name = this.updatedInfo.name;
      this.unchanged.name = false;
    }
    if (this.updatedInfo.status) {
      this.commision.status = this.approvalService.getValueOnCode(this.updatedInfo.status);
      this.unchanged.status = false;
    }
  }

}
