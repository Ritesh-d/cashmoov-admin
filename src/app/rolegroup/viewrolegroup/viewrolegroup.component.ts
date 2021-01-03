import { Component, OnInit, Input } from '@angular/core';
import { RoleGroupService } from '../rolegroup.service';
import { RoleGroupModel } from '../rolegroup.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalService } from '../../approval/approval.service';

@Component({
  selector: 'app-viewrolegroup',
  templateUrl: './viewrolegroup.component.html',
  styleUrls: ['./viewrolegroup.component.css']
})
export class ViewRoleGroup implements OnInit {

  @Input()
  roleCode: string;
  role: any;
  featuresList: any[];
  errorMessage: string;

  constructor(private roleGroupService: RoleGroupService,
    public activeModal: NgbActiveModal,
    private approvalService: ApprovalService) {
    this.ngOnInit();
  }

  ngOnInit() {
    if (this.roleCode) {
      this.roleGroupService.getPermissionByRoleCode(this.roleCode).subscribe(data => {
        if (data.resultCode === '0') {
          this.role = data.role;
          this.featuresList = data.role.featuresList ? data.role.featuresList : [];
          console.log('featuresList' , this.featuresList)
        } else {
          this.errorMessage = data.resultDescription;
        }
      });
    }
  }
}
