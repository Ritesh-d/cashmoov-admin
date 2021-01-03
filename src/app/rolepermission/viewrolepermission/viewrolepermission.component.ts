import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { RolePermissionService } from '../rolepermission.service';
import { RolePermissionModel } from '../rolepermission.model';

@Component({
  selector: 'app-viewrolepermission',
  templateUrl: './viewrolepermission.component.html',
  styleUrls: ['./viewrolepermission.component.css']
})
export class ViewRolePermission implements OnInit {

  
  editMode = false;
  paramList :any;
  createSystemUserModel: RolePermissionModel;
  id: number;
  createdOn: Date;
  permission :String;
  role :String;
  featureCode :String;
  view : Boolean;
  edit :Boolean;
  create :Boolean;
  approve :Boolean;
  delete :Boolean;
  status = '';
  constructor(private systemUserConfigurationService: RolePermissionService,private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute) { }

   
  

  ngOnInit() {

      this.route.params.subscribe((params: Params) => {
       
    
      if(params.id) {
      console.log("params" + params.id);
        this.createSystemUserModel = this.systemUserConfigurationService.geSystemUserById(+params.id);
        this.id =  this.createSystemUserModel.id;
        this.role = this.createSystemUserModel.role;
        this.permission = this.createSystemUserModel.permission;
        this.featureCode = this.createSystemUserModel.featuresCode;
        this.edit = this.createSystemUserModel.edit;
        this.approve = this.createSystemUserModel.approve;
        this.delete = this.createSystemUserModel.delete;

        this.view = this.createSystemUserModel.view;
        this.create = this.createSystemUserModel.create;
        this.createdOn = this.createSystemUserModel.createdOn;
        this.status = this.createSystemUserModel.status;
        
        
     
      }
     
       
    });
  }

  navigateToSytemUserCreation(){
    
      this.router.navigate( ['../../'], {relativeTo: this.route} );
    
  }
   

  onCancel() {
    
  
      this.router.navigate( ['../../'], {relativeTo: this.route} );
     
  }
 
}
