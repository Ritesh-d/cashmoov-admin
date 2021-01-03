import { OnInit, Component, Input } from '@angular/core';
import { template } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TemplateLimitService } from '../template-limit.service';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-viewservicetemplate',
    templateUrl: './viewservicetemplate.component.html',
    styleUrls: ['./viewservicetemplate.component.css']
})


export class ViewserviceTemplateLimit {
    @Input() data;
    taxTypeList: any;
    taxTypeCode: any;
    selected: any =  [];
    multiselectform : FormGroup;
    public settings = {};
    istaxtype :boolean = false;
    constructor(private templateService: TemplateLimitService,public activeModal: NgbActiveModal,  private router: Router, private activatedrouter: ActivatedRoute,
        private route: ActivatedRoute) {
           
        
        }
     
    }