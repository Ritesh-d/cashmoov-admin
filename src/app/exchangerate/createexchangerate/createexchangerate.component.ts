import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ExchangerateService } from '../ExchangerateService.service';
import { ExchangerateModel } from '../exchangerate.model';
import { Constants } from '../exchangerate.constant';
import { CompareMatch } from "./customvalidator.validator";
import { ApprovalConstants } from '../../approval/approval.constants';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-createexchangerate',
  templateUrl: './createexchangerate.component.html',
  styleUrls: ['./createexchangerate.component.css']
})

export class CreateExchangerateComponent implements OnInit {


  errorMessage : string='';
  displaytable : boolean = true;
  fetchingData : boolean = false;
  dtOption: any = {};
  countries :any ;
  // countriesgroup1 :any ;
  // countriesgroup2 :any ;
  currencies :any ;
  // currenciesgroup1 :any ;
  // currenciesgroup2 :any ;
  agents :any ;
  institutes : any;
  paying_institute:string;
  remit_institute : string;
  // agentsgroup1 :any ;
  // agentsgroup2 :any ;
  sendingbranch :any ;
  receivingbranch :any ;
  // branchesgroup1 :any ;
  // branchesgroup2 :any ;
   
  createExchnageRateForm : FormGroup;
  exchangerateModel : ExchangerateModel = new ExchangerateModel();
  
  editMode = false;
  code : string="";
  name : string="";
  sending_currency : string="";
  receiving_currency : string="";
  sending_country : string="";
  receiving_country : string="";
  remit_agent : string;
  remit_branch : string ;
  paying_agent : string ;
  paying_branch : string ;
  exchange_rate : string="";
  status : string;
  submitted : boolean = false;
  showagent : boolean = false;
  showbranch : boolean = false;
  showinstitute : boolean =false;
  showremitbranch : boolean = false;
  showremitagent: boolean = false;
  receivingagent : any;
  sendingagent : any;
  showpayingbranch : boolean = false;
  showpayingagent: boolean = false;
  exchRateData:any;
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate: TranslatelanguageService,
    private exchangerateService : ExchangerateService,
    private router: Router){
    
  }
  onchangeSend(event){
    console.log('onchangeSend' +  event.target.value);
   
      this.countries.filter(m=>{
        console.log('send currency found : '+ m.code == event.target.value);
       if(m.code == event.target.value ){
         console.log('send .currencyCode' + m.currencyCode);
         this.currencies.filter(mc=>{
           if(mc.currencyCode == m.currencyCode){
           this.createExchnageRateForm.get("sending_currency").setValue(mc.code)  ;
           }
         })
       
       }
    }) 
   
    
  }
  onchangeRecv(event){
    console.log('onchangeRec' +  event.target.value);
   
      this.countries.filter(m=>{
        console.log('recv currency found : '+ m.code == event.target.value);
      if(m.code == event.target.value ){
        console.log('recv .currencyCode' + m.currencyCode);
        this.currencies.filter(mc=>{
          if(mc.currencyCode == m.currencyCode){
            this.createExchnageRateForm.get("receiving_currency").setValue(mc.code)  ;

          }
        })
       }
     }) 
     
  }
  ngOnInit(){
    
    this.exchangerateService.callGetCountry().subscribe(x => {
        this.countries = x.countryList.map(country => {
          return {
            ...country,
            icon: country.countryCode.toLocaleLowerCase()
          };
        });
    }); 
    this.exchangerateService.callGetCurrency().subscribe(x => {
      this.currencies = x["currencyList"];
    }); 
    this.exchangerateService.callGetWalletOwner(Constants.institute).subscribe(x => {
      this.institutes = x["walletOwnerList"];
    }); 
    this.exchangerateService.callGetWalletOwner(Constants.agent).subscribe(x => {
      this.agents = x["walletOwnerList"];
      this.sendingagent = x["walletOwnerList"];
      this.receivingagent = x["walletOwnerList"];
    }); 
    this.exchangerateService.callGetWalletOwner(Constants.branch).subscribe(x => {
      this.sendingbranch = x["walletOwnerList"];
      this.receivingbranch = x["walletOwnerList"];
    }); 
     
    this.editMode = this.exchangerateService.prepareUserAction(); 
    this.route.queryParams.subscribe((params: Params) => {
     console.log('params' ,params);
            if(params && this.editMode)
            {
                this.exchRateData = params;
                this.code = params.code;
                this.name = params.name
                this.sending_currency= params.sendCurrencyCode;
                this.receiving_currency = params.receiveCurrencyCode;
                this.sending_country = params.sendCountryCode;
                this.receiving_country = params.receiveCountryCode;
                this.remit_agent = params.remitAgentCode;
                this.remit_branch = params.remitBranchCode;
                this.paying_agent = params.payAgentCode;
                this.paying_branch = params.payBranchCode;
                this.paying_institute = params.payInstituteCode;
                this.remit_institute = params.remitInstituteCode;
                

                
                this.exchange_rate= params.value;
                this.status= params.status == "Active" ? "Y" : "N";
               
            } 
              this.createForm();
             
           
        });
    if(!this.editMode){
      this.createExchnageRateForm.get("instituteType").valueChanges.subscribe(x => {
        if(this.createExchnageRateForm.get("instituteType").value){
            this.showinstitute = true;
            this.createExchnageRateForm.get("remit_institute").enable();
            this.createExchnageRateForm.get("paying_institute").enable();
            this.createExchnageRateForm.get("remit_institute").setValue("") ;
            this.createExchnageRateForm.get("paying_institute").setValue("") ;
            this.createExchnageRateForm.get("remit_institute").setValidators([Validators.required]);
            this.createExchnageRateForm.get("paying_institute").setValidators([Validators.required]);
            this.createExchnageRateForm.updateValueAndValidity();
           }  if(!this.createExchnageRateForm.get("instituteType").value){    
            this.showinstitute = false;
            this.createExchnageRateForm.get("remit_institute").setValue("") ;
            this.createExchnageRateForm.get("paying_institute").setValue("") ;
            this.createExchnageRateForm.get("remit_institute").disable();
            this.createExchnageRateForm.get("paying_institute").disable();
          }
          })
          this.createExchnageRateForm.get("agentType").valueChanges.subscribe(x => {
            if(this.createExchnageRateForm.get("agentType").value){
                this.showagent = true;
                this.createExchnageRateForm.get("remit_agent").enable();
                this.createExchnageRateForm.get("paying_agent").enable();
                this.createExchnageRateForm.get("remit_agent").setValue("") ;
                this.createExchnageRateForm.get("paying_agent").setValue("") ;
                this.createExchnageRateForm.get("remit_agent").setValidators([Validators.required]);
                this.createExchnageRateForm.get("paying_agent").setValidators([Validators.required]);
                 this.createExchnageRateForm.updateValueAndValidity();
                 this.createExchnageRateForm.get("remit_agent").valueChanges.subscribe(x => {
                  this.exchangerateService.callGetWalletOwnerOfParent(Constants.agent, this.createExchnageRateForm.get("remit_institute").value).subscribe(x => {
                    this.sendingagent = x["walletOwnerList"];
                  }); 
  
                });
                this.createExchnageRateForm.get("paying_agent").valueChanges.subscribe(x => {
                  this.exchangerateService.callGetWalletOwnerOfParent(Constants.agent, this.createExchnageRateForm.get("paying_institute").value).subscribe(x => {
                    this.receivingagent = x["walletOwnerList"];
                  }); 
  
                });
               }  if(!this.createExchnageRateForm.get("agentType").value){    
                this.showagent = false;
                this.createExchnageRateForm.get("remit_agent").setValue("") ;
                this.createExchnageRateForm.get("paying_agent").setValue("") ;
                this.createExchnageRateForm.get("remit_agent").disable();
                this.createExchnageRateForm.get("paying_agent").disable();
              }
         })
         this.createExchnageRateForm.get("branchType").valueChanges.subscribe(x => {
            if(this.createExchnageRateForm.get("branchType").value ){
              this.showbranch = true;
              this.createExchnageRateForm.get("remit_branch").enable()
              this.createExchnageRateForm.get("paying_branch").enable();
              this.createExchnageRateForm.get("remit_branch").setValue("") ;
              this.createExchnageRateForm.get("paying_branch").setValue("") ;
              this.createExchnageRateForm.get("remit_branch").setValidators([Validators.required]);
              this.createExchnageRateForm.get("paying_branch").setValidators([Validators.required]);
             
              this.createExchnageRateForm.get("remit_agent").valueChanges.subscribe(x => {
                this.exchangerateService.callGetWalletOwnerOfParent(Constants.branch, this.createExchnageRateForm.get("remit_agent").value).subscribe(x => {
                  this.sendingbranch = x["walletOwnerList"];
                }); 

              });
              this.createExchnageRateForm.get("paying_agent").valueChanges.subscribe(x => {
                this.exchangerateService.callGetWalletOwnerOfParent(Constants.branch, this.createExchnageRateForm.get("paying_agent").value).subscribe(x => {
                  this.receivingbranch = x["walletOwnerList"];
                }); 

              });
            }  if(!this.createExchnageRateForm.get("branchType").value ){
              this.showbranch = false;
              this.createExchnageRateForm.get("remit_branch").setValue("") ;
              this.createExchnageRateForm.get("paying_branch").setValue("") ;
              this.createExchnageRateForm.get("remit_branch").disable();
              this.createExchnageRateForm.get("paying_branch").disable();
              this.exchangerateService.callGetWalletOwner(Constants.branch).subscribe(x => {
                this.sendingbranch = x["walletOwnerList"];
                this.receivingbranch = x["walletOwnerList"];
              }); 
            }
         })
         this.createExchnageRateForm.get("remit_institute").valueChanges.subscribe(x => {
          if(this.createExchnageRateForm.get("remit_institute").value && 
          this.createExchnageRateForm.get("agentType").value ){
            this.exchangerateService.callGetWalletOwnerOfParent(Constants.agent, this.createExchnageRateForm.get("remit_institute").value).subscribe(x => {
              this.sendingagent = x["walletOwnerList"];
            }); 

          }
        });
        this.createExchnageRateForm.get("paying_institute").valueChanges.subscribe(x => {
          if(this.createExchnageRateForm.get("paying_institute").value&& 
          this.createExchnageRateForm.get("agentType").value ){
            this.exchangerateService.callGetWalletOwnerOfParent(Constants.agent, this.createExchnageRateForm.get("paying_institute").value).subscribe(x => {
              this.receivingagent = x["walletOwnerList"];
            }); 
          }
        });
        this.createExchnageRateForm.get("remit_agent").valueChanges.subscribe(x => {
          if(this.createExchnageRateForm.get("remit_agent").value && 
          this.createExchnageRateForm.get("branchType").value ){
            this.exchangerateService.callGetWalletOwnerOfParent(Constants.branch, this.createExchnageRateForm.get("remit_agent").value).subscribe(x => {
              this.sendingbranch = x["walletOwnerList"];
            });  

          }
        });
        this.createExchnageRateForm.get("paying_agent").valueChanges.subscribe(x => {
          if(this.createExchnageRateForm.get("paying_agent").value&& 
          this.createExchnageRateForm.get("branchType").value ){
            this.exchangerateService.callGetWalletOwnerOfParent(Constants.branch, this.createExchnageRateForm.get("paying_agent").value).subscribe(x => {
              this.receivingbranch = x["walletOwnerList"];
            });
          }
        });

        }
        
      if(this.editMode){ 
      if(this.remit_agent){
        this.createExchnageRateForm.get("agentType").setValue(true);
        this.showagent = true;
      }  
      if(this.remit_branch){
        this.createExchnageRateForm.get("branchType").setValue(true);
        this.showbranch = true;
      } 
      if(this.remit_institute){
        this.createExchnageRateForm.get("instituteType").setValue(true);
        this.showinstitute = true;
      } 
    }

    

    
  }

   onCancel(){
    const firstPath = window.location.pathname.split('/')[1];
    this.router.navigate( ['/exchangerate'], {relativeTo: this.route} );
   }
   async onSubmit(){
    this.submitted = true;
    console.log("sumbmitted++", this.createExchnageRateForm, this.exchangerateService.approvalRequired);
    this.errorMessage = "";
  
    if(!this.createExchnageRateForm.get("instituteType").value){
      this.createExchnageRateForm.get("remit_institute").setValue("") ;
      this.createExchnageRateForm.get("paying_institute").setValue("") ;
      this.createExchnageRateForm.get("remit_institute").disable();
      this.createExchnageRateForm.get("paying_institute").disable();
    }
    if(!this.createExchnageRateForm.get("agentType").value){
      this.createExchnageRateForm.get("remit_agent").setValue("") ;
      this.createExchnageRateForm.get("paying_agent").setValue("") ;
      this.createExchnageRateForm.get("remit_agent").disable();
      this.createExchnageRateForm.get("paying_agent").disable();
   
    }
    if(!this.createExchnageRateForm.get("branchType").value){
      this.createExchnageRateForm.get("remit_branch").setValue("") ;
      this.createExchnageRateForm.get("paying_branch").setValue("") ;
      this.createExchnageRateForm.get("remit_branch").disable();
      this.createExchnageRateForm.get("paying_branch").disable();
    }
    this.createExchnageRateForm.updateValueAndValidity();
    if(this.createExchnageRateForm.invalid){
      return ;
    }
    this.exchangerateModel.name = this.createExchnageRateForm.value.name;
    this.exchangerateModel.sendCurrencyCode = this.createExchnageRateForm.value.sending_currency;
    this.exchangerateModel.receiveCurrencyCode = this.createExchnageRateForm.value.receiving_currency;
    this.exchangerateModel.sendCountryCode = this.createExchnageRateForm.value.sending_country;
    this.exchangerateModel.receiveCountryCode = this.createExchnageRateForm.value.receiving_country;
    
    this.exchangerateModel.remitAgentCode = this.createExchnageRateForm.value.remit_agent  ;
     
   
    this.exchangerateModel.remitBranchCode = this.createExchnageRateForm.value.remit_branch  ;
   
    
    this.exchangerateModel.payAgentCode = this.createExchnageRateForm. value.paying_agent ;
     
    
    this.exchangerateModel.payBranchCode = this.createExchnageRateForm. value.paying_branch ;
    this.exchangerateModel.remitInstituteCode = this.createExchnageRateForm.value.remit_institute  ;
   
    
    this.exchangerateModel.payInstituteCode = this.createExchnageRateForm. value.paying_institute ;
    if(this.editMode){
      this.exchangerateModel.status = this.createExchnageRateForm.value.status;

    }
    // this.exchangerateModel.remitAgentCode = this.createExchnageRateForm.value.remit_agent == undefined ? "" : this.createExchnageRateForm.value.remit_agent;
    // this.exchangerateModel.remitBranchCode = this.createExchnageRateForm.value.remit_branch  == undefined ? "" : this.createExchnageRateForm.value.remit_branch;
    // this.exchangerateModel.payAgentCode = this.createExchnageRateForm. value.paying_agent == undefined ? "" : this.createExchnageRateForm.value.paying_agent;
    // this.exchangerateModel.payBranchCode = this.createExchnageRateForm. value.paying_branch== undefined ? "" : this.createExchnageRateForm.value.paying_branch;
    this.exchangerateModel.value = this.createExchnageRateForm.value.exchange_rate;
   
    console.log('request :: save ::' + JSON.stringify(this.exchangerateModel));
    
    if(!this.editMode){
      if(this.exchangerateService.approvalRequired){
      let  data = await this.exchangerateService.createExchangeRate(this.exchangerateModel);
      console.log('res ',data);
      if (data == null) {
        //this.errorMessage = "There is some error, Please try after some time.";
        this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
          this.errorMessage=data;
        });
      }
      else if(data["resultCode"] == "0"){
        this.exchangerateService.makeEntryToApproval(data.exchangeRate).subscribe(approvalData => {
          console.log('approvalData',approvalData)
          if (approvalData === null) {
           // this.errorMessage = "There is some error, Please try after some time.";
           this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
            this.errorMessage=data;
          });
          } else {
            if (approvalData["resultCode"] == "0") {
              this.errorMessage = undefined;
              this.router.navigate(['/exchangerate'], {relativeTo: this.route, queryParams: { status: 'added' } });
            } else {
              this.errorMessage =approvalData["resultDescription"];
            }
          }
        });     
      }else{
         this.errorMessage = data["resultDescription"];
      }
    } else{
    //No apporval required
       let request ={
       ...this.exchangerateModel,
       status:ApprovalConstants.status.code.ACTIVE,
       state: ApprovalConstants.state.code.APPROVED
       }
        let  data = await this.exchangerateService.createExchangeRate(request);
        console.log('res ',data);
        if(data["resultCode"] == "0"){
          this.errorMessage = undefined;
          this.router.navigate(['/exchangerate'], {relativeTo: this.route, queryParams: { status: 'added' } });
        }else{
          this.errorMessage =data["resultDescription"];
        }
    }
    }else{
      if(this.exchangerateService.approvalRequired){
      const updatedInfo = this.exchangerateService.preparedUpdatedDataForApproval(this.exchRateData, this.exchangerateModel);
      console.log('updatedInfo',updatedInfo);
       
      let  data = await this.exchangerateService.modifyExchangeRate(this.prepareDataForUpdateStatus(this.exchRateData), this.code);
      console.log('res ',data);
      if (data == null) {
        //this.errorMessage = "There is some error, Please try after some time.";
        this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
          this.errorMessage=data;
        });
      }
      else if(data["resultCode"] == "0"){
        this.exchangerateService.makeEntryToApproval(this.exchRateData,  updatedInfo).subscribe(approvalData => {
          console.log('--approvalData--', approvalData);
          if (approvalData === null) {
            //this.errorMessage = "There is some error, Please try after some time.";
            this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
              this.errorMessage=data;
            });
          } else {
            if (approvalData.resultCode === '0') {

              this.errorMessage = undefined;
              this.router.navigate(['/exchangerate'], {relativeTo: this.route, queryParams: { status: 'updated' } });
            } else {
              this.errorMessage = approvalData.resultDescription;
            }
          }
        });
     
      }else{
         this.errorMessage = data["resultDescription"];
      }
    } else{
        //No apporval required
        let request ={
          ...this.exchangerateModel,
          // status:ApprovalConstants.status.code.ACTIVE,
          state: ApprovalConstants.state.code.APPROVED
        }
        let  data = await this.exchangerateService.modifyExchangeRate(request, this.code);
        console.log('res ',data);
        if(data["resultCode"] == "0"){
          this.errorMessage = undefined;
          this.router.navigate(['/exchangerate'], {relativeTo: this.route, queryParams: { status: 'updated' } });
        }else{
          this.errorMessage =data["resultDescription"];
        }
    }
    }
 
  }

  get f(){
     return this.createExchnageRateForm.controls;
  }

  createForm(){
 
    this.createExchnageRateForm = this.formBuilder.group({
      name: [this.name, [Validators.required,Validators.pattern('^[a-zA-Z0-9-\._ ]+$'),Validators.pattern(/^[^ ][\w\W ]*[^ ]/),Validators.minLength(5)]],
      sending_currency: [this.sending_currency],
      receiving_currency : [this.receiving_currency],
      sending_country: [this.sending_country, [Validators.required]],
      receiving_country : [this.receiving_country, [Validators.required]],
      remit_agent :[  this.remit_agent  ],
      remit_branch:[  this.remit_branch  ],
      paying_agent:[ this.paying_agent ],
      paying_branch:[ this.paying_branch  ],
      remit_institute: [this.remit_institute],
      paying_institute: [this.paying_institute],

      status:[ this.status  ],
      exchange_rate : [this.exchange_rate,[Validators.required,Validators.pattern('^[-+]?[0-9]+\.[0-9]+[1-9]+$'),Validators.pattern(/^[^ ][\w\W ]*[^ ]/),Validators.minLength(5)]],
      branchType : [],
      agentType:[],
      instituteType:[]
      // bothType:[]
    },
    {
      validator: CompareMatch("sending_country", "receiving_country","remit_agent", "paying_agent","remit_branch", "paying_branch","remit_institute", "paying_institute",
      "sending_currency", "receiving_currency")
    }
    );   
  }

  matchCountry(){
    if(this.createExchnageRateForm.get("sending_country").value === this.createExchnageRateForm.get("receiving_country").value)
    {
      console.log("match")
       return true; 
    }

  }
  
  prepareDataForUpdateStatus(data){
    return {
      ...data,
      status : ApprovalConstants.status.code.INACTIVE,
      state  : ApprovalConstants.status.code.UPDATED
    }
  
  }
  
  // checkApplicableCountry1(event: any) {
   
  //   this.countriesgroup1 =  this.countries.map(a => Object.assign({}, a));
  //  if(event.target.value != ''){
  //    this.countriesgroup1.forEach(element => {
  //      if(event.target.value === element.code) {
  //        const index: number = this.countriesgroup1.indexOf(element);
  //        element = { ...element, disabled: true };
  //        this.countriesgroup1.splice(index, 1, element);
  //      }
  //    });
  //  }
  //  }
   
  //  checkApplicableCountry2(event: any) {
  //   this.countriesgroup2 =  this.countries.map(a => Object.assign({}, a));
  //   if(event.target.value != ''){
  //     this.countriesgroup2.forEach(element => {
  //       if(event.target.value === element.code) {
  //         const index: number = this.countriesgroup2.indexOf(element);
  //         element = { ...element, disabled: true };
  //         this.countriesgroup2.splice(index, 1, element);
  //       }
  //     });
  //   }
  //   }

  
}