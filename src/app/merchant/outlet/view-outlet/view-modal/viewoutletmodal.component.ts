import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
 
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
 

@Component({
  selector: 'app-viewoutletmodal',
  templateUrl: './viewoutletmodal.component.html',
  styleUrls: ['./viewoutletmodal.component.css']
})
export class ViewOutletModalComponent {
  @Input() user;
 
  employeeId : string;
  showDateOptions: boolean= false;
  constructor(public activeModal: NgbActiveModal,   private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute) {


    this.ngOnInit();

  }

  ngOnInit() {

    if (this.user) {
      console.log('walletOwner', this.user);
    }
  }
  
  navigateToSytemUserCreation() {

    this.router.navigate(['../../'], { relativeTo: this.route });

  }


  onCancel() {


    this.router.navigate(['../../'], { relativeTo: this.route });

  }

}