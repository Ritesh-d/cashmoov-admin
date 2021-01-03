import { ConfigService } from './services/config.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Endpoints {

    public IP_PORT: string;
    public REPORT_IP_PORT:string;
    public E_WALLET_EMONEY_CREATION_URL : string;
    public E_WALLET_CALCULATION_TYPE_URL : string;
    public E_WALLET_TAX_TYPE_URL : string;
    public E_WALLET_FEE_TEMPLATE_URL : string;
    public E_WALLET_TRANSACTION_LIMIT_TEMPLATE_URL: string;
    public E_WALLET_CHANNEL_API_URL : string;
    public E_WALLET_CHANNEL_TYPE_API_URL : string;
    public E_WALLET_FEE_COMMISION_TEMPLATE_URL : string;
    public E_WALLET_TAX_CONFIGURATION_TEMPLATE_URL : string;
    public E_WALLET_EXCHANGE_RATE_URL :string;
    public E_WALLET_IDPROOFTYPE_URL : string;
    public E_WALLET_LOGIN_URL: string;
    public E_WALLET_LOGOUT_URL: string;
    public E_WALLET_FORGOT_PASSWORD: string;
    public E_WALLET_MASTERS_URL: string;
    public E_WALLET_SERVICE_CATEGORY_URL: string;
    public E_WAllET_SERVICE_OPERATOR_URL : string;
    public E_WALLET_INCENTIVE_DISTRIBUTION_URL:string; 
   
    public E_WALLET_SERVICE_PROVIDER_URL: string;
    public E_WALLET_SERVICE_PROVIDER_API_URL : string;
    public E_WALLET_OWNER_URL: string;
    public E_WALLET_WALLETOWNER_URL: string;
    public E_WALLET_WALLETOWNER_TEMPLATE_URL : string;
    public E_WALLET_URL: string;
    public E_WALLET_SERVICE_PROVIDER_SERVICE_MASTER_URL: string;
    public E_WALLET_SERVICE_PROVIDER_MASTER_URL: string;
    public E_WALLET_WALLETTRANSFER: string;
    public E_WALLET_DATAAPPROVAL: string;
 

    public E_WALLET_OWNER_ADDRESS_URL: string;
    public E_WALLET_OWNER_SUBORDINATE_URL: string;
    public E_WALLET_FIN_INSTITUTION_URL: string;
    public E_WALLET_BANK_DETAILS_URL: string;
    public E_WALLET_FEATURE_URL: string;
    public E_WALLET_GROUP_URL: string;
    public E_WALLET_TAX_CONFIGURATION_API_URL: string;
    public E_WALLET_TEMPLATE_URL: string;
    public E_WALLET_TRANSTYPE_URL: string;
    public E_WALLET_TRANSTEMPLATE_URL: string;
    public E_WALLET_SERVICE_TRANSTEMPLATE_URL : string;
    public E_WALLET_PERMISSION_URL: string;
    public E_WALLET_ROLE_URL: string;
    public E_WALLET_ROLE_PERMISSION_URL: string;
    public E_WALLET_SYSTEM_USER_URL: string;
    public E_WALLET_KYC_FIELDS: string;
    public E_WALLET_KYC_USER_FIELDS: string;
    public E_WALLET_DATA_APPROVAL_URL: string;
    public E_WALLET_CHANGE_PASSWORD_URL: string;
    public E_WALLET_COUNTRY_URL: string;
    public E_WALLET_REGION_URL: string;
    public E_WALLET_COUNTRY_REGION_URL: string;
    public E_WALLET_CURRENCY_URL: string;
    public E_WALLET_COUNTRYCURRENCY_COUNTRY_URL: string;
    public E_WALLET_COUNTRYCURRENCY_URL: string;
    public E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL: string;
    public E_WALLET_WALLETOWNERUSER_RESET_PASSWORD_URL :string;
    public E_WALLET_WALLETOWNERUSER_RESET_PIN_URL :string;
    public E_WALLET_COUNTRY_REMITTANCE_URL: string;
    public E_WALLET_WALLETOWNER_COUNTRYREMITTANCE_URL : string
    public E_WALLET_FILE_UPLOAD_URL: string;
    public E_WALLET_WALLET_OWNER_USER: string;
    public E_WALLET_WALLET_OWNER_FILE_DOWNLOAD: string;
    public E_WALLET_FEATUREALLBYCRITERIA_URL : string;
    public E_WALLET_TRANSACTIONTEMPLATE_URL: string;
    public E_WALLET_APPROVALTRANSACTIONTEMPLATE_URL: string;
    public E_WALLET_CONTROLACCOUNT_URL : string;
    public E_WALLET_WALLETTOPUP_URL : string;
    public E_WALLET_INCENTIVE_TEMPLATE_URL : string;
    public E_WALLET_CALCULATION_CYCLE_TYPE_URL : string;
    public E_WALLET_PRODUCT_URL: string;
    public E_WALLET_SIMPLE_REPORT_URL :string;
    public E_WALLET_TRANS_TYPE_URL :string;
 
    public E_WALLET_PUBLIC_FORGOT_PASSWORD : string
    public TRANSACTION_REVERSAL : string
    public TRANSACTION_REVERSALSEND : string
    public E_WALLET_WALLET_URL : string;

 
    constructor(private configService: ConfigService) {
        this.IP_PORT = this.configService.apiBaseUrl;
        this.REPORT_IP_PORT = this.configService.apiReportBaseUrl;
        this.E_WALLET_WALLET_URL = this.IP_PORT + 'ewallet/api/v1/wallet';
        this.E_WALLET_CHANNEL_API_URL = this.IP_PORT +'ewallet/api/v1/channel';
        this.E_WALLET_CHANNEL_TYPE_API_URL= this.IP_PORT + 'ewallet/api/v1/channelType';
        this.E_WALLET_IDPROOFTYPE_URL = this.IP_PORT + 'ewallet/api/v1/master/IDPROOFTYPE ';
        this.E_WALLET_LOGIN_URL = this.IP_PORT + "ewallet/oauth/token";
        this.E_WALLET_LOGOUT_URL = this.IP_PORT + "ewallet/oauth/logout";
        this.E_WALLET_FORGOT_PASSWORD = this.IP_PORT + 'ewallet/common/forgotPassword/';
        this.E_WALLET_MASTERS_URL = this.IP_PORT + "ewallet/api/v1/master/";
        this.E_WALLET_SERVICE_CATEGORY_URL = this.IP_PORT + "ewallet/api/v1/serviceCategory/";
        this.E_WAllET_SERVICE_OPERATOR_URL = this.IP_PORT+'ewallet/api/v1/operator';
        this.E_WALLET_SERVICE_PROVIDER_URL = this.IP_PORT + "ewallet/api/v1/serviceProvider/serviceCategory/";
        this.E_WALLET_SERVICE_PROVIDER_API_URL = this.IP_PORT + "ewallet/api/v1/serviceProvider/";
        this.E_WALLET_OWNER_URL = this.IP_PORT + "ewallet/api/v1/walletOwner";
        this.E_WALLET_WALLETOWNER_URL = this.IP_PORT + 'ewallet/api/v1/wallet/walletOwner';
        this.E_WALLET_WALLETOWNER_TEMPLATE_URL = this.IP_PORT + 'ewallet/api/v1/walletOwnerTemplate/walletOwnerCode';
        this.E_WALLET_URL= this.IP_PORT + 'ewallet/api/v1/wallet';
        this.E_WALLET_SERVICE_PROVIDER_SERVICE_MASTER_URL = this.IP_PORT + 'ewallet/api/v1/serviceProvider/serviceProviderMaster';
        this.E_WALLET_FEE_TEMPLATE_URL = this.IP_PORT + 'ewallet/api/v1/feeTemplate';
        this.E_WALLET_TRANSACTION_LIMIT_TEMPLATE_URL = this.IP_PORT + 'ewallet/api/v1/transactionLimitTemplate';
        this.E_WALLET_FEE_COMMISION_TEMPLATE_URL = this.IP_PORT + 'ewallet/api/v1/feeCommissionTemplate';
        this.E_WALLET_TAX_CONFIGURATION_TEMPLATE_URL = this.IP_PORT +'ewallet/api/v1/taxConfiguration';
        this.E_WALLET_OWNER_ADDRESS_URL = this.IP_PORT + 'ewallet/api/v1/address';
        this.E_WALLET_OWNER_SUBORDINATE_URL = this.IP_PORT + 'ewallet/api/v1/walletOwner/all/parent';
        this.E_WALLET_FIN_INSTITUTION_URL = this.IP_PORT + 'ewallet/api/v1/finInstitution';
        this.E_WALLET_BANK_DETAILS_URL = this.IP_PORT + 'ewallet/api/v1/settlementAccount';
        this.E_WALLET_GROUP_URL = this.IP_PORT + "ewallet/api/v1/group";
        this.E_WALLET_TAX_CONFIGURATION_API_URL = this.IP_PORT + 'ewallet/api/v1/taxConfiguration';
        this.E_WALLET_TEMPLATE_URL = this.IP_PORT + "ewallet/api/v1/template";
        this.E_WALLET_TRANSTYPE_URL = this.IP_PORT + "ewallet/api/v1/transType";
        this.E_WALLET_TRANSTEMPLATE_URL = this.IP_PORT + "ewallet/api/v1/transTemplate";
        this.E_WALLET_SERVICE_TRANSTEMPLATE_URL = this.IP_PORT + "ewallet/api/v1/serviceTemplate";
        this.E_WALLET_FEATURE_URL = this.IP_PORT + 'ewallet/api/v1/feature';
        this.E_WALLET_FEATUREALLBYCRITERIA_URL = this.IP_PORT + 'ewallet/api/v1/feature/allByCriteria';
        this.E_WALLET_PERMISSION_URL = this.IP_PORT + 'ewallet/api/v1/permission';
        this.E_WALLET_ROLE_URL = this.IP_PORT + 'ewallet/api/v1/role';
        this.E_WALLET_ROLE_PERMISSION_URL = this.IP_PORT + 'ewallet/api/v1/rolePermission';
        this.E_WALLET_SYSTEM_USER_URL = this.IP_PORT + 'ewallet/api/v1/user';
        this.E_WALLET_KYC_FIELDS = this.IP_PORT + 'ewallet/api/v1/walletOwnerKyc/walletOwnerCategoryCode';
        this.E_WALLET_KYC_USER_FIELDS = this.IP_PORT + 'ewallet/api/v1/walletOwnerKyc/walletOwnerUserTypeCode';
        this.E_WALLET_DATA_APPROVAL_URL = this.IP_PORT + 'ewallet/api/v1/dataApproval';
        this.E_WALLET_CHANGE_PASSWORD_URL = this.IP_PORT + 'ewallet/api/v1/user/changePassword';
        this.E_WALLET_COUNTRY_URL = this.IP_PORT + 'ewallet/api/v1/country';
        this.E_WALLET_REGION_URL = this.IP_PORT + 'ewallet/api/v1/region';
        this.E_WALLET_COUNTRY_REGION_URL = this.IP_PORT + 'ewallet/api/v1/region/country';
        this.E_WALLET_CURRENCY_URL = this.IP_PORT + 'ewallet/api/v1/currency';
        this.E_WALLET_COUNTRYCURRENCY_COUNTRY_URL = this.IP_PORT + 'ewallet/api/v1/countryCurrency/country';
        this.E_WALLET_COUNTRYCURRENCY_URL = this.IP_PORT + 'ewallet/api/v1/countryCurrency';
        this.E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL = this.IP_PORT + 'ewallet/api/v1/walletOwnerCountryCurrency';
        this.E_WALLET_COUNTRY_REMITTANCE_URL = this.IP_PORT + 'ewallet/api/v1/countryRemittance';
        this.E_WALLET_WALLETOWNER_COUNTRYREMITTANCE_URL = this.IP_PORT + 'ewallet/api/v1/walletOwnerCountryRemittance';
        this.E_WALLET_EXCHANGE_RATE_URL = this.IP_PORT + 'ewallet/api/v1/exchangeRate';
        this.E_WALLET_FILE_UPLOAD_URL = this.IP_PORT + 'ewallet/api/v1/fileUpload';
        this.E_WALLET_WALLET_OWNER_USER = this.IP_PORT + 'ewallet/api/v1/walletOwnerUser';
        this.E_WALLET_WALLET_OWNER_FILE_DOWNLOAD = this.IP_PORT + 'ewallet/api/v1/fileUpload/download/';
        this.E_WALLET_WALLETOWNERUSER_RESET_PASSWORD_URL =this.IP_PORT +  'ewallet/api/v1/walletOwnerUser/resetPassword';
        this.E_WALLET_WALLETOWNERUSER_RESET_PIN_URL=this.IP_PORT + 'ewallet/api/v1/walletOwnerUser/resetPin';
        this.E_WALLET_APPROVALTRANSACTIONTEMPLATE_URL=this.IP_PORT+'ewallet/api/v1/dataApproval';
        this.E_WALLET_TRANSACTIONTEMPLATE_URL=this.IP_PORT+'ewallet/api/v1/transTemplate';
        this.E_WALLET_CALCULATION_TYPE_URL=this.IP_PORT+'ewallet/api/v1/calculationType';
        this.E_WALLET_TAX_TYPE_URL=this.IP_PORT+'ewallet/api/v1/taxType';
        this.E_WALLET_CONTROLACCOUNT_URL=this.IP_PORT+'ewallet/api/v1/controlAccount';
        this.E_WALLET_WALLETTOPUP_URL=this.IP_PORT+'ewallet/api/v1/walletTopUp';
        this.E_WALLET_EMONEY_CREATION_URL = this.IP_PORT + 'ewallet/api/v1/emoneyCreation';
        this.E_WALLET_SERVICE_PROVIDER_MASTER_URL = this.IP_PORT + 'ewallet/api/v1/serviceProviderMaster/walletOwner';
        this.E_WALLET_WALLETTRANSFER = this.IP_PORT + 'ewallet/api/v1/walletTransfer';
        this.E_WALLET_DATAAPPROVAL = this.IP_PORT + 'ewallet/api/v1/dataApproval';
        this.E_WALLET_INCENTIVE_TEMPLATE_URL = this.IP_PORT + 'ewallet/api/v1/incentiveTemplate';
        this.E_WALLET_CALCULATION_CYCLE_TYPE_URL=this.IP_PORT+'ewallet/api/v1/calculationCycleType';

        this.E_WALLET_TRANS_TYPE_URL = this.IP_PORT + 'ewallet/api/v1/transType';
        this.E_WALLET_SIMPLE_REPORT_URL=this.REPORT_IP_PORT+'report/userReport';
        this.E_WALLET_PRODUCT_URL = this.IP_PORT + 'ewallet/api/v1/product';
        this.E_WALLET_PUBLIC_FORGOT_PASSWORD = this.IP_PORT + 'ewallet/public/forgotPassword'
       
        this.E_WALLET_INCENTIVE_DISTRIBUTION_URL = this.IP_PORT + 'ewallet/api/v1/incentiveDistributionTemplate';
        this.TRANSACTION_REVERSAL = this.IP_PORT + 'ewallet/api/v1/transactionReversal/all';
        this.TRANSACTION_REVERSALSEND = this.IP_PORT + 'ewallet/api/v1/transactionReversal';
    }
         
}
 
