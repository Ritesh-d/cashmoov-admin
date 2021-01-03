import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endpoints } from '../shared/endpoints';
import { ActivatedRoute, Params } from '@angular/router';
import { ApprovalConstants } from '../approval/approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable()
export class TemplatesService {
    setPermission: any;
    approvalRequired: Boolean=false;
    constructor(private http: HttpClient,private route: ActivatedRoute,
        private commonHttpService: CommonHelperService,
        private endpoints: Endpoints){
            this.apporvalRequired(ApprovalConstants.featureCode.TEMPLATE);
            // this.route.queryParams.subscribe((params: Params) => {
            //     if(params['property']){
            //     this.setPermission = JSON.parse(params['property']);
            //     }
            //   });
        }
        apporvalRequired(code: string) {

            this.setPermission = JSON.parse(localStorage.getItem(code));

            this.commonHttpService.approvalRequired(code,
                (status) => {
                    this.approvalRequired = status
                }
            )

       }
    /**
     * method is to list all templates
     */
    get allTemplates(): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_TEMPLATE_URL + '/all');
    }

    getTemplateDetails(tmpcode){
        return this.http.get(this.endpoints.IP_PORT+'ewallet/api/v1/transTemplate/template/'+tmpcode);
    }

}