
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import{ CreateTemplateService} from '../create-template.service'
import { Router, ActivatedRoute } from '@angular/router';
import{ TemplatesService } from '../../templates.service'
@Component({
  selector: 'app-credit-limit-template',
  templateUrl: './credit-limit-template.component.html',
  styleUrls: ['./credit-limit-template.component.css']
})
export class CreditLimitTemplateComponent implements OnInit {

  constructor(private tempService:TemplatesService,private createTemplateService:CreateTemplateService, private route: ActivatedRoute,private router:Router) {
  
   }

  errorMessage : '';
  public form: FormGroup;
  public updateform: FormGroup;
  public loadContent: boolean = false;
  
  public data =[];
  public settings = {};

  public updatedata =[];
  public updatesettings = {};
  public selectedItems = [];teplateDetails;
  transTemplateCategories;tempcode;tempname;templatestate;transtemplatelist;selectedTransTemplates=[];
  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('data'))
      this.data=  JSON.parse(this.route.snapshot.queryParamMap.get('data')); 
      this.updatedata=this.data;
      console.log(this.data)

      console.log(this.route.snapshot.queryParamMap.get('temp'))
      if (this.route.snapshot.queryParamMap.get('temp'))
      var tmp=  JSON.parse(this.route.snapshot.queryParamMap.get('temp')); 
      console.log(tmp)
      this.tempcode=tmp.code;
      this.tempname=tmp.name;
      this.templatestate=tmp.state;

      console.log(tmp.template);
      this.teplateDetails=tmp.template;
      if(tmp.transtemplatelist){
        this.transtemplatelist=tmp.transtemplatelist.transTemplateList
        for(var j=0;j<this.transtemplatelist.length;j++){
          this.selectedTransTemplates.push({ item_id: this.transtemplatelist[j].transTypeCode, item_text:this.transtemplatelist[j].transTypeName })
        }
      }
    
      console.log(this.tempcode,this.tempname,this.transtemplatelist)

     
      // if (this.route.snapshot.queryParamMap.get('temp'))
      // this.tempname=  JSON.parse(this.route.snapshot.queryParamMap.get('tempname')); 
      // console.log(this.tempname)
    // this.createTemplateService.getTransTemplateCategoryMasters().subscribe(result=>{
    //   this.transTemplateCategories=result;

    //   this.transTemplateCategories=this.transTemplateCategories.transTypeList;
    //   console.log(this.transTemplateCategories);
    //   for(var i=0;i<this.transTemplateCategories.length;i++){
    //     var obj={item_id:this.transTemplateCategories[i].code , item_text:this.transTemplateCategories[i].name}
   
    //     this.data.push(obj);
    //   }
      
      
 
        
 
   
      
    // })
    this.settings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',    
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,     
      searchPlaceholderText: 'Transaction template Category',
      noDataAvailablePlaceholderText: 'NA',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };

    this.updatesettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',    
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,     
      searchPlaceholderText: 'Transaction template Category',
      noDataAvailablePlaceholderText: 'NA',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };
    // this.data = [
    //   { item_id: 1, item_text: 'Hanoi' },
    //   { item_id: 2, item_text: 'Lang Son' },
    //   { item_id: 3, item_text: 'Vung Tau' },
    //   { item_id: 4, item_text: 'Hue' },
    //   { item_id: 5, item_text: 'Cu Chi' }
    // ];
    // setting and support i18n
    
    this.setForm();
    this.updateForm();
  }

  public setForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required)
    });
    this.loadContent = true;
  }
  get f() { return this.form.controls; }


  public updateForm() {
    this.updateform = new FormGroup({
      name: new FormControl(this.selectedTransTemplates, Validators.required)
    });
    this.loadContent = true;
  }
  get updatef() { return this.updateform.controls; }

  public save() {

    var selected=this.form.value;
    selected=selected.name
    
    var transTemplateCodesSelected=[];
    for(var i=0;i<selected.length;i++){
      transTemplateCodesSelected.push(selected[i].item_id)
  
    }

    if(this.form.valid){
      this.createTemplateService.createTransTemplate(transTemplateCodesSelected,this.tempcode).subscribe(result=>{
        console.log(result);
        
        this.router.navigate(['../'], { relativeTo: this.route  , queryParams: { status: 'transTemplateadded' }});
      })

      this.createTemplateService.TransTemplateApproval(this.tempcode,this.tempname).subscribe(result=>{
        console.log(result);

      })




    }
   
   
    
  }


  public update() {

    var selected=this.updateform.value;
    selected=selected.name
    
    var transTemplateCodesSelected=[];
    for(var i=0;i<selected.length;i++){
      transTemplateCodesSelected.push(selected[i].item_id)
  
    }
console.log(this.updateForm)
    if(this.updateform.valid){
      // this.createTemplateService.updateTransTemplate(transTemplateCodesSelected,this.tempcode).subscribe(result=>{
      //   console.log(result);
      //   this.router.navigate(['../'], { relativeTo: this.route  , queryParams: { status: 'transTemplateupdated' }});
      // })

      this.createTemplateService.updateTransTemplateApproval(this.tempcode,this.tempname,transTemplateCodesSelected,this.transtemplatelist).subscribe(result=>{
        console.log(result);
        this.router.navigate(['../'], { relativeTo: this.route  , queryParams: { status: 'transTemplateupdated' }});

      })

    }
   
   
    
  }

  navigateBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
