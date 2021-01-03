import { Component, OnInit } from '@angular/core';
import { CountryService } from '../country.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { RegionModalComponent } from '../region-modal/region-modal.component';
import { CommonHelperService } from '../../shared/services/common-helper-service';

@Component({
  selector: 'app-country-region',
  templateUrl: './country-region.component.html',
  styleUrls: ['./country-region.component.css']
})
export class CountryRegionComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  fetchingData = true;
  dtOption: any = {};
  countries: any[];
setPermission : any;
  constructor(private countryService: CountryService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private formBuilder: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.setPermission= this.countryService.setPermission;
    this.showMessage();
    this.countryService.countries.subscribe(data => {
      this.countryService.countryResponse = data;
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.countries = data.countryList.map(country => {
          return {
            ...country,
            image: country.countryCode.toLocaleLowerCase() + '.png',
            icon: country.countryCode.toLocaleLowerCase()
          };
        });
        this.dtOption = this.commonHelperService.settingDataTable();
      } else {
        this.errorMessage = data.resultDescription;
      }
      this.fetchingData = false;
    }, error => {
      this.fetchingData = false;
      this.errorMessage = error.error.resultDescription;
    });
  }

  viewRegion(countryCode: string) {
    const modalRef = this.modalService.open(RegionModalComponent);
    modalRef.componentInstance.countryCode = countryCode;
  }

  addRegion(countryCode: any) {
    this.router.navigate(['add', countryCode], { relativeTo: this.route });
  }

  private showMessage() {
    this.successMessage = this.countryService.getMessage;
    if (this.successMessage) {
      setTimeout(() => {
        this.successMessage = undefined;
        this.countryService.setMessage = undefined;
      }, 10 * 1000);
    }
    document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  navigateToAddRegion() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
}
