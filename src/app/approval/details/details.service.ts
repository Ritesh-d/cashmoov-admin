import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints } from '../../shared/endpoints';
import { HttpClient } from '@angular/common/http';
import { ApprovalConstants } from '../approval.constants';
import { ApprovalService } from '../approval.service';
import { UserService } from '../../user/user.service';
import { setMastersService } from '../../shared/services/set-masters.service';

@Injectable({
    providedIn: 'root',
})
export class DetailsService {

    constructor(private http: HttpClient,
        private approvalService: ApprovalService,
        private setMastersService: setMastersService,
        private endpoints: Endpoints) { }

    public actionOnApprovalOption(approvalData: any, action: string): Observable<any> {
        const featureName = approvalData.featureName === ApprovalConstants.featureName.PERMISSION ?
            ApprovalConstants.featureName.ROLE : approvalData.featureName;
            console.log('approvalData ',approvalData);
            console.log(featureName + ' claim request-- ',  this.prepareRequest(approvalData, action));
        return this.http.put(this.fetchFeatureUrl(featureName) + '/' + approvalData.entityCode,
            this.prepareRequest(approvalData, action));
    }

    private prepareRequest(approvalData: any, action: string) {
            
        if (approvalData.featureName ===(ApprovalConstants.featureName.ROLE ||
            ApprovalConstants.featureName.PERMISSION)) {
            return this.prepareApprovalRequestForRolePermission(approvalData, action);
        }
       else if (approvalData.featureName === ApprovalConstants.featureName.SYSTEM_USER) {
            return this.prepareApprovalRequestForSystemUser(approvalData, action);
        }
    }

    private prepareApprovalRequestForRolePermission(approvalData: any, action: string) {
      
        if (approvalData.updatedInformation && approvalData.updatedInformation != '{}' &&
            action === ApprovalConstants.status.text.APPROVED) {
            return {
                ...(approvalData.updatedInformation),

                state: this.approvalService.getDataApprovalStatus(action),
                status: ApprovalConstants.status.code.ACTIVE
            }
        } else if (action === ApprovalConstants.status.text.CLAIMED ||
            action === ApprovalConstants.status.text.DISCLAIMED) {
            return {
                code: approvalData.entityCode,
                name: approvalData.entityName,
                state: this.approvalService.getDataApprovalStatus(action),
                status: ApprovalConstants.status.code.INACTIVE
            }
        } else {
            return {
                code: approvalData.entityCode,
                name: approvalData.entityName,
                state: this.approvalService.getDataApprovalStatus(action),
                status: ApprovalConstants.status.code.ACTIVE
            };
        }
    }

    private   prepareApprovalRequestForSystemUser(approvalData: any, action: string) {
       
        if (approvalData.updatedInformation && approvalData.updatedInformation != '{}' &&
            action === ApprovalConstants.status.text.APPROVED) {
            console.log('user : updatedInformation' + approvalData.updatedInformation);
            return {
                ...JSON.parse(approvalData.updatedInformation),
                state: this.approvalService.getDataApprovalStatus(action),
                status: ApprovalConstants.status.code.ACTIVE
            }
        } else if (action === ApprovalConstants.status.text.CLAIMED ||
            action === ApprovalConstants.status.text.DISCLAIMED) {
            console.log('user : claimmed status update');
            return {
                ...JSON.parse(approvalData.updatedInformation),
                state: this.approvalService.getDataApprovalStatus(action),
                status: ApprovalConstants.status.code.INACTIVE
            }
        } else {
            console.log('user : created  staus update');
            return {
                ...JSON.parse(approvalData.updatedInformation),
                state: this.approvalService.getDataApprovalStatus(action),
                status: ApprovalConstants.status.code.ACTIVE
            };
        }
    }

    private fetchFeatureUrl(featureName: string): string {
        let url: string;
        switch (featureName) {
            case ApprovalConstants.featureName.ROLE: url = this.endpoints.E_WALLET_ROLE_URL;
                break;
            case ApprovalConstants.featureName.WALLET_OWNER: url = this.endpoints.E_WALLET_OWNER_URL;
                break;
            case ApprovalConstants.featureName.SYSTEM_USER: url = this.endpoints.E_WALLET_SYSTEM_USER_URL;
                break;
            case ApprovalConstants.featureName.PERMISSION: url = this.endpoints.E_WALLET_ROLE_PERMISSION_URL;
                break;
            case ApprovalConstants.featureName.GROUPS: url = this.endpoints.E_WALLET_GROUP_URL;
                break;
            case ApprovalConstants.featureName.TEMPLATE: url = this.endpoints.E_WALLET_TEMPLATE_URL;
                break;
            case ApprovalConstants.featureName.CURRENCY: url = this.endpoints.E_WALLET_CURRENCY_URL;
                break;
            case ApprovalConstants.featureName.COUNTRY: url = this.endpoints.E_WALLET_COUNTRY_URL;
                break;
            case ApprovalConstants.featureName.SERVICE_CATEGORY: url = this.endpoints.E_WALLET_SERVICE_CATEGORY_URL;
            break;
            case ApprovalConstants.featureName.SERVICE_PROVIDER: url = this.endpoints.E_WALLET_SERVICE_PROVIDER_API_URL;
            break;
            case ApprovalConstants.featureName.EMONEYCREATION: url = this.endpoints.E_WALLET_CONTROLACCOUNT_URL;
            break;
            
                
            default: url = '';
        }
        return url;
    }

    public getByCode(feature: string, code: string) {
 
        return this.http.get<any>(this.fetchFeatureUrl(feature) + '/' + code);
        
    }
    public getNameByCode(feature: string, code: string) {
 
        return this.http.get<any>(this.fetchFeatureUrl(feature) + code);
        
    }
    /**
 * method is dedicateldly for permission updation only
 * @param approvalData 
 */
    public permissionUpdation(approvalData: any): Observable<any> {
        return new Observable(observer => {
            this.roleStatusUpdate(approvalData).subscribe(roleUpdated => {
                if (roleUpdated.resultCode === '0') {
                    this.rolPermissionUpdate(approvalData).subscribe(permissionUpdated => {
                        if (permissionUpdated.resultCode === '0') {
                            return observer.next(permissionUpdated);
                        } else {
                            return observer.next(permissionUpdated);
                        }
                    });
                } else {
                    return observer.next(roleUpdated);
                }
            });
        });
    }

    private roleStatusUpdate(approvalData: any): Observable<any> {
        return this.http.put(this.endpoints.E_WALLET_ROLE_URL + '/' + approvalData.entityCode,
            {
                code: approvalData.entityCode,
                name: approvalData.entityName,
                state: this.approvalService.getDataApprovalStatus(ApprovalConstants.status.text.APPROVED),
                status: ApprovalConstants.status.code.INACTIVE
            });
    }

    private rolPermissionUpdate(approvalData: any): Observable<any> {
        return this.http.put(this.endpoints.E_WALLET_ROLE_PERMISSION_URL + '/' + approvalData.entityCode,
            {
                ...JSON.parse(approvalData.updatedInformation)
            });
    }

    getAll() {
        return this.http.get(this.endpoints.E_WALLET_INCENTIVE_DISTRIBUTION_URL +
          '/all',
          { headers: this.setMastersService.getHeaders() });
    
      }
    getTaxTypeMapped(){
        return this.http.get<any>(this.endpoints.E_WALLET_TAX_TYPE_URL + '/all', { headers:this.setMastersService.getHeaders() }).toPromise()
          .then(data => {
              console.log("Response===============");
              console.log(JSON.stringify(data));
    
              return data;
          }, error => {
              console.log("API error : " + JSON.stringify(error));
              return null;
          }
    
          );
      }
      

     

}