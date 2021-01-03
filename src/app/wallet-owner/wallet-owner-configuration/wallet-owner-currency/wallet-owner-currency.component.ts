import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CurrencyService } from '../../../country/currency-modal/currency.service';
import { CountryService } from '../../../country/country.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Params, ActivatedRoute } from '@angular/router';
import { WalletOwnerService } from '../../wallet-owner.service';
import {TranslatelanguageService} from '../../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-wallet-owner-currency',
  templateUrl: './wallet-owner-currency.component.html',
  styleUrls: ['./wallet-owner-currency.component.css'],
  providers : [CurrencyService,CountryService]
})
export class WalletOwnerCurrencyComponent implements OnInit {
   @Input() walletOwner : any;
   countryCode: string;
   walletOwnerCode: string;
  
  country: any;
  fetchingData = true;
  editMode = false;
  errorMessage: string;
  currencies: any;
  currencyForm: FormGroup;
  allCurrencies: any[];
  successMessage: any;
  walletOwnerCategoryCode: string;
  parentWalletOwners: any[];
  countryCurrencyList : any [];
  walletOwnerCountryCurrencyList : any[];
  errorMsg : string;
  constructor(private currencyService: CurrencyService,
    private translate: TranslatelanguageService,
    private countryService: CountryService,private route: ActivatedRoute,  private walletOwnerService: WalletOwnerService,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log('queryParam ',this.walletOwner);
    this.walletOwnerCode =  this.walletOwner.code;
    
    this.countryCode = this.walletOwner.registerCountryCode; //'100102'//

    // this.route.params.subscribe((params: Params) => {
    //   console.log('params ',params);
    //   if (params) {
    //     this.walletOwnerCode = params.walletOwnerCode;
    //     this.countryCode = '100102' ;//params.registerCountryCode
    //   }
    // });
    
    console.log('walletOwnerCode ' ,this.walletOwnerCode);
    console.log('countryCode ' ,this.countryCode);
    this.getCountryCurrencyCountry();
    this.getCountryInfo();
    this.getAllCurrency();
    
  
  }
  getCountryCurrencyCountry(){
    this.fetchingData = true;
    this.walletOwnerService.getCountryCurrencyCountry(this.countryCode).subscribe(data => {
      console.log('data :country currency cuntry detail :: ',data)
      if  (data["resultCode"] === '0') {
        this.errorMessage = undefined;
        this.country = data["country"];
        if(this.country){
          this.countryCurrencyList = this.country["countryCurrencyList"];
        }
        
      } else {
        this.fetchingData = false;
        this.errorMessage = data["resultDescription"];
      }
    }, error => {
      console.log('--error--', error);
      this.fetchingData = false;
      this.errorMessage = error.error.resultDescription;
    });
     
  }
 
  private getCountryInfo() {
    this.fetchingData = true;
    let matchCurrencyList : any =[];
    this.walletOwnerService.getCurrencyByWalletOwenerCode(this.walletOwnerCode).subscribe(data => {
      console.log('data from currency by country ',data)
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.walletOwnerCountryCurrencyList = data["walletOwnerCountryCurrencyList"]
        matchCurrencyList = this.matchCurrency(this.walletOwnerCountryCurrencyList , this.countryCurrencyList);
        this.currencyForm = this.walletOwnerService.initializeCurrencyForm();
        // this.previouslyAddedCurrency(data.walletOwnerCountryCurrencyList);
        this.previouslyAddedCurrency(matchCurrencyList);
        this.fetchingData = false;
      }
      // else if(data.resultCode === '1010'){    // no currency 
      //   this.currencyForm = this.walletOwnerService.initializeCurrencyForm();
      //   this.fetchingData = false;

      // }
       else {
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
      console.log('all currency  ',data);

      if (data.resultCode === '0') {
        this.currencyService.currencyResponse = data;
        this.currencies = data.currencyList;
        // if (this.currencyForm && this.currencyForm.get('countryCurrency').value.length === 0) {
        //   this.onAddCurrency();
        // }
        // this.fetchingData = false;
      }
    });
  }

  get getCurrencyControl() {
    return (this.currencyForm.get('countryCurrency') as FormArray).controls;
  }

  // onAddCurrency() {
  //   (this.currencyForm.get('countryCurrency') as FormArray).push(new FormGroup({
  //     currency: new FormControl(''),
  //     outbound: new FormControl(false),
  //     inbound: new FormControl(false),
  //     code: new FormControl(null)
      
  //     , sendingCurrency: new FormControl(false),
  //     receivingCurrency: new FormControl(false),
  //   }));
  // }

  previouslyAddedCurrency(countryCurrencyList: any[]) {
    console.log('previouslyAddedCurrency ',countryCurrencyList);
    if (countryCurrencyList) {
      countryCurrencyList.forEach(currencyItem => {
        (this.currencyForm.get('countryCurrency') as FormArray).push(new FormGroup({
          currency: new FormControl(currencyItem.currencyCode),
          inbound: new FormControl({value:currencyItem.inBound,disabled:currencyItem.inBoundDisabled}),
          outbound: new FormControl({value: currencyItem.outBound,disabled:currencyItem.outBoundDisabled}),
          sendingCurrency: new FormControl(currencyItem.sendingCurrency),
          receivingCurrency: new FormControl(currencyItem.receivingCurrency),
          countryCurrencyCode: new FormControl(currencyItem.countryCurrencyCode),
         
          code: new FormControl(currencyItem.code),
          
        }
        
        ));
      });
    } else {
      //this.errorMsg='No data found';
      this.translate.languageText('MASTER.nodatafound', data=> {
        this.errorMsg =data;
        });
      return;
    }
  }

  onRemoveCurrency(currencyIndex: number) {
    
    let any = (this.currencyForm.get('countryCurrency') as FormArray).controls;
    let code = any[currencyIndex].value.code;
    console.log('code to delete ' ,code);
    if(code != null && code != ""){
        this.walletOwnerService.deleteByCode(code).subscribe(data => {
          console.log('--response from delete --', data);
          if (data["resultCode"] === '0') {
           // this.successMessage = 'Currency Deleted Successfully';
           this.translate.languageText('COUNTRY.currencyDeletedSuccessfully', data=> {
            this.successMessage =data;
            });
            setTimeout(() => {
              this.successMessage = undefined;
              this.activeModal.close('Close click');
            }, 5000);
          } else {
            this.errorMessage = data["resultDescription"];
          }
        });;
    }
    (this.currencyForm.get('countryCurrency') as FormArray).removeAt(currencyIndex);
  }

  submitCurrency() {
    console.log('--submitCurrency--', this.currencyForm.value);
    if(this.currencyForm.valid){
    this.walletOwnerService.saveCountryCurrency(this.walletOwnerCode, this.currencyForm.value).subscribe(data => {
      console.log('--response--', data);
      if (data.resultCode === '0') {
        //this.successMessage = 'Currency Updated Successfully';
        this.translate.languageText('COUNTRY.currencyUpdatedSuccessfully', data=> {
          this.successMessage =data;
          });
        setTimeout(() => {
          this.successMessage = undefined;
          this.activeModal.close('Close click');
        }, 5000);
      } else {
        this.errorMessage = data.resultDescription;
      }

    },err=>{
      this.errorMessage = err.error.resultDescription;
 
    });
  }else{
    //this.errorMessage = "Nothing to save";
    this.translate.languageText('MASTER.nothingtosave', data=> {
      this.errorMessage =data;
      });
  }
  document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  matchCurrency(walletOwnerCountryCurrencyList : any,countryCurrencyList : any){
    let matchCurrency : any = [];
    if(walletOwnerCountryCurrencyList && countryCurrencyList ){
     for(let i = 0; i < walletOwnerCountryCurrencyList.length ;i ++){
      for(let j = 0; j < countryCurrencyList.length ;j ++){
        // console.log('match code '+ walletOwnerCountryCurrencyList[i].currencyCode , countryCurrencyList[j].currencyCode);
   
        if (walletOwnerCountryCurrencyList[i].currencyCode === countryCurrencyList[j].currencyCode) {
          console.log('matched code '+ walletOwnerCountryCurrencyList[i].currencyCode , countryCurrencyList[j].currencyCode);
          let  inBoundDisabled :boolean = false;
          let  outBoundDisabled :boolean = false;
          if(!countryCurrencyList[j].inBound){
              inBoundDisabled = true;
          }
          if(!countryCurrencyList[j].outBound){
            outBoundDisabled = true;
          }
          matchCurrency.push({
            "currencyCode": walletOwnerCountryCurrencyList[i].currencyCode,
            "walletOwnerCode": walletOwnerCountryCurrencyList[i].walletOwnerCode,
            "code": walletOwnerCountryCurrencyList[i].code,
            "inBound": walletOwnerCountryCurrencyList[i].inBound,
            "outBound": walletOwnerCountryCurrencyList[i].outBound,
            "status": walletOwnerCountryCurrencyList[i].status,
            "sendingCurrency": countryCurrencyList[j].inBound,
            "receivingCurrency": countryCurrencyList[j].outBound,  
            "countryCurrencyCode": countryCurrencyList[j].code,  
            "inBoundDisabled" : inBoundDisabled,
            "outBoundDisabled" : outBoundDisabled
          });
        }
      }
  
     }
    }
     console.log('matchCurrency' + JSON.stringify(matchCurrency));
     return matchCurrency;
  }
  
}
