export interface SubscriberBasicRequestModel {
    businessName: string;
    businessTypeCode: string;
    email: string;
    groupCode: string;
    idExpiryDate: Date;
    idProofNumber: string;
    idProofTypeCode: string;
    issuingCountryCode: string;
    lineOfBusiness: string;
    mobileNumber: string;
    code: string;
    ownerName: string;
    walletOwnerCategoryCode: string;
    walletOwnerParentCode?: string;
    dateOfBirth?: Date;
    gender?: string;
    lastName?: string;
}
