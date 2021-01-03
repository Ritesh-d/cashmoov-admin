import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { CreateGroupService } from './create-group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarAngularDateFormatter } from 'angular-calendar';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  groupForm: FormGroup;
  groups: any[];
  regionals: any[];
  governorates: any[];
  regions: any[];
  templateCategories: any[];
  remaingCategories: any[];
  templateNames: any[] = [];
  errorMessage: string;

  constructor(private createGroupService: CreateGroupService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.groupForm = this.createGroupService.createGroupForm();

    this.createGroupService.prepareMasters().subscribe((data) => {
      this.regionals = [ {code: '', type: 'select regional area'}, ...this.createGroupService.regionals ];
      this.templateCategories = this.createGroupService.templateCategories;
      this.remaingCategories = [ { code: '', type: 'select category' }, ...this.templateCategories];
      if(data) {  
        this.remaingCategories = [ { code: '', type: 'select category' }, ...data];
      }
    });
    this.createGroupService.groups.subscribe(response => {
      this.groups = [ { code: '', name: 'select group'}, ...response.groupList];
    });

  }

  /**
   * on changing or select value in dropdown
   * @param event : event, selected value
   * @param field : dropdown
   */
  selectChangeHandler(event: any, field: string) {
    switch (field) {
      case 'regional':
        this.governorates = this.createGroupService.governorates(event.target.value);
        this.groupForm.get('governorate').enable();
        this.groupForm.get('governorate').setValue('');
        this.groupForm.get('region').setValue('');
        break;
      case 'governorate':
        this.regions = this.createGroupService.regions(event.target.value);
        this.groupForm.get('region').enable();
        this.groupForm.get('region').setValue('');
        break;
      case 'region':
        
        break;
      default:
        break;
    }
  }

  /**
   * get the templates on basis of template category
   */

   
  templateNameOnCategory(event: any) {
    this.createGroupService.templateNameOnCategory(event.target.value).subscribe((response: any) => {
      console.log('--templates--', response);
      this.templateNames.push([{ code: '', name: 'select template' }, ...response.transTypeList]);
      // this.groupForm.get('groupTemplates').get('templateName').enable();
    },
    error => {
      this.errorMessage = error.resultDescription;
    });
    this.disableSelectedCategories(this.groupForm.get('groupTemplates').value);
  }

  /**
   * disable already selected categories
   * @param groupTemplatesForm 
   */
  disableSelectedCategories(groupTemplatesForm: any[]){
    const selectedCategories = [];
    groupTemplatesForm.forEach(element => {
      if(element.templateCategory !== '') {
        selectedCategories.push(element.templateCategory);
      }
    });
    this.prepareRemainingCategories(selectedCategories);
  }

  /**
   * to enable remaining categories
   * @param selectedCategories 
   */
  prepareRemainingCategories(selectedCategories: string[]) {
    this.remaingCategories = [...this.templateCategories];
    selectedCategories.forEach(category => {
      this.remaingCategories.forEach(element => {
        if(category === element.code) {
          const index: number = this.remaingCategories.indexOf(element);
          element = { ...element, disabled: true };
          this.remaingCategories.splice(index, 1, element);
        }
      })
    });
  }

  /**
   * on submit form; group creation
   */
  submitted : boolean = false;
  submitGroup() {
    this.submitted= true;
    console.log('--groupForm--', this.groupForm.value);
    if(this.groupForm.invalid){
      return;
    }
    this.createGroupService.createGroup(this.groupForm.value).subscribe((response: any) => {
      if(response.resultCode === '0') {
        this.errorMessage = undefined;
        console.log('--created group code--', response.groupCode);
        this.router.navigate(['../'], {relativeTo: this.route, queryParams: { status: 'added' } });
      } else {
        this.errorMessage = response.resultDescription;
      }
     
    },
    error => {
      this.errorMessage = error.resultDescription;
    });

  }

  /**
   * navigate to previous page
   */
  navigateBack() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  /**
   * add template form in group templates
   */
  onAddTemplate() {
    (this.groupForm.get('groupTemplates') as FormArray).push(new FormGroup({
      templateCategory: new FormControl(''),
      // templateName: new FormControl({ value:'', disabled: true}),
      templateName: new FormControl('')
    }));
  }

  /**
   * remove form on delete icon
   * @param templateIndex : form index
   */
  onRemoveTemplate(templateIndex: number) {
    (this.groupForm.get('groupTemplates') as FormArray).removeAt(templateIndex);
    this.disableSelectedCategories(this.groupForm.get('groupTemplates').value);
    this.templateNames.splice(templateIndex, 1);
  }

  /**
   * get controls of template form; the nested/dynamic one
   */
  get getTemplatesControl() {
    return (this.groupForm.get('groupTemplates') as FormArray).controls;
  }

}
