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
        ACCOUNT_TYPE: 'ACCOUNTTYPE'
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
        TEMPLATE:'Template'
    },
    category: {
        INSTITUTION: 'Institute',
        AGENT: 'Agent',
        BRANCH: 'Branch',
        INSTITUTION_CODE: '100000',
        AGENT_CODE: '100002',
        BRANCH_CODE: '100001',
        USER_CODE: '100005',
        CASHIER : '100001',
        SUPERVISOR:'100000'
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
            TERRITORY_NAME: 'territoryName',
            BUSINESS_TYPE: 'businessTypeCode',
            ID_PROOF_TYPE: 'idProofTypeCode',
            ID_EXPIRY_DATE: 'idExpiryDate',
            MOBILE_NUMBER: 'mobileNumber',
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
            WALLET_OWNER: 'userCode'
        },
        formFieldType: {
            INPUT_TEXT: 'TextBox',
            INPUT_SELECT: 'DropDown',
            INPUT_RADIO: 'RadioButton',
            INPUT_DATE: 'Date',
            INPUT_PASSWORD: 'Password'
        }
    },

    redirectedFrom:{
            WALLETOWNER : 'WALLETOWNER'
        }
};
