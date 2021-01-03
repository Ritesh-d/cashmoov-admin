import { Component, OnInit, Input } from '@angular/core';

  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApprovalService } from '../../../approval/approval.service';
 import { WalletOwnerService } from '../../wallet-owner.service';
 

@Component({
  selector: 'app-editmodalservice',
  templateUrl: './editmodalservice.component.html',
  styleUrls: ['./editmodalservice.component.css']
})
export class EditServiceComponent  implements OnInit{
 
  serviceErrorMessage : string;
  serviceProviderForm : FormGroup;
  serviceProviderList : any;
  serviceList : any;
  serviceCategoryList : any;
  submitted : boolean= false;
  seriveSuccessmessage: string;
  serviceProviderMaster: string;
  serviceCategoryCode: string;
  serviceCode: string;
  serviceName: string;
  serviceProviderMasterCode: string;
  serviceCategoryName: string;
  serviceProviderMasterName: string;
  status: string;
  code: string;
  constructor( private walletOwnerService: WalletOwnerService, private approvalService : ApprovalService, private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedrouter.queryParams.subscribe((params: Params) => {

      if (params) {
        this.code= params.code;        
        this.serviceCode= params.serviceCode;
        this.serviceCategoryCode= params.serviceCategoryCode;
        this.serviceCategoryName= params.serviceCategoryName;
        this.serviceName = params.serviceName;
        this.serviceProviderMasterCode= params.serviceProviderMasterCode;
        this.serviceProviderMasterName= params.name;
       
        this.status = this.approvalService.getDataApprovalStatus( params.status);


        
        console.log('params', params);
      }
      this.walletOwnerService.getEWALLETSERVICE().subscribe(res => {
        if (res["resultCode"] === '0') {
          this.serviceList  =  res["ewalletServiceList"];
          
           
        } 
        });
      this.loadServiceForm();
    });
    
  }

  loadServiceForm(){
   
    this.serviceProviderForm = this.formBuilder.group({
      serviceCode : [this.serviceCode,[Validators.required]],
      serviceCategoryCode : [this.serviceCategoryCode,[Validators.required]],
      serviceProviderMasterCode : [this.serviceProviderMasterCode],
      name : [this.serviceProviderMasterName],
      status : [this.status,[Validators.required]]
    })
  }
 
  get fservice(){
    return this.serviceProviderForm.controls;

  }

  onSaveService(){
    this.submitted = true;
    this.seriveSuccessmessage= '';
    this.serviceErrorMessage='';
    console.log('this.serviceProviderForm ',this.serviceProviderForm.invalid ,this.serviceProviderForm.getRawValue());
    if(this.serviceProviderForm.invalid){
      return ;
    }
 
 
    this.walletOwnerService.updateServiceProvider(this.serviceProviderForm.getRawValue(),this.code).subscribe(res => {
      if (res["resultCode"] === '0') {
        this.seriveSuccessmessage  = res["resultDescription"];

      } 
      });
    
  }
  onCancel(){
    this.router.navigate(['../'], { skipLocationChange: true, relativeTo: this.route });

  }
  
 

 

}