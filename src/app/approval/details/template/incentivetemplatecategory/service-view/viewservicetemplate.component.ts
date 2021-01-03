import { OnInit, Component, Input } from '@angular/core';
import { template } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { DetailsService } from '../../../details.service';
@Component({
    selector: 'app-viewservicetemplate',
    templateUrl: './viewservicetemplate.component.html',
    styleUrls: ['./viewservicetemplate.component.css']
})


export class ViewIncentiveComponent {
    @Input() data;
    @Input() oldValue;
    multiselectform: FormGroup;
    public settings = {};
    istaxtype: boolean = false;
    taxTypeList: any;
    constructor(private detailsService: DetailsService, public activeModal: NgbActiveModal, private router: Router, private activatedrouter: ActivatedRoute,
        private route: ActivatedRoute) {
        this.multiselectform = new FormGroup({
            taxTypeCode: new FormControl('')

        });
        this.settings = {
            singleSelection: false,

            idField: 'code',
            textField: 'typeEn',

            limitSelection: -1,
            clearSearchFilter: true,

            noDataAvailablePlaceholderText: 'NA',
            closeDropDownOnSelection: false,
            showSelectedItemsAtTop: false,
            defaultOpen: false
        };
        this.ngOnInit();
    }
    async  ngOnInit() {
        console.log('this.data', this.data);
        console.log('this.oldValue', this.oldValue);
        if (this.oldValue == undefined) {
            this.oldValue = this.data;
        }
        console.log('this.data', JSON.stringify(this.data));
        console.log('this.oldValue', JSON.stringify(this.oldValue));

        // console.log('this.data.taxTypeCode',this.data.taxTypeCode);
        // if(this.data.taxTypeCode){
        let data = await this.detailsService.getTaxTypeMapped();
        let selected = [];
        if (data["resultCode"] === '0') {
            this.taxTypeList = data["taxTypeList"];
            if(this.data.taxTypeCode!=undefined){
            let taxTypeCodeList = this.data.taxTypeCode.split(',');
            taxTypeCodeList.forEach(element => {
                this.taxTypeList.forEach(element2 => {
                    if (element2.code == element) {
                        selected.push(element2);

                    }
                });
            

            });
        }

        }

        console.log('taxTypeCodeList', JSON.stringify(selected));
        this.multiselectform.get("taxTypeCode").setValue(selected);
        // }
        this.istaxtype = true;

    }
    get f1() { return this.multiselectform.controls; }
}
