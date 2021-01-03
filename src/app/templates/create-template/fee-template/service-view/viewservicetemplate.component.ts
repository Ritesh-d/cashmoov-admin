import { OnInit, Component, Input } from '@angular/core';
import { template } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeeTemplateService } from '../fee-template.service';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-viewservicetemplate',
    templateUrl: './viewservicetemplate.component.html',
    styleUrls: ['./viewservicetemplate.component.css']
})


export class ViewFeeComponent {
    @Input() data;
    taxTypeList: any;
    taxTypeCode: any;
    selected: any =  [];
    multiselectform : FormGroup;
    public settings = {};
    istaxtype :boolean = false;
 
    constructor(private templateService: FeeTemplateService,public activeModal: NgbActiveModal,  private router: Router, private activatedrouter: ActivatedRoute,
        private route: ActivatedRoute) {
            this.multiselectform = new FormGroup({
                taxTypeCode: new FormControl({value:'',disabled: true})
               
              });
        
        }
       async  ngOnInit(){
        this.taxTypeCode = this.data.taxTypeCode; //'100000,100001,100002'
       
            let data =  await  this.templateService.getTaxTypeMapped();
            if (data["resultCode"] === '0') {
                this.taxTypeList = data["taxTypeList"];
                let taxTypeCodeList = this.taxTypeCode.split(',');
                console.log('taxTypeCodeList' ,taxTypeCodeList);
                taxTypeCodeList.forEach(element => {
                      this.taxTypeList.forEach(element2 => {
                        if (element2.code == element) {
                          this.selected.push(element2);
                         
                        }
                      });
                     
                });
                
              }         
             
              this.multiselectform.get("taxTypeCode").setValue(this.selected);
                   
               this.istaxtype = true;
               this.settings = {
                singleSelection: false,
              
                idField : 'code',
                textField:'typeEn',
              
                limitSelection: -1,
                clearSearchFilter: true,     
             
                noDataAvailablePlaceholderText: 'NA',
                closeDropDownOnSelection: true,
                showSelectedItemsAtTop: false,
                enableCheckAll : false,
                // itemsShowLimit: 1,
               
                defaultOpen: false
              };
              console.log('taxTypeCode', this.taxTypeCode);
              
        }
       get f1() { return this.multiselectform.controls; }

    }