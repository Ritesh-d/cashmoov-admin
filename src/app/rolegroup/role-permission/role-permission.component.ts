import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RoleGroupService } from '../rolegroup.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RoleGroupModel } from '../rolegroup.model';
import { PermissionService } from './permission.service';
import { ApprovalService } from '../../approval/approval.service';
import { ApprovalConstants } from '../../approval/approval.constants';
import { DetailsService } from '../../approval/details/details.service';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.css']
})
export class RolePermissionComponent implements OnInit {

  rolePermissionForm: FormGroup;
  roleGroupModel: RoleGroupModel;
  errorMessage: string;
  fetchingData = true;
  roleName: string;
  roleCode: string;
  features: any[];
  selectedFeatures: any[];
  previousPermission: any[];
  constructor(private roleService: RoleGroupService,
    private route: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService,
    private translate: TranslatelanguageService,
    private approvalService: ApprovalService,
    private detailsService: DetailsService) { }

   ngOnInit() {
   
     this.initializeForm();
    
  }

  /**
   * method is to get permission / features of role
   */
  private getPermission() {
    this.roleService.getPermissionByRoleCode(this.roleCode).subscribe(data => {
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.previousPermission = data.role.featuresList;
        if (this.previousPermission) {
          this.assignedFeatures();
        }
      } else {
        this.errorMessage = data.resultDescription;
      }
    });
  }

   initializeForm() {
     
    this.route.params.subscribe((params: Params) => {
  
      if (params.id) {
        this.roleService.getRoleByCode(params.id).subscribe(data => {
           
          if (data.resultCode === '0') {
            this.errorMessage = undefined;
            this.roleName = data.role.name;
            this.roleCode = data.role.code;
            
            this.previousPermission = data.role.featuresList;
            // if (this.previousPermission) {
            //   this.assignedFeatures();
            // }

            this.permissionService.features.subscribe(response => {
               
              this.features = response.featureList.map(feature => {
                return {
                  ...feature,
                  checked: false,
                  viewChecked: false,
                  addChecked: false,
                  addDisabled: false,
                  editChecked: false,
                  editDisable: false,
                  deleteChecked: false,
                  deleteDisable: false,
                  approveChecked: false,
                  // TODO: hard coded approval required; Transaction
                  approvalRequired: feature.code === '100004'
                };
              });
              this.features.sort((a,b)=>a.name.localeCompare(b.name));

              this.fetchingData = false;
              // this.getPermission();
            
              if (this.previousPermission) {
                this.assignedFeatures();
              }
            });

          } else {
            this.errorMessage = data.resultDescription;
          }
        });

      }
      this.rolePermissionForm = new FormGroup({});
    });
  }

  selectAllFeatures() {
    this.allToggle();
  }

  onCancel() {
    this.router.navigate(['../../'], { relativeTo: this.route })
  }

  onSubmit() {
    this.selectedFeatures = [];
    this.features.filter(_ => _.checked).forEach(elm => {
      this.selectedFeatures.push(elm);
    });

    if (this.previousPermission) {

      console.log('--selectedFeatures--', this.permissionService.preparePermissionRequest(this.roleCode, this.selectedFeatures));

      this.permissionService.updatePermission(this.roleCode, this.selectedFeatures).subscribe(data => {
        if (data == null) {
          //this.errorMessage = 'There is some error, Please try after some time.';
          this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
            this.errorMessage =data;
            });
        } else if (data.resultCode === '0') {
          this.router.navigate(['../../'], { relativeTo: this.route, queryParams: { status: 'updated' } });
        } else {
          this.errorMessage = data.resultDescription;
        }
      });

      const actionApprovalData = {
        featureName: ApprovalConstants.featureName.PERMISSION,
        entityCode: this.roleCode,
        entityName: this.roleName
      };
      // this.detailsService.actionOnApprovalOption(actionApprovalData, ApprovalConstants.status.text.UPDATED)
      //   .subscribe(roleResponse => {
          // if (roleResponse.resultCode === '0') {
        this.permissionService.updatePermission(this.roleCode, this.selectedFeatures).subscribe(data => {
          if (data == null) {
            this.errorMessage = 'There is some error, Please try after some time.';
          } else if (data.resultCode === '0') {
            const permissionInfo = { code: this.roleCode, name: this.roleName };
            this.approvalService.makeEntryToApproval(ApprovalConstants.featureCode.PERMISSION, permissionInfo,
              this.permissionService.preparePermissionRequest(this.roleCode, this.selectedFeatures))
              .subscribe(approvalData => {
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
            this.errorMessage = data.resultDescription;
          }
        });

    } else {
      this.permissionService.createPermission(this.roleCode, this.selectedFeatures).subscribe(data => {
        if (data == null) {
          //this.errorMessage = 'There is some error, Please try after some time.';
          this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
            this.errorMessage =data;
            });
        } else if (data.resultCode === '0') {
          this.approvalService.makeEntryToApproval(ApprovalConstants.featureCode.PERMISSION, data.role)
            .subscribe(approvalData => {
              if (approvalData === null) {
                //this.errorMessage = "There is some error, Please try after some time.";
                this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
                  this.errorMessage =data;
                  });
              } else {
                if (approvalData.resultCode === '0') {
                  this.permissionService.makeRoleStatusUpdated(data.role)
                    .subscribe(response => {
                      if (response.resultCode === '0') {
                        this.errorMessage = undefined;
                        this.router.navigate(['../../'], { relativeTo: this.route, queryParams: { status: 'updated' } });
                      } else {
                        this.errorMessage = data.resultDescription;
                      }
                    });
                  // this.errorMessage = undefined;
                  // this.router.navigate(['../../'], { relativeTo: this.route, queryParams: { status: 'added' } });
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

  featureSelected(index: number) {
    if (!this.features[index].checked && !this.features[index].approveChecked) {
      this.features[index].viewChecked = true;
      this.features[index].addChecked = true;
      this.features[index].editChecked = true;
      this.features[index].deleteChecked = true;
     

    } else {
      this.features[index].viewChecked = false;
      this.features[index].addChecked = false;
      this.features[index].editChecked = false;
      this.features[index].deleteChecked = false;
      this.features[index].approveChecked = false;
    }
    this.features[index].addDisabled = false;
    this.features[index].editDisable = false;
    this.features[index].deleteDisable = false;
  }

  approveFeature(index: number) {

    console.log('--approvalRequired--', this.features[index].approvalRequired);

    if (!this.features[index].approveChecked) {
      // if approve is selected, make add/edit/delete uncheck
      this.features[index].addChecked = false;
      this.features[index].editChecked = false;
      this.features[index].deleteChecked = false;
      // disable add/edit/delete
      // this.features[index].addDisabled = true;
      // this.features[index].editDisable = true;
      // this.features[index].deleteDisable = true;

      // make view checked; on select approval
      this.features[index].viewChecked = true;
    } else {
      // enable add/edit/delete
      this.features[index].addDisabled = false;
      this.features[index].editDisable = false;
      this.features[index].deleteDisable = false;

      // make all checked(default behaviour) on deselect approval
      this.features[index].addChecked = true;
      this.features[index].editChecked = true;
      this.features[index].deleteChecked = true;
      this.features[index].viewChecked = true;
    }
  }

  allToggle() {
    if (this.features.every(val => val.checked == true)) {
      // make all the field unchecked
      for (let i = 0; i < this.features.length; i++) {
        this.features[i].checked = false;
        this.features[i].viewChecked = false;
        this.features[i].addChecked = false;
        this.features[i].editChecked = false;
        this.features[i].deleteChecked = false;
        this.features[i].approveChecked = false;

        this.features[i].addDisabled = false;
        this.features[i].editDisable = false;
        this.features[i].deleteDisable = false;
      }
    } else {
      // make all the field checked
      for (let i = 0; i < this.features.length; i++) {
        this.features[i].checked = true;
        this.features[i].viewChecked = true;
        this.features[i].addChecked = true;
        this.features[i].editChecked = true;
        this.features[i].deleteChecked = true;

        this.features[i].addDisabled = false;
        this.features[i].editDisable = false;
        this.features[i].deleteDisable = false;

        //make approval uncheck/deselect
        this.features[i].approveChecked = false;

      }
    }
  }

  makeFeatureChecked(index: number) {
    if (!this.features[index].checked) {
      this.features[index].checked = true;
    }
  }

  /**
   * method is to render previously assigned permissions
   */
  assignedFeatures() {
    for (let index = 0; index < this.features.length; index++) {
      this.previousPermission.forEach(assigned => {
        if (assigned.featuresCode === this.features[index].code) {
          this.features[index].checked = true;
          this.features[index].approveChecked = assigned.approve;
          this.features[index].addChecked = assigned.create;
          this.features[index].deleteChecked = assigned.delete;
          this.features[index].editChecked = assigned.edit;
          this.features[index].viewChecked = assigned.view;
        }
      })
    };
  }
}
