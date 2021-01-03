import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class MastersViewModelBuilder {
    private mastersData;
    constructor() {
        this.initializeMasterViewModel();
    }

    initializeMasterViewModel() {
        this.mastersData = {
            "regionalAreaList": [],
            "governorateList": [],
            "regionList": [],
            "territoryList": [],
            "addressTypeList": [],
            "contractTypeList": [],
            "categoryList": [],
            "businessTypeList": [],
            "templateCategoryList": [],
            "finInstitutionTypeList": [],

            "bankNames": [],
            "mobileOperators": [],
            "ewalletServiceList":[],
            "channelTypeList":[]
        };
    }

    get masterViewModel() {
        return this.mastersData;
    }

    regionalsData(regionals: any[]) {
        this.mastersData.regionalAreaList = regionals;
    }
    get regionals() {
        return this.mastersData.regionalAreaList;
    }
    channelTypeList(channelTypeList: any[]) {
        this.mastersData.channelTypeList = channelTypeList;
    }
    get channelTypeListData() {
        return this.mastersData.channelTypeList;
    }
    ewalletServiceList(ewalletServiceList: any[]) {
        this.mastersData.ewalletServiceList = ewalletServiceList;
    }
    get ewalletServiceListData() {
        return this.mastersData.ewalletServiceList;
    }
    
    governaratesData(governarates: any[]) {
        this.mastersData.governorateList = governarates;
    }
    get governarates() {
        return this.mastersData.governorateList;
    }

    regionsData(regions: any[]) {
        this.mastersData.regionList = regions;
    }
    get regions() {
        return this.mastersData.regionList;
    }

    territoriesData(territories: any[]) {
        this.mastersData.territoryList = territories;
    }
    get territories() {
        return this.mastersData.territoryList;
    }

    addressTypesData(addressTypes: any[]){
        this.mastersData.addressTypeList = addressTypes;
    }
    get addressTypes() {
        return this.mastersData.addressTypeList;
    }

    contractTypesData(contractTypes: any[]){
        this.mastersData.contractTypeList = contractTypes;
    }
    get contractTypes() {
        return this.mastersData.contractTypeList;
    }

    categoriesData(categories: any[]){
        this.mastersData.categoryList = categories;
    }
    get categories() {
        return this.mastersData.categoryList;
    }

    businessTypesData(businessTypes: any[]){
        this.mastersData.businessTypeList = businessTypes;
    }
    get businessTypes() {
        return this.mastersData.businessTypeList;
    }

    templateCategoriesData(templateCategories: any[]){
        this.mastersData.templateCategoryList = templateCategories;
    }
    get templateCategories() {
        return this.masterViewModel.templateCategoryList;
    }

    finInstitutionTypeData(finInstitutionTypes: any[]) {
        this.mastersData.finInstitutionTypeList = finInstitutionTypes;
    }
    get finInstitutionTypes() {
        return this.mastersData.finInstitutionTypeList;
    }

    // bankNames and mobileOperators are not masters but we are taking these as masters.
    // as these are not changing frequently
    bankNamesData(bankNames: any[]) {
        this.mastersData.bankNames = bankNames;
    }
    get bankNames(){
        return this.mastersData.bankNames;
    }
    mobileOperatorsData(mobileOperators: any[]) {
        this.mastersData.mobileOperators = mobileOperators;
    }
    get mobileOperators(){
        return this.mastersData.mobileOperators;
    }
}