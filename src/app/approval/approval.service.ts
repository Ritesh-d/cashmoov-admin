import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../shared/endpoints';
import { Observable } from 'rxjs';
import { ApprovalConstants } from './approval.constants';
import { loginDataBuilder } from '../shared/login-data.builder';

@Injectable({
    providedIn: 'root',
})
export class ApprovalService {

    constructor(private http: HttpClient,
        private loginDataBuilder: loginDataBuilder,
        private endpoints: Endpoints) { }

    get approvals(): Observable<any> {
        return this.http.get<any>(this.endpoints.E_WALLET_DATA_APPROVAL_URL + '/all');
    }
     approvalsearch(request :any) : Observable<any>{
         console.log(this.endpoints.E_WALLET_DATA_APPROVAL_URL + '/all?'+request);
        return this.http.get<any>(this.endpoints.E_WALLET_DATA_APPROVAL_URL + '/all?'+request );
    }

    getApproval(approvalCode: string): Observable<any> {
        return this.http.get<any>(this.endpoints.E_WALLET_DATA_APPROVAL_URL + '/' + approvalCode);
    }

    public makeEntryToApproval(featureCode: string, featureInfo: any, updatedData?: any): Observable<any> {
        const approvalRequest = this.prepareDataApprovalRequest(featureCode, featureInfo, updatedData);
        console.log('--request--' + JSON.stringify(approvalRequest));
        return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
    }



    private prepareDataApprovalRequest(featureCode: string, featureInfo: any, updatedData?: any) {

        let dataApprovalList = [];
        dataApprovalList.push({
            featureCode: featureCode,
            entityCode: featureInfo.code,
            actionType: updatedData ? ApprovalConstants.status.text.UPDATED : ApprovalConstants.status.text.CREATED,
            updatedInformation: updatedData ? updatedData : {},
            comments: '',
            status: updatedData ? ApprovalConstants.status.code.UPDATED : ApprovalConstants.status.code.CREATED,
            assignTo: '',
            entityName: featureInfo.name

        });
        return { dataApprovalList: dataApprovalList };
    }

    public approvalAction(status: string, approvalData: any): Observable<any> {
         console.log('status ',status, 'request for approvalAction'  + JSON.stringify(this.approvalRequest(status, approvalData)));
       
            return this.http.put(this.endpoints.E_WALLET_DATA_APPROVAL_URL ,  this.approvalRequest(status, approvalData));

    }

    private approvalRequest(status: string, approvalData: any) {
        // approvalData.entity.status = (status == "Approved" ? "Y" : "Y");
        console.log(' approvar request status ' + status);
        if(status == "Approved"){
        // approvalData.entity.status =   "Y";
        approvalData.entity.state = ApprovalConstants.state.code.APPROVED;
        }else{
            // approvalData.entity.status =   "N";
            // approvalData.entity.state =   ApprovalConstants.state.code.IN_PROGRESS;
            // status =   approvalData.entity.status;
            // approvalData.entity.status = this.getDataApprovalStatus(status)
            // approvalData.entity.state = ApprovalConstants.state.code.IN_PROGRESS;
        } 
        console.log('on approval request status ' + status , approvalData.entity.state , approvalData.entity.status );
        // approvalData.entity.state = this.getDataApprovalStatus(status);
        let dataApprovalList = [];

        dataApprovalList.push({

            code: approvalData.code,
            featureCode: approvalData.featureCode,
            entityCode: approvalData.entityCode,
            entityName: approvalData.entityName,
            actionType: approvalData.actionType,
            updatedInformation: approvalData.updatedInformation ? (approvalData.updatedInformation) : {},
            comments: '',
            status: this.getDataApprovalStatus(status),
            assignTo: this.getUserCode(status),
            entity: approvalData.entity

        });
        return { dataApprovalList: dataApprovalList };
    }

    public getDataApprovalStatus(status: string) {
        let approvalStatus: string;
        switch (status) {
            case ApprovalConstants.status.text.CLAIMED:
                approvalStatus = ApprovalConstants.status.code.CLAIMED;
                break;
            case ApprovalConstants.status.text.APPROVED:
                approvalStatus = ApprovalConstants.status.code.APPROVED;
                break;
            case ApprovalConstants.status.text.REJECTED:
                approvalStatus = ApprovalConstants.status.code.REJECTED;
                break;
            case ApprovalConstants.status.text.DISCLAIMED:
                approvalStatus = ApprovalConstants.status.code.UPDATED;
                break;
            case ApprovalConstants.status.text.UPDATED:
                approvalStatus = ApprovalConstants.status.code.UPDATED;
                break;
            case ApprovalConstants.status.text.CREATED:
                approvalStatus = ApprovalConstants.status.code.CREATED;
                break;
            case ApprovalConstants.status.text.ENROLLED:
                approvalStatus = ApprovalConstants.status.code.ENROLLED;
                break;
            case ApprovalConstants.status.text.INACTIVE:
                approvalStatus = ApprovalConstants.status.code.INACTIVE;
                break;
            case ApprovalConstants.status.text.ACTIVE:
                approvalStatus = ApprovalConstants.status.code.ACTIVE;
                break;
            case ApprovalConstants.status.text.SUSPENDED:
                approvalStatus = ApprovalConstants.status.code.SUSPENDED;
                break;
            case ApprovalConstants.status.text.BLOCKED:
                approvalStatus = ApprovalConstants.status.code.BLOCKED;
                break;
            case ApprovalConstants.status.text.TERMINATED:
                approvalStatus = ApprovalConstants.status.code.TERMINATED;
                break;
            default: approvalStatus = '';
        }
        return approvalStatus;
    }

    private getUserCode(status: string) {
        if (status === ApprovalConstants.status.text.CLAIMED) {
            return this.loginDataBuilder.userData.userCode;
        }
        return '';
    }

    getValueOnCode(code: string) {
        let status: string;
        switch (code) {
            case ApprovalConstants.status.code.CLAIMED:
                status = ApprovalConstants.status.text.CLAIMED; break;
            case ApprovalConstants.status.code.APPROVED:
                status = ApprovalConstants.status.text.APPROVED; break;
            case ApprovalConstants.status.code.CREATED:
                status = ApprovalConstants.status.text.CREATED; break;
            case ApprovalConstants.status.code.UPDATED:
                status = ApprovalConstants.status.text.UPDATED; break;
            case ApprovalConstants.status.code.ACTIVE:
                status = ApprovalConstants.status.text.ACTIVE; break;
            case ApprovalConstants.status.code.INACTIVE:
                status = ApprovalConstants.status.text.INACTIVE; break;
            case ApprovalConstants.status.code.REJECTED:
                status = ApprovalConstants.status.text.REJECTED; break;
            case ApprovalConstants.status.code.NEW:
                status = ApprovalConstants.status.text.NEW; break;
            case ApprovalConstants.status.code.ENROLLED:
                status = ApprovalConstants.status.text.ENROLLED; break;
            case ApprovalConstants.status.code.INACTIVE:
                status = ApprovalConstants.status.text.INACTIVE; break;
            case ApprovalConstants.status.code.ACTIVE:
                status = ApprovalConstants.status.text.ACTIVE; break;
            case ApprovalConstants.status.code.SUSPENDED:
                status = ApprovalConstants.status.text.SUSPENDED; break;
            case ApprovalConstants.status.code.BLOCKED:
                status = ApprovalConstants.status.text.BLOCKED; break;
            case ApprovalConstants.status.code.TERMINATED:
                status = ApprovalConstants.status.text.TERMINATED; break;
            default: status = '';
        }
        return status;
    }

}