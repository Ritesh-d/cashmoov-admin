import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BankDetailsService } from './bank-details.service';
import { WalletOwnerConstants } from '../../wallet-owner.constants';
import { AddWalletOwnerService } from '../add-wallet-owner-service';
import { TranslatelanguageService } from '../../../shared/services/translatelanguage.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {
  @Input() bankFormSubmitted  : boolean;
  bankDetailsForm: FormGroup;
  accountTypes: any[];
  bankNames: any[];
  mobileOperators: any;
  settlementOptions: any[];
  accountOption: string;
  bankDetailsBankCode: string;
  bankDetailsMMOCode: string;
  bankDetailsFormFields: any[];
  input_text = WalletOwnerConstants.kyc.formFieldType.INPUT_TEXT;
  input_select = WalletOwnerConstants.kyc.formFieldType.INPUT_SELECT;
  input_radio = WalletOwnerConstants.kyc.formFieldType.INPUT_RADIO;
  input_password = WalletOwnerConstants.kyc.formFieldType.INPUT_PASSWORD;
  settlement_account = WalletOwnerConstants.kyc.formFieldName.SETTLEMENT_ACCOUNT;
  account_type = WalletOwnerConstants.kyc.formFieldName.ACCOUNT_TYPE;
  fin_institution = WalletOwnerConstants.kyc.formFieldName.FIN_INSTITUTION;
  mobile_subscriber = WalletOwnerConstants.kyc.formFieldName.MOBILE_SUBSCRIBER;
  _bank = WalletOwnerConstants.kyc.formFieldName.BANK;
  _mmo = WalletOwnerConstants.kyc.formFieldName.MMO;
  countryCodes = [];
  getcurrentLang:any;
  constructor(private bankDetailsService: BankDetailsService,private translate : TranslatelanguageService,
    private addWalletOwnerService: AddWalletOwnerService) {
      this.getcurrentLang=this.translate.getcurrentLang();
     }

  ngOnInit() {
    // this.addWalletOwnerService.selectedCountries.forEach(item => {
    //   this.countryCodes.push(item.code);
    // });
    this.bankDetailsBankCode = WalletOwnerConstants.identifiers.BANK_DETAILS_BANK_CODE;
    this.bankDetailsMMOCode = WalletOwnerConstants.identifiers.BANK_DETAILS_MMO_CODE;
    this.bankDetailsFormFields = this.addWalletOwnerService.formFields.bankKycList;
    console.log('--bankDetailsFormFields--', this.bankDetailsFormFields);
    this.bankDetailsForm = this.bankDetailsService.createBankForm();
    this.bankDetailsService.accountTypes.subscribe(accountTypesData => {
      if (accountTypesData.resultCode === '0') {
        this.bankDetailsService.accountTypeResponse = accountTypesData;
        this.accountTypes = [{ code: '', type: 'select account type' }, ...accountTypesData.accountTypeList];
      }
    });
    this.bankDetailsService.preapareMaster().subscribe(() => {
      this.settlementOptions = this.bankDetailsService.settlementOptions;
      this.accountOption = this.settlementOptions[0].code;
      this.bankDetailsService.settlementOption = this.settlementOptions[0].code;
      this.bankDetailsService.bankNames(this.countryCodes[0], this.countryCodes[1])
        .subscribe(bankNameResponse => {
          if(bankNameResponse.resultCode === '0') {
            this.bankNames = [{ code: '', type: 'select bank' }, ...bankNameResponse.finInstitutionList];
          }
        });
      // this.bankDetailsService.mobileOperators.subscribe(mobileOperators => {
      //   this.mobileOperators = [{ code: '', type: 'select mobile operator' }, ...mobileOperators];
      // });
    });

  }

  /**
   * Reset bank details form
   */
  resetBankDetailsForm() {
    this.bankDetailsForm.reset();
    this.accountOption = this.settlementOptions[0].code;
    this.bankDetailsService.settlementOption = this.settlementOptions[0].code;
  }

  /**
   * method is to set settlement option in form
   * @param code : selected option code
   */
  settlementOption(code: string) {
    this.bankDetailsService.settlementOption = code;
  }

}
