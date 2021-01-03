import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RolePermissionService } from '../rolepermission.service';
import { API_URLs } from '../../shared/models/constants';
import { RolePermissionModel } from '../rolepermission.model';
import { ActivatedRoute, Params } from '@angular/router';

 @Component({
    selector: 'app-editrolepermission',
    templateUrl: './editrolepermission.component.html',
    styleUrls: ['./editrolepermission.component.css']
  })
export class EditRolePermissionComponent implements OnInit {
    dynamicForm: FormGroup;
    submitted = false;
    roleList : any[];
    featureList : any[];
    role: string='';
    permission: string ='';
    rolePermissionModel: any;
    editMode: boolean;
    errorMessage: string;
    constructor(private route: ActivatedRoute,private formBuilder: FormBuilder,private apiurls: API_URLs,private rolePermissionService: RolePermissionService) { }

    ngOnInit() {
        this.dynamicForm = this.formBuilder.group({
            role: [this.role, Validators.required],
            permission: [this.permission, Validators.required],
            permissions: new FormArray([])
        });
       this.onLoad();
    }
async onLoad(){
    this.roleList    =  await this.rolePermissionService.getrolesDetail(this.apiurls.URL_SEARCH_ROLE);
    this.featureList =  await this.rolePermissionService.getFeatureDetail(this.apiurls.URL_SEARCH_FEATURE);
    this.route.params.subscribe((params: Params) => {
        console.log(params.id);
        if(params.id) {
          this.rolePermissionModel = this.rolePermissionService.geSystemUserById(+params.id);
          this.role = this.rolePermissionModel.roleName;console.log('this.rolePermissionModel.role'+this.rolePermissionModel.roleName)
          this.permission = this.rolePermissionModel.name;console.log('this.rolePermissionModel.name'+this.rolePermissionModel.name)
         }
    });
}
    get f() { return this.dynamicForm.controls; }
    get t() { return this.f.permissions as FormArray; }

    onChangePermissions(e) {
        const numberOfPermissions = e.target.value || 0;
        if (this.t.length < numberOfPermissions) {
            for (let i = this.t.length; i < numberOfPermissions; i++) {
                this.t.push(this.formBuilder.group({
                    featureCode: [''],
                    create: [''],
                    view :[''],
                    edit:[''],
                    approve:[''],
                    delete:['']
                })); 
            }
        } else {
            for (let i = this.t.length; i >= numberOfPermissions; i--) {
                this.t.removeAt(i);
            }
        }
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.dynamicForm.invalid) {
            return;
        }

        // display form values on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.dynamicForm.value, null, 4));
    }

    onReset() {
        // reset whole form back to initial state
        this.submitted = false;
        this.dynamicForm.reset();
        this.t.clear();
    }

    onClear() {
        // clear errors and reset ticket fields
        this.submitted = false;
        this.t.reset();
    }

    navigateToSytemUserCreation() {

    }

    onCancel() {
        
    }
}