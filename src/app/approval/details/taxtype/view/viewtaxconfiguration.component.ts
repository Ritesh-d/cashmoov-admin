import { Component, OnInit, PipeTransform, Pipe, Input } from '@angular/core';
 
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TaxConfigurationService } from '../../../../taxconfiguration/taxconfiguration.service';

 

@Component({
  selector: 'app-viewtaxconfiguration',
  templateUrl: './viewtaxconfiguration.component.html',
  styleUrls: ['./viewtaxconfiguration.component.css']
})

export class ViewTaxConfigurationComponent  {
 
  @Input() data;
  constructor(public activeModal: NgbActiveModal, private taxConfigurationService: TaxConfigurationService, private modalService: NgbModal,
    private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router) {
     
  }

   
}
