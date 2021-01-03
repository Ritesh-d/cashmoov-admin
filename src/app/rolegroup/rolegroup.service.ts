import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoleGroupModel } from './rolegroup.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Endpoints } from '../shared/endpoints';
import { ApprovalConstants } from '../approval/approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable({
    providedIn: 'root',
})

export class RoleGroupService {
    setPermission: any;
    approvalRequired: boolean=false;
    constructor(private http: HttpClient,
        private router: Router,private route: ActivatedRoute,
        private commonHttpService: CommonHelperService,
        private endpoints: Endpoints) {
            this.apporvalRequired(ApprovalConstants.featureCode.ROLE);
            
         }
         apporvalRequired(code: string) {

             this.setPermission = JSON.parse(localStorage.getItem(code));

             this.commonHttpService.approvalRequired(ApprovalConstants.featureCode.ROLE,
                 (status) => {
                     this.approvalRequired = status
                 }
             )

        }
    async getRolesDetail() {
        const data = await this.callGetRole();
        return data["roleList"];
    }

    public getRoleByCode(roleCode: number): any {
        return this.getPermissionByRoleCode(roleCode.toString());
    }

    public getPermissionByRoleCode(roleCode: string): Observable<any> {
        return this.http.get<any>(this.endpoints.E_WALLET_ROLE_PERMISSION_URL + '/' + roleCode);
    }

    createRole(request: any) {
        return this.http.post<any>(this.endpoints.E_WALLET_ROLE_URL, request);
    }

    updateRole(request: any): Observable<any> {
        return this.http.put<any>(this.endpoints.E_WALLET_ROLE_URL+ '/'+ request.code, request);
    }


    async callGetRole() {
        return this.http.get<any>(this.endpoints.E_WALLET_ROLE_URL + '/all').toPromise()
            .then(data => {
                // console.log(JSON.stringify(data));
                return data;
            }, error => {
                console.log("API error in GET_ROLES : " + JSON.stringify(error));
                return null;
            });

    }

    preparedUpdatedDataForApproval(unChangedData: any, updatedData: any) {
        let updatedInfo: any = {};
        if (unChangedData.name !== updatedData.name) {
            updatedInfo.name = updatedData.name;
        }
        if (unChangedData.status != updatedData.status) {
            updatedInfo.status = updatedData.status;
        }
        return updatedInfo;
    }

    /**
     * no need of this method: only for develeopment
     * TODO: will delete
     */
    public get dummyAssignedFeatures() {
        return [
            {
                "id": 1145,
                "featuresCode": "100003",
                "name": "Reports",
                "create": false,
                "view": true,
                "edit": false,
                "approve": true,
                "delete": false
            },
            {
                "id": 1146,
                "featuresCode": "100004",
                "name": "Transaction",
                "create": true,
                "view": false,
                "edit": true,
                "approve": false,
                "delete": true
            },
            {
                "id": 1147,
                "featuresCode": "100005",
                "name": "Commission",
                "create": false,
                "view": true,
                "edit": false,
                "approve": true,
                "delete": false
            },
            {
                "id": 1148,
                "featuresCode": "100006",
                "name": "Dashboard",
                "create": true,
                "view": false,
                "edit": false,
                "approve": false,
                "delete": true
            },
            {
                "id": 1149,
                "featuresCode": "100007",
                "name": "Wallet Owner",
                "create": true,
                "view": true,
                "edit": true,
                "approve": false,
                "delete": false
            },
            {
                "id": 1150,
                "featuresCode": "100008",
                "name": "System User",
                "create": true,
                "view": false,
                "edit": true,
                "approve": false,
                "delete": true
            },
            {
                "id": 1151,
                "featuresCode": "100009",
                "name": "Bulk Upload",
                "create": false,
                "view": true,
                "edit": false,
                "approve": true,
                "delete": false
            },
            {
                "id": 1152,
                "featuresCode": "100010",
                "name": "Groups",
                "create": true,
                "view": false,
                "edit": true,
                "approve": false,
                "delete": true
            }
        ];
    }

}
