import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RegionModalComponent } from './region-modal/region-modal.component';
import { CountryService } from './country.service';
import { CurrencyModalComponent } from './currency-modal/currency-modal.component';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})

export class CountryComponent implements OnInit {

  constructor(private modalService: NgbModal) {}
  ngOnInit() {
    
  }
}
