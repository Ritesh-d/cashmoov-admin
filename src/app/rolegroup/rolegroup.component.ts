import { Component, OnInit, EventEmitter, Output, Input, ViewChild, Inject } from '@angular/core';
import { RoleGroupService } from './rolegroup.service';
import { RoleGroupModel } from './rolegroup.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RoleGroupModule } from './rolegroup.module';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { API_URLs } from '../shared/models/constants';
// import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/typings/scroll/scroll-strategy';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewRoleGroup } from './viewrolegroup/viewrolegroup.component';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ApprovalService } from '../approval/approval.service';
import { ApprovalConstants } from '../approval/approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';
import {TranslatelanguageService} from '../shared/services/translatelanguage.service';

@Component({
  selector: 'app-rolegroup',
  templateUrl: './rolegroup.component.html',
  styleUrls: ['./rolegroup.component.css']
})
export class RoleGroup implements OnInit {
  users: any[];
  roles: any[];
  dtOptions: any = {};
  searchRoleForm: FormGroup;
  filterOptions: any[];
  successMessage: string;
  fetchingData = true;
  model: NgbDateStruct;
  currentdate: string;
  date: { year: number, month: number };
  approvalEnabled = true;
  setPermission:any;
  constructor(private roleGroupService: RoleGroupService,
    private apiurls: API_URLs,
    private calendar: NgbCalendar,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private commonHelperService: CommonHelperService,
    private router: Router,
    private translate: TranslatelanguageService,
    private modalService: NgbModal,
    private approvalService: ApprovalService) {
  }

  ngOnInit() {
   this.setPermission = this.roleGroupService.setPermission;
    console.log('approvalRequired' + this.roleGroupService.approvalRequired ,  this.setPermission);
    this.currentdate = formatDate(new Date(), "dd/MM/yyyy", "en");
    this.getRoles();
    this.showMessage();
    // this.createForm();
  }

  async getRoles() {
    this.roles = await this.roleGroupService.getRolesDetail();
    if (this.roles.length > 0) {
      this.fetchingData = false;
    }
    this.dtOptions = this.commonHelperService.settingDataTable();
    this.dtOptions  = {... this.dtOptions , order:[[4, 'desc']] };
  }
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
        //this.successMessage = 'Role Added successfully, sent for approval.';
        this.translate.languageText('ROLE.roleAddedsuccessfullysentforapproval', data=> {
          this.successMessage =data;
          });
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        //this.successMessage = 'Role Updation sent for approval successfully.';
        this.translate.languageText('ROLE.roleUpdationsentforapprovalsuccessfully', data=> {
          this.successMessage =data;
          });
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
    }
  }
  createForm() {
    this.searchRoleForm = this.formBuilder.group({
      name: ['-1'],
      permission: [''],
      namesearch: [''],
    });

    this.filterOptions = this.roles;

    this.searchRoleForm.get("namesearch").valueChanges.subscribe(x => {
      if (this.searchRoleForm.get("namesearch").value == "") {
        this.filterOptions = this.roles;
      } else {
        this.filterOptions = this.roles.filter(x =>
          x.name.includes(this.searchRoleForm.get("namesearch").value)
        );
      }

    });
  }

  searchUsers(val: string) {
    var Name = this.searchRoleForm.get(val).value; console.log('role' + Name);
    this.users = this.roles;
    if ('-1' != Name) {
      //  this.users = this.users.filter(data => data.role === role);
      this.users = this.users.filter(x =>
        x.name.includes(Name)
      );
    }

  }
  viewRoleGroup(code: string) {
    this.modalService.open(ViewRoleGroup).componentInstance.roleCode = code;
  }

  editRoleGroup(roleCode: string) {
    this.router.navigate(['edit', roleCode], { relativeTo: this.route });
  }

  addPermissionRoleGroup(roleCode: string) {
    this.router.navigate(['permission', roleCode], { relativeTo: this.route });
  }

  showActionButton(role: any) {
    if(this.approvalEnabled) {
      if(role.state === ApprovalConstants.status.text.APPROVED) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}