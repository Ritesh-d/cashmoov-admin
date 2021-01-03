export const WalletOwnerConstants = {
    masters: {
        CATEGPRY: 'CATEGORY',
        CATEGORY: 'CATEGORY',
        CONTRACT_TYPE: 'CONTRACTTYPE',
        BUSINESS_TYPE: 'BUSINESSTYPE',
        GOVERNORATE: 'GOVERNORATE',
        REGION: 'REGION',
        REGIONAL_AREA: 'REGIONALAREAS',
        TERRITORY: 'TERRITORY',
        ADDRESS_TYPE: 'ADDRESSTYPE',
        FIN_INSTITUTION_TYPE: 'FININSTITUTIONTYPE',
        DOCUMENT_TYPE: 'DOCUMENTTYPE',
        ID_PROOF_TYPE: 'IDPROOFTYPE',
        GENDER_TYPE: 'GENDERTYPE',
        WALLET_OWNER_USER_TYPE: 'WALLETOWNERUSERTYPE',
        ACCOUNT_TYPE: 'ACCOUNTTYPE',
       
        
    },
    state: {
        ENROLLED: 'Enrolled',
        CREATED: 'Created'
    },
    stage: {
        BASIC_INFO: 'GeneralInfo',
        ADDRESS: 'Address',
        BANK: 'Bank',
        DOCUMENT: 'Document',
        WALLET:'Wallet',
        TEMPLATE:'Template',
        SERVICES:'Services'
    },
    category: {
        INSTITUTION: 'Institute',
        AGENT: 'Agent',
        BRANCH: 'Branch',
        EMPLOYER: 'Employer',
        EMPLOYER_CODE: '100009',
        MERCHANT: 'Merchant',
        MERCHANT_CODE: '100011',
        OUTLET: 'Outlet',
        OUTLET_CODE:'100012',
        INSTITUTION_CODE: '100000',
        USER_CODE: '100005',
        TRUSTACCOUNT: '100006',
        TAXACCOUNT: '100007',
        SERVICEPROVIDER: '100008',
        
    },
    identifiers: {
        BANK_DETAILS_BANK_CODE: '100000',
        BANK_DETAILS_MMO_CODE: '100002',
        BANK_DETAILS_WALLET_CODE: '100001'
    },
    kyc: {
        formFieldName: {
            GOVERNORATE_NAME: 'governorateName',
            REGION_NAME: 'regionName',
            CITY : 'city',
            TERRITORY_NAME: 'territoryName',
            BUSINESS_TYPE: 'businessTypeCode',
            ID_PROOF_TYPE: 'idProofTypeCode',
            ID_EXPIRY_DATE: 'idExpiryDate',
            DATE_OF_BIRTH: 'dateOfBirth',
            GROUP: 'groupCode',
            GENDER: 'gender',
            ADDRESS_TYPE: 'addressType',
            REGIONAL_AREA_NAME: 'regionalAreaName',
            COUNTRY_NAME: 'country',
            SETTLEMENT_ACCOUNT: 'settlementAccount',
            ACCOUNT_TYPE: 'accountType',
            BANK_NAME: 'bankName',
            FIN_INSTITUTION: 'finInstitutionCode',
            MOBILE_SUBSCRIBER: 'mobileSubscriber',
            BANK: 'Bank',
            MMO: 'MMO',
            ISSUING_COUNTRY: 'issuingCountryCode',
            REGISTER_COUNTRY_CODE: 'registerCountryCode',
            WALLET_OWNER_PARENT: 'walletOwnerParentCode',
            WALLET_OWNER: 'userCode',
            WALLETEXISTS: 'walletExists',
             
            MOBILE_NUMBER: 'mobileNumber'
      
        },
        formFieldType: {
            INPUT_TEXT: 'TextBox',
            INPUT_SELECT: 'DropDown',
            INPUT_RADIO: 'RadioButton',
            INPUT_CHECKBOX: 'CheckBox',
            INPUT_DATE: 'Date',
            INPUT_PASSWORD: 'Password'
        }
    },
    redirectedFrom:{
        WALLETOWNER : 'WALLETOWNER'
    }
};
