import { Component, OnInit, Input } from '@angular/core';
import { CurrencyService } from './currency.service';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryService } from '../country.service';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.css']
})
export class CurrencyModalComponent implements OnInit {

  @Input() countryCode: string;
  country: any;
  fetchingData = true;
  editMode = false;
  errorMessage: string;
  currencies: any;
  currencyForm: FormGroup;
  allCurrencies: any[];
  successMessage: any;
  setPermission:any;
  getcurrentLang:any;

  constructor(private currencyService: CurrencyService,
    private countryService: CountryService,
    private translate : TranslatelanguageService,
    public activeModal: NgbActiveModal) {
      this.getcurrentLang=this.translate.getcurrentLang();
     }

  ngOnInit() {
    this.setPermission= this.countryService.setPermission;
    if (this.countryCode) {
      this.getCountryInfo();
      this.getAllCurrency();
    }
  }

  private getCountryInfo() {
    this.fetchingData = true;
    this.currencyService.getCurrencyByCountryCode(this.countryCode).subscribe(data => {
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.country = data.country;
        this.currencyForm = this.currencyService.initializeCurrencyForm();
        this.previouslyAddedCurrency(this.country.countryCurrencyList);
        this.fetchingData = false;
      } else {
        this.fetchingData = false;
        this.errorMessage = data.resultDescription;
      }
    }, error => {
      console.log('--error--', error);
      this.fetchingData = false;
      this.errorMessage = error.error.resultDescription;
    });
  }

  private getAllCurrency() {
    this.currencyService.currencies.subscribe(data => {
      if (data.resultCode === '0') {
        this.currencyService.currencyResponse = data;
        this.currencies = data.currencyList;
        if (this.currencyForm && this.currencyForm.get('countryCurrency').value.length === 0) {
          this.onAddCurrency();
        }
        // this.fetchingData = false;
      }
    });
  }

  get getCurrencyControl() {
    return (this.currencyForm.get('countryCurrency') as FormArray).controls;
  }

  onAddCurrency() {
    (this.currencyForm.get('countryCurrency') as FormArray).push(new FormGroup({
      currency: new FormControl(''),
      outbound: new FormControl(false),
      inbound: new FormControl(false),
      code: new FormControl(undefined),
      countryCode:new FormControl(this.countryCode)
    }));
  }

  previouslyAddedCurrency(countryCurrencyList: any[]) {
    if (countryCurrencyList) {
      countryCurrencyList.forEach(currencyItem => {
        (this.currencyForm.get('countryCurrency') as FormArray).push(new FormGroup({
          currency: new FormControl(currencyItem.currencyCode),
          outbound: new FormControl(currencyItem.outBound),
          inbound: new FormControl(currencyItem.inBound),
          code: new FormControl(currencyItem.code),
          countryCode:new FormControl(currencyItem.countryCode),
        }));
      });
    } else {
      return;
    }
  }

  onRemoveCurrency(currencyIndex: number) {
    (this.currencyForm.get('countryCurrency') as FormArray).removeAt(currencyIndex);
  }

  submitCurrency() {
    console.log('--submitCurrency--', this.currencyForm.value);
 
    this.currencyService.saveCountryCurrency(this.countryCode, this.currencyForm.value).subscribe(data => {
      console.log('--response--', data);
      if (data.resultCode === '0') {
       // this.successMessage = 'Currency Updated Successfully';
      //  if(this.getcurrentLang==="en"){
      //   this.successMessage = 'Currency Updated Successfully';
      //    }
      //    if(this.getcurrentLang==="fr"){
      //     this.successMessage = 'Mise a jour de la monnaie avec succes';

      //    }

       this.translate.languageText('COUNTRY.currencyUpdatedSuccessfully', data=> {
        this.successMessage=data;
      });
        setTimeout(() => {
          this.successMessage = undefined;
          this.activeModal.close('Close click');
        }, 5000);
      } else {
        this.errorMessage = data.resultDescription;
        // document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });

      }
    
    }, error => {
      this.errorMessage = error.error.resultDescription;
      // document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });

    });
    // this.onActivate();
    document.querySelector('#errormsg').scrollIntoView({block: "end", inline: "nearest"});
    // var elmnt = document.getElementById("errmsg");
    // elmnt.scrollIntoView();
  }
  onActivate() {
    let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 16);
}
}
