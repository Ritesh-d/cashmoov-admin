import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { TaxConfigurationService } from '../../../taxconfiguration/taxconfiguration.service';
import { ViewTaxConfigurationComponent } from './view/viewtaxconfiguration.component';

@Component({
  selector: 'app-taxtype',
  templateUrl: './taxtype.component.html',
  styleUrls: ['./taxtype.component.css']
})
export class TaxtypeComponent implements OnInit {
  
  
  @Input() entityCode :string;
  @Input() approvalData : any;

  displaytable: Boolean = false;
  successMessage: string;
  submitted: boolean;
  errorMessges: string;
  addTaxForm : FormGroup;
  msg: string = '';
  offset: number = 0;
  limit: number;
  taxTypeList :any
  taxConfigurationList: any;
  loader: boolean;
  taxtypename: string;
  constructor( private taxConfigurationService: TaxConfigurationService, private modalService: NgbModal,
    private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.showMessage();
   // this.callOnLoad();
    this.getRelatedList(this.approvalData.entityCode);
   
    this.addTaxForm = this.formBuilder.group({
      typeEn: [[this.taxtypename],[Validators.required,Validators.pattern(/^[a-zA-Z-0-9,]+(\s{0,1}[a-zA-Z-0-9, ])*$/)]],
      status: ['']
    })
   
  }
  get f(){
    return this.addTaxForm.controls;
  }
  getRelatedList(code : string){
    this.displaytable= false;
    this.loader= true
    this.taxConfigurationService.getAllByCriteria(code).subscribe(x => {
      
      this.taxConfigurationList = x.taxConfigurationList;
      this.taxtypename=this.taxConfigurationList[0].taxTypeName;
      this.addTaxForm.get("typeEn").setValue(this.taxtypename);
      this.displaytable = true;
      this.loader= false;
    },error => console.log('err',error)); 
  }
 
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
        this.successMessage = 'Tax Configuration Added successfully, sent for approval';
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        this.successMessage = 'Tax Configuration Updated successfully.';
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
    }
  }
  configureTax(data : any){
    data.display = "block"
    this.router.navigate(['add'], { queryParams: data, skipLocationChange: true, relativeTo: this.route });

  }
  view(data: any){
    const modalRef = this.modalService.open(ViewTaxConfigurationComponent);
    modalRef.componentInstance.data = data;
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

        //this.callOnLoad();
        
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
