import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
 
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
 

@Component({
  selector: 'app-viewmodalservice',
  templateUrl: './viewmodalservice.component.html',
  styleUrls: ['./viewmodalservice.component.css']
})
export class ViewModalServiceComponent {
  @Input() data;
 
  employeeId : string;
  showDateOptions: boolean= false;
  constructor(public activeModal: NgbActiveModal,   private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute) {


    this.ngOnInit();

  }

  ngOnInit() {

    if (this.data) {
      console.log('walletOwner', this.data);
    }
  }
  
 

 

}