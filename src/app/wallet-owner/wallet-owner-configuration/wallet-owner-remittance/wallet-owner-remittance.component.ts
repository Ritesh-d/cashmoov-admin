import { Component, OnInit } from '@angular/core';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { CountryRemittanceService } from '../../../country/country-remittance/country-remittance.service';
import { CountryService } from '../../../country/country.service';
import { WalletOwnerRemittanceService } from './wallet-owner-remittance.service';
import { map, filter } from 'rxjs/operators';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { WalletOwnerService } from '../../wallet-owner.service';
import { ApprovalConstants } from '../../../approval/approval.constants';
import {TranslatelanguageService} from '../../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-wallet-owner-remittance',
  templateUrl: './wallet-owner-remittance.component.html',
  styleUrls: ['./wallet-owner-remittance.component.css']
})
export class WalletOwnerRemittanceComponent implements OnInit {

  walletOwnerCode: string;
  successMessage: string;
  errorMessage: string;
  allCountries: any[];
  remittingCountries: any[];
  dtOption: any = {};
  collatedData: any[];
  fethingData : boolean = false;
  constructor(private route: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private countryRemittanceService: CountryRemittanceService,
    private countryService: CountryService,
    private walletOwnerService: WalletOwnerService,
    private translate: TranslatelanguageService,
    private router: Router,
    private walletOwnerRemittanceService: WalletOwnerRemittanceService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.walletOwnerCode) {
        this.walletOwnerCode = params.walletOwnerCode;
      }
    });
    
    this.walletOwnerService.getCountryRemittanceByWalletOwenerCode(this.walletOwnerCode).subscribe(countries => {
      if (countries.resultCode === '0') {
        this.allCountries = countries.walletOwnerCountryRemittanceList;
            this.countryRemittanceService.countryRemittance.subscribe(remittigCountries => {
          if (remittigCountries.resultCode === '0') {
            this.remittingCountries = remittigCountries.countryRemittanceList;
       
             this.collatedData = this.walletOwnerRemittanceService.preparecollatedData(this.allCountries, this.remittingCountries);
            console.log('--collatedData--', this.collatedData);
            this.dtOption = this.commonHelperService.settingDataTable();
          }
          else{
            this.errorMessage = remittigCountries["resultDescription"];
          }
        });
      }else{
        this.errorMessage = countries["resultDescription"];
      }
      this.fethingData = true;
    });
  }

  countrySelected(index: number) {
    if (!this.collatedData[index].checked) {
      this.collatedData[index].disable = false;
    } else {
      this.collatedData[index].remitSending = false;
      this.collatedData[index].remitReceiving = false;
      this.collatedData[index].disable = true;
    }
  }
  onCancel(){
    this.router.navigate(['/wallet-owner'], { relativeTo: this.route });

  }
  onSubmit() {
      const selectedCountries = [];
      
      this.collatedData.filter(_ => _.checked).forEach(elm => {
        elm.countryCode
        selectedCountries.push(elm);
      });
      if(selectedCountries.length>0){
      this.walletOwnerService.saveWalletOwnerCountryRemittance(this.prepareRequst(this.walletOwnerCode,selectedCountries)).subscribe(data => {
      console.log('--response--', data);
      if (data.resultCode === '0') {
       // this.successMessage = 'Country updated successfully!';
       this.translate.languageText('COUNTRY.currencyUpdatedSuccessfully', data=> {
        this.successMessage =data;
        });
        setTimeout(() => {
          this.successMessage = undefined;
          
        }, 5000);
      } else {
        this.errorMessage = data.resultDescription;
      }
    },err=>{
      this.errorMessage = err.error.resultDescription;
    });
  }
   else{
    //this.errorMessage = "Please select checkbox";
    this.translate.languageText('COUNTRY.pleaseselectcheckbox', data=> {
      this.errorMessage =data;
      });
    setTimeout(() => {
      this.errorMessage = undefined;
      
    }, 5000);
     }
   
     document.querySelector('#errmsg').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  prepareRequst(walletOwnerCode:string, countryList: any){
      const request : any = {
        walletOwnerCode: walletOwnerCode,
        walletOwnerCountryRemittanceList: this.prepareItem(countryList)
    };
    console.log('--request--', JSON.stringify(request));
    return request;
  }

  private prepareItem(countryList: any): any[] {
     const currencies = [];
     countryList.forEach(element => {
       currencies.push(this.element(element));
    });
     return currencies;
  }
  private element(element) {

    if(element.code === null || element.code=="") {
      return {
        countryCode: element.countryCode,
        remitSending: element.remitSending_o,
        remitReceiving: element.remitReceiving_o,
        status: ApprovalConstants.status.code.ACTIVE,
        countryRemittanceCode : element.countryRemittanceCode
      }
    } else {
      return {
        code : element.code,
        countryCode: element.countryCode,
        remitSending: element.remitSending_o,
        remitReceiving: element.remitReceiving_o,
        status: ApprovalConstants.status.code.ACTIVE,
        countryRemittanceCode : element.countryRemittanceCode
      }
      
    }
    
  }


}
