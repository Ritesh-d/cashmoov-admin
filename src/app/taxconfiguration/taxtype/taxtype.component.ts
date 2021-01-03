import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
 
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaxConfigurationService } from '../taxconfiguration.service';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-taxtype',
  templateUrl: './taxtype.component.html',
  styleUrls: ['./taxtype.component.css']
})

export class TaxTypeComponent implements OnInit {
 
  getcurrentLang:any;
  displaytable: Boolean = false;
  successMessage: string;
  submitted: boolean;
  errorMessges: string;
  addTaxForm : FormGroup;
  msg: string = '';
  offset: number = 0;
  limit: number;
  taxTypeList :any
  constructor( private taxConfigurationService: TaxConfigurationService, private modalService: NgbModal,
    private route: ActivatedRoute, private formBuilder: FormBuilder, private translate : TranslatelanguageService,
    private router: Router) {
  }

  ngOnInit() {
    this.showMessage();
    this.callOnLoad();
   
    this.addTaxForm = this.formBuilder.group({
      typeEn: ['',[Validators.required,Validators.pattern(/^[a-zA-Z-0-9,]+(\s{0,1}[a-zA-Z-0-9, ])*$/)]],
      status: ['']
    })
   
  }
  get f(){
    return this.addTaxForm.controls;
  }
  callOnLoad(){
    this.displaytable = false;
    this.taxConfigurationService.getAllTaxType().subscribe(x => {
      
      this.taxTypeList = x.taxTypeList;
      this.displaytable = true;
    },error => console.log('err',error)); 
   }
 
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
        //this.successMessage = 'Tax Configuration Added successfully, sent for approval';
        this.translate.languageText('TAXCONFIGURATION.taxConfigurationAddedsuccessfullysentforapproval', data=> {
          this.successMessage =data;
          });
          
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        //this.successMessage = 'Tax Configuration Updated successfully.';
        this.translate.languageText('TAXCONFIGURATION.taxConfigurationUpdatedsuccessfully', data=> {
          this.successMessage =data;
          });
          

      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 500);
    }
  }
  configureTax(data : any){
    data.display = "block"
    this.router.navigate(['add'], { queryParams: data, skipLocationChange: true, relativeTo: this.route });

  }
  view(data: any){
    data.display = "none"

    this.router.navigate(['add'], { queryParams: data, skipLocationChange: true, relativeTo: this.route });

  }
  onSubmit(){  
    this.errorMessges = undefined;
    this.successMessage = undefined;
    this.submitted = true;
    if(this.addTaxForm.invalid){
     return;
    }
  
    console.log('this.createAddForm.getRawValue()' ,this.addTaxForm.getRawValue());
    this.taxConfigurationService.createTaxType(this.addTaxForm.getRawValue()).subscribe(result=>{
      if (result["resultCode"] === '0') {
        this.successMessage = result["resultDescription"];

        this.callOnLoad();
        
       // this.taxConfigurationService.makeEntryToApprovalforParent(result["taxType"]).subscribe(approvalData => {
        //  console.log('approvalData', approvalData)
         // if (approvalData === null) {
         ///   this.errorMessges = "There is some error, Please try after some time.";
         // } else {
          //  if (approvalData["resultCode"] == "0") {
           //   this.errorMessges = undefined;
            //  this.router.navigate(['taxtype'], { relativeTo: this.route, queryParams: { status: 'added' } });
          //  } else {
            //  this.errorMessges = approvalData["resultDescription"];
            //}
         // }
       // });

      } else {
        this.errorMessges =  result["resultDescription"];
      }
    });

  }
}
