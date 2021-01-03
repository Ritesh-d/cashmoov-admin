import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Endpoints } from '../../../shared/endpoints';
import { HttpClient } from '@angular/common/http';
import { WalletOwnerConstants } from '../../../wallet-owner/wallet-owner.constants';
import { Observable } from 'rxjs';

@Injectable()
export class DetailsWalletOwnerService {


    addressTypeList: any[];
    countryList: any[];
    regionList: any[];

    constructor(private http: HttpClient,
        private endpoints: Endpoints) {

    }

    public getWalletOwnerByCode(walletOwnerCode: string): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_OWNER_URL + '/' + walletOwnerCode);
    }
    public formatDate(date) {
        if(date!=''){
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
        }
    }
    fetchFormFields(categoryCode: string): Observable<any> {
        return this.http.get<any>(this.endpoints.E_WALLET_KYC_FIELDS + '/' + categoryCode);
    }

    // ----------------------- BasicInfo -----------------------
    createBasicInfoForm(basicInfoFields: any[], walletOwner: any): FormGroup {
        let group = {};
        group['businessName'] = new FormControl({ value: walletOwner.businessName, disabled: true });
        group['businessTypeCode'] = new FormControl({ value: walletOwner.businessTypeName, disabled: true });
        group['email'] = new FormControl({ value: walletOwner.email, disabled: true });
        group['groupCode'] = new FormControl({ value: walletOwner.groupName, disabled: true });
        group['idExpiryDate'] = new FormControl({ value: this.formatDate(walletOwner.idExpiryDate==null?'':walletOwner.idExpiryDate), disabled: true });
        group['idProofNumber'] = new FormControl({ value: walletOwner.idProofNumber, disabled: true });
        group['idProofTypeCode'] = new FormControl({ value: walletOwner.idProofTypeName, disabled: true });
        group['issuingCountryCode'] = new FormControl({ value: walletOwner.issuingCountryName, disabled: true });
        group['registerCountryCode'] = new FormControl({ value: walletOwner.registerCountryName, disabled: true });
        group['lineOfBusiness'] = new FormControl({ value: walletOwner.lineOfBusiness, disabled: true });
        group['mobileNumber'] = new FormControl({ value: walletOwner.mobileNumber, disabled: true });
        group['code'] = new FormControl({ value: walletOwner.code, disabled: true });
        group['ownerName'] = new FormControl({ value: walletOwner.ownerName, disabled: true });
        if (walletOwner.walletOwnerCategoryCode) {
            group['walletOwnerCategoryCode'] = new FormControl({ value: walletOwner.walletOwnerCategoryName, disabled: true });
        }
        if (walletOwner.walletOwnerParentCode) {
            group['walletOwnerParentCode'] = new FormControl({ value: walletOwner.walletOwnerParentCode, disabled: true });
        }
        if(walletOwner.dateOfBirth===undefined){
            group['dateOfBirth'] = new FormControl({ value: '', disabled: true });
        }
        if (walletOwner.dateOfBirth) {
            group['dateOfBirth'] = new FormControl({ value: this.formatDate(walletOwner.dateOfBirth), disabled: true });
        }
        if(walletOwner.gender===undefined){
            group['gender'] = new FormControl({ value: '', disabled: true });
        }
        if (walletOwner.gender) {
            group['gender'] = new FormControl({ value: walletOwner.gender, disabled: true });
        }
        if(walletOwner.lastName===undefined){
            group['lastName'] = new FormControl({ value: '', disabled: true });
        }
        if (walletOwner.lastName) {
            group['lastName'] = new FormControl({ value: walletOwner.lastName, disabled: true });
        }
        if (walletOwner.walletExists===true || walletOwner.walletExists===false) {
                let openacc=walletOwner.walletExists===true?"Open":"Not Open";

            group['walletExists'] = new FormControl({ value: openacc, disabled: true });
        }
   
      
        return new FormGroup(group);
    }
    updatedBasicInfoData(approvalData: any): any[] {
        const updatedBasicInfo = [];
        if (approvalData.updatedInformation.businessName) {
            updatedBasicInfo.push({
                key: 'businessName',
                changed: true,
                previousValue: approvalData.entity.businessName
            });
        }
        if (approvalData.updatedInformation.businessTypeCode) {
            updatedBasicInfo.push({
                key: 'businessTypeCode',
                changed: true,
                previousValue: approvalData.entity.businessTypeName
            });
        }
        if (approvalData.updatedInformation.email) {
            updatedBasicInfo.push({
                key: 'email',
                changed: true,
                previousValue: approvalData.entity.email
            });
        }
        if (approvalData.updatedInformation.gender) {
            updatedBasicInfo.push({
                key: 'gender',
                changed: true,
                previousValue: approvalData.entity.gender
            });
        }
        if (approvalData.updatedInformation.groupCode) {
            updatedBasicInfo.push({
                key: 'groupCode',
                changed: true,
                previousValue: approvalData.entity.groupCode
            });
        }
        if (approvalData.updatedInformation.idExpiryDate) {
            updatedBasicInfo.push({
                key: 'idExpiryDate',
                changed: true,
                previousValue: approvalData.entity.idExpiryDate
            });
        }
        if (approvalData.updatedInformation.idProofNumber) {
            updatedBasicInfo.push({
                key: 'idProofNumber',
                changed: true,
                previousValue: approvalData.entity.idProofNumber
            });
        }
        if (approvalData.updatedInformation.idProofTypeCode) {
            updatedBasicInfo.push({
                key: 'idProofTypeCode',
                changed: true,
                previousValue: approvalData.entity.idProofTypeName
            });
        }
        if (approvalData.updatedInformation.issuingCountryCode) {
            updatedBasicInfo.push({
                key: 'issuingCountryCode',
                changed: true,
                previousValue: approvalData.entity.issuingCountryName
            });
        }
        if (approvalData.updatedInformation.lineOfBusiness) {
            updatedBasicInfo.push({
                key: 'lineOfBusiness',
                changed: true,
                previousValue: approvalData.entity.lineOfBusiness
            });
        }
        if (approvalData.updatedInformation.mobileNumber) {
            updatedBasicInfo.push({
                key: 'mobileNumber',
                changed: true,
                previousValue: approvalData.entity.mobileNumber
            });
        }
        if (approvalData.updatedInformation.ownerName) {
            updatedBasicInfo.push({
                key: 'ownerName',
                changed: true,
                previousValue: approvalData.entity.ownerName
            });
        }
        if (approvalData.updatedInformation.registerCountryCode) {
            updatedBasicInfo.push({
                key: 'registerCountryCode',
                changed: true,
                previousValue: approvalData.entity.registerCountryName
            });
        }
        return updatedBasicInfo;
    }
    // ----------------------- Address -----------------------
    getAddressDetails(walletOwnerCode: string): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_OWNER_ADDRESS_URL + '/' + walletOwnerCode);
    }
    createAddressForms(addressFormFields: any[], addressList: any[], newAddresses?: any[]): FormArray {
        let addresses = new FormArray([]);
        if (addressList.length > 0) {
            addressList.forEach(address => {
                addresses.push(new FormGroup({
                    addressType: new FormControl({ value: address.addTypeName, disabled: true }),
                    country: new FormControl({ value: address.countryName, disabled: true }),
                    regionName: new FormControl({ value: address.regionName, disabled: true }),
                    city: new FormControl({ value: address.city, disabled: true }),
                    addressLine1: new FormControl({ value: address.addressLine1, disabled: true }),
                    addressLine2: new FormControl({ value: address.addressLine2, disabled: true }),
                    location: new FormControl({ value: address.location, disabled: true }),
                }));
            });
        }
        if (newAddresses && newAddresses.length > 0) {
            newAddresses.forEach(address => {
                addresses.push(new FormGroup({
                    addressType: new FormControl({ value: this.getAddTypeNameOnCode(address.addTypeCode), disabled: true }),
                    country: new FormControl({ value: this.getCountryNameOnCode(address.countryCode), disabled: true }),
                    regionName: new FormControl({ value: this.getRegionNameOnCode(address.regionCode), disabled: true }),
                    city: new FormControl({ value: address.city, disabled: true }),
                    addressLine1: new FormControl({ value: address.addressLine1, disabled: true }),
                    addressLine2: new FormControl({ value: address.addressLine2, disabled: true }),
                    location: new FormControl({ value: address.location, disabled: true }),
                }));
            });
        }
        return addresses;
    }
    getValueifExist(addressItem: any, field: string) {
        if (addressItem && addressItem[field]) {
            console.log('--returning--', addressItem[field]);
            return addressItem[field];
        } else {
            return;
        }
    }
    updatedAddressData(approvalData: any): any[] {
        const updatedAddressList = [];
        // console.log('--1--', approvalData.updatedInformation);
        for (let i = 0; i < approvalData.updatedInformation.addressList.length; i++) {
            console.log('--i--', i);
            const address = [];
            if (approvalData.updatedInformation.addressList[i] &&
                (Object.keys(approvalData.updatedInformation.addressList[i]).length === 0)) {
                updatedAddressList.push(address);
                console.log('--return--');
                // TODO: need to continue
                continue;
            } else {
                console.log('--else--', i, approvalData.updatedInformation);
                if (approvalData.updatedInformation.addressList[i].addressLine1) {
                    address.push({
                        key: 'addressLine1',
                        changed: true,
                        // previousValue: approvalData.entity.addressList[i].addressLine1,
                        previousValue: this.getValueifExist(approvalData.entity.addressList[i], 'addressLine1')
                    });
                }
                if (approvalData.updatedInformation.addressList[i].addressLine2) {
                    address.push({
                        key: 'addressLine2',
                        changed: true,
                        // previousValue: approvalData.entity.addressList[i].addressLine2
                        previousValue: this.getValueifExist(approvalData.entity.addressList[i], 'addressLine2')
                    });
                }
                if (approvalData.updatedInformation.addressList[i].city) {
                    address.push({
                        key: 'city',
                        changed: true,
                        // previousValue: approvalData.entity.addressList[i].city
                        previousValue: this.getValueifExist(approvalData.entity.addressList[i], 'city')
                    });
                }
                if (approvalData.updatedInformation.addressList[i].countryCode) {
                    address.push({
                        key: 'country',
                        changed: true,
                        // previousValue: approvalData.entity.addressList[i].countryCode
                        previousValue: this.getValueifExist(approvalData.entity.addressList[i], 'countryName')
                    });
                }
                if (approvalData.updatedInformation.addressList[i].location) {
                    address.push({
                        key: 'location',
                        changed: true,
                        // previousValue: approvalData.entity.addressList[i].location
                        previousValue: this.getValueifExist(approvalData.entity.addressList[i], 'location')
                    });
                }
                if (approvalData.updatedInformation.addressList[i].regionCode) {
                    address.push({
                        key: 'regionName',
                        changed: true,
                        // previousValue: approvalData.entity.addressList[i].regionCode
                        previousValue: this.getValueifExist(approvalData.entity.addressList[i], 'regionName')
                    });
                }
                updatedAddressList.push(address);
            }

        }
        return updatedAddressList;
    }
    getAddTypeNameOnCode(addTypeCode: string): string {
        if (this.addressTypeList) {
            for (let i = 0; i < this.addressTypeList.length; i++) {
                if (addTypeCode === this.addressTypeList[i].code) {
                    return this.addressTypeList[i].type;
                }
            }
        }
        return 'not found';
    }
    getCountryNameOnCode(countryCode: string): string {
        if (this.countryList) {
            for (let i = 0; i < this.countryList.length; i++) {
                if (countryCode === this.countryList[i].code) {
                    return this.countryList[i].name;
                }
            }
        }
        return 'not found';
    }
    getRegionNameOnCode(regionCode: string): string {
        if (this.regionList) {
            for (let i = 0; i < this.regionList.length; i++) {
                if (regionCode === this.regionList[i].code) {
                    return this.regionList[i].name;
                }
            }
        }
        return 'not found';
    }
    async prepareNewAddressMaster() {
        this.addressTypes.subscribe(data => {
            if (data.resultCode === '0') {
                this.addressTypeList = data.addressTypeList;
            }
        });

        this.countries.subscribe(data => {
            if (data.resultCode == '0') {
                this.countryList = data.countryList;
            }
        });

        this.regions.subscribe(data => {
            if (data.resultCode == '0') {
                this.regionList = data.regionList;
            }
        });
    }
    get addressTypes(): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + WalletOwnerConstants.masters.ADDRESS_TYPE);
    }
    get countries(): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_COUNTRY_URL + '/all');
    }
    get regions(): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_REGION_URL + '/all');
    }
    // ----------------------- Bank -----------------------
    getBankDetails(walletOwnerCode: string): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_BANK_DETAILS_URL + '/' + walletOwnerCode);
    }
    createBankDetailsForm(bankDetailsFields: any[], bankData: any) {
        let group = {};
        group['accountName'] = new FormControl({ value: bankData.accountName, disabled: true });
        group['accountType'] = new FormControl({ value: bankData.accountTypeName, disabled: true });
        group['branchName'] = new FormControl({ value: bankData.branchName, disabled: true });
        group['finInstitutionCode'] = new FormControl({ value: bankData.finInstitutionName, disabled: true });
        group['routingNo'] = new FormControl({ value: bankData.routingNo, disabled: true });
        group['accountNumber'] = new FormControl({ value: bankData.accountNumber.replace(/\d(?=\d{4})/g, "*"), disabled: true});
        group['settlementAccount'] = new FormControl({ value: bankData.finInstitutionTypeName, disabled: true });
        group['confirmAccountNumber'] = new FormControl({ value: bankData.accountNumber.replace(/\d(?=\d{4})/g, "*"), disabled: true });
        return new FormGroup(group);
    }
    updatedBankData(approvalData: any): any[] {
        const updatedBank = [];
        console.log('--updatedBankData--', approvalData);
        if (approvalData.updatedInformation.accountName) {
            updatedBank.push({
                key: 'accountName',
                changed: true,
                previousValue: approvalData.entity.accountName
            });
        }
        if (approvalData.updatedInformation.accountNumber) {
            updatedBank.push({
                key: 'accountNumber',
                changed: true,
                previousValue: approvalData.entity.accountNumber
            });
        }
        if (approvalData.updatedInformation.accountType) {
            updatedBank.push({
                key: 'accountType',
                changed: true,
                previousValue: approvalData.entity.accountType
            });
        }
        if (approvalData.updatedInformation.branchName) {
            updatedBank.push({
                key: 'branchName',
                changed: true,
                previousValue: approvalData.entity.branchName
            });
        }
        if (approvalData.updatedInformation.finInstitutionCode) {
            updatedBank.push({
                key: 'finInstitutionCode',
                changed: true,
                previousValue: approvalData.entity.finInstitutionCode
            });
        }
        if (approvalData.updatedInformation.routingNo) {
            updatedBank.push({
                key: 'routingNo',
                changed: true,
                previousValue: approvalData.entity.routingNo
            });
        }
        return updatedBank;
    }

    // ----------------------- Documents -----------------------
    getDocumentsOfWalletOwner(walletOwnerCode: string): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_FILE_UPLOAD_URL + '/walletOwner/' + walletOwnerCode)
    }
    createDocumentForm(documents: any[]): FormArray {
        let docs = new FormArray([]);
        if (documents.length > 0) {
            documents.forEach(doc => {
                docs.push(new FormGroup({
                    documentTypeCode: new FormControl({ value: doc.documentTypeName, disabled: true }),
                    fileName: new FormControl({ value: doc.fileName, disabled: true })
                }));
            });
        }
        return docs;
    }
    onDownload(fileName: string, walletOwnerCode: string): string {
        const fileURL = this.endpoints.E_WALLET_WALLET_OWNER_FILE_DOWNLOAD + walletOwnerCode +
            '/' + fileName;
        return fileURL;
    }
    // ----------------------------------------------
    showField(feild, list: any[]): boolean {
        for (let i = 0; i < list.length; i++) {
            if (list[i].key === feild) {
                return false;
            }
        }
        return true;
    }










}