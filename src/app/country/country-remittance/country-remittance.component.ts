import { Component, OnInit } from '@angular/core';
import { CountryService } from '../country.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { FormBuilder } from '@angular/forms';
import { CountryRemittanceService } from './country-remittance.service';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-country-remittance',
  templateUrl: './country-remittance.component.html',
  styleUrls: ['./country-remittance.component.css']
})
export class CountryRemittanceComponent implements OnInit {
  
  getcurrentLang:any;
  errorMessage: string;
  successMessage: string;
  fetchingData = true;
  dtOption: any = {};
  countries: any[];
  selectedCountries: any[];
  countryRemittanceList: any[];
  setPermission;any;
  constructor(private countryService: CountryService,
    private route: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private formBuilder: FormBuilder,
    private translate : TranslatelanguageService,
    private router: Router,
    private countryRemittanceService: CountryRemittanceService) {
      this.getcurrentLang=this.translate.getcurrentLang();
  }

  ngOnInit() {
    this.setPermission= this.countryService.setPermission;

    this.listCountries();
  }

  private listCountries() {
    this.countryService.countries.subscribe(data => {
      this.countryService.countryResponse = data;
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.countries = data.countryList.map(country => {
          return {
            ...country,
            icon: country.countryCode.toLocaleLowerCase(),
            countryCode: country.code,
            checked: false,
            disable: true,
            sendChecked: false,
            receiveChecked: false,
            earlier: false
          };
        });
        this.getCountryRemittance();
        this.dtOption = this.commonHelperService.settingDataTable();
        this.dtOption  = {... this.dtOption  ,  columnDefs: [ { orderable: false, targets: [0,0,5,6] } ], order:[[0, '']] };
        
       
      } else {
        this.errorMessage = data.resultDescription;
      }
      this.fetchingData = false;
    }, error => {
      this.fetchingData = false;
      this.errorMessage = error;
    });
  }

  private getCountryRemittance() {
    this.countryRemittanceService.countryRemittance.subscribe(data => {
      if (data.resultCode === '0') {
        this.countryRemittanceList = data.countryRemittanceList;
        this.preservdEarlierRemittance();
      } else {
        this.errorMessage = data.resultDescription;
      }
    }, error => {
      this.errorMessage = error.error.resultDescription;
    });
  }

  private preservdEarlierRemittance() {
    this.countryRemittanceList.forEach(remittance => {
      for (let index = 0; index < this.countries.length; index++) {
        if (remittance.countryCode === this.countries[index].code) {
          this.countries[index].disable = true;
          this.countries[index].sendChecked = remittance.remitSending;
          this.countries[index].receiveChecked = remittance.remitReceiving;
          this.countries[index].code = remittance.code;
          this.countries[index].earlier = true;
          break;
        }
      }
    });
  }

  private showMessage() {
    if (this.successMessage) {
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5 * 1000);
    }
  }

  countrySelected(index: number) {
    if (!this.countries[index].checked) {
      this.countries[index].disable = false;
    } else {
      this.countries[index].sendChecked = false;
      this.countries[index].receiveChecked = false;
      this.countries[index].disable = true;
    }
  }

  onSubmit() {
    this.selectedCountries = [];
    this.countries.filter(_ => _.checked).forEach(elm => {
      this.selectedCountries.push(elm);
    });

    this.countryRemittanceService.updateCountryRemittance(this.selectedCountries).subscribe(data => {
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        //this.successMessage = 'Remittance updated Successfully.';
        this.translate.languageText('COUNTRY.remittanceupdatedSuccessfully', data=> {
          this.successMessage=data;
        });
        this.showMessage();
      } else {
        this.successMessage = undefined;
        this.errorMessage = data.resultDescription;
      }
    },
      error => {
        this.successMessage = undefined;
        this.errorMessage = error.error.resultDescription;
      }
    );
    document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.listCountries();
  }
  
}
