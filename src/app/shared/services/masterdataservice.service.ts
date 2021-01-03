import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { API_URLs } from '../models/constants';
import { formattedError } from '@angular/compiler';
import { SessionMgtService } from './SessionMgt.service';


@Injectable()
export class MasterDataService {
 
  language : Object[];
  //status : Object[];
  userGroup : Object[];
  pinFileFormat : Object[];
  pinFileType : Object[];
  keyStore : Object[];
  country : Object[];
  packageType: Object[];
  state : Object[];
  city : Object[];
  loginSystem: Object[];
  commonStatus : Object[];
  userStatus : Object[];
  productType : Object[];
  masterObj  :any;
  keyStatus : Object[];
  purchaseOrderStatus : Object[];
  batchProcessStatus : Object[];
  purchaseOrderType : Object[];
  voucherType : Object[]; 
  productionOrderStatus : Object[];
  systemConfiguration : Object[];
  orderType : Object[];
  batchFileUploadStatus: Object[];
  recordStatus: Object[];
  voucherMovementStatus : Object[];
  expiryExtensionStatus: Object[];
  electronicOrderStatus : Object[];
  resonExtensionStatus: Object[];
  activationStatus: Object[];
  changeStatus:Object[];
  artworkType: Object[];
  descriptionStatus:Object[];
  reasonObj:Object[];
  genMethodStatus: Object[];
  userSubType:Object[];

constructor(private http: HttpClient,private sesionService:SessionMgtService) {
    console.log("master data : "+JSON.stringify(JSON.parse(sessionStorage.getItem("masterdata"))));    
    if(sessionStorage.getItem("masterdata") != null){        
        this.settingData(JSON.parse(sessionStorage.getItem("masterdata")));
    }   
 }
 

getData (url : string , data : any) {
    const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
    return this.http.post<any>(url,data,{headers})
      .toPromise()
      .then(data => {
          console.log("response master data : "+JSON.stringify(data));
          if(data != null){
              if(data["response"]["resultCode"] == API_URLs.RESULT_CODE){
                    this.settingData(data);
                    sessionStorage.setItem("masterdata" , JSON.stringify(data));
              }
          }
      
          return data
        },error=>{
            console.log("Master data API error : "+JSON.stringify(error));
            return "error";
        }
    );
}

settingData(masterdata){
    
    console.log("status data : "+JSON.stringify(masterdata["response"]["masterData"][0]["status"]));
    // this.sesionService.basicAuthCredentials="Basic QXJjaGFuYV9UZXN0OkFBQUFAMTIzNDU2Nzg=";
    //this.setCountry(masterdata["response"]["masterData"][0]["country"]);
    //this.setState(masterdata["response"]["masterData"][0]["country"][0]["state"]);
    //this.setLanguage(masterdata["response"]["masterData"][0]["language"]);
    //this.setStatus(masterdata["response"]["masterData"][0]["status"]);
    //this.setUserGroup(masterdata["response"]["masterData"][0]["groupType"]);
    //this.setPinFileFormat(masterdata["response"]["masterData"][0]["pinFileFormat"]);
    //this.setPinFileType(masterdata["response"]["masterData"][0]["pinFileType"]);
    //this.setkeyStore(masterdata["response"]["masterData"][0]["keyStore"]);
    this.setStatus(masterdata["response"]["masterData"][0]["status"]);
    this.setLanguage(masterdata["response"]["masterData"][1]["language"]);
    this.setLoginSystem(masterdata["response"]["masterData"][2]["loginSystem"]);
    this.masterObj = masterdata["response"]["masterData"][3]["master"];
    console.log('Reason Master::'+masterdata["response"]["masterData"][5]["reason"]);
    this.setReason(masterdata["response"]["masterData"][5]["reason"]);
 
    if(this.masterObj != undefined){
    var productTypeObj = this.masterObj.filter(function (element) {return (element.masterTypeCode == "PRODUCT_TYPE")});
    var puchaseOrderTypeObj = this.masterObj.filter(function (element) {return (element.masterTypeCode == "PUR_ORD_TYPE")});
    var voucherTypeObj = this.masterObj.filter(function (element) {return (element.masterTypeCode == "VOUCHER_TYPE")});
    var orderTypeObj = this.masterObj.filter(function (element) {return (element.masterTypeCode == "ORDER_TYPE")});
    var packageTypeObj = this.masterObj.filter(function (element) {return (element.masterTypeCode == "PACKAGE_TYPE")});
    var artworkTypeObj = this.masterObj.filter(function (element) {return (element.masterTypeCode == "ARTWORK_TYPE")});
    var descriptionStatusObj = this.masterObj.filter(function (element) { return (element.masterTypeCode == "ENC_DEC_METHOD") });
    var userSubTypeObj = this.masterObj.filter(function (element) { return (element.masterTypeCode == "USER_SUB_TYPE") });
   
    this.setUserSubType(userSubTypeObj[0].masterLookup);
    this.setProductType(productTypeObj[0].masterLookup);
    this.setPurchaseOrderType(puchaseOrderTypeObj[0].masterLookup);
    this.setVoucherType(voucherTypeObj[0].masterLookup);
    this.setOrderType(orderTypeObj[0].masterLookup);
    this.setPackageType( packageTypeObj[0].masterLookup);
    this.setSystemConfiguration(masterdata["response"]["masterData"][4]["systemConfiguration"]);
    this.setArtworkType(artworkTypeObj[0].masterLookup);
    this.setDescriptionStatus(descriptionStatusObj[0].masterLookup);
   
    }
}

setCountry(country : Object[]){
    this.country = country;
}

getCountry(){
    return this.country;
}

setState(state : Object[]){
    this.state = state;
}

getState(){
    return this.state;
}

setLanguage(language : Object[]){
    this.language = language;        
}

getLanguage(){
    return this.language;
}

setStatus(status : any){
    var commonStatusObj = status.filter(function (element) {return (element.statusType == "COMMON")});
    var userStatusObj = status.filter(function (element) {return (element.statusType == "USER")});
    var keyStatusObj = status.filter(function (element) {return (element.statusType == "KEY")});
    var puchaseOrderStatusObj = status.filter(function (element) {return (element.statusType == "PUR_ORD_STATUS")});
    var productionOrderStatusObj = status.filter(function (element) {return (element.statusType == "PROD_ORD_STATUS")});
    var batchProcessStatusObj = status.filter(function (element) {return (element.statusType == "BATCH_PROCESSING_STATUS")});
    var batchFileUploadStatusObj = status.filter(function (element) { return (element.statusType == "BATCH_FILE_UPLOAD_STATUS") });
    var recordStatusObj = status.filter(function (element) { return (element.statusType == "RECORD_STATUS") });
    var voucherMovementStatusObj = status.filter(function (element) { return (element.statusType == "VOUCHER_MOVE_REQUEST") });
    var voucherExpiryExtensionStatusObj = status.filter(function (element) { return (element.statusType == "EXTEND_VOUCHER_EXPIRY") });
    var genMethodStatusObj = status.filter(function (element) {return (element.statusType == "GEN_METHOD_STATUS")})
    var electronicOrderStatusObj = status.filter(function (element) { return (element.statusType == "ELE_ORD_STATUS") });
   // var reasonTypeObj = this.masterObj.filter(function (element) {return (element.masterTypeCode == "EXTEND_VOUCHER_EXPIRY")});
    var activationStatusObj = status.filter(function (element) { return (element.statusType == "VOUCHER_STATUS_CHANGE") });
    var changeStatusObj = status.filter(function (element) { return (element.statusType == "VOUCHER_STATUS") });

    this.setRecordStatus(recordStatusObj[0].statusDetail);
    this.setBatchFileUploadStatus(batchFileUploadStatusObj[0].statusDetail);
    this.setCommonStatus(commonStatusObj[0].statusDetail);
    this.setUserStatus(userStatusObj[0].statusDetail);
    this.setKeyStatus(keyStatusObj[0].statusDetail);
    this.setPurchaseOrderStatus(puchaseOrderStatusObj[0].statusDetail);
    this.setProductionOrderStatus(productionOrderStatusObj[0].statusDetail);
    this.setBatchProcessStatus(batchProcessStatusObj[0].statusDetail);
    this.setVoucherMovementStatus(voucherMovementStatusObj[0].statusDetail);
    this.setExpiryExtensionStatus(voucherExpiryExtensionStatusObj[0].statusDetail);
    this.setElectronicOrderStatus(electronicOrderStatusObj[0].statusDetail);
  //this.setResonExtensionStatus(voucherExpiryExtensionStatusObj[0].statusDetail);
    this.setActivationStatus(activationStatusObj[0].statusDetail);
    this.setChangeStatus(changeStatusObj[0].statusDetail);
    this.setGenMethodStatus(genMethodStatusObj[0].statusDetail);
}

setElectronicOrderStatus(electronicOrderStatus : Object[]){
    this.electronicOrderStatus = electronicOrderStatus;
}
getElectronicOrderStatus(){
    return this.electronicOrderStatus;
}

setResonExtensionStatus(resonExtensionStatus : Object[]){
    this.resonExtensionStatus = resonExtensionStatus;
}
getResonExtensionStatus(){
    return this.resonExtensionStatus;
}

setReason(reason : Object[]){
    this.reasonObj = reason;
}
getReason(){
    return this.reasonObj;
}



setBatchProcessStatus(batchProcessStatus : Object[]){
    this.batchProcessStatus = batchProcessStatus;
}

getBatchProcessStatus(){
    return this.batchProcessStatus;
}

setKeyStatus(keyStatus : Object[]){
    this.keyStatus = keyStatus;
}

getKeystatus(){
    return this.keyStatus;
}

setPurchaseOrderStatus(purchaseOrderStatus : Object[]){
    this.purchaseOrderStatus = purchaseOrderStatus;
}

getPurchaseOrderstatus(){
    return this.purchaseOrderStatus;
}

setProductionOrderStatus(productionOrderStatus : Object[]){
    this.productionOrderStatus = productionOrderStatus;
}

getProductionOrderstatus(){
    return this.productionOrderStatus;
}




// getStatus(){
//     return this.status;
// }

setCommonStatus(commonStatus : Object[]){
    this.commonStatus = commonStatus;
}

getCommonstatus(){
    return this.commonStatus;
}

setUserStatus(userStatus : Object[]){
    this.userStatus = userStatus;
}

getUserStatus(){
   return this.userStatus;
}

setUserGroup(userGroup : Object[]){
    console.log("USERGROUPDATA " +JSON.stringify(userGroup));
    this.userGroup = userGroup;
}

getUserGroup(){
    return this.userGroup
}

setPinFileFormat(pinFileFormat : Object[]){
    this.pinFileFormat = pinFileFormat;
}

getPinFileFormat(){
    return this.pinFileFormat;
}

setPinFileType(pinFileType : Object[]){
    this.pinFileType = pinFileType;
}

getPinFileType(){
    return this.pinFileType;
}

setkeyStore(keyStore : Object[]){
    this.keyStore = keyStore;
}

getkeyStore(){
    return this.keyStore;
}

setLoginSystem(loginSystem : Object[]){
    this.loginSystem = loginSystem;
}

getLoginSystem(){
    return this.loginSystem;
}

getCity(value : Object[]){
    for(let entry of JSON.parse(JSON.stringify(this.state))){
        if(entry.stateId == value){
          return entry.city;
        }
    }
}

getStateName(value : Object[]){
    for(let entry of JSON.parse(JSON.stringify(this.state))){
        if(entry.stateId == value){
          return entry.stateName;
        }
    }
}
getCityName(stateId : Object[], cityId : Object[],){
    console.log(cityId +"  : "+stateId);
    for(let entry of JSON.parse(JSON.stringify(this.state))){
        if(entry.stateId == stateId){
            console.log(cityId +" Cities : "+JSON.stringify(entry.city));
            for(let city of JSON.parse(JSON.stringify(entry.city))){
                if(city.cityId == cityId){
                  return city.cityName;
                }
            }
        }
    }
}
getKeyStoreName(value : Object[]){
    for(let entry of JSON.parse(JSON.stringify(this.keyStore))){
        if(entry.keyStoreId == value){
          return entry.keyStoreName;
        }
    }
}
getPinFileFormatName(value : Object[]){
    for(let entry of JSON.parse(JSON.stringify(this.pinFileFormat))){
        if(entry.fileFormatId == value){
          return entry.fileFormatName;
        }
    }
}
getPinFileTypeName(value : Object[]){
    for(let entry of JSON.parse(JSON.stringify(this.pinFileType))){
        if(entry.pinFileTypeId == value){
          return entry.pinFileTypeName;
        }
    }
}
getLanguageName(value : Object[]){
    for(let entry of JSON.parse(JSON.stringify(this.language))){
        if(entry.languageCode == value){
          return entry.languageName;
        }
    }
}

getUserGroupName(value : Object[]){
    for(let entry of JSON.parse(JSON.stringify(this.userGroup))){
        if(entry.groupTypeId == value){
          return entry.groupName;
        }
    }
}

getAdminList() {
    let obj = JSON.parse(sessionStorage.getItem('currentuser'));
    if(obj != undefined && obj.response != undefined && obj.response.levelList != undefined) {
      if(obj.response.levelList[0] != undefined && obj.response.levelList[0].ADMIN != undefined) {
        return obj.response.levelList[0].ADMIN;
      } else {
        return null;
      }
    } else {
      return null;
    }
    // console.log("Obj : "+ JSON.stringify(obj.response));
    // console.log("levelList 1: "+JSON.stringify(obj.response.levelList));
    // console.log("levelList2 : "+JSON.stringify(obj.response.levelList[0]));
    // console.log("levelList3 : "+JSON.stringify(obj.response.levelList[0].ADMIN));
    // console.log("levelList4 : "+JSON.stringify(obj.response.levelList[0].ADMIN.USRSESSIO));
  }

  setUserSubType(userSubType : Object[]){
    this.userSubType=userSubType;
  }
  getUserSubType(){
    return this.userSubType;
  }

  setProductType(productType : Object[]){
       this.productType = productType;
  }
  getProductType(){
      return this.productType;
  }
  setArtworkType(artworkType : Object[]){
      this.artworkType = artworkType;
  }
  getArtworkType(){
      return this.artworkType;
  }

  setPurchaseOrderType(purchaseOrderType : Object[]){
    this.purchaseOrderType = purchaseOrderType;
}

getPurchaseOrderType(){
   return this.purchaseOrderType;
}

setPackageType(packageType : Object[]){
    this.packageType = packageType;
}

getPackageType(){
   return this.packageType;
}

setVoucherType(voucherType : Object[]){
    this.voucherType = voucherType;
}

getVoucherType(){
    return this.voucherType;
}

setSystemConfiguration(systemConfiguration : Object[]){
    this.systemConfiguration = systemConfiguration;
}

getSysytemConfiguration(){
    return this.systemConfiguration;
}

setOrderType(orderType : Object[]){
    this.orderType = orderType;
}

getOrderType(){
    return this.orderType;
}

setRecordStatus(recordStatus:Object[]){
    this.recordStatus=recordStatus;
}
getRecordStatus(){
    return this.recordStatus;
}

setBatchFileUploadStatus(batchFileUploadStatus : Object[]){
    this.batchFileUploadStatus=batchFileUploadStatus;
}
getBatchFileUploadStatus(){
    return this.batchFileUploadStatus;
}

setVoucherMovementStatus(voucherMovementStatus : Object[]){
    this.voucherMovementStatus=voucherMovementStatus;
}
getVoucherMovementStatus(){
    return this.voucherMovementStatus;
}
setExpiryExtensionStatus(expiryExtensionStatus : Object[]){
    this.expiryExtensionStatus =  expiryExtensionStatus;
}

getExpiryExtensionStatus(){
    return this.expiryExtensionStatus;
}

setActivationStatus(activationStatus : Object[]){
    this.activationStatus =  activationStatus;
}

getActivationStatus(){
    return this.activationStatus;
}

setChangeStatus(changeStatus : Object[]){
    this.changeStatus =  changeStatus;
}

getChangeStatus(){
    return this.changeStatus;
}

setDescriptionStatus(descriptionStatus : Object[]){
    this.descriptionStatus = descriptionStatus;
}
getDescriptionStatus(){
    return this.descriptionStatus;
}
setGenMethodStatus(genMethodStatus : Object[]){
    this.genMethodStatus = genMethodStatus;
}
getGenMethodStatus(){
    return this.genMethodStatus;
}
}
