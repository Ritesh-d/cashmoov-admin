import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../shared/endpoints';
import { ActivatedRoute, Params } from '@angular/router';
import { ApprovalConstants } from '../approval/approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable()
export class GroupsService {
    setPermission : any;
    approvalRequired: boolean=false;
    constructor(private http: HttpClient,private route: ActivatedRoute,   private commonHttpService: CommonHelperService,
        private endpoints: Endpoints) {
           
        
            this.apporvalRequired(ApprovalConstants.featureCode.GROUP);
          
        }
        apporvalRequired(code: string) {

            this.setPermission = JSON.parse(localStorage.getItem(code));

            this.commonHttpService.approvalRequired(ApprovalConstants.featureCode.GROUP,
                (status) => {
                    this.approvalRequired = status
                }
            )

       }
        
   
    get allGroups(): Observable<any> {
        return this.http.get(this.endpoints.E_WALLET_GROUP_URL + '/all');
    }
}