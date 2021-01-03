import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
 
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TaxConfigurationService } from './taxconfiguration.service';
import { TranslatelanguageService } from '../shared/services/translatelanguage.service';

@Component({
  selector: 'app-taxconfiguration',
  templateUrl: './taxconfiguration.component.html',
  styleUrls: ['./taxconfiguration.component.css']
})

export class TaxConfigurationComponent implements OnInit {
 
 
  displaytable: Boolean = false;
  successMessage: string='';
 
  msg: string = '';
  offset: number = 0;
  limit: number;
  taxConfigurationList :any
  setPermission: any;
  getcurrentLang:any;

  constructor( private taxConfigurationService: TaxConfigurationService,
     private modalService: NgbModal,
    private activatedrouter: ActivatedRoute,
     private formBuilder: FormBuilder,
     private translate : TranslatelanguageService,
    private router: Router) {

      this.getcurrentLang=this.translate.getcurrentLang();
  }

  ngOnInit() {
    this.setPermission = this.taxConfigurationService.setPermission;
    this.showMessage();
    this.callOnLoad();
   
  }
  callOnLoad(){
    this.taxConfigurationService.getAll('all').subscribe(x => {
      
      this.taxConfigurationList = x.taxConfigurationList;
      this.displaytable = true;
    },error => console.log('err',error)); 
   }
 
  private showMessage() {
    if (this.activatedrouter.snapshot.queryParamMap.get('status')) {
      if (this.activatedrouter.snapshot.queryParamMap.get('status').toString() === 'added') {
        //this.successMessage = 'Tax Configuration Added successfully ';
        this.translate.languageText('TAXCONFIGURATION.taxConfigurationAddedsuccessfully', data=> {
          this.successMessage =data;
          });
      } else if (this.activatedrouter.snapshot.queryParamMap.get('status').toString() === 'updated') {
        //this.successMessage = 'Tax Configuration Updated successfully.';
        this.translate.languageText('TAXCONFIGURATION.taxConfigurationUpdatedsuccessfully', data=> {
          this.successMessage =data;
          });
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
    }
  }
  view(data : any){
 
  }
  edit(data: any){


  }
}
