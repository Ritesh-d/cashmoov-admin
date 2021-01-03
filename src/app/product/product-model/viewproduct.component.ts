import { OnInit, Component, Input } from '@angular/core';
import { template } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-viewproduct',
    templateUrl: './viewproduct.component.html',
    styleUrls: ['./viewproduct.component.css']
})


export class ViewProductComponent {
    @Input() data;
    constructor(public activeModal: NgbActiveModal,  private router: Router, private activatedrouter: ActivatedRoute,
        private route: ActivatedRoute) {
 
          
        }
 
    }