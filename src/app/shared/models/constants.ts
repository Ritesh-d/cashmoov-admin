import { Injector, } from '@angular/core';
import { ConfigService } from '../../shared/services/config.service';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class API_URLs {

  public URL_PREFIX: string
  public URL_LOGIN: string;
  public URL_MASTERDATA: string;
  public URL_LOGOUT: string;
  public URL_CHANGEPASSWORD: string;

  public URL_SEARCHROLE: string;
  public URL_MODIFYROLE: string;
  public URL_VIEWROLE: string;
  public URL_UPDATEROLE: string;
  public URL_DELETEROLE: string;
  public URL_GETGROUPLIST: string;
  public URL_GETGROUPROLE: string;
  public URL_CREATEGROUP: string;
  public URL_UPDATEGROUP: string;
  public URL_GETROLELIST: string;
  public URL_CREATEROLE: string;

  public URL_CREATEUSER: string;
  public URL_SEARCHUSER: string;
  public URL_UPDATEHUSER: string;
  public RESULT_CODE: string = "0000";
  public static RESULT_CODE: string = "0000";
  public URL_CRAETEGENERATIONMETHOD: string;
  public URL_SEARCHGENERATIONMETHOD: string;
  public URL_MODIFYGENERATIONMETHOD: string;
  public URL_SEARCHKEY: string;
  public URL_REVOKEKEY: string;

  public URL_SEARCH_ITEM_CODE: string;
  public URL_CREATE_PURCHASE_ORDER: string;
  public URL_SEARCH_PURCHASE_ORDER: string;
  public URL_SEARCH_REASON: string;
  public URL_UPDATE_PURCHASE_ORDER: string;
  public URL_SEARCH_PRODUCT: string;
  public URL_SEARCH_PRODUCTION_ORDER: string;
  public URL_SEARCH_PRODUCT_CATEGORY: string;
  public URL_CREATE_PRODUCTION_ORDER: string;
  public URL_GET_ORDER_BATCH_DETAILS: string;
  public URL_MODIFY_PRODUCTION_ORDER: string;
  public URL_EXTEND_DOWNLOAD_PRODUCTION: string;
  public URL_DOWNLOAD_VOUCHER_BATCH_FILE: string;
  public URL_DOWNLOAD_ORDER_INFO_FILE: string;
  public URL_CREATE_WAREHOUSE: string;
  public URL_SEARCH_WAREHOUSE: string;
  public URL_MODIFY_WAREHOUSE: string;

  public URL_CREATE_FACEVALUE: string;
  public URL_SEARCH_FACEVALUE: string;
  public URL_MODIFY_FACEVALUE: string;

  public URL_FINISH_GOODS_UPLOAD: string;
  public URL_SEARCH_FINISH_GOODS: string;
  public URL_SEARCH_FINISH_GOODS_FILE_DETAILS: string;
  public URL_FINISH_GOODS_DELETE: string;
  public URL_FINISH_GOODS_FILE_DOWNLOAD: string;
  public URL_CREATE_VOUCHER_MOVEMENT: string;

  public URL_CREATE_PACKSIZE: string;
  public URL_SEARCH_PACKSIZE: string;
  public URL_MODIFY_PACKSIZE: string;

  public URL_CREATE_VOUCHER_RECHARGE_CODE: string;
  public URL_UPDATE_VOUCHER_RECHARGE_CODE: string;
  public URL_SEARCH_PACKAGE_CODE: string;

  public URL_SEARCH_VOUCHER_MOVEMENT: string;
  public URL_CREATE_EXT_SYS_USER: string;
  public URL_EDIT_EXT_SYS_USER: string;

  public pageWrapperId: any;

  public URL_SEARCH_VOUCHERRECHARGECODE: string;

  public URL_DOWNLOAD_MOVEMENT_REPORT: string;

  public URL_CREATE_PACKAGE_CODE: string;

  public URL_UPDATE_VOUCHER_MOVEMENT: string;

  public URL_MODIFY_PACKEGECODE: string;
  public URL_CREATE_ITEMCODE: string;
  public URL_MODIFY_ITEMCODE: string;
  public URL_PREFIX_REPORT: string;
  public URL_REPORT_API: string;
  public URL_REPORT_FILTER_API: string;
  public URL_CREATE_CAMPAIGN: string;
  public URL_SEARCH_CAMPAIGN: string;
  public URL_MODIFY_CAMPAIGN: string;
  public URL_UPLOAD_EXPIRY_FILE: string;
  public URL_SEARCH_EXPIRY_EXTENSION: string;
  public URL_SEARCH_ELECTRONIC_ORDER: string;
  public URL_ELECTRONIC_ORDER_BATCH_DETAILS: string;
  public URL_WH_TO_WH_FILE_UPLOAD: string;
  public URL_SEARCH_WH_TO_WH_VOU_MOVEMENT: string;
  public URL_ELECTRONIC_ORDER_CANCEL_ORDER: string;
  public URL_UPDATE_EXPIRY_FILE: string;
  public URL_GET_WH_VOUCHER_MOVEMENT_REQUEST : string;
  public URL_DOWNLOAD_EXPIRY_FILE: string;
  public URL_UPLOAD_VOUCHER_CHANGE_STATUS_FILE: string;
  public URL_ERP_CHANGE_STATUS_FILE: string;
  public URL_SEARCH_VOUCHERACTIVATION: string;
  public URL_GET_VOUCHER_CHANGE_STATUS_DETAIL: string; 
  public URL_UPDATE_VOUCHERACTIVATION: string;
  public URL_GET_VOUCHERSTATUS: string;

  public URL_SEARCH_PACKING: string;
  public URL_CREATE_PACKING: string;
  public URL_UPDATE_PACKING: string;

  public URL_SEARCH_ARTWORK: string;
  public URL_CREATE_ARTWORK: string;
  public URL_MODIFY_ARTWORK: string;
  public URL_CREATE_PRODUCT: string;
  public URL_CREATE_REASON : string;
  public URL_MODIFY_REASON : string;

  public URL_EDIT_VOUCHER_STATUS : string;
  public URL_DOWNLOAD_VOUCHER_ACTIVATION_FILE: string;
  public URL_CREATE_PRINTING_SUPPLIER_STAFF:string;

  public URL_CREATE_OPERATOR: string;
  public URL_SEARCH_OPERATOR: string;
  public URL_MODIFY_OPERATOR: string;
  public URL_CREATE_PRINTING_SUPPLIER: string;
  public URL_SEARCH_VOUCEHR_STATUS_INQUIRY : string;
  public URL_EDIT_PRODUCT : string;
  public URL_CREATE_PRODUCTCATEGORY: string;
  public URL_EDIT_PRODUCTCATEGORY: string;
  public URL_SEARCH_PRODUCTCATEGORY: string;

  public URL_RESETPASSWORD:string;
  public URL_SEARCH_PURGING:string;
  public URL_UPDATE_PURGING:string;

  public URL_CREATE_PRODUCTMAPPING:string;
  public URL_SEARCH_PRODUCTMAPPING:string;
  public URL_UPDATE_PRODUCTMAPPING:string;
 
  public URL_SEARCH_SUBPARTNER :string ;
 
  public URL_CREATE_SUBPARTNER:string;
  public URL_UPDATE_SUBPARTNER:string;
   public URL_SEARCH_EXTERNAL_SYSTEM_USER:string;
  public  URL_SEARCH_CHANNEL:string;
  public  URL_SEARCH_SYSTEM_CONFIG:string;
  public  URL_COMMON_VIEW_API:string;
  public URL_UPDATE_SYSTEM_CONFIG:string;

   public URL_CREATE_PERMISSION:string;
   public URL_CREATE_ROLE:string;
   public URL_SEARCH_ROLE:string;
   public URL_SEARCH_FEATURE : string;
   public URL_SEARCH_PERMISSION : string ;
   
   public MINIMUM_AGE_DATE_OF_BIRTH :any;



  constructor(private configService: ConfigService) {
    this.URL_PREFIX = this.configService.apiBaseUrl;
    this.URL_PREFIX_REPORT = this.configService.apiReportBaseUrl;
    console.log("URL PREFIX : " + this.URL_PREFIX);
    this.URL_LOGIN = this.URL_PREFIX + "ewallet/oauth/token";
    this.URL_MASTERDATA = this.URL_PREFIX + "master-data";
    this.URL_LOGOUT = this.URL_PREFIX + "logout";
    this.URL_CHANGEPASSWORD = this.URL_PREFIX + "change-password";
    this.URL_GETROLELIST = this.URL_PREFIX + "all-roles";
    this.URL_CREATEROLE = this.URL_PREFIX + "/create-role-type";
    this.URL_SEARCHROLE = this.URL_PREFIX + "search-role-type";
    this.URL_MODIFYROLE = this.URL_PREFIX + "edit-role-type";
    this.URL_VIEWROLE = this.URL_PREFIX + "view-role-type";
    this.URL_UPDATEROLE = this.URL_PREFIX + "update-role-type";
    this.URL_DELETEROLE = this.URL_PREFIX + "delete-role-type";
    this.URL_GETGROUPLIST = this.URL_PREFIX + "search-group-role";
    this.URL_GETGROUPROLE = this.URL_PREFIX + "edit-group-role";
    this.URL_CREATEGROUP = this.URL_PREFIX + "create-group-role";
    this.URL_UPDATEGROUP = this.URL_PREFIX + "update-group-role";

    this.URL_CREATEUSER = this.URL_PREFIX + "create-user";
    this.URL_SEARCHUSER = this.URL_PREFIX + "search-user";
    this.URL_UPDATEHUSER = this.URL_PREFIX + "update-user";
    this.URL_CRAETEGENERATIONMETHOD = this.URL_PREFIX + "create-generation-method";
    this.URL_SEARCHGENERATIONMETHOD = this.URL_PREFIX + "search-generation-method";
    this.URL_MODIFYGENERATIONMETHOD = this.URL_PREFIX + "edit-generation-method";
    this.URL_SEARCHKEY = this.URL_PREFIX + "search-key";
    this.URL_REVOKEKEY = this.URL_PREFIX + "revoke-key";
    this.URL_SEARCH_ITEM_CODE = this.URL_PREFIX + "search-itemcode";
    this.URL_CREATE_PURCHASE_ORDER = this.URL_PREFIX + "create-purchase-order";
    this.URL_SEARCH_PURCHASE_ORDER = this.URL_PREFIX + "search-purchase-order";
    this.URL_SEARCH_REASON = this.URL_PREFIX + "search-reason";
    this.URL_UPDATE_PURCHASE_ORDER = this.URL_PREFIX + "update-purchase-order";
    this.URL_SEARCH_PRODUCT = this.URL_PREFIX + "search-product";
    this.URL_SEARCH_PRODUCTION_ORDER = this.URL_PREFIX + "search-production-order";
    this.URL_SEARCH_PRODUCT_CATEGORY = this.URL_PREFIX + "search-product-category";
    this.URL_CREATE_PRODUCTION_ORDER = this.URL_PREFIX + "create-production-order";
    this.URL_GET_ORDER_BATCH_DETAILS = this.URL_PREFIX + "get-order-batch-details";
    this.URL_MODIFY_PRODUCTION_ORDER = this.URL_PREFIX + "update-production-order";
    this.URL_EXTEND_DOWNLOAD_PRODUCTION = this.URL_PREFIX + "extend-download-production";
    this.URL_DOWNLOAD_VOUCHER_BATCH_FILE = this.URL_PREFIX + "download-voucher-batch-file";
    this.URL_DOWNLOAD_ORDER_INFO_FILE = this.URL_PREFIX + "download-order-info";
    this.URL_CREATE_WAREHOUSE = this.URL_PREFIX + "create-warehouse";
    this.URL_SEARCH_WAREHOUSE = this.URL_PREFIX + "search-warehouse";
    this.URL_MODIFY_WAREHOUSE = this.URL_PREFIX + "update-warehouse";

    this.URL_CREATE_FACEVALUE = this.URL_PREFIX + "create-facevalue";
    this.URL_SEARCH_FACEVALUE = this.URL_PREFIX + "search-facevalue";
    this.URL_MODIFY_FACEVALUE = this.URL_PREFIX + "update-facevalue";

    this.URL_CREATE_PACKSIZE = this.URL_PREFIX + "create-packsize";
    this.URL_SEARCH_PACKSIZE = this.URL_PREFIX + "search-packsize";
    this.URL_MODIFY_PACKSIZE = this.URL_PREFIX + "update-packsize";




    this.URL_FINISH_GOODS_UPLOAD = this.URL_PREFIX + "upload-finishgoods-file";
    this.URL_SEARCH_FINISH_GOODS = this.URL_PREFIX + "search-finish-goods";
    this.URL_SEARCH_FINISH_GOODS_FILE_DETAILS = this.URL_PREFIX + "search-finish-goods-file-detail";
    this.URL_FINISH_GOODS_DELETE = this.URL_PREFIX + "finishgoods-delete";
    this.URL_FINISH_GOODS_FILE_DOWNLOAD = this.URL_PREFIX + "download-finishgoods-file";
    this.URL_CREATE_VOUCHER_MOVEMENT = this.URL_PREFIX + "create-voucher-movement";

    this.URL_SEARCH_VOUCHERRECHARGECODE = this.URL_PREFIX + "search-voucher-recharge-code"

    this.URL_CREATE_VOUCHER_RECHARGE_CODE = this.URL_PREFIX + "create-voucher-recharge-code";
    this.URL_UPDATE_VOUCHER_RECHARGE_CODE = this.URL_PREFIX + "update-voucher-recharge-code";
    this.URL_SEARCH_PACKAGE_CODE = this.URL_PREFIX + "search-package-code";


    this.URL_SEARCH_VOUCHER_MOVEMENT = this.URL_PREFIX + "search-voucher-movement";

    this.URL_DOWNLOAD_MOVEMENT_REPORT = this.URL_PREFIX + "voucher-movement-report";

    this.URL_CREATE_PACKAGE_CODE = this.URL_PREFIX + "create-package-code";
    this.URL_UPDATE_VOUCHER_MOVEMENT = this.URL_PREFIX + "update-voucher-movement";

    this.URL_MODIFY_PACKEGECODE = this.URL_PREFIX + "update-package-code";
    this.URL_CREATE_ITEMCODE = this.URL_PREFIX + "create-itemcode";
    this.URL_MODIFY_ITEMCODE = this.URL_PREFIX + "update-itemcode";

    this.URL_REPORT_API = this.URL_PREFIX_REPORT + "report/userReport";
    this.URL_REPORT_FILTER_API = this.URL_PREFIX_REPORT + "report/filterData";
    this.URL_CREATE_CAMPAIGN = this.URL_PREFIX + "create-campaign";
    this.URL_SEARCH_CAMPAIGN = this.URL_PREFIX + "search-campaign";
    this.URL_MODIFY_CAMPAIGN = this.URL_PREFIX + "update-campaign";
    this.URL_SEARCH_ELECTRONIC_ORDER = this.URL_PREFIX + "search-electronic-order";
    this.URL_ELECTRONIC_ORDER_BATCH_DETAILS = this.URL_PREFIX + "get-electronic-order-batch-detail";
    this.URL_WH_TO_WH_FILE_UPLOAD = this.URL_PREFIX+"upload-wh-voucher-movement-file";
    this.URL_SEARCH_WH_TO_WH_VOU_MOVEMENT = this.URL_PREFIX+"search-wh-voucher-movement-request";

    this.URL_ELECTRONIC_ORDER_CANCEL_ORDER = this.URL_PREFIX + "cancel-electronic-order";


    this.URL_CREATE_PACKAGE_CODE = this.URL_PREFIX + "create-package-code";
    this.URL_UPDATE_VOUCHER_MOVEMENT = this.URL_PREFIX + "update-voucher-movement";

    this.URL_MODIFY_PACKEGECODE = this.URL_PREFIX + "update-package-code";
    this.URL_CREATE_ITEMCODE = this.URL_PREFIX + "create-itemcode";
    this.URL_MODIFY_ITEMCODE = this.URL_PREFIX + "update-itemcode";

    this.URL_REPORT_API = this.URL_PREFIX_REPORT + "report/userReport";
    // this.URL_REPORT_FILTER_API = this.URL_PREFIX_REPORT + "report/filterData";
    this.URL_CREATE_CAMPAIGN = this.URL_PREFIX + "create-campaign";
    this.URL_SEARCH_CAMPAIGN = this.URL_PREFIX + "search-campaign";
    this.URL_MODIFY_CAMPAIGN = this.URL_PREFIX + "update-campaign";
    this.URL_UPLOAD_EXPIRY_FILE = this.URL_PREFIX + "create-expiry-extension-request";
    this.URL_SEARCH_EXPIRY_EXTENSION = this.URL_PREFIX + "search-expiry-extension-request";

    this.URL_UPDATE_EXPIRY_FILE = this.URL_PREFIX + "update-expiry-extension-request";
    this.URL_GET_WH_VOUCHER_MOVEMENT_REQUEST = this.URL_PREFIX+"get-wh-voucher-movement-request";

    this.URL_DOWNLOAD_EXPIRY_FILE=this.URL_PREFIX+"download-expiry-extension-files",
    this.URL_UPLOAD_VOUCHER_CHANGE_STATUS_FILE=this.URL_PREFIX+"upload-voucher-change-status-file"
    this.URL_ERP_CHANGE_STATUS_FILE = this.URL_PREFIX+"upload-erp-change-status-file"
    this.URL_DOWNLOAD_EXPIRY_FILE=this.URL_PREFIX+"download-expiry-extension-files"
    this.URL_SEARCH_VOUCHERACTIVATION=this.URL_PREFIX+"search-voucher-change-status"
    this.URL_GET_VOUCHER_CHANGE_STATUS_DETAIL = this.URL_PREFIX+"get-voucher-change-status-detail";

    
    this.URL_UPDATE_VOUCHERACTIVATION=this.URL_PREFIX+"update-voucher-change-status";

    this.URL_GET_VOUCHERSTATUS=this.URL_PREFIX+"get-voucher-change-status-detail";
    this.URL_SEARCH_PACKING=this.URL_PREFIX+"search-packing";
    this.URL_CREATE_PACKING=this.URL_PREFIX+"create-packing";
    this.URL_UPDATE_PACKING=this.URL_PREFIX+"update-packing";
    this.URL_CREATE_PRODUCT=this.URL_PREFIX+"create-product";


    this.URL_GET_VOUCHERSTATUS=this.URL_PREFIX+"get-voucher-change-status-detail"
    this.URL_EDIT_VOUCHER_STATUS = this.URL_PREFIX+"update-voucher-change-status";
    this.URL_DOWNLOAD_VOUCHER_ACTIVATION_FILE=this.URL_PREFIX+"download-voucher-change-status-files";

    this.URL_CREATE_PRINTING_SUPPLIER_STAFF=this.URL_PREFIX +"create-user"

  
    this.URL_CREATE_OPERATOR = this.URL_PREFIX + "create-operator";
    this.URL_SEARCH_OPERATOR = this.URL_PREFIX + "search-operator";
    this.URL_MODIFY_OPERATOR = this.URL_PREFIX + "update-operator";
    this.URL_CREATE_PRINTING_SUPPLIER=this.URL_PREFIX +"create-user";
    this.URL_SEARCH_VOUCEHR_STATUS_INQUIRY = this.URL_PREFIX + "voucher-status-inquiry";
    this.URL_EDIT_PRODUCT=this.URL_PREFIX+"update-product";

    this.URL_CREATE_PRODUCTCATEGORY=this.URL_PREFIX+"create-product-category";
    this.URL_EDIT_PRODUCTCATEGORY=this.URL_PREFIX+"update-product-category";
    this.URL_SEARCH_PRODUCTCATEGORY=this.URL_PREFIX+"search-product-category";

    this.URL_SEARCH_ARTWORK=this.URL_PREFIX+"search-artwork";
    this.URL_CREATE_ARTWORK = this.URL_PREFIX+"create-artwork";
    this.URL_MODIFY_ARTWORK = this.URL_PREFIX+"update-artwork";


    this.URL_CREATE_REASON = this.URL_PREFIX + "create-reason";
    this.URL_MODIFY_REASON = this.URL_PREFIX + "update-reason";
    this.URL_RESETPASSWORD = this.URL_PREFIX + "reset-password";
    this.URL_SEARCH_PURGING=this.URL_PREFIX + "search-purging-policy";
    this.URL_UPDATE_PURGING=this.URL_PREFIX + "update-purging-policy";

    this.URL_CREATE_PRODUCTMAPPING=this.URL_PREFIX + "create-product-mapping";
    this.URL_SEARCH_PRODUCTMAPPING=this.URL_PREFIX + "search-product-mapping";
    this.URL_UPDATE_PRODUCTMAPPING=this.URL_PREFIX + "update-product-mapping";
 
    this.URL_SEARCH_SUBPARTNER = this.URL_PREFIX + 'search-subpartner';
    
 
    this.URL_CREATE_SUBPARTNER=this.URL_PREFIX + "create-subpartner";
    this.URL_UPDATE_SUBPARTNER=this.URL_PREFIX + "update-subpartner";
    this.URL_CREATE_EXT_SYS_USER=this.URL_PREFIX + "create-extsystemuser";
    this.URL_EDIT_EXT_SYS_USER=this.URL_PREFIX + "edit-extsystemuser";
    this.URL_UPDATE_SUBPARTNER=this.URL_PREFIX + "update-subpartner";

    this.URL_SEARCH_EXTERNAL_SYSTEM_USER=this.URL_PREFIX+ "search-extsystemuser"
  
    this.URL_CREATE_EXT_SYS_USER=this.URL_PREFIX + "create-extsystemuser";
    this.URL_SEARCH_CHANNEL=this.URL_PREFIX + "search-channel";

    this.URL_SEARCH_SYSTEM_CONFIG=this.URL_PREFIX + "search-system-config";

    this.URL_COMMON_VIEW_API=this.URL_PREFIX + "view";
    this.URL_UPDATE_SYSTEM_CONFIG=this.URL_PREFIX+ "edit-system-config";
    this.URL_CREATE_PERMISSION = this.URL_PREFIX + "ewallet/api/v1/permission";
    this.URL_CREATE_ROLE = this.URL_PREFIX + "ewallet/api/v1/role";
    this.URL_SEARCH_ROLE = this.URL_PREFIX+ "ewallet/api/v1/role/all";
    this.URL_SEARCH_FEATURE = this.URL_PREFIX + "ewallet/api/v1/feature/all";
    this.URL_SEARCH_PERMISSION = this.URL_PREFIX+ "ewallet/api/v1/permission/all";
    this.MINIMUM_AGE_DATE_OF_BIRTH = "18";


   }

}
