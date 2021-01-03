import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { RoleGroupService } from '../rolegroup.service';
import { API_URLs } from '../../shared/models/constants';
import { Endpoints } from '../../shared/endpoints';
import { ApprovalService } from '../../approval/approval.service';
import { ApprovalConstants } from '../../approval/approval.constants';
import { DetailsService } from '../../approval/details/details.service';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-createrolegroup',
  templateUrl: './createrolegroup.component.html',
  styleUrls: ['./createrolegroup.component.css']
})
export class CreateRoleGroup implements OnInit {

  createRoleForm: FormGroup;
  editMode = false;
  paramList: any;
  errorMessage: string;
  successMessage: string;
  unChangedRole: any;
  dataLoaded = true;
  approvalEnabled = true;
  submitted: Boolean = false;
 
  constructor(private roleService: RoleGroupService,
    private approvalService: ApprovalService,
    private apiurls: API_URLs,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslatelanguageService,
    private detailsService: DetailsService,
    private commonHelperService: CommonHelperService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    let name = '';
    let code = '';
    let status = '';
    this.editMode = this.commonHelperService.isEditMode;
    this.route.params.subscribe((params: Params) => {
      this.dataLoaded = this.editMode ? false : true;
      if (params.id) {
        this.roleService.getRoleByCode(params.id).subscribe(roleData => {
          this.dataLoaded = true;
          if (roleData.resultCode === '0') {
            console.log('roleData',roleData);
            this.unChangedRole = roleData.role;
            name = roleData.role.name;
            code = roleData.role.code;
            status = roleData.role.status;
            // status = roleData.role.status;
            status = this.approvalService.getDataApprovalStatus(roleData.role.status);

            this.createRoleForm = new FormGroup({
              name: new FormControl(name, [Validators.required,Validators.minLength(5),Validators.pattern(/^[a-zA-Z-àâçéèêëîïôûùüÿñæœ\/\'.,]+(\s{0,1}[a-zA-Z-àâçéèêëîïôûùüÿñæœ\/\', ])*$/),]),
              code: new FormControl(code, [Validators.required]),
              status: new FormControl(status, [Validators.required])
            });
          } else {
            this.errorMessage = roleData.resultDescription;
          }
        });
      } else {
        this.createRoleForm = new FormGroup({
          name: new FormControl(name, [Validators.required,Validators.minLength(5),Validators.pattern(/^[a-zA-Z-àâçéèêëîïôûùüÿñæœ\/\'.,]+(\s{0,1}[a-zA-Z-àâçéèêëîïôûùüÿñæœ\/\', ])*$/)]),
          // code: new FormControl(code, [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$')]),
          code: new FormControl(code, [Validators.required,Validators.pattern('^[0-9]*[1-9][0-9]*$'),Validators.minLength(5)]),
         
          status: new FormControl(status)
        });
      }

    });
  }

  onCancel() {
    this.editMode
      ? this.router.navigate(['../../'], { relativeTo: this.route })
      : this.router.navigate(['../'], { relativeTo: this.route });
  }

    onSubmit() {
    console.log('--onSubmit--', this.createRoleForm.value);
    this.submitted = true;


      this.errorMessage = "";
    if (this.createRoleForm.invalid) {
      return;
    }
   

     

    
    if (this.approvalEnabled) {
      this.approvalRequired();
    } else {
      if (this.editMode) {
        this.roleService.updateRole(this.prepareupdateRoleRequest(this.createRoleForm.value)).subscribe(data => {
          if (data === null) {
            //this.errorMessage = "There is some error, Please try after some time.";
            this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
              this.errorMessage =data;
              });
          } else {
            if (data.resultCode === '0') {
              this.errorMessage = undefined;
              this.router.navigate(['../../'], { relativeTo: this.route, queryParams: { status: 'updated' } });
            } else {
              this.errorMessage = data.resultDescription;
            }
          }
        });
      } else {
          this.roleService.createRole(this.prepareCreateRoleRequest(this.createRoleForm.value)).subscribe(data => {
          if (data === null) {
            //this.errorMessage = "There is some error, Please try after some time.";
            this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
              this.errorMessage =data;
              });
          } else {
            if (data.resultCode === '0') {
              this.errorMessage = undefined;
              this.router.navigate(['../'], { relativeTo: this.route, queryParams: { status: 'added' } });
            } else {
              this.errorMessage = data.resultDescription;
            }
          }
        },
        error => console.log('oops', error));
      }
    }

  }

  private prepareCreateRoleRequest(formData: any) {
    if (this.approvalEnabled) {
      return {
        name: formData.name,
        code: formData.code
      }
    } else {
      return {
        name: formData.name,
        code: formData.code,
        status: ApprovalConstants.status.code.ACTIVE
      }
    }
  }

  private prepareupdateRoleRequest(formData: any) {
    return {
      name: formData.name,
      code: formData.code,
      status: formData.status
    };
  }

  private approvalRequired() {
    if (this.editMode) {
      const updatedInfo = this.roleService.preparedUpdatedDataForApproval(this.unChangedRole, this.createRoleForm.value);
      if (updatedInfo && (updatedInfo.name || updatedInfo.status)) {
        this.errorMessage = undefined;
        const actionApprovalData = {
          featureName: ApprovalConstants.featureName.ROLE,
          entityCode: this.unChangedRole.code,
          entityName: this.unChangedRole.name
        };
        this.detailsService.actionOnApprovalOption(actionApprovalData, ApprovalConstants.status.text.UPDATED)
          .subscribe(roleResponse => {
            if (roleResponse.resultCode === '0') {
              this.approvalService.makeEntryToApproval(ApprovalConstants.featureCode.ROLE, this.unChangedRole, updatedInfo).subscribe(approvalData => {
                console.log('--approvalData--', approvalData);
                if (approvalData === null) {
                  //this.errorMessage = "There is some error, Please try after some time.";
                  this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
                    this.errorMessage =data;
                    });
                } else {
                  if (approvalData.resultCode === '0') {
                    this.errorMessage = undefined;
                    this.router.navigate(['../../'], { relativeTo: this.route, queryParams: { status: 'updated' } });
                  } else {
                    this.errorMessage = approvalData.resultDescription;
                  }
                }
              });
            } else {
              this.errorMessage = roleResponse.resultDescription;
            }
          });
      } else {
        //this.errorMessage = 'No field Changed';
        this.translate.languageText('MASTER.nofieldChanged', data=> {
          this.errorMessage =data;
          });
      }

    } else {
      this.roleService.createRole(this.prepareCreateRoleRequest(this.createRoleForm.value)).subscribe(data => {
        if (data == null) {
         // this.errorMessage = "There is some error, Please try after some time.";
         this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
          this.errorMessage =data;
          });
        } else if (data.resultCode === '0') {
          this.approvalService.makeEntryToApproval(ApprovalConstants.featureCode.ROLE, data.role).subscribe(approvalData => {
            if (approvalData === null) {
              //this.errorMessage = "There is some error, Please try after some time.";
              this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
                this.errorMessage =data;
                });
            } else {
              if (approvalData.resultCode === '0') {
                this.errorMessage = undefined;
                this.router.navigate(['../'], { relativeTo: this.route, queryParams: { status: 'added' } });
              } else {
                this.errorMessage = data.resultDescription;
              }
            }
          });
        } else {
          this.errorMessage = data.resultDescription;
        }
      });
    }
  }

  get f() {
    return this.createRoleForm.controls;
 }

}
