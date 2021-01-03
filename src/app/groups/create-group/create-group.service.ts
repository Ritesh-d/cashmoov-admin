import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MasterResponseModel } from '../../shared/master-response.model';
import { HttpClient } from '@angular/common/http';
import { setMastersService } from '../../shared/services/set-masters.service';
import { WalletOwnerConstants } from '../../wallet-owner/wallet-owner.constants';
import { MastersViewModelBuilder } from '../../shared/masters-view-model.builder';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { TemplatesConstants } from '../../templates/templates.constants';
import { CreateGroupRequestModel } from './create-group-request.model';
import { Endpoints } from '../../shared/endpoints';
import { GroupConstants } from '../groups.constants';

@Injectable()
export class CreateGroupService {

    constructor(private http: HttpClient,
        private setMastersService: setMastersService,
        private mastersViewModelBuilder: MastersViewModelBuilder,
        private endpoints: Endpoints) { }
    /**
     * prepare masters create group info
     */
    prepareMasters(): Observable<any> {
        if (this.regionals.length === 0 ||
            this.mastersViewModelBuilder.governarates.length === 0 ||
            this.mastersViewModelBuilder.regions.length === 0 ||
            this.templateCategories.length === 0) {
            const groupMasterString = this.setMastersService.prepareMasterString(
                [WalletOwnerConstants.masters.REGIONAL_AREA,
                WalletOwnerConstants.masters.GOVERNORATE,
                WalletOwnerConstants.masters.REGION,
                TemplatesConstants.masters.TEMPLATE_CATEGORY]);
            return new Observable(observer => {
                this.getGroupMasters(groupMasterString).subscribe((mastersData: MasterResponseModel) => {
                    this.setMastersService.setMastersData(mastersData);
                    observer.next();
                });
            });
        } else {
            return new Observable(observer => {
                // this is for fresh templateCategories; not disabled
                observer.next(this.templateCategories);
            });
        }

    }

    createGroupForm() {
        return new FormGroup({
            groupName: new FormControl(''),
            parent: new FormControl(''),
            // regional: new FormControl(''),
            // governorate: new FormControl({value: '', disabled: true}),
            // region: new FormControl({value: '', disabled: true}),
            // groupTemplates: new FormArray([])
        });
    }

    /**
     * hit masters api for basic Info masters
     * @param masters : Master Identifier
     */
    private getGroupMasters(masters: string) {
        return this.http.get(this.endpoints.E_WALLET_MASTERS_URL + masters,
            { headers: this.setMastersService.getHeaders() });
    }

    /**
    * get groups from group API
    */
    get groups(): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_GROUP_URL + '/all');
    }

    /**
     * get regionals masters from mastersViewModelBuilder
     */
    get regionals(): any[] {
        return this.mastersViewModelBuilder.regionals;
    }

    /**
     * get selected governorates of selected regional: masters from mastersViewModelBuilder
     * @param regionalId : selected regional
     */
    governorates(regionalId: string): any[] {
        const governorates = [];
        governorates.push({ type: 'select governorate', code: '' });
        this.mastersViewModelBuilder.governarates.forEach(element => {
            if (element.regionalAreaCode === regionalId) {
                governorates.push(element);
            }
        });
        return governorates;
    }

    /**
     * get selected regions of selected governarate: masters from mastersViewModelBuilder
     * @param governarateId : selceted governarateId
     */
    regions(governarateId: string): any[] {
        const regions = [];
        regions.push({ type: 'select region', code: '' });
        this.mastersViewModelBuilder.regions.forEach(element => {
            if (element.governorateCode === governarateId) {
                regions.push(element)
            }
        });
        return regions;
    }

    /**
     * get template categories from masters
     */
    get templateCategories(): any[] {
        return this.mastersViewModelBuilder.templateCategories;
    }

    /**
     * get the templates of particular category
     * @param templateCategoryId: template category id
     */
    templateNameOnCategory(templateCategoryId: string) {

        // TODO : hit API for template on category basis
        if(templateCategoryId === GroupConstants.profile.SERVICE_PROFILE_CODE) {
            return this.http.get(this.endpoints.E_WALLET_TRANSTYPE_URL+ '/all');        
        } else {
            console.log('--invalid choice,; not in scope--');
            return new Observable(observer => {
                observer.next( { transTypeList: [{ code: '', name: 'not available' }] } );
            })
        }
    }

    /**
     * method is to prepare templates for group creation request
     * @param templates : templates data, from user
     */
    private prepareTemplates(templates: any[]) {
        const groupTemplates = [];
        templates.forEach(template => {
            groupTemplates.push({
                templateCode: template.templateName,
                templateCategoryCode: template.templateCategory
            });
        });
        return groupTemplates;
    }

    /**
     * prepare request for create Group
     * @param rawData : form data
     */
    private prepareCreateGroupRequest(rawData: any): CreateGroupRequestModel {
        return {
            name: rawData.groupName,
            groupCode: rawData.parent,
            // governorateCode: rawData.governorate,
            // regionCode: rawData.region,
            // regionalAreaCode: rawData.regional,
            // templateList: this.prepareTemplates(rawData.groupTemplates)
        };
    }

    /**
     * hit API for group creation with provided data
     * @param rawData : form data
     */
    createGroup(rawData: any) {
        const createGroupReq: CreateGroupRequestModel = this.prepareCreateGroupRequest(rawData);
        console.log('--createGroupReq--', createGroupReq);
        return this.http.post(this.endpoints.E_WALLET_GROUP_URL, createGroupReq);
    }

}