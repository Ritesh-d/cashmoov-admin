import { Component, OnInit, Input } from '@angular/core';
import { RoleGroupService } from '../../../rolegroup/rolegroup.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  @Input()
  approvalData: any;
  role: any;
  showOldValue: boolean;
  updatedInfo: any;
  oldname :string ;
  oldstatus :string;
  earlierRole: any;
  errorMessage: string;
  featuresList: any[];
  isPermission = false;
  unchanged = {
    name: true,
    status: true,
    code: true
  };

  constructor(private roleService: RoleGroupService,
    private approvalService: ApprovalService) { }

  ngOnInit() {
    this.getRole();

    if(this.approvalData.actionType == ApprovalConstants.status.text.APPROVED){
      this.unchanged.name=true;
      this.unchanged.status=true;
    }
  }

  getRole() {
    // this.roleService.getPermissionByRoleCode(this.approvalData.entityCode).subscribe(roleData => {
      // let roleData = this.approvalData.entity;
      // this.earlierRole = { ...roleData.role };
      // this.role = roleData.role;
      this.oldname = this.approvalData.entity.name;
      this.oldstatus = this.approvalData.entity.status;
     
      this.role = this.approvalData.entity;
      this.isPermission = this.approvalData.featureName === ApprovalConstants.featureName.PERMISSION;
      if(this.isPermission){
        //commented for  get feature list from role api 
      // this.featuresList = roleData.role.featuresList ? roleData.role.featuresList : [];
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
      this.role.name = this.updatedInfo.name;
      this.unchanged.name = false;
    }
    if (this.updatedInfo.status) {
      //this.role.status = this.updatedInfo.status;
      this.role.status =this.approvalService.getValueOnCode(this.updatedInfo.status);
      this.unchanged.status = false;
    }
  }

}
