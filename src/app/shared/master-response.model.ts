export interface MasterResponseModel {
    transactionId: string;
    requestedBy: number;
    requestTime: Date;
    responseTime: Date;
    resultCode: string;
    resultDescription: string;
    regionalAreaList? : any[];
    governorateList? : any[];
    regionList? : any[];
    territoryList? : any[];
    addressTypeList?: any[];
    contractTypeList?: any[];
    categoryList?: any[];
    businessTypeList?: any[];
    groupList?: any[];
    templateCategoryList?: any[];
    finInstitutionTypeList?: any[];
    ewalletServiceList?: any[];
    channelTypeList?:any[];

}