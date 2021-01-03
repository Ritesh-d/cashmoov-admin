import { Component, OnInit, EventEmitter, Output, Input, ViewChild, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormControl, FormArray } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { RolePermissionService } from '../rolepermission.service';
import { RolePermissionModel } from '../rolepermission.model';
import { AddRolePermissionService } from './addroles/addroles.service';
import { DOCUMENT } from '@angular/common';
import { RolePermissionRequestModel } from '../rolepermissionrequest.mode';
import { API_URLs } from '../../shared/models/constants';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 


@Component({
  selector: 'app-createrolepermission',
  templateUrl: './createrolepermission.component.html',
  styleUrls: ['./createrolepermission.component.css']
})
export class CreateRolePermission implements OnInit {
  formArray = new FormArray([]);
  savedArray: any[] = [];
  createRolePermissionForm: FormGroup;
  editMode = false;
  paramList :any;
  rolePermissionModel: RolePermissionModel =  new RolePermissionModel();
  rolePermissionRequestModel: RolePermissionRequestModel = new RolePermissionRequestModel;
   id: number;
   createdOn: Date;
   permission :String='';
   role :String = '';
   featureCode :String='';
   view : Boolean=false;
   edit :Boolean = false;
   create :Boolean= false;
   approve :Boolean =false;
   delete : Boolean= false;
   status :String= '';
 
   @Input('formIndex')
   formIndex: number;
   allRoles: FormGroup; 
   submitted : Boolean = false;
   addmore : Boolean = false;
   errorMessage :string;
   successMessage :string
   roleList : any ;
   
 
   @Input('featureList')
   featureList : any ;
 
  constructor(private apiurls: API_URLs,private systemUserConfigurationService: RolePermissionService,
    private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private translate: TranslatelanguageService,
    private rolePermissionService: AddRolePermissionService,
    private route: ActivatedRoute,  @Inject(DOCUMENT) document) { }

 async createForm() {
    this.createRolePermissionForm = this.formBuilder.group({ 
     id: [''],
     permission: [this.permission, [Validators.required]],
     role: [this.role, [Validators.required]],
     featureCode: [this.featureCode, [Validators.required]],
     createdOn: [this.createdOn],
     create: [this.create, [ ]],
     edit: [this.edit, [ ]],
     view: [this.view, [ ]],
     approve: [this.approve, [ ]],
     delete: [this.delete, [ ]],
     status : [this.status]
 
    });
    this.roleList =  await this.systemUserConfigurationService.getrolesDetail(this.apiurls.URL_SEARCH_ROLE);
    this.featureList =  await this.systemUserConfigurationService.getFeatureDetail(this.apiurls.URL_SEARCH_FEATURE);
    return this.createRolePermissionForm;
  }
  

  ngOnInit() {
   
     

    this.editMode = this.systemUserConfigurationService.prepareUserAction(); 
    this.rolePermissionService.createAllPermission();
    this.allRoles = this.rolePermissionService.allRolePermission;
    console.log('--editMode--', this.editMode);   
    

       this.route.params.subscribe((params: Params) => {
       
    
      if(params.id) {
        
        this.rolePermissionModel = this.systemUserConfigurationService.geSystemUserById(+params.id);
        this.id =  this.rolePermissionModel.id;
        this.role = this.rolePermissionModel.role;
        this.permission = this.rolePermissionModel.permission;
        this.featureCode = this.rolePermissionModel.featuresCode;
        this.edit = this.rolePermissionModel.edit;
        this.approve = this.rolePermissionModel.approve;
        this.delete = this.rolePermissionModel.delete;

        this.view = this.rolePermissionModel.view;
        this.create = this.rolePermissionModel.create;
        this.createdOn = this.rolePermissionModel.createdOn;
        this.status = this.rolePermissionModel.status;
        
        
     
      }
      this.createForm();
     
    });
  }

  navigateToSytemUserCreation(){
    const firstPath = window.location.pathname.split('/')[1];
    if(this.editMode){
      this.router.navigate( ['../../'], {relativeTo: this.route} );
    }else{
      this.router.navigate( ['../'], {relativeTo: this.route} );
    }
  }

  onReset() {
    this.createRolePermissionForm.reset();
  }
  onCancel(){
    const firstPath = window.location.pathname.split('/')[1];
    if(this.editMode){
      this.router.navigate( ['../../'], {relativeTo: this.route} );
    }else{
      this.router.navigate( ['../'], {relativeTo: this.route} );
    }

  }

  onSaveForm() {
     this.submitted=true;
 
    if (this.createRolePermissionForm.invalid) {
      return;
    } 
    this.rolePermissionModel.featuresCode =  this.createRolePermissionForm.get('featureCode').value;
    this.rolePermissionModel.create = this.createRolePermissionForm.get('create').value;
    this.rolePermissionModel.approve = this.createRolePermissionForm.get('approve').value;
    this.rolePermissionModel.delete = this.createRolePermissionForm.get('delete').value;
    this.rolePermissionModel.view = this.createRolePermissionForm.get('view').value;

    this.rolePermissionModel.edit = this.createRolePermissionForm.get('edit').value;

    this.rolePermissionService.rolePermissionRequestModel.name = this.createRolePermissionForm.get('permission').value;
    this.rolePermissionService.rolePermissionRequestModel.roleCode =  this.createRolePermissionForm.get('role').value;

    this.rolePermissionService.rolePermissionRequestModel.featuresList.push(this.rolePermissionModel);
    this.createRolePermissionForm.disable();
    
    console.log("Request for Create RolePErmission API... " + JSON.stringify(this.rolePermissionService.rolePermissionRequestModel));
    this.addmore=true;
    
  }

  onSubmit(){
    // this.submitted=true;
    this.errorMessage ='';
    this.successMessage ='';
    console.log('++submitted+++' + window.location.pathname.split('/')[1]);
    if (this.createRolePermissionForm.invalid) {
       return;
    }
    console.log("Request for Create RolePErmission API... " + JSON.stringify(this.rolePermissionService.rolePermissionRequestModel));
    if(this.editMode){
      this.onSaveForm();
      this.createRolePermissionForm.enable();
    }
    console.log('apiurls ' + this.apiurls.URL_CREATE_PERMISSION);
    this.systemUserConfigurationService.createRolePermissionApi(this.apiurls.URL_CREATE_PERMISSION, this.rolePermissionService.rolePermissionRequestModel)
      .then(
        data => {
          console.log("Response for Permission API... : " + JSON.stringify(data));
          if (data == null) {
           //this.errorMessage = "Technical Failed.";
           this.translate.languageText('MASTER.technicalFailed', data=> {
            this.errorMessage =data;
            });
          }
          else if (data["resultCode"] == "0") {
            this.successMessage = data["resultDescription"];
            this.router.navigate( ['../'], {relativeTo: this.route, queryParams: { status: 'added' }});
 
            
           } else {
           // this.errorMessage = "Failed : Error Code : " + data["resultCode"] + " : Error Desc : " + data["resultDescription"];
            this.errorMessage = data["resultDescription"];

          }
          this.submitted = false;
        }
      );

    
   // this.rolePermissionService.rolePermissionRequestModel.featuresList  =undefined;
   // const firstPath = window.location.pathname.split('/')[1];
    // if(this.editMode){
    //   this.router.navigate( ['../../'], {relativeTo: this.route} );
    // }else{
    //   this.router.navigate( ['../'], {relativeTo: this.route} );
    // }
  }

  onEditForm() {
    console.log('--onEditForm--', this.formIndex);
    // updating the address(default: null) at formIndex
    // this.rolePermissionService.savedRolePermission.splice(this.formIndex, 1, this.rolePermissionService.createFormGroup().value);
    // this.createRolePermissionForm.enable();
    //  this.rolePermissionService.savedRolePermission.splice(this.formIndex, 1, this.rolePermissionService.createFormGroup().value);
      this.createRolePermissionForm.enable();
      this.rolePermissionService.rolePermissionRequestModel.featuresList.splice(this.formIndex,1);
      console.log(this.rolePermissionService.rolePermissionRequestModel);
  }
 

  get getFormControl() {
    return this.rolePermissionService.getFormControl;
  }
  get f() {
    return this.createRolePermissionForm.controls;
  }
  // onAddForm() {
  //   this.formArray.push(this.createForm());
  //   this.savedArray.push(this.createForm().value);
  // }
  onChange(event : any){
    console.log('event.target.value'+event.target.value,this.systemUserConfigurationService.sharedData);
    this.systemUserConfigurationService.sharedData.forEach(function(e){
      // if (typeof e === "object" ){
        if(e.code == event.target.value){
        e["disabled"] = true;
        }
      // }
    })
};
}
