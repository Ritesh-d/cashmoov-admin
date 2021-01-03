export interface BankDetailsRequestModel {
    walletOwnerCode: string;
    finInstitutionTypeCode: string;
    finInstitutionCode: string;
    accountType: string;
    accountName: string;
    accountNumber: string;
    branchName: string;
    routingNo: string;
    msisdn?: string;
}