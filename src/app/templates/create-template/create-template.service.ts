import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MastersViewModelBuilder } from '../../shared/masters-view-model.builder';
import { setMastersService } from '../../shared/services/set-masters.service';
import { TemplatesConstants } from '../templates.constants';
import { HttpClient } from '@angular/common/http';
import { MasterResponseModel } from '../../shared/master-response.model';
import { Endpoints } from '../../shared/endpoints';

@Injectable()
export class CreateTemplateService {

  templateName: string;
  templateCategoryId: string;
  templateCategory: string;
  newlyCreatedTemplateCode: string;
  constructor(private mastersViewModelBuilder: MastersViewModelBuilder,
    private setMastersService: setMastersService,
    private http: HttpClient,
    private endpoints: Endpoints) {}

  getTransTemplateCategoryMasters() {
    return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + 'TRANSTYPE',
        { headers: this.setMastersService.getHeaders() });
}


  createTransTemplate(req,tempcode){
    var codes=[];
    for(var i=0;i<req.length;i++){
      var transTypeCode=req[i];
      codes.push({"transTypeCode": transTypeCode});
    }
    
    const addTemplateRequset = {
      "templateCode": tempcode,
      "transTemplateList": 
          codes
      
  };
  
  return this.http.post(this.endpoints.E_WALLET_TRANSACTIONTEMPLATE_URL, addTemplateRequset);
  }
  
  updateTransTemplate(req,tempcode){
    var codes=[];
    for(var i=0;i<req.length;i++){
      var transTypeCode=req[i];
      codes.push({"transTypeCode": transTypeCode});
    }
    
    const updateTemplateRequset = {
      "templateCode": tempcode,
      "transTemplateList": 
          codes
      
  };
  
  return this.http.post(this.endpoints.E_WALLET_TRANSACTIONTEMPLATE_URL, updateTemplateRequset);
  }


  TransTemplateApproval(tempcode,tempname){
    console.log(tempcode,tempname)
    const addTransTemplateRequset = {
      "dataApprovalList": [
          {
              "featureCode": "100020",
              "entityCode": tempcode,
              "entityName": tempname,
              "actionType": "Created",
              
              "comments": "",
              "status": "U",
              "assignTo": ""
          }
      ]
  };
  
  return this.http.post(this.endpoints.E_WALLET_APPROVALTRANSACTIONTEMPLATE_URL, addTransTemplateRequset);
  }



  updateTransTemplateApproval(tempcode,tempname,req,entity){
    var codes=[];
    for(var i=0;i<req.length;i++){
      var transTypeCode=req[i];
      codes.push({"transTypeCode": transTypeCode});
    }
    console.log(tempcode,tempname)
    const updateTransTemplateRequset = {
      "dataApprovalList": [
          {
              "featureCode": "100020",
              "entityCode": tempcode,
              "entityName": tempname,
              "actionType": "Updated",
              "updatedInformation": {
                  "templateCode": tempcode,
                  "transTemplateList": codes
              },
              "entity": {
                "transTemplateList": 
                  entity
                ,
                "templateCode": tempcode},
              "comments": "",
              "status": "UP",
              "assignTo": ""
          }
      ]
  };
  
  return this.http.post(this.endpoints.E_WALLET_APPROVALTRANSACTIONTEMPLATE_URL, updateTransTemplateRequset);
  }
}
