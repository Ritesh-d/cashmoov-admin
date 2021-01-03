export interface WalletOwnerUserRequestModel {
    code: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    walletOwnerUserTypeCode: string;
    walletOwnerCategoryCode: string;
    userCode: string;
    gender: string;
    dateOfBirth: any;
    idProofTypeCode: string;
    idProofNumber: string;
    issuingCountryCode: string;
    idExpiryDate: any;
     
    addressList: {
        addTypeCode: string;
        countryCode: string;
        regionCode: string;
        city: string;
        addressLine1: string;
        addressLine2: string;
        location: string;
        district?: string;
      
    }[];
}