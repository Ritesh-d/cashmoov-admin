import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CreateTemplateService } from '../create-template/create-template.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AddTemplateService } from './add-template.service';
import { result } from 'lodash';
import{TemplatesService} from '../templates.service'
import { ApprovalConstants } from '../../approval/approval.constants';
import { ApprovalService } from '../../approval/approval.service';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.css']
})
export class AddTemplateComponent implements OnInit {

  templateForm: FormGroup;
  updatetemplateForm: FormGroup;
  templateCategories: any[];
  walletCategories: any[];
  walletCategoryResult;
  errorMessage: string;
  successMessages: string;
  tempName : string='';
  tempCode : string;

  walletCategory : string='';
  status: string;
  save = false;
  templateDetails;templateCase='create';transtemplatelist;category;
  showforfee: boolean;
  constructor(private approvalService : ApprovalService,
    private createTemplateService: CreateTemplateService,
    private tmpservice:TemplatesService,
    private addTemplateService: AddTemplateService,
    private translate: TranslatelanguageService,
    private router: Router,
    private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      console.log('params', params);
      if(params){ 
      this.templateCase = params.templateCase;
      this.tempCode = params.code;
      this.tempName = params.name;
      this.walletCategory = params.walletOwnerCategoryCode;
      this.category = params.templateCategoryCode;
      this.status = this.approvalService.getDataApprovalStatus(params.status);
      this.updatetemplateForm = new FormGroup({
        tempName: new FormControl(this.tempName, [Validators.required]),
        category: new FormControl(  this.category , [Validators.required]),
        walletCategory: new FormControl(this.walletCategory, [Validators.required]),
        status: new FormControl(this.status, [Validators.required]),

        default:new FormControl(false)
      });
      } 
     
    });
    this.addTemplateService.prepareMasters().subscribe(() => {
       this.templateCategories = this.addTemplateService.templateCategories;
       if( this.templateCategories &&  this.templateCategories.length> 0){
         this.templateCategories = this.templateCategories.filter(m=>{
           return  m.status == ApprovalConstants.status.text.ACTIVE;
         })
       }
      // this.templateCategories = [ {code: '', type: 'select category' }, ...this.templateCategories ];

    });
  console.log('templateCategories' ,this.templateCategories);
    this.addTemplateService.getWalletCategoryMasters().subscribe(result=>{
      this.walletCategoryResult = result;
      this.walletCategories = this.walletCategoryResult.categoryList;
      this.walletCategories = this.walletCategories.filter(m=>{
        return m.templateAllowed
      })

    })
    this.templateForm = new FormGroup({
      tempName: new FormControl(this.tempName, [Validators.required,Validators.pattern(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-0-9, ])*$/)]),
      category: new FormControl(  this.category , [Validators.required]),
      walletCategory: new FormControl(this.walletCategory, [Validators.required]),
      default:new FormControl(false)
    });


    if (this.route.snapshot.queryParamMap.get('temp'))
      var tmp=  JSON.parse(this.route.snapshot.queryParamMap.get('temp')); 
      console.log(tmp);

if(tmp && tmp.transtemplatelist)
{this.transtemplatelist=tmp.transtemplatelist};
      if(tmp && tmp.template){
        this.templateCase='update';
        this.templateDetails=tmp.template;
      }


      if(this.templateDetails){
        var status=tmp.template.status;
  var st;
        if(status=='Active'){
          st='Y';
  
        }
        else
        st='N';
        var category={code: this.templateDetails.templateCategoryCode,type: this.templateDetails.templateCategoryName}
        var walletCategory={code:this.templateDetails.walletOwnerCategoryCode,name:this.templateDetails.walletOwnerCategoryName}
      this.category=category;}
  if(this.templateDetails)
      this.updatetemplateForm = new FormGroup({
        tempName: new FormControl(this.templateDetails.name, [Validators.required]),
        category: new FormControl(category.code, [Validators.required]),
        status: new FormControl(st, [Validators.required]),
        walletCategory: new FormControl(walletCategory.code, [Validators.required]),
        default:new FormControl(this.templateDetails.isDefault,)
      });
      console.log(this.updatetemplateForm)
  }

  /**
   * submit to add/create template
   */
  transTemplateCategories;data=[];
  submitTemplate() {
    console.log(this.templateForm)
    this.save=true;
    this.createTemplateService.templateName = this.templateForm.value.tempName;
    this.createTemplateService.templateCategoryId = this.templateForm.value.category;
    console.log('this.templateForm.value.category' + this.templateForm.value.category);
    this.createTemplateService.templateCategory = this.addTemplateService.getTemplateCategory(this.templateForm.value.category);
    // hit service for create template with template name and category; it returns me the created templateId
    if(this.createTemplateService.templateCategoryId=='100002' || this.createTemplateService.templateCategoryId=='100009')
    this.templateForm.value.walletCategory='100002';
    
    if(this.templateForm.valid)
    this.addTemplateService.addTemplate(this.templateForm.value).subscribe(response => {
      console.log('response' + JSON.stringify(response));
      if (response.resultCode === '0') {
        this.errorMessage = undefined;
        this.createTemplateService.newlyCreatedTemplateCode = response.templateCode;
        // if(response.template.templateCategoryName=='Transaction Profile' || response.template.templateCategoryCode== '100001'){
         

            this.createTemplateService.getTransTemplateCategoryMasters().subscribe(result=>{
              this.transTemplateCategories=result;
        
              this.transTemplateCategories=this.transTemplateCategories.transTypeList;
              console.log('transTypeList ' , this.transTemplateCategories);
              for(var i=0;i<this.transTemplateCategories.length;i++){
                var obj={item_id:this.transTemplateCategories[i].code , item_text:this.transTemplateCategories[i].name}
                // this.data[i]['item_id']=this.transTemplateCategories.transTypeList[i].code;
                // this.data[i]['item_text']=this.transTemplateCategories.transTypeList[i].name;
                this.data.push(obj);
              }
        

         console.log(this.templateForm.value.category);
              var tmp={code:response.template.code,name:response.template.name,state:response.template.state,walletOwnerCategoryName:response.template.walletOwnerCategoryName,walletOwnerCategoryCode:response.template.walletOwnerCategoryCode,templateCategoryName:response.template.templateCategoryName,template:response.template};
              if(this.templateForm.value.category=='100001'){
              this.router.navigate(['../createTransactionTemplate'], { relativeTo: this.route, skipLocationChange: true,queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } });    
              }
              else{

               if (this.templateForm.value.category=='100000'){
                this.router.navigate(['../createServiceTemplate'], { relativeTo: this.route,skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } });    
              }
              if (this.templateForm.value.category=='100002'){

                this.router.navigate(['../createFeeTemplate'], { relativeTo: this.route,skipLocationChange: true, queryParams: {  data: JSON.stringify(this.data), temp:JSON.stringify(tmp) ,editmode: 'Add'}}); 
              }
              if (this.templateForm.value.category=='100009'){

                this.router.navigate(['../createFeeCommisionTemplate'], { relativeTo: this.route, skipLocationChange: true,queryParams: {  data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } }); 
              }
              if (this.templateForm.value.category=='100009'){

                this.router.navigate(['../createFeeCommisionTemplate'], { relativeTo: this.route, skipLocationChange: true,queryParams: {  data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } }); 
              }
              if (this.templateForm.value.category=='100008'){
                       console.log('tranLimitTemplate', this.templateForm.value.category)
                this.router.navigate(['../tranLimitTemplate'], { relativeTo: this.route, skipLocationChange: true,queryParams: {  data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } }); 
              }
              if (this.templateForm.value.category=='100010'){

                this.router.navigate(['../createIncentiveTemplate'], { relativeTo: this.route,skipLocationChange: true, queryParams: {  data: JSON.stringify(this.data), temp:JSON.stringify(tmp) ,editmode: 'Add'}}); 
              }
        //       if(this.templateForm.value.category!='100001' && this.templateForm.value.category!='100000' &&  this.templateForm.value.category!='100002' &&  this.templateForm.value.category!='100009')
        // this.router.navigate(['../'], { relativeTo: this.route  , queryParams: { status: 'added' }});  
      }            
            })
         
     
         
   
        // }
        // else
        // this.router.navigate(['../'], { relativeTo: this.route  , queryParams: { status: 'added' }});
      } else {
        this.errorMessage = response.resultDescription;
      }
    });
    // this.router.navigate(['../create'], { relativeTo: this.route });
    else
    //this.errorMessage = 'Please Enter all required values';
    this.translate.languageText('MASTER.pleaseEnterallrequiredvalues', data=> {
      this.errorMessage =data;
      });
  }
 
  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  // updateTemplate(){
  //   console.log(this.templateForm)
  //   this.createTemplateService.templateName = this.templateForm.value.tempName;
  //   this.createTemplateService.templateCategoryId = this.templateForm.value.category;
  //   console.log('this.templateForm.value.category' + this.templateForm.value.category);
  //   this.createTemplateService.templateCategory = this.addTemplateService.getTemplateCategory(this.templateForm.value.category);
   
    
  //   if(this.templateForm.valid)
  //   this.addTemplateService.updateTemplate(this.updatetemplateForm.value, this.tempCode).subscribe(response => {
  //     console.log('response' + JSON.stringify(response));
  //     if (response["resultCode"] === '0') {
  //       this.errorMessage = undefined;
  //       this.successMessages = response["resultDescription"];
  //     } else {
  //       this.errorMessage =  response["resultDescription"];
  //     }
  //   });
   
  //   else
  //   this.errorMessage = 'Please Enter all required values';
  // }
  onChangeTemplate($event,template: FormGroup){

    let templateName = $event.target.options[$event.target.options.selectedIndex].value;
    if(templateName=='100002'|| templateName=='100009')
     this.showforfee=true;
     else
     this.showforfee=false;
    
    // template.controls["templateNameOld"].setValue(templateName);
    

  }

  updateTemplate() {
    
    console.log(this.updatetemplateForm)
    this.createTemplateService.templateName = this.templateForm.value.tempName;
    this.createTemplateService.templateCategoryId = this.templateForm.value.category;
    this.createTemplateService.templateCategory = this.addTemplateService.getTemplateCategory(this.templateForm.value.category);
    // hit service for create template with template name and category; it returns me the created templateId
    let code;
    if(this.templateDetails){
       code = this.templateDetails.code;
    }else{
     code = this.tempCode;
    }
    if(this.updatetemplateForm.valid) 
     
    this.addTemplateService.updateTemplateApproval(this.updatetemplateForm.value,code,this.templateDetails).subscribe(res => {
      // this.addTemplateService.updateTemplate(this.updatetemplateForm.value,this.tempCode).subscribe(res => {

      var response:any=res;
      if (response.resultCode === '0') {
        this.errorMessage = undefined;
        this.createTemplateService.newlyCreatedTemplateCode = response.templateCode;
        if(response.template && (response.template.templateCategoryName=='Transaction' || response.template.templateCategoryCode== '100001')){
         

            this.createTemplateService.getTransTemplateCategoryMasters().subscribe(result=>{
              this.transTemplateCategories=result;
        
              this.transTemplateCategories=this.transTemplateCategories.transTypeList; 
              console.log('transTypeList' , this.transTemplateCategories);
              for(var i=0;i<this.transTemplateCategories.length;i++){
                var obj={item_id:this.transTemplateCategories[i].code , item_text:this.transTemplateCategories[i].name}
                // this.data[i]['item_id']=this.transTemplateCategories.transTypeList[i].code;
                // this.data[i]['item_text']=this.transTemplateCategories.transTypeList[i].name;
                this.data.push(obj);
              }
        
              var tmp={code:this.templateDetails.code,name:this.templateDetails.name,state:this.templateDetails.state,transtemplatelist:this.transtemplatelist,template:this.templateDetails};
              this.router.navigate(['../createTransactionTemplate'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } });
              // var tmp={code:response.template.code,name:response.template.name,state:response.template.state};
              // this.router.navigate(['../createTransactionTemplate'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } });    
         
           
              
            })

     
         
   
        }
        else
        this.router.navigate(['../'], { relativeTo: this.route  , queryParams: { status: 'updated' }});
      } else {
        this.errorMessage = response.resultDescription;
      }
    });
    // this.router.navigate(['../create'], { relativeTo: this.route });
    else
    this.errorMessage = 'Please Enter all required values';
  }
 

  
}
