import { Component, OnInit, Input } from '@angular/core';
  
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';

@Component({
  selector: 'app-transTemplate',  
  templateUrl: './transtemplate.component.html',
  styleUrls: ['./transtemplate.component.css']
})
export class transTemplateComponent implements OnInit {

  @Input()  
  approvalData: any;
  transTemp: any;
  showOldValue: boolean;
  updatedInfo: any;
  oldname :string ;
  oldstatus :string;
  earliertransTemp: any;
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
    this.gettransTemp();
console.log();
    if(this.approvalData.actionType == ApprovalConstants.status.text.APPROVED){
      this.unchanged.name=true;
      this.unchanged.status=true;
    }
  }
transtemplatelist;
  gettransTemp() {
    // this.transTempService.getPermissionBytransTempCode(this.approvalData.entityCode).subscribe(transTempData => {
      // let transTempData = this.approvalData.entity;
      // this.earliertransTemp = { ...transTempData.transTemp };
      // this.transTemp = transTempData.transTemp;
      this.oldname = this.approvalData.entity.name;
      this.oldstatus = this.approvalData.entity.status;
     
      this.transTemp = this.approvalData;
      this.transtemplatelist=this.transTemp.entity.transTemplateList;
      this.isPermission = this.approvalData.featureName === ApprovalConstants.featureName.PERMISSION;
      if(this.isPermission){
        //commented for  get feature list from transTemp api 
      // this.featuresList = transTempData.transTemp.featuresList ? transTempData.transTemp.featuresList : [];
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
      this.transTemp.name = this.updatedInfo.name;
      this.unchanged.name = false;
    }
    if (this.updatedInfo.status) {
      this.transTemp.status = this.approvalService.getValueOnCode(this.updatedInfo.status);
      this.unchanged.status = false;
    }
  }

}
