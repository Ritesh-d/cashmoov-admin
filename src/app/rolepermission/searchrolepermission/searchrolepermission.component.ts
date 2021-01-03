
import { Component, OnInit, EventEmitter, Output, Input, ViewChild, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';

import { RolePermissionService } from '../rolepermission.service';
import { RolePermissionModel } from '../rolepermission.model';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RolePermissionModule } from '../rolepermission.module';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import { values } from 'lodash';
import { API_URLs } from '../../shared/models/constants';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-searchrolepermission',
  templateUrl: './searchrolepermission.component.html',
  styleUrls: ['./searchrolepermission.component.css']
})
export class SearchRolePermission implements OnInit {

  showList: boolean = false;
  editMode = false;
  paramList: any;
  searchSystemUserModel: RolePermissionModel;

  id: number;
  createdOn: Date;
  template: String;
  featureCode: String;
  view: Boolean;
  edit: Boolean;
  create: Boolean;
  approve: Boolean;
  delete: Boolean;
  status = '';
  searchRolePermissionForm: FormGroup;
  users: any;
  systemusers: any;
  filterOptions: any;
  // dtOptions: any = {};
  dtOptions: any = {};
  // dtTrigger: Subject<any> = new Subject();
  // @ViewChild(DataTableDirective, {static: false})
  // dtElement: DataTableDirective;  
  permissionList = [];
  displaytable: Boolean = false;
  successMessage: string = "";
  fetchingData = true;
  constructor(private rolePermissionService: RolePermissionService, 
    private apiurls: API_URLs, private formBuilder: FormBuilder, 
    private translate: TranslatelanguageService,
    private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute) { }


  ngOnInit() {
    this.showMessage();
    this.createForm();
    // this.rolePermissionService.getPermissionDetail.subscribe(response => {

    //   this.displaytable = true;
    //   this.permissionList = response.permissionList;
    //   console.log('--this.permissionList--', this.permissionList);
    //   this.dtOption = {
    //     pagingType: 'full_member',
    //     pageLength: 5,
    //     processing: true
    //   };
    // });

  }




  // ngAfterViewInit(): void {
  //   this.dtTrigger.next();

  // }

  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

  //     dtInstance.destroy();

  //     this.dtTrigger.next();
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.dtTrigger.unsubscribe();
  // }

  navigateToSytemUserCreation() {

    this.router.navigate(['../../'], { relativeTo: this.route });

  }
  async createForm() {
    this.searchRolePermissionForm = this.formBuilder.group({

      role: ['-1'],
      permission: [''],
      rolesearch: [''],


    });

    this.systemusers = await this.rolePermissionService.getPermissionDetail(this.apiurls.URL_SEARCH_PERMISSION);
    this.users = this.systemusers;
    this.fetchingData = false;
    this.filterOptions = this.systemusers;
    this.displaytable = true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.searchRolePermissionForm.get("rolesearch").valueChanges.subscribe(x => {
      this.filterOptions = this.systemusers.filter(x =>
        x.roleName.includes(this.searchRolePermissionForm.get("rolesearch").value)
      );
      //  this.searchUsers('rolesearch');

    });

  }


  onSearch() {
    this.showList = true;

  }
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
        //this.successMessage = 'Permission Added successfully.';
        this.translate.languageText('ROLE.permissionAddedsuccessfully', data=> {
          this.successMessage =data;
          });
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        //this.successMessage = 'Permission Updated successfully.';
        this.translate.languageText('ROLE.permissionUpdatedsuccessfully', data=> {
          this.successMessage =data;
          });
          
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
    }
  }
  searchUsers(val: string) {
    var role = this.searchRolePermissionForm.get(val).value; console.log('role' + role);
    this.users = this.systemusers;
    if ('-1' != role) {
      //  this.users = this.users.filter(data => data.role === role);
      this.users = this.users.filter(x =>
        x.roleName.includes(role)
      );
    }

  }

  viewRolePermission(userid: number) {
    // const systemUser: SystemUserConfigurationModel = this.systemUserConfigurationService.geSystemUserById(systemUserId);
    // console.log(systemUser);
    this.router.navigate(['view', userid], { relativeTo: this.route });
  }

  editRolePermission(userid: any) {
    this.router.navigate(['edit', userid], { relativeTo: this.route });
    //   this.router.navigate(["/artwork/modifyartwork"], { queryParams: value, skipLocationChange: true });

  }

}
