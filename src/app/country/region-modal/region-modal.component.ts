import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CountryService } from '../country.service';
import { CommonHelperService } from '../../shared/services/common-helper-service';

@Component({
  selector: 'app-region-modal',
  templateUrl: './region-modal.component.html',
  styleUrls: ['./region-modal.component.css']
})
export class RegionModalComponent {

  @Input() countryCode: string;
  country: any;
  fetchingData = true;
  editMode = false;
  errorMessage: string;
  dtOption: any = {};
  setPermission : any;
  constructor(public activeModal: NgbActiveModal,
    private countryService: CountryService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedrouter: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private route: ActivatedRoute) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.setPermission = this.countryService.setPermission;
    if (this.countryCode) {
      this.countryService.getRegionByCountryCode(this.countryCode).subscribe(data => {
        if (data.resultCode === '0') {
          this.errorMessage = undefined;
          this.country = data.country;
          this.fetchingData = false;
          this.dtOption = this.commonHelperService.settingDataTable();
        } else {
          this.fetchingData =false;
          this.errorMessage = data.resultDescription;
        }
      }, error => {
        this.fetchingData =false;
        this.errorMessage = error.error.resultDescription;
      });
    }
  }

  editRegion(countryCode: string, regionName: string, regionCode: string) {
    this.activeModal.close('Close click');
    this.countryService.region.name = regionName;
    this.countryService.region.code = regionCode;
    this.router.navigate(['/country/region', 'edit', countryCode]);
  }

  addRegion(countryCode: string) {
    this.activeModal.close('Close click');
    this.router.navigate(['/country/region', 'add', countryCode]);
  }

}