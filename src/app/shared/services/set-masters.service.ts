import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { MastersViewModelBuilder } from '../masters-view-model.builder';
import { MasterResponseModel } from '../master-response.model';


@Injectable({providedIn: 'root'})
export class setMastersService{

  constructor(private mastersViewModel: MastersViewModelBuilder) { }

    /**
   * prepare master string
   * @param masters 
   */
  prepareMasterString(masters: string[]) {
    let mastersString = '';
    masters.forEach(master => {
      mastersString += master.toUpperCase() + ",";
    });
    // Remove last "," from string
    mastersString = mastersString.slice(0, -1);
    return mastersString;
  }

  /**
   * setting Masters data in masterViewModel
   */
  public setMastersData(mastersData: MasterResponseModel) {
    if (mastersData.regionalAreaList) {
      this.mastersViewModel.regionalsData(mastersData.regionalAreaList);
    }
    if (mastersData.channelTypeList) {
      this.mastersViewModel.channelTypeList(mastersData.channelTypeList);
    }
    if (mastersData.ewalletServiceList) {
      this.mastersViewModel.ewalletServiceList(mastersData.ewalletServiceList);
    }
    if (mastersData.governorateList) {
      this.mastersViewModel.governaratesData(mastersData.governorateList);
    }
    if (mastersData.regionList) {
      this.mastersViewModel.regionsData(mastersData.regionList);
    }
    if (mastersData.territoryList) {
      this.mastersViewModel.territoriesData(mastersData.territoryList);
    }
    if (mastersData.addressTypeList) {
      this.mastersViewModel.addressTypesData(mastersData.addressTypeList);
    }
    if (mastersData.categoryList) {
      this.mastersViewModel.categoriesData(mastersData.categoryList);
    }
    if (mastersData.contractTypeList) {
      this.mastersViewModel.contractTypesData(mastersData.contractTypeList);
    }
    if (mastersData.businessTypeList) {
      this.mastersViewModel.businessTypesData(mastersData.businessTypeList);
    }
    if(mastersData.templateCategoryList) {
      this.mastersViewModel.templateCategoriesData(mastersData.templateCategoryList);
    }
    if(mastersData.finInstitutionTypeList) {
      this.mastersViewModel.finInstitutionTypeData(mastersData.finInstitutionTypeList);
    }
    
  }

  getHeaders(): HttpHeaders {
     return new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  }
}