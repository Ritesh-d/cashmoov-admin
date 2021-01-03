import { OnInit, Component, Input } from '@angular/core';
import { template } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-viewexchangerate',
    templateUrl: './viewexchangerate.component.html',
    styleUrls: ['./viewexchangerate.component.css']
})


export class ViewExchangerateComponent {
    @Input() data;
    constructor(public activeModal: NgbActiveModal,  private router: Router, private activatedrouter: ActivatedRoute,
        private route: ActivatedRoute) {

          
        }
 
    }