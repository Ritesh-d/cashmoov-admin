import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators ,FormBuilder} from '@angular/forms';
import { RolePermissionModel } from '../../rolepermission.model';
import { RolePermissionRequestModel } from '../../rolepermissionrequest.mode';

@Injectable()
export class AddRolePermissionService {

  formRolePermission = new FormArray([]);
  allRolePermission: FormGroup; 
  savedRolePermission: any[] = [];
  rolePermissionModel: RolePermissionModel =  new RolePermissionModel();
  rolePermissionRequestModel: RolePermissionRequestModel = new RolePermissionRequestModel;
  constructor(private formBuilder: FormBuilder) { }

  createFormGroup(): FormGroup { 
    const rolePermissionForm = this.formBuilder.group({ 
        id: ['', [Validators.required, Validators.minLength(3)]],
        // permission: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3)]],
        // role: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3)]],
       
        featureCode: ['', [Validators.required]],
        createdOn: [''],
        create: ['', [ ]],
        edit: ['', [ ]],
        view: ['', [ ]],
        approve: ['', [ ]],
        delete: ['', [ ]],
        status : ['']
    
       });
     return rolePermissionForm;
  }

  createAllPermission() {
    this.allRolePermission = new FormGroup({
      permissions: this.formRolePermission
    });
  }

  get getFormControl() {
    return (this.allRolePermission.get('permissions') as FormArray).controls;    
  }

  onAddForm() {
    
    this.formRolePermission.push(this.createFormGroup());
    this.savedRolePermission.push(this.createFormGroup().value);
  }

  onRemoveForm(index: number) {
    this.formRolePermission.removeAt(index);
   
  }

}
