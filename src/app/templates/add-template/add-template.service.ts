import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MastersViewModelBuilder } from '../../shared/masters-view-model.builder';
import { setMastersService } from '../../shared/services/set-masters.service';
import { TemplatesConstants } from '../templates.constants';
import { HttpClient } from '@angular/common/http';
import { MasterResponseModel } from '../../shared/master-response.model';
import { AddTemplateRequestModel } from './add-template-request.model';
import { Endpoints } from '../../shared/endpoints';

@Injectable()
export class AddTemplateService {

    constructor(private mastersViewModelBuilder: MastersViewModelBuilder,
        private setMastersService: setMastersService,
        private http: HttpClient,
        private endpoints: Endpoints) {}


    /**
     * get template categories from masters builders
     */
    get templateCategories(): any[] {
        console.log('this.mastersViewModelBuilder ' , this.mastersViewModelBuilder);
        return this.mastersViewModelBuilder.templateCategories;
    }

    /**
     * to get template category name on id
     * @param templateCategoryId : selectred template category id
     */
    getTemplateCategory(templateCategoryId: string): string {
        const templatesCategories = this.templateCategories;
        for(let i = 0; i < templatesCategories.length; i++) {
            if(templatesCategories[i].code === templateCategoryId) {
                return templatesCategories[i].type;
            }
        }
    }

    /**
     * prepare masters for add template page
     */
    prepareMasters(): Observable<any> {
        if (this.templateCategories.length === 0 ) {
            const groupMasterString = this.setMastersService.prepareMasterString(
                [TemplatesConstants.masters.TEMPLATE_CATEGORY]);
            return new Observable(observer => {
                this.getTemplateMasters(groupMasterString).subscribe((mastersData: MasterResponseModel) => {
                    this.setMastersService.setMastersData(mastersData);
                    observer.next();
                });
            });
        } else {
            return new Observable(observer => {
                observer.next();
            });
        }
    }

    /**
     * to get template masters
     * @param masters : master code
     */
    private getTemplateMasters(masters: string) {
        return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + masters ,
            { headers: this.setMastersService.getHeaders() });
    }

    /**
     * make API call to add template
     * @param formData : user input data
     */
    addTemplate(formData: any): Observable<any>{
        const addTemplateRequset: AddTemplateRequestModel = {
            name: formData.tempName,
            templateCategoryCode: formData.category,
            walletOwnerCategoryCode: formData.walletCategory,
            isDefault: formData.default
        };
        console.log('--addTemplateRequset--', addTemplateRequset);
        // return ; 
        return this.http.post(this.endpoints.E_WALLET_TEMPLATE_URL, addTemplateRequset);
    }

    updateTemplate(data,tmpcode){
        const updateTemplateRequset = {
      
    "name": data.tempName,
    "templateCategoryCode":data.category,
    "walletOwnerCategoryCode": data.walletCategory,
    "isDefault": data.default,
	"status":data.status,
	// "state":"A"
        };
        console.log('--updateTemplateRequset--', updateTemplateRequset);
        return this.http.put(this.endpoints.IP_PORT+'ewallet/api/v1/template/'+tmpcode, updateTemplateRequset);
    }
    modifyTemplate(request:any, code:string){
        return this.http.put(this.endpoints.IP_PORT+'ewallet/api/v1/template/'+code, request);

    }
     getWalletCategoryMasters() {
        return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + 'CATEGORY',
            { headers: this.setMastersService.getHeaders() });
    }

    updateTemplateApproval(req,tempcode,entity){
        console.log(req,entity);
       
       
        const updateTemplateRequset = {
            
                "dataApprovalList": [
                    {
                        "featureCode": '100011', // Template Feature code
                        "entityCode": tempcode,  // Template Code
                        "entityName": req.tempName,
                        "actionType": "Updated",
                        "comments": "",
                        "status": "U",
                        "assignTo": "",
                        "updatedInformation": {
                            "id": entity.id,
                            "code": tempcode,
                            "name": req.tempName,
                            "templateCategoryCode": req.category,
                            "walletOwnerCategoryCode": req.walletCategory, //updated fields
                            "isDefault": req.isDefault,
                            "status": req.status, //updated fields
                            "state": entity.state,
                            "creationDate": entity.creationDate,
                            "createdBy": entity.createdBy,
                            "modificationDate": entity.modificationDate
                        },
                        "entity": { //old data fields
                            entity
                        }
                    }
                ]
            
      };
      
      return this.http.post(this.endpoints.IP_PORT+'ewallet/api/v1/dataApproval', updateTemplateRequset);
      }
}