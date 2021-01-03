import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormControl, FormArray } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { RolePermissionService } from '../../rolepermission.service';
import { RolePermissionModel } from '../../rolepermission.model';
import { AddRolePermissionService } from './addroles.service';
import { RolePermissionRequestModel } from '../../rolepermissionrequest.mode';
import { API_URLs } from '../../../shared/models/constants';

@Component({
  selector: 'app-addroles',
  templateUrl: './addroles.component.html',
  styleUrls: ['./addroles.component.css']
})
export class AddRolePermission implements OnInit {
  formArray = new FormArray([]);
  savedArray: any[] = [];
  addRolePermissionForm: FormGroup;
  editMode = false;
  paramList :any;
  rolePermissionModel: RolePermissionModel =  new RolePermissionModel();
  rolePermissionRequestModel: RolePermissionRequestModel = new RolePermissionRequestModel;

   id: number;
   createdOn: Date;
   role : String;
   permission :String;
   featureCode :String;
   view : Boolean;
   edit :Boolean;
   create :Boolean;
   approve :Boolean;
   delete : Boolean;
   status = '';
   submitted :Boolean = false;
   validatemsg;Boolean = false;
  //  featureList : any;

  //  rolePermissionForm: FormGroup;
   @Input('formIndex')
  
   featureList : any;
   formIndex: number;
   allRoles: FormGroup; 
  constructor(private apiurls: API_URLs,public systemUserConfigurationService: RolePermissionService,private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,private rolePermissionService: AddRolePermissionService,
    private route: ActivatedRoute) { }

 async  createForm() {
    this.addRolePermissionForm = this.formBuilder.group({ 
     id: ['', [ ]],
     role: ['', [ ]],
    // {value: '', disabled: true}
     permission: ['', [ ]],
     featureCode: ['', [Validators.required ]],
     createdOn: ['', [ ]],
     create: ['', [ ]],
     edit: ['', [ ]],
     view: ['', [ ]],
     approve: ['', [ ]],
     delete: ['', [ ]],
     status : ['']
 
    });
   // this.featureList =  await this.systemUserConfigurationService.getFeatureDetail(this.apiurls.URL_SEARCH_FEATURE);
    
    return this.addRolePermissionForm;
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
//console.log('featureList ',this.featureList);
   // this.addRolePermissionForm.get("featureCode").valueChanges.subscribe(x => {
    //   this.featureList = this.featureList.filter(x => 
    //   x.roleName.includes(this.addRolePermissionForm.get("featureCode").value)
    // );
  
  //  });
  
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
    this.addRolePermissionForm.reset();
  }
  onCancel(){
    const firstPath = window.location.pathname.split('/')[1];
    if(this.editMode){
      this.router.navigate( ['../../'], {relativeTo: this.route} );
    }else{
      this.router.navigate( ['../'], {relativeTo: this.route} );
    }

  }

  onSubmit() {
    this.submitted= true;
    console.log('savedRolePermission' + JSON.stringify(this.rolePermissionService.savedRolePermission));
    console.log('++submitted+++' + window.location.pathname.split('/')[1]);
    const firstPath = window.location.pathname.split('/')[1];
    if(this.editMode){
      this.router.navigate( ['../../'], {relativeTo: this.route} );
    }else{
      this.router.navigate( ['../'], {relativeTo: this.route} );
    }
  }

  // navgateToStep1() {
  //   document.getElementById('step-1-tab').click();
  // }
  // navgateToStep2() {
  //   document.getElementById('step-2-tab').click();
  // }
  // navgateToStep3() {
  //   document.getElementById('step-3-tab').click();
  // }

  finalSubmit() {
    
  }
  onRemoveForm() {
    console.log('--RemoveForm--', this.formIndex);
    this.rolePermissionService.rolePermissionRequestModel.featuresList.splice(this.formIndex+1,1);
    console.log(this.rolePermissionService.rolePermissionRequestModel);

      this.rolePermissionService.onRemoveForm(this.formIndex);
    //  this.rolePermissionService.savedRolePermission.splice(this.formIndex, 1);
  }

  onEditForm() {

     console.log('--onEditForm--', this.formIndex);
    // this.rolePermissionService.savedRolePermission.splice(this.formIndex, 1, this.rolePermissionService.createFormGroup().value);
    this.addRolePermissionForm.enable();
    this.rolePermissionService.rolePermissionRequestModel.featuresList.splice(this.formIndex+1,1);
    console.log(this.rolePermissionService.rolePermissionRequestModel);
   }
  submitForm() {
 
    this.submitted= true;
this.validatemsg = false;
    // document.getElementById('form_' + this.formIndex).click();

    // console.log('--form valid--', this.addRolePermissionForm.valid);
 if(!this.addRolePermissionForm.get('create').value && !this.addRolePermissionForm.get('approve').value
 &&!this.addRolePermissionForm.get('view').value && !this.addRolePermissionForm.get('edit').value
 && !this.addRolePermissionForm.get('delete').value){
  this.addRolePermissionForm.setErrors({'incorrect': true});
  this.validatemsg = true;
  return ;
 }
    if (this.addRolePermissionForm.valid) {
      console.log('--form is valid--');
      console.log(this.addRolePermissionForm.value);
      
      // updating the address(actual: user enterd) at formIndex
      // this.rolePermissionService.savedRolePermission.splice(this.formIndex, 1, this.addRolePermissionForm.value);
      this.addRolePermissionForm.disable();

      // console.log('--size--', this.rolePermissionService.savedRolePermission);
    }
   
    this.rolePermissionModel.featuresCode =  this.addRolePermissionForm.get('featureCode').value;
    this.rolePermissionModel.create = this.addRolePermissionForm.get('create').value;
    this.rolePermissionModel.approve = this.addRolePermissionForm.get('approve').value;
    this.rolePermissionModel.delete = this.addRolePermissionForm.get('delete').value;
    this.rolePermissionModel.view = this.addRolePermissionForm.get('view').value;

    this.rolePermissionModel.edit = this.addRolePermissionForm.get('edit').value;

    this.rolePermissionService.rolePermissionRequestModel.featuresList.push(this.rolePermissionModel);
    console.log("Request for Create RolePErmission API... " + JSON.stringify(this.rolePermissionService.rolePermissionRequestModel));

  }

  get getFormControl() {
    return this.rolePermissionService.getFormControl;
  }
  get f() {
    return this.addRolePermissionForm.controls;
  }
  // onAddForm() {
  //   this.formArray.push(this.createForm());
  //   this.savedArray.push(this.createForm().value);
  // }

  onChange(event : any){
    console.log('in Add event.target.value'+event.target.value,this.systemUserConfigurationService.sharedData);
    this.systemUserConfigurationService.sharedData.forEach(function(e){
      // if (typeof e === "object" ){
        if(e.code == event.target.value){
        e["disabled"] = true;
        } 
      // }
    })
};
}
