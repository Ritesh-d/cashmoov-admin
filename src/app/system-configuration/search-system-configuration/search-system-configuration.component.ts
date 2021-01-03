import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { API_URLs } from '../../shared/models/constants';
import { MasterDataService } from '../../shared/services/masterdataservice.service';
import { ErrorMessageProvider } from '../../shared/services/errormessageprovider.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxValidatorService } from '../../shared/services/validator.service';
import { formatDate } from '@angular/common';
import { SystemConfigurationService } from '../service/system-configuration.service';
import { SystemConfigurationRequestModel } from '../model/system-configurationrequest.model';
import { SystemConfigurationModel, ChangedList } from '../model/system-configuration.model';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

declare let $: any;



@Component({
  selector: 'app-search-system-configuration',
  templateUrl: './search-system-configuration.component.html',
  styleUrls: ['./search-system-configuration.component.css']
})
export class SearchSystemConfigurationComponent implements OnInit {

  languagecode: string;
  subLevelId: string;
  systemConfigFormGroup: FormGroup;
  errorMessage: string;
  successMessage: string;
  submitted: boolean = false;
  // systemConfigurationList:Array<any>=[];
  systemConfigurationList: any[];
  formLoadFlag: boolean = false;
  rows: FormArray;
  addForm: FormGroup;
  SNFlag: boolean = false;
  selectcheckboxflag: number;
  display_allowed: any;
  showLabel: boolean = false;
  textboxValue: any;
  labelDivValue: any;
  defalvalue: any;
  checkboxshow: boolean = false;
  editSystemConfigList: any;
  selected: Array<any> = []
  minmassageflag: number;
  maxmassageflag: number;
  maxsizeflag: number;
  toggleBool: boolean=true;
  checkedInfo: any;
  closeResult: string;
  changedList:ChangedList[]=[]// =new ChangedList();
 

  systemConfigurationModel: SystemConfigurationModel = new SystemConfigurationModel();
  systemConfigurationRequestModel: SystemConfigurationRequestModel = new SystemConfigurationRequestModel();



  constructor(private apiurls: API_URLs, private masterdataservice: MasterDataService,
     private errorMessageProvider: ErrorMessageProvider,
    private formBuilder: FormBuilder, private router: Router,
     private activatedrouter: ActivatedRoute,
    private translateService: TranslateService,
     private comboBoxValidator: ComboBoxValidatorService,
     private translate: TranslatelanguageService,
    private systemconfigureService: SystemConfigurationService) { }



  ngOnInit() {
    this.activatedrouter.queryParams.subscribe(params => {
      this.languagecode = params.language;
      this.subLevelId = params.sublevelid;
      this.translateService.use(this.languagecode);
    });

    this.createsystemConfigFormGroup();
    this.callAPIOnLoad();

  }

  async callAPIOnLoad() {
    this.systemConfigurationModel.userId = sessionStorage.getItem("userId");
    this.systemConfigurationModel.status = "-1";
    this.systemConfigurationModel.channel = "IWP";
    //this.systemConfigurationModel.comments = "Search System Configuration Request";
    this.translate.languageText('TAXCONFIGURATION.searchSystemConfigurationRequest', data=> {
      this.systemConfigurationModel.comments =data;
      });
      
    this.systemConfigurationModel.requestcts = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss.SSS", "en");
    this.systemConfigurationRequestModel.action = "SEARCHSYSTEMCONFIG";
    this.systemConfigurationRequestModel.request = this.systemConfigurationModel;


    this.systemConfigurationList = await this.systemconfigureService.callToSystemConfigurationApi(this.apiurls.URL_SEARCH_SYSTEM_CONFIG, this.systemConfigurationRequestModel);
    console.log("systemConfigurationList... " + JSON.stringify(this.systemConfigurationList));
    if (this.systemConfigurationList == null) {
      this.translateService.get('common_error_message').subscribe((text: string) => { this.errorMessage = text; });
      return;
    } else if (this.systemConfigurationList["response"]["resultCode"] == this.apiurls.RESULT_CODE) {
      this.systemConfigurationList = this.systemConfigurationList["response"]["systemConfigurationList"];
      console.log("Before filtering: " + JSON.stringify(this.systemConfigurationList))
      this.systemConfigurationList = this.systemConfigurationList.filter(entry => {
        if (entry.displayAllowed == "1") {
          if (entry.modifiedAllowed == "1") {
            entry.modifiedAllowed = true;
         //   entry.checkboxshow = true;
            this.defalvalue = entry.defaultValue
          } else {
            entry.modifiedAllowed = false;
          //  entry.checkboxshow = false;
          }
          return true;
        }
        return false;
      });
      console.log("After filtering: " + JSON.stringify(this.systemConfigurationList))

    } else {
      this.errorMessage = this.errorMessageProvider.getErrorMessage(this.systemConfigurationList["response"]["resultCode"], this.systemConfigurationList["response"]["resultCodeDesc"]);
      return;
    }
    this.formLoadFlag = true;
  }


  createsystemConfigFormGroup() {
    this.systemConfigFormGroup = this.formBuilder.group({
      defaultValue: [''],
    });
  }


  submitForm(event: any) {
    this.submitted = true;
    this.errorMessage = "";
    this.successMessage = "";
    console.log(this.changedList);
    if(this.changedList.length!=0){
      for(var i=0;i<this.changedList.length;i++){
        if (Number(this.changedList[i].defaultValue) ==0) {
         alert("Please verify Default Value.")
          //this.errorMessage+=this.changedList[i].configurationCode+"\n"
          return;
         }
         if (Number(this.changedList[i].defaultValue) < Number(this.changedList[i].minValue) && Number(this.changedList[i].defaultValue)!= Number(this.changedList[i].minValue)) {
          //this.errorMessage+=this.changedList[i].configurationCode+"\n"
          alert("Please verify Default Value.")
           return;
         }
        
         if (Number(this.changedList[i].defaultValue) >  Number(this.changedList[i].maxValue) && Number(this.changedList[i].defaultValue) != Number(this.changedList[i].maxValue)) {
          //this.errorMessage+=this.changedList[i].configurationCode+"\n"
          alert("Please verify Default Value.")

           return;
         }
         if (Number(this.changedList[i].defaultValue.length) > Number(this.changedList[i].maxSize)) {
         // this.errorMessage+=this.changedList[i].configurationCode+"\n"
          alert("Please verify Default Value.")

           return;
         }
      }
      // if(this.errorMessage.length!=0){
      //   alert("Please verify Default Value. \n"+this.errorMessage+"\n")
      //   return;
      // }
    }
    if (this.systemConfigFormGroup.invalid) {
      return;
    }
   
    this.systemConfigurationModel.userId = sessionStorage.getItem("userId");
    this.systemConfigurationModel.requestcts = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss.SSS", "en");
    //this.systemConfigurationModel.comments = "Edit System Configuration Request";
    this.translate.languageText('TAXCONFIGURATION.editSystemConfigurationRequest', data=> {
      this.systemConfigurationModel.comments =data;
      });
    this.systemConfigurationModel.channel = "IWP";
    this.systemConfigurationModel.editSystemConfigList = this.getListArrayData();
   this.systemConfigurationRequestModel.action = "EDITSYSTEMCONFIG";
    this.systemConfigurationRequestModel.request = this.systemConfigurationModel;

    console.log("Request for Edit System Configuration Request API... " + JSON.stringify(this.systemConfigurationRequestModel));

    this.systemconfigureService.callToSystemConfigurationApi(this.apiurls.URL_UPDATE_SYSTEM_CONFIG, this.systemConfigurationRequestModel)
      .then(
        data => {
          console.log("Response for Edit Edit System Configuration Request API... : " + JSON.stringify(data));
          if (data == null) {
            this.translateService.get('common_error_message').subscribe((text: string) => { this.errorMessage = text; });
          } else if (data["response"]["resultCode"] == this.apiurls.RESULT_CODE) {
            this.successMessage = data["response"]["resultCodeDesc"];

            this.createsystemConfigFormGroup();
            this.callAPIOnLoad();
            this.selected.length = 0;
          } else {
            this.errorMessage = "Failed : Error Code : " + data["response"]["resultCode"] + " : Error Desc : " + data["response"]["resultCodeDesc"];
          }
          this.submitted = false;
        }
      );
  }


  onCheck() {
    this.selectcheckboxflag = 1;
  }
  get f() { return this.systemConfigFormGroup.controls; }

  removeMessages() {
    this.successMessage = "";
    this.errorMessage = "";
  }

  checked(sysconf) {
    console.log("checked");
    this.selectcheckboxflag = 1;
    if (this.selected.indexOf(sysconf) != -1) {
      return;
    }
  }

  updateValueInList(event: any, index: number, sysconf): void {
    this.systemConfigurationList[index]["defaultValue"] = event.target.value;
    console.log("updating value" + JSON.stringify(this.systemConfigurationList[index]));
  }

  // when checkbox change, add/remove the item from the array
  onChange(event: any, sysconf:any) {
   // this.checkedInfo = isChecked;
    var i=0;
    // this.ChangedList[i].configurationCode=sysconf.configurationCode;
    // this.ChangedList[i].minValue=sysconf.minValue;
    // this.ChangedList[i].maxValue=sysconf.maxValue;
    // this.ChangedList[i].defaultValue=sysconf.defaultValue;
var flag=0;
    if(this.changedList.length!=0){
      for(var i=0;i<this.changedList.length;i++){
        if(this.changedList[i].configurationCode==sysconf.configurationCode){
          flag=1
          break
        }else{
          flag=0;
        }
      }
      if(flag){
        this.changedList.find(item => item.configurationCode == sysconf.configurationCode).configurationCode =  sysconf.configurationCode;
        this.changedList.find(item => item.configurationCode == sysconf.configurationCode).defaultValue =  event.target.value
        this.changedList.find(item => item.configurationCode == sysconf.configurationCode).maxsize =  sysconf.maxSize;
        this.changedList.find(item => item.configurationCode == sysconf.configurationCode).maxvalue =  sysconf.maxValue;
        this.changedList.find(item => item.configurationCode == sysconf.configurationCode).minvalue =  sysconf.minValue; 
      }else{
        this.changedList.push(sysconf);

      }
      


    }else{
      this.changedList.push(sysconf);

    }

    this.errorMessage = "";
    if (event.target.value) {
      if (event.target.value ==0) {
       alert("Default Value can not be zero")
        //this.translateService.get('Default Value can not be zero').subscribe((text: string) => { this.errorMessage = text; });
       return;
      }
      if (event.target.value < Number(sysconf.minValue) && event.target.value != Number(sysconf.minValue)) {
        alert("Default Value can not be less than Min Value")
        //this.translateService.get('Default Value can not be less than Min Value').subscribe((text: string) => { this.errorMessage = text; });
        return;
      }
     
      if (event.target.value >  Number(sysconf.maxValue) && event.target.value != Number(sysconf.maxValue)) {
       alert("Default Value can not be greater than Max Value")
      //this.translateService.get('Default Value can not be greater than Max Value').subscribe((text: string) => { this.errorMessage = text; });
        return;
      }
      if (event.target.value.length > Number(sysconf.maxSize)) {
        alert("Default Value length can not be greater than maxSize length")
        //this.translateService.get('Default Value length can not be greater than maxSize length').subscribe((text: string) => { this.errorMessage = text; });
        return;
      }
     
      // var defaultValue = this.systemConfigFormGroup.get('defaultValue').value;
      // console.log("defaultValue : " + defaultValue);

      // this.selected.push(sysconf);
      // console.log("checked" + JSON.stringify(this.selected));
    } else {
      // this.selected.splice(this.selected.indexOf(sysconf), 1)
    }
  }

  checkedEvnt(event:any) {
   
    event.target.checked = false;
   

//  this.checkboxes.forEach((element) => {
//    element.nativeElement.checked = false;
//  });

  }

  // numberOnly(event:any): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }

  getListArrayData() {
    const selecteddata = JSON.parse(JSON.stringify(this.systemConfigurationList));
    selecteddata.forEach(data => {
      delete data["allowedValue"];
      delete data["configurationCode"];
      delete data["description"];
      delete data["maxSize"];
      delete data["lastModifiedOn"];
      delete data["displayAllowed"];
      delete data["minValue"];
      delete data["maxValue"];
      delete data["modifiedAllowed"];
      delete data["checkboxshow"];
      delete data["configurationName"];
      delete data["valueType"];
      delete data["createdOn"];
      delete data["createdBy"];
      delete data["lastModifiedBy"];

    });
    console.log("ListArrayData==>" + JSON.stringify(selecteddata));
    return selecteddata;
  }
  unCheckThis(event:any,index:number):void{
    console.log("inside unCheckThis()")
  //  this.checkboxes["_results"][index]["nativeElement"]["checked"] = false;
  }
 


}

