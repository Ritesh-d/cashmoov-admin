import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../../shared/endpoints';
import { WalletOwnerConstants } from '../wallet-owner.constants';
import { WalletOwnerUserRequestModel } from './add-user/wallet-owner-user-request.model';
import { ApprovalConstants } from '../../approval/approval.constants';
import { formatDate } from '@angular/common';

@Injectable()
export class UserDetailsService {

    walletOwnerCode: string;
    userTypeResponse: any;

    constructor(private commonHelperService: CommonHelperService,
        private http: HttpClient,
        private endpoints: Endpoints) { }


    initializeUserDetailsForm(userFormFields: any, walletOwnerCode: string) {
        let group = {};
        userFormFields.genInfoKycList.forEach(formField => {
            if (formField.kycMetaDataField === 'userCode') {
                group[formField.kycMetaDataField] = new FormControl({ value: walletOwnerCode, disabled: true });
            } else {
                if(formField.kycMetaDataField === 'idExpiryDate')
                group[formField.kycMetaDataField] = new FormControl(null);
                else
                    group[formField.kycMetaDataField] = new FormControl('');  
                
            }
        });
        userFormFields.addressKycList.forEach(formField => {
            if (formField.kycMetaDataField === 'regionName') {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: true });
            } else {
                group[formField.kycMetaDataField] = new FormControl('');
            }

        });
        group['status'] =  new FormControl({value: ''});
        group['fromdate'] =  new FormControl({value: ''});
        group['todate'] =  new FormControl({value: ''});
        return new FormGroup(group);

        /*
        let firstname: string,
        lastname: string,
        username: string,
        email: string,
        contact: string,
        password: string,
        type: string = '';
        let viewMode = false;;
        if (userData) {
            viewMode = !this.commonHelperService.isEditMode;
            firstname = userData.firstname;
            lastname = userData.lastname;
            username = userData.username;
            email = userData.email;
            contact = userData.contact;
            password = userData.password;
            type = userData.type;
        }
        return new FormGroup({
            firstname: new FormControl({ value: firstname, disabled: viewMode }, Validators.required),
            lastname: new FormControl({ value: lastname, disabled: viewMode }, Validators.required),
            username: new FormControl({ value: username, disabled: viewMode }, Validators.required),
            password: new FormControl({ value: password, disabled: viewMode }, Validators.required),
            email: new FormControl({ value: email, disabled: viewMode }, Validators.required),
            contact: new FormControl({ value: contact, disabled: viewMode }, Validators.required),
            type: new FormControl({ value: type, disabled: viewMode }, Validators.required)
        });
        */
    }
    // userData.walletOwnerUser
    initializeUserDetailsFormViewEdit(userFormFields: any, userData: any, editMode: boolean) {
        let group = {};
        userFormFields.genInfoKycList.forEach(formField => {
            console.log('(formField.kycMetaDataField' + formField.kycMetaDataField);
            if (formField.kycMetaDataField === 'userCode') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.userCode, disabled: true });
            } else if (formField.kycMetaDataField === 'code') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.code, disabled: true });
            } else if (formField.kycMetaDataField === 'userName') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.userName, disabled: true });
            } else if (formField.kycMetaDataField === 'dateOfBirth') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.dateOfBirth, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'email') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.email, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'firstName') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.firstName, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'idProofNumber') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.idProofNumber, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'idProofTypeCode') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.idProofTypeCode, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'issuingCountryCode') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.issuingCountryCode, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'lastName') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.lastName, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'mobileNumber') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.mobileNumber, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'idExpiryDate') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.idExpiryDate, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'gender') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.gender, disabled: !editMode });
            } else {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            }
        });
        if(userData.addressList!=undefined || userData.addressList!=null){
        userFormFields.addressKycList.forEach(formField => {
            if (formField.kycMetaDataField === 'location') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.addressList[0].location, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'addressLine1') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.addressList[0].addressLine1, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'addressLine2') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.addressList[0].addressLine2, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'city') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.addressList[0].city, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'addressType') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.addressList[0].addTypeCode, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'country') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.addressList[0].countryCode, disabled: !editMode });
            } else if (formField.kycMetaDataField === 'regionName') {
                group[formField.kycMetaDataField] = new FormControl({ value: userData.addressList[0].regionCode, disabled: !editMode });
            } else {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            }

        });
    }
     else{
         
        userFormFields.addressKycList.forEach(formField => {
            if (formField.kycMetaDataField === 'location') {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            } else if (formField.kycMetaDataField === 'addressLine1') {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            } else if (formField.kycMetaDataField === 'addressLine2') {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            } else if (formField.kycMetaDataField === 'city') {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            } else if (formField.kycMetaDataField === 'addressType') {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            } else if (formField.kycMetaDataField === 'country') {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            } else if (formField.kycMetaDataField === 'regionName') {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            } else {
                group[formField.kycMetaDataField] = new FormControl({ value: '', disabled: !editMode });
            }

        });
     }
        group['status'] =  new FormControl({value: ''});
        group['fromdate'] =  new FormControl({value: ''});
        group['todate'] =  new FormControl({value: ''});
        return new FormGroup(group);
    }

    getUsersOfWallet(walletOwnerCode: string): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_WALLET_OWNER_USER +
            '/all?userCode=' + walletOwnerCode + '&limit=30&offset=0');
    }

    getUserByCode(userCode: string): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_WALLET_OWNER_USER + '/' + userCode);
    }

    get passwordOptions() {
        return [
            { code: 'email', label: 'Email' },
            { code: 'sms', label: 'SMS' },
            { code: 'both', label: 'Both' }
        ];
    }

    get userTypes(): Observable<any> {
        if (this.userTypeResponse && this.userTypeResponse.resultCode === '0') {
            return new Observable(observer => {
                observer.next(this.userTypeResponse);
            });
        } else {
            return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + WalletOwnerConstants.masters.WALLET_OWNER_USER_TYPE);
        }
    }

    fetchFields(userTypeCode: string): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_KYC_USER_FIELDS + '/' + userTypeCode);
    }
    formatDatePicker(date : any){
           if(date!=""){
        return formatDate(date.year+'-'+ date.month+'-'+ date.day, "yyyy-MM-dd", "en") ;
           }
           

    }
    prepareWaletOwnerUserRequest(formData: any, userTypeCode: string, walletOwnerCategoryCode: string,status:string): WalletOwnerUserRequestModel {
        let walletOwnerUserRequest: WalletOwnerUserRequestModel;
        walletOwnerUserRequest = {
           
            code: formData.code,
            
            userName: formData.userName,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            walletOwnerUserTypeCode: userTypeCode,
            // walletOwnerCategoryCode: walletOwnerCategoryCode,
            walletOwnerCategoryCode : userTypeCode,
            userCode: formData.userCode,
            gender: formData.gender,
            
            dateOfBirth: this.formatDatePicker(formData.dateOfBirth),//? this.commonHelperService.formatDate(formData.dateOfBirth) : undefined,
            idProofTypeCode: formData.idProofTypeCode,
            idProofNumber: formData.idProofNumber,
            issuingCountryCode: formData.issuingCountryCode,
            idExpiryDate: this.formatDatePicker(formData.idExpiryDate==null?'':formData.idExpiryDate) ,//? this.commonHelperService.formatDate(formData.idExpiryDate) : undefined,
            addressList: [{
               
                addTypeCode: formData.addressType,
                countryCode: formData.country,
               // regionCode :"100017",    // hard coded   :: need to discuss with team 
                regionCode: formData.regionName,
                city: formData.city,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                location: formData.location
                
            }]
        };
        console.log('--walletOwnerUserRequest--', walletOwnerUserRequest);
        return walletOwnerUserRequest;
    }

    createWalletOwnerUser(walletOwnerUserRequest: WalletOwnerUserRequestModel, userTypeCode :string): Observable<any> {
        if( userTypeCode ==  WalletOwnerConstants.category.SUPERVISOR){
            return this.http.post(this.endpoints.E_WALLET_WALLET_OWNER_USER + '/supervisor', walletOwnerUserRequest);
        }else if ( userTypeCode ==  WalletOwnerConstants.category.CASHIER){
            return this.http.post(this.endpoints.E_WALLET_WALLET_OWNER_USER + '/cashier', walletOwnerUserRequest);

        }
      
    }

    updateWalletOwnerUser(walletOwnerUserRequest: WalletOwnerUserRequestModel,userTypeCode  : string): Observable<any> {
       console.log('userTypeCode'+ userTypeCode);
      
       
       if( userTypeCode ==  WalletOwnerConstants.category.SUPERVISOR){
            return this.http.put(this.endpoints.E_WALLET_WALLET_OWNER_USER + '/supervisor/' + walletOwnerUserRequest.code, walletOwnerUserRequest);
       }else if ( userTypeCode ==  WalletOwnerConstants.category.CASHIER){
            return this.http.put(this.endpoints.E_WALLET_WALLET_OWNER_USER + '/cashier/' + walletOwnerUserRequest.code, walletOwnerUserRequest);
       }
    }

    public makeEntryToApproval(userInfo: any, updatedData?: any): Observable<any> {
        const approvalRequest = this.prepareDataApprovalRequest(userInfo, updatedData);
        console.log('--approvalRequest--', approvalRequest);
        return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
    }

    private prepareDataApprovalRequest(userInfo: any, updatedData?: any) {
         let dataApprovalList = [];

            dataApprovalList.push({
        
            featureCode: ApprovalConstants.featureCode.WALLET_OWNER_USER,
            entityCode: userInfo.code,
            actionType: updatedData ? 'Updated' : 'Created',
            updatedInformation: updatedData ? updatedData :{},
            comments: '',
            status:  updatedData ? ApprovalConstants.status.code.UPDATED :ApprovalConstants.status.code.CREATED,
            assignTo: '',
            entityName: userInfo.userName,
            
        });
        return {dataApprovalList : dataApprovalList};
    }
    prepareUpdateInformation(unChangedData: any, updatedData: any,status,todate,fromdate) {
         console.log(status , 'updatedData.addressList',unChangedData);
        let updatedInfo: any = {};
        

        if(unChangedData.firstName != updatedData.firstName){
        updatedInfo.firstName = updatedData.firstName;
        }
        if(unChangedData.lastName != updatedData.lastName){
            updatedInfo.lastName = updatedData.lastName;
            }
            if(unChangedData.userName != updatedData.userName){
                updatedInfo.userName = updatedData.userName;
                }
                if(unChangedData.mobileNumber != updatedData.mobileNumber){
                    updatedInfo.mobileNumber = updatedData.mobileNumber;
                    }
                    if(unChangedData.walletOwnerUserTypeName != updatedData.walletOwnerUserTypeName){
                        updatedInfo.walletOwnerUserTypeName = updatedData.walletOwnerUserTypeName;
                        }
                        if(unChangedData.walletOwnerCategoryName != updatedData.walletOwnerCategoryName){
                            updatedInfo.walletOwnerCategoryName = updatedData.walletOwnerCategoryName;
                            }
                            if(unChangedData.userCode != updatedData.userCode){
                                updatedInfo.userCode = updatedData.userCode;
                                }
                              
                                    if(unChangedData.gender != updatedData.gender){
                                        updatedInfo.gender = updatedData.gender;
                                        }
                                   
                                            if(unChangedData.dateOfBirth != updatedData.dateOfBirth){
                                                updatedInfo.dateOfBirth = this.formatDatePicker(updatedData.dateOfBirth);
                                                }
                                                if(unChangedData.idProofTypeName != updatedData.idProofTypeName){
                                                    updatedInfo.idProofTypeName = updatedData.idProofTypeName;
                                                    }
                                                    if(unChangedData.idProofNumber != updatedData.idProofNumber){
                                                        updatedInfo.idProofNumber = updatedData.idProofNumber;
                                                        }
                                                        if(unChangedData.issuingCountryName != updatedData.issuingCountryName){
                                                            updatedInfo.issuingCountryName = updatedData.issuingCountryName;
                                                            }
                                                            if(unChangedData.idExpiryDate != updatedData.idExpiryDate){
                                                                updatedInfo.idExpiryDate = this.formatDatePicker(updatedData.idExpiryDate);
                                                                }
                                                                if(unChangedData.email != updatedData.email){
                                                                    updatedInfo.email = updatedData.email;
                                                                    }
                                                                    if(unChangedData.status != status){
                                                                        updatedInfo.status = status;
                                                                        }
                                                                     if(status == ApprovalConstants.status.code.SUSPENDED){   
                                                                        if(unChangedData.toDate != todate){
                                                                            updatedInfo.toDate = todate;
                                                                            }
                                                                            if(unChangedData.fromDate != fromdate){
                                                                                updatedInfo.fromDate = fromdate;
                                                                                }
                                                                            }
                                                                     
               for(let i=0; i < unChangedData.addressList.length  ; i++){
                    let addressList : any = {};
                    console.log('unChangedData.addressList[i]',unChangedData.addressList[i]);
                    if(unChangedData.addressList[i].addressLine1 != updatedData.addressLine1){
                        addressList.addressLine1 = updatedData.addressLine1;
                    }
                    if(unChangedData.addressList[i].addressLine2!=updatedData.addressLine2){
                        addressList.addressLine2 = updatedData.addressLine2;
                    }
                    if(unChangedData.addressList[i].city!=updatedData.city){
                        addressList.city = updatedData.city;
                    }
                    if(unChangedData.addressList[i].location!=updatedData.location){
                        addressList.location = updatedData.location;
                    }
                    if(unChangedData.addressList[i].addTypeCode != updatedData.addressType){
                        addressList.addTypeCode = updatedData.addressType;
                        addressList.addTypeName = unChangedData.addressList[i].addTypeName;
                        
                    }
                    if(unChangedData.addressList[i].regionCode!=updatedData.regionName){
                        addressList.regionCode = updatedData.regionName;
                        addressList.regionName = unChangedData.addressList[i].regionName;
                    }
                    if(unChangedData.addressList[i].countryCode!=updatedData.country){
                        addressList.countryCode = updatedData.country;
                        addressList.countryName = unChangedData.addressList[i].countryName;
                    }
                    console.log('addressList ', this.isEmptyObject(addressList));
                   
                   if(!this.isEmptyObject(addressList)){
                     updatedInfo.addressList=[];
                     updatedInfo.addressList.push(addressList);
                   }

                }                                                                   
        return updatedInfo;
        
    }
    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
      }

    resetPassword(code: string){
            return this.http.put(this.endpoints.E_WALLET_WALLETOWNERUSER_RESET_PASSWORD_URL +'/'+code,'');
    }
    resetPin(code : string){
        return this.http.put(this.endpoints.E_WALLET_WALLETOWNERUSER_RESET_PIN_URL +'/'+code,'');
    }
}
