import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
 
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaxConfigurationService } from '../taxconfiguration.service';
import { ApprovalService } from '../../approval/approval.service';
 

@Component({
  selector: 'app-edittaxconfiguration',
  templateUrl: './edittaxconfiguration.component.html',
  styleUrls: ['./edittaxconfiguration.component.css']
})

export class EditTaxConfigurationComponent implements OnInit {
 
 
  displaytable: Boolean = false;
  successMessage: string;
  errorMessges: string;
  fetchingData = true;
  msg: string = '';
  offset: number = 0;
  limit: number;
  taxTypeCode : string;
  taxTypeName : string;
  calculationTypeCode: string;
  minValue : string;
  maxValue: string;
  value: string
  status : string;
  createAddForm : FormGroup;
  submitted : Boolean ;
  taxTypeList: any;
  calculationTypeList: any;
  constructor( private taxConfigurationService: TaxConfigurationService, private modalService: NgbModal,
    private activatedrouter: ActivatedRoute, private formBuilder: FormBuilder,private approvalService : ApprovalService,
    private router: Router) {
  }

  ngOnInit() {
   
    this.activatedrouter.queryParams.subscribe((params: Params) => {
      this.taxTypeCode = params.taxTypeCode;
      this.taxTypeName = params.taxTypeName;
      this.calculationTypeCode =  params.calculationTypeCode;
      this.minValue =  params.minValue;
      this.maxValue =  params.maxValue;
      this.value =  params.value;
      this.status = this.approvalService.getDataApprovalStatus(params.status);
      this.taxConfigurationService.getAllTaxType().subscribe(x => {
      
        this.taxTypeList = x.taxTypeList;
    
      },error => console.log('err',error)); 
      this.taxConfigurationService.getAllCalculationType().subscribe(x => {
      
        this.calculationTypeList = x.calculationTypeList;
     
      },error => console.log('err',error)); 
 
      });
      this.createForm();
  }
  get f(){
    return this.createAddForm.controls;
  }
  createForm(){
    this.createAddForm = this.formBuilder.group({
   
      taxTypeCode: [this.taxTypeCode, [Validators.required]],
      calculationTypeCode: [this.calculationTypeCode, [Validators.required]],
      minValue: [this.minValue,[Validators.required] ],
      maxValue: [this.maxValue,[Validators.required] ],
      value: [this.value,[Validators.required] ],
      status: [this.status,[Validators.required]],
      percentValue:['',[Validators.required]]

    });
  }
  onCancel(){
    this.router.navigate(['../add'], { queryParams: {code:this.taxTypeCode}, skipLocationChange: true, relativeTo: this.activatedrouter });

  }

  onSubmit(){
    this.submitted= true;
    this.errorMessges=''
    this.successMessage = '';
    if(this.createAddForm.invalid){
      return;
    }
    
    console.log('this.createAddForm.getRawValue()' ,this.createAddForm.getRawValue());
    this.taxConfigurationService.modifyTaxConfiguration(this.createAddForm.getRawValue(),this.taxTypeCode).subscribe(result=>{
      if (result.resultCode === '0') {

        this.errorMessges = undefined;
        this.successMessage = result.resultDescription;
        this.router.navigate(['../add'], { queryParams: {code:this.taxTypeCode,status:'updated'}, skipLocationChange: true, relativeTo: this.activatedrouter });

        

      } else {
        this.errorMessges = result.resultDescription;
      }
    });
  }

  
  selectChangeHandler(event: any, field: string) {
    switch (field) {
      case 'calculationType':
        //this.regions = this.createAddForm.regions(event.target.value);
        if(event.target.value=="100001"){
        this.createAddForm.get('value').enable();
        //this.createAddForm.get('fixedFeeValue').setValue('');
        this.createAddForm.get('percentValue').setValue(0);
        this.createAddForm.get('percentValue').disable();
        }
        if(event.target.value=="100002"){
          this.createAddForm.get('percentValue').enable();
          this.createAddForm.get('value').setValue(0);
          this.createAddForm.get('percentValue').setValue('');
          this.createAddForm.get('value').disable();
        }
        if(event.target.value=="100003") {
          this.createAddForm.get('percentValue').enable();
          this.createAddForm.get('percentValue').setValue('');
          this.createAddForm.get('value').setValue('');
          this.createAddForm.get('value').enable();
        }
        break;
      default:
        break;
    }
  }
  
}
