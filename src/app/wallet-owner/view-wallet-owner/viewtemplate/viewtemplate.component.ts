import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
 
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
 

@Component({
  selector: 'app-viewtemplate',
  templateUrl: './viewtemplate.component.html',
  styleUrls: ['./viewtemplate.component.css']
})
export class viewTemplateModalComponent {
  @Input() template;
 
  employeeId : string;
  showDateOptions: boolean= false;
  serviceTemplateList: any[];
  displaytable: boolean=true;
  constructor(public activeModal: NgbActiveModal,   private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute) {


    this.ngOnInit();

  }

  ngOnInit() {

    if (this.template) {
      console.log('template', this.template);
    }
  }
  

 

}