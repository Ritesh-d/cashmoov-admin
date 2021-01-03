import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CountryService } from '../country.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-create-region',
  templateUrl: './create-region.component.html',
  styleUrls: ['./create-region.component.css']
})
export class CreateRegionComponent implements OnInit {

  getcurrentLang:any;
  regionForm: FormGroup;
  editMode = false;
  fetchingData = true;
  countries: any[];
  countryCode: string;
  twoStep = false;
  errorMessage: string;
  regionCode: string;
  submitted: Boolean = false;
  setPermission: any;
  constructor(private countryService: CountryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedrouter: ActivatedRoute,
    private translate : TranslatelanguageService,
    private commonHelperService: CommonHelperService,
    private route: ActivatedRoute) {
      this.getcurrentLang=this.translate.getcurrentLang();
     }

  createForm() {
    let country: string = '',
      region: string = '';
    if (this.countryCode) {
      country = this.countryCode;
    }
    if (this.commonHelperService.isEditMode) {
      this.editMode = true;
      region = this.countryService.region.name;
      this.regionCode = this.countryService.region.code;
    }
    this.regionForm = this.formBuilder.group({
      country: new FormControl({ value: country, disabled: this.countryCode != undefined },[Validators.required]),
      region: new FormControl(region,[Validators.required,,Validators.minLength(4),Validators.pattern(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)])
    });
  }

  ngOnInit() {
    this.setPermission= this.countryService.setPermission;

    this.route.params.subscribe((params: Params) => {
      this.countryService.countries.subscribe(data => {
        if (data.resultCode === '0') {
          this.countries = data.countryList;
          this.fetchingData = false;
          if (params.id) {
            this.countryCode = params.id;
          }
          this.twoStep = this.router.url.indexOf('add/') > -1 || this.router.url.indexOf('edit/') > -1;
          this.createForm();
        }
      });
    });
  }

  onSubmit() {
    console.log('--onSubmit--', this.regionForm.value);
    
    this.submitted = true;
    if(this.editMode) {
      if(this.regionForm.valid){
      this.countryService.updateRegion(this.regionForm.value, this.countryCode, this.regionCode).subscribe(data => {
        if(data.resultCode === '0') {
          this.errorMessage = undefined;
          //this.countryService.setMessage = 'Region updated successfully';
          this.translate.languageText('COUNTRY.regionupdatedsuccessfully', data=> {
            this.countryService.setMessage=data;
          });
          this.onCancel();
        } else {
          this.errorMessage = data.resultDescription;
        }
      }, error => {
        this.errorMessage = error.error.resultDescription;
      });
    }
    } else {
      if(this.regionForm.valid){
       
      this.countryService.createRegion(this.regionForm.controls, this.countryCode).subscribe(data => {
        if(data.resultCode === '0') {
          this.errorMessage = undefined;
          //this.countryService.setMessage = 'Region added successfully';
          if(this.getcurrentLang==="en"){
            this.countryService.setMessage = 'Region added successfully';
             }
             if(this.getcurrentLang==="fr"){
              this.countryService.setMessage = 'Region ajoutee avec succes';
             }
          this.onCancel();
        } else {
          this.errorMessage = data.resultDescription;
        }
      }, error => {
        this.errorMessage = error.error.resultDescription;
      });
    }
  }
  document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });

  }

  onCancel() {
    this.twoStep
      ? this.router.navigate(['../../'], { relativeTo: this.route })
      : this.router.navigate(['../'], { relativeTo: this.route });
  }

  get f() {
    return this.regionForm.controls;
 }

}
