import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormArrayName } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../../shared/endpoints';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { WalletOwnerBasicInfoRequestModel } from '../add-wallet-owner/basic-info/wallet-owner-basic-info-request.model';
import { AddWalletOwnerService } from '../add-wallet-owner/add-wallet-owner-service';
import { WalletOwnerConstants } from '../wallet-owner.constants';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { ApprovalConstants } from '../../approval/approval.constants';
import { ApprovalService } from '../../approval/approval.service';
import { WalletOwnerAddressRequest } from '../add-wallet-owner/address/wallet-owner-address-request.model';

@Injectable()
export class ViewWalletOwnerService {

    basicInfoForm: FormGroup;
    bankDetailsForm: FormGroup;
    selectedCountries: any[];
    constructor(private http: HttpClient,
        private router: Router,
        private endpoints: Endpoints,
        private addWalletOwnerService: AddWalletOwnerService,
        private commonHelperService: CommonHelperService,
        private approvalService: ApprovalService) { }

    // ----------------------- Basic INFO -----------------------

    createBasicInfoForm(walletOwner: any, editMode: boolean): FormGroup {
        let group = {};
        group['businessName'] = new FormControl({ value: walletOwner.businessName, disabled: !editMode });
        group['businessTypeCode'] = new FormControl({ value: walletOwner.businessTypeCode, disabled: !editMode });
        group['email'] = new FormControl({ value: walletOwner.email, disabled: !editMode });
        group['groupCode'] = new FormControl({ value: walletOwner.groupCode, disabled: !editMode });
        group['idExpiryDate'] = new FormControl({ value: walletOwner.idExpiryDate, disabled: !editMode });
        group['idProofNumber'] = new FormControl({ value: walletOwner.idProofNumber, disabled: !editMode });
        group['idProofTypeCode'] = new FormControl({ value: walletOwner.idProofTypeCode, disabled: !editMode });
        group['issuingCountryCode'] = new FormControl({ value: walletOwner.issuingCountryCode, disabled: true });
        group['registerCountryCode'] = new FormControl({ value: walletOwner.registerCountryCode, disabled: true }, Validators.required);
        group['lineOfBusiness'] = new FormControl({ value: walletOwner.lineOfBusiness, disabled: !editMode });
        group['mobileNumber'] = new FormControl({ value: walletOwner.mobileNumber, disabled: !editMode });
        group['code'] = new FormControl({ value: walletOwner.code, disabled: true });
        group['ownerName'] = new FormControl({ value: walletOwner.ownerName, disabled: !editMode }, Validators.required);
        if (walletOwner.walletOwnerCategoryCode) {
            group['walletOwnerCategoryCode'] = new FormControl({ value: walletOwner.walletOwnerCategoryCode, disabled: true }, Validators.required);
        }
        if (walletOwner.walletOwnerParentCode) {
            group['walletOwnerParentCode'] = new FormControl({ value: walletOwner.walletOwnerParentCode, disabled: true }, Validators.required);
        }
        if (walletOwner.dateOfBirth) {
            group['dateOfBirth'] = new FormControl({ value: walletOwner.dateOfBirth, disabled: !editMode }, Validators.required);
        }
        if (walletOwner.gender) {
            group['gender'] = new FormControl({ value: walletOwner.gender, disabled: !editMode }, Validators.required);
        }
        if (walletOwner.gender) {
            group['lastName'] = new FormControl({ value: walletOwner.lastName, disabled: !editMode }, Validators.required);
        }
        return new FormGroup(group);
    }

    public updateBasicInfo(walletOwnerCode: string, basicInfoData: any): Observable<any> {
        if (basicInfoData.idExpiryDate) {
            basicInfoData.idExpiryDate = this.commonHelperService.formatDate(basicInfoData.idExpiryDate);
        }
        if (basicInfoData.dateOfBirth) {
            basicInfoData.dateOfBirth = this.commonHelperService.formatDate(basicInfoData.dateOfBirth);
        }
        return this.http.put(this.endpoints.E_WALLET_OWNER_URL + '/' + walletOwnerCode,
            basicInfoData);
    }

    prepareBasicInfoUpdatedData(unchangedData: any, changedData: any): any {
        let updatedData: any = {};
        if (unchangedData.businessName != changedData.businessName) {
            updatedData.businessName = changedData.businessName;
        }
        if (unchangedData.businessTypeCode != changedData.businessTypeCode) {
            updatedData.businessTypeCode = changedData.businessTypeCode;
        }
        if (unchangedData.email != changedData.email) {
            updatedData.email = changedData.email;
        }
        if (unchangedData.groupCode != changedData.groupCode) {
            updatedData.groupCode = changedData.groupCode;
        }
        if (unchangedData.idExpiryDate != changedData.idExpiryDate) {
            updatedData.idExpiryDate = changedData.idExpiryDate;
        }
        if (unchangedData.idProofNumber != changedData.idProofNumber) {
            updatedData.idProofNumber = changedData.idProofNumber;
        }
        if (unchangedData.idProofTypeCode != changedData.idProofTypeCode) {
            updatedData.idProofTypeCode = changedData.idProofTypeCode;
        }
        if (unchangedData.issuingCountryCode != changedData.issuingCountryCode) {
            updatedData.issuingCountryCode = changedData.issuingCountryCode;
        }
        if (unchangedData.lineOfBusiness != changedData.lineOfBusiness) {
            updatedData.lineOfBusiness = changedData.lineOfBusiness;
        }
        if (unchangedData.mobileNumber != changedData.mobileNumber) {
            updatedData.mobileNumber = changedData.mobileNumber;
        }
        if (unchangedData.ownerName != changedData.ownerName) {
            updatedData.ownerName = changedData.ownerName;
        }
        if (unchangedData.registerCountryCode != changedData.registerCountryCode) {
            updatedData.registerCountryCode = changedData.registerCountryCode;
        }
        return updatedData;
    }

    // ----------------------- Address -----------------------

    getCountryOnCode(countryCode: string, countryList: any[]) {
        for (let i = 0; i < countryList.length; i++) {
            if (countryList[i].code === countryCode) {
                return countryList[i];
            }
        }
    }

    getAddresses(walletOwnerCode: string): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_OWNER_ADDRESS_URL + '/' + walletOwnerCode);
    }

    createAddressForms(addressList: any[], editMode: boolean): FormArray {
        let addresses = new FormArray([]);
        if (addressList.length > 0) {
            addressList.forEach(address => {
                addresses.push(new FormGroup({
                    addTypeCode: new FormControl({ value: address.addTypeCode, disabled: true }, Validators.required),
                    countryCode: new FormControl({ value: address.countryCode, disabled: !editMode }, Validators.required),
                    regionCode: new FormControl({ value: address.regionCode, disabled: !editMode }, Validators.required),
                    city: new FormControl({ value: address.city, disabled: !editMode }),
                    addressLine1: new FormControl({ value: address.addressLine1, disabled: !editMode }, Validators.required),
                    addressLine2: new FormControl({ value: address.addressLine2, disabled: !editMode }),
                    location: new FormControl({ value: address.location, disabled: !editMode }, Validators.required)
                }));
            });
        } else {
            addresses.push(this.blankAddressForm);
        }
        return addresses;
    }

    get blankAddressForm() {
        return new FormGroup({
            addTypeCode: new FormControl('', Validators.required),
            countryCode: new FormControl('', Validators.required),
            regionCode: new FormControl('', Validators.required),
            city: new FormControl(''),
            addressLine1: new FormControl('', Validators.required),
            addressLine2: new FormControl(''),
            location: new FormControl('', Validators.required)
        });
    }

    public updateAddressData(walletOwnerCode: string, addressData: any, newAddress?: boolean): Observable<any> {
        if (newAddress) {
            addressData = this.transformAddressToAdd(addressData)
            this.addWalletOwnerService.walletOwnerId = walletOwnerCode;
            return this.addWalletOwnerService.submitAddress(addressData);
        } else {
            return this.http.put(this.endpoints.E_WALLET_OWNER_ADDRESS_URL + '/' + walletOwnerCode,
                this.prepareAddressRequest(walletOwnerCode, addressData.addresses));
        }
    }

    private transformAddressToAdd(addressData: any) {
        const address = [];
        addressData.addresses.forEach(element => {
            address.push({
                address: {
                    addressType: element.addTypeCode,
                    addressLine1: element.addressLine1,
                    addressLine2: element.addressLine2,
                    country: element.countryCode,
                    city: element.city,
                    regionName: element.regionCode,
                    location: element.location
                }
            });
        });
        return address;
    }

    private prepareAddressRequest(walletOwnerCode: string, addressData: any[]) {
        console.log('--q--', addressData);
        const addressRequest = [];
        addressData.forEach(element => {
            addressRequest.push({
                addTypeCode: element.addTypeCode,
                addressLine1: element.addressLine1,
                addressLine2: element.addressLine2,
                countryCode: element.countryCode,
                regionCode: element.regionCode,
                city: element.city,
                location: element.location
            });
        });
        console.log('--w--', addressRequest);
        return {
            addressList: addressRequest
        };
    }

    prepareAddressUpdatedData(unchangedData: any[], changedData: any, walletOwnerCode: string): any {
        console.log('--unchangedData--', unchangedData);
        console.log('--changedData--', changedData);
        let updatedData: any[] = [];
        if (unchangedData.length === changedData.addresses.length) {
            for (let i = 0; i < unchangedData.length; i++) {
                updatedData.push(this.prepareAddressUpdatedItem(unchangedData[i], changedData.addresses[i]));
            }
        } else if (unchangedData.length < changedData.addresses.length) {
            // taking second because we can have 2 address only; and second is new one
            updatedData.push(this.prepareAddressUpdatedItem(unchangedData[0], changedData.addresses[0]))
            updatedData.push(changedData.addresses[1]);
        } else if (unchangedData.length > changedData.addresses.length) {
            updatedData.push(this.prepareAddressUpdatedItem(unchangedData[0], changedData.addresses[0]));
        } else {
            console.log('--need to handle--');
        }
        // TODO: remove walletOwnerCode;
        return { addressList: updatedData, walletOwnerCode: walletOwnerCode };
    }

    prepareAddressUpdatedItem(unchangedData: any, changedData: any): any {
        let updatedData: any = {};
        if (unchangedData.addTypeCode != changedData.addTypeCode) {
            updatedData.addTypeCode = changedData.addTypeCode;
        }
        if (unchangedData.addressLine1 != changedData.addressLine1) {
            updatedData.addressLine1 = changedData.addressLine1;
        }
        if (unchangedData.addressLine2 != changedData.addressLine2) {
            updatedData.addressLine2 = changedData.addressLine2;
        }
        if (unchangedData.city != changedData.city) {
            updatedData.city = changedData.city;
        }
        if (unchangedData.location != changedData.location) {
            updatedData.location = changedData.location;
        }
        if (unchangedData.countryCode != changedData.countryCode) {
            updatedData.countryCode = changedData.countryCode;
        }
        if (unchangedData.regionCode != changedData.regionCode) {
            updatedData.regionCode = changedData.regionCode;
        }
        return updatedData;
    }

    // ----------------------- Bank Details -----------------------

    public updateBankDetails(walletOwnerCode: string, request: any): Observable<any> {
        return this.http.put(this.endpoints.E_WALLET_BANK_DETAILS_URL + '/' + walletOwnerCode, request);
    }

    prepareBankDetailsUpdatedData(unchangedData: any, changedData: any): any {
        let updatedData: any = {};
        if (unchangedData.accountName != changedData.accountName) {
            updatedData.accountName = changedData.accountName;
        }
        if (unchangedData.accountNumber != changedData.accountNumber) {
            updatedData.accountNumber = changedData.accountNumber;
        }
        if (unchangedData.accountType != changedData.accountType) {
            updatedData.accountType = changedData.accountType;
        }
        if (unchangedData.branchName != changedData.branchName) {
            updatedData.branchName = changedData.branchName;
        }
        if (unchangedData.finInstitutionCode != changedData.finInstitutionCode) {
            updatedData.finInstitutionCode = changedData.finInstitutionCode;
        }
        if (unchangedData.routingNo != changedData.routingNo) {
            updatedData.routingNo = changedData.routingNo;
        }
        return updatedData;
    }

    getBankDetails(walletOwnerCode: string): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_BANK_DETAILS_URL + '/' + walletOwnerCode);
    }

    createBankDetails(settlementAccount: any, editMode: boolean): FormGroup {
        let accountName = '',
            finInstitutionTypeCode = WalletOwnerConstants.identifiers.BANK_DETAILS_BANK_CODE,
            accountNumber = '',
            accountType = '',
            branchName = '',
            routingNo = '',
            finInstitutionCode = ''
        const bankInfo = settlementAccount;
        if (bankInfo) {
            accountName = bankInfo.walletOwnerName;
            finInstitutionTypeCode = bankInfo.finInstitutionTypeCode;
            accountNumber = bankInfo.accountNumber;
            accountType = bankInfo.accountType;
            branchName = bankInfo.branchName;
            routingNo = bankInfo.routingNo;
            finInstitutionCode = bankInfo.finInstitutionCode;
        }
        this.bankDetailsForm = new FormGroup({
            accountName: new FormControl({ value: accountName, disabled: !editMode }, Validators.required),
            branchName: new FormControl({ value: branchName, disabled: !editMode }, Validators.required),
            routingNo: new FormControl({ value: routingNo, disabled: !editMode }, Validators.required),
            accountNumber: new FormControl({ value: accountNumber, disabled: !editMode }, Validators.required),
            confirmAccountNumber: new FormControl({ value: accountNumber, disabled: !editMode }, Validators.required),
            finInstitutionCode: new FormControl({ value: finInstitutionCode, disabled: !editMode }, Validators.required),
            accountType: new FormControl({ value: accountType, disabled: !editMode }, Validators.required)
        });

        return this.bankDetailsForm;
    }

    // ----------------------- Documents -----------------------

    public createDocumentsForm(docs: any[], editMode: boolean): FormArray {
        let documents = new FormArray([]);
        if (docs.length > 0) {
            docs.forEach(doc => {
                documents.push(new FormGroup({
                    fileName: new FormControl({ value: doc.fileName, disabled: true }, Validators.required),
                    documentType: new FormControl({ value: doc.documentTypeCode, disabled: true })
                }));
            });
        }
        return documents;
    }

    // -----------------------------------------------
    public putWallet(request: any,code:string): Observable<any> {
        return this.http.put(this.endpoints.E_WALLET_WALLET_URL+'/'+code, request);
    }
    prepareDataApprovalRequest(stage: string, entityCode: string, entityName: string, updatedInformation: any, entityData: any) {
        let featureCode: string;
        if (stage === WalletOwnerConstants.stage.BASIC_INFO) {
            featureCode = ApprovalConstants.featureCode.WALLET_OWNER;
        } else if (stage === WalletOwnerConstants.stage.ADDRESS) {
            featureCode = ApprovalConstants.featureCode.WALLET_OWNER_ADDRESS;
        } else if (stage === WalletOwnerConstants.stage.BANK) {
            featureCode = ApprovalConstants.featureCode.WALLET_OWNER_BANK;
        } else if (stage === WalletOwnerConstants.stage.DOCUMENT) {
            featureCode = ApprovalConstants.featureCode.WALLET_OWNER_DOCUMENT;
        }
        else if (stage === WalletOwnerConstants.stage.WALLET) {
            featureCode = ApprovalConstants.featureCode.OWNERWALLET;
        }
        else if (stage === WalletOwnerConstants.stage.TEMPLATE) {
            featureCode = ApprovalConstants.featureCode.OWNERTEMPLATE;
        }
        return {
            dataApprovalList: [
                {
                    featureCode: featureCode,
                    entityCode: entityCode,
                    actionType: ApprovalConstants.status.text.UPDATED,
                    updatedInformation: updatedInformation,
                    comments: '',
                    status: ApprovalConstants.status.code.UPDATED,
                    assignTo: '',
                    entityName: entityName,
                    entity: this.prepareEntity(entityData)
                }
            ]
        };
    }

    public makeApprovalEntry(dataApprovalRequest: any): Observable<any> {
        return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, dataApprovalRequest);
    }

    private prepareEntity(entityData: any) {
        if (Array.isArray(entityData)) {
            const addresses = [];
            entityData.forEach(address => {
                addresses.push({
                    ...address,
                    state: ApprovalConstants.status.code.UPDATED,
                    status: this.approvalService.getDataApprovalStatus(address.status)
                });
            });
            return {
                addressList: addresses
            };
        } else {
            return {
                ...entityData,
                state: ApprovalConstants.status.code.UPDATED,
                status: this.approvalService.getDataApprovalStatus(entityData.status)
            };
        }
    }

}