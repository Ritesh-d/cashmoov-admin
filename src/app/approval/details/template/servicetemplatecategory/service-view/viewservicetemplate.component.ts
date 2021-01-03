import { OnInit, Component, Input } from '@angular/core';
import { template } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-viewservicetemplate',
    templateUrl: './viewservicetemplate.component.html',
    styleUrls: ['./viewservicetemplate.component.css']
})


export class ViewServiceComponent {
    @Input() data;
    @Input() oldValue ;
    constructor(public activeModal: NgbActiveModal,  private router: Router, private activatedrouter: ActivatedRoute,
        private route: ActivatedRoute) {

          this.ngOnInit();
        }
        ngOnInit(){
            console.log('this.data',this.data);
            console.log('this.oldValue',this.oldValue);
            if(this.oldValue==undefined){
                this.oldValue = this.data;
            }
            console.log('this.data',this.data);
            console.log('this.oldValue',this.oldValue);
        }
    }