import { Injectable } from '@angular/core';

@Injectable()
export class WalletOwnerRemittanceService {

  constructor() { }

  preparecollatedData(allCountries: any[], remittingCountries: any[]): any[] {
    console.log('allCountries', allCountries);
        console.log('remittingCountries', remittingCountries);
    const requiredData = [];
    for (let i = 0; i < remittingCountries.length; i++) {
      for (let j = 0; j < allCountries.length; j++) {
        if (remittingCountries[i].countryCode === allCountries[j].countryCode) {
          let disableSendingNetwork = true;
          let disableReceivingNetwork = true;
        if(remittingCountries[i].remitSending){
          disableSendingNetwork = false;
        }
        if(remittingCountries[i].remitReceiving){
          disableReceivingNetwork = false;
        }
            
          requiredData.push({
            // ...remittingCountries[i],
            code : allCountries[j].code,
            remitReceiving_o: allCountries[j].remitReceiving,
            remitSending_o: allCountries[j].remitSending,
            remitReceiving: remittingCountries[i].remitReceiving,
            remitSending: remittingCountries[i].remitSending,
            disableSendingNetwork: disableSendingNetwork,
            disableReceivingNetwork : disableReceivingNetwork,
            checked: false,
            // isoCode: remittingCountries[i].isoCode,
            countryCode: allCountries[j].countryCode,
            currencyCode: remittingCountries[i].currencyCode,
            countryIsoCode: remittingCountries[i].countryIsoCode,
            countryName: remittingCountries[i].countryName,
            currencySymbol: allCountries[j].currencySymbol,
            countryRemittanceCode :  remittingCountries[i].code,  //countryRemittanceCode added 
            icon: remittingCountries[i].countryIsoCode.toLocaleLowerCase()
          });
          break;
        }
      }
    }

    // this.collatedData = allCountries.filter((country) => {
    //   remittingCountries.filter((remittingCountry) => {
    //     return {
    //       if(remittingCountry.code === country.code) {
    //         return {
    //           ...remittingCountry,
    //           icon: true
    //         }
    //       }
    //     }
    //   })
    // })

    return requiredData;
  }


}
