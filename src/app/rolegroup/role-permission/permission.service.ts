import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../../shared/endpoints';
import { Observable } from 'rxjs';
import { PermissionRequestModel } from './permission-request.model';
import { DatePipe } from '@angular/common';
import { ApprovalConstants } from '../../approval/approval.constants';

@Injectable()
export class PermissionService {

  constructor(private http: HttpClient,
    private datePipe: DatePipe,
    private endpoints: Endpoints) { }

  get features(): Observable<any> {
    return this.http.get<any>(this.endpoints.E_WALLET_FEATUREALLBYCRITERIA_URL + '?featureTypeCode=100000&status=Y');
  }

  createPermission(roleCode: string, selectedFeatures: any[]): Observable<any> {
    return this.http.post(this.endpoints.E_WALLET_ROLE_PERMISSION_URL,
      this.preparePermissionRequest(roleCode, selectedFeatures));
  }

  updatePermission(roleCode: string, selectedFeatures: any[]): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_ROLE_PERMISSION_URL + '/' + roleCode,
      this.preparePermissionRequest(roleCode, selectedFeatures));
  }

  preparePermissionRequest(roleCode: string, selectedFeatures: any[]): PermissionRequestModel {
    return {
      featuresList: this.prepareFeatureList(selectedFeatures),
      roleCode: roleCode
    };
  }

  private prepareFeatureList(selectedFeatures: any) {
    let featureList = [];
    selectedFeatures.forEach(feature => {
      featureList.push({
        approve: feature.approveChecked,
        view: feature.viewChecked,
        create: feature.addChecked,
        delete: feature.deleteChecked,
        edit: feature.editChecked,
        featuresCode: feature.code,
        name: feature.name
      });
    });
    return featureList;
  }

  public makeRoleStatusUpdated(roleData: any): Observable<any> {
    return this.http.put(this.endpoints.E_WALLET_ROLE_URL+ '/'+ roleData.code,
    this.prepareRoleStatusUpdatedRequest(roleData));
  }

  prepareRoleStatusUpdatedRequest(roleData: any) {
    return {
      name: roleData.name,
      code: roleData.code,
      state: ApprovalConstants.status.code.UPDATED,
      status: ApprovalConstants.status.code.INACTIVE
    };
  }
}
