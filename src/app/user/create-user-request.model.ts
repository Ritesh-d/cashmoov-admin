export interface CreateUserRequestModel {
    code : number;
    // groupCode: number,
    roleCode: number,
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    // aliasName: string,
    // nationalId: number,
    mobileNumber: number,
    employeeId: string,
    // jobTitle: string,
    // departmentName: string,  
    // idProofNumber: string, 
    // idProofTypeCode: string,
    // idExpiryDate  : string, 
    todate : string;
    fromdate : string;
    status: string;
   
}