import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserModel } from './user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service'
import { Endpoints } from '../shared/endpoints';
import { ApprovalConstants } from '../approval/approval.constants';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { ApprovalService } from '../approval/approval.service';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    setPermission : any;
    approvalRequired : boolean = false;
    private userModel: UserModel[];
    constructor(private router: Router,
        private http: HttpClient, private route: ActivatedRoute,
        private session: SessionMgtService,
        private commonHttpService: CommonHelperService,
        private approvalService : ApprovalService,
        private endpoints: Endpoints) {
          console.log('yui',ApprovalConstants.featureCode.USER);
           this.apporvalRequired(ApprovalConstants.featureCode.USER);
         }

    
        apporvalRequired(code: string) {

            this.setPermission = JSON.parse(localStorage.getItem(code)); 
            this.commonHttpService.approvalRequired(ApprovalConstants.featureCode.USER,
                (status) => {
                    this.approvalRequired = status
                }
            )

        }

 
    async getusersDetail(requestparams) {

        const data = await this.callGetUser(requestparams);
        this.userModel = data["userList"];
        return this.userModel;
    }

    public getCurrentURL() {
        return this.router.url;
    }

    public prepareUserAction(): boolean {
        const currentURL = this.getCurrentURL();
        if (currentURL.indexOf('/add') > -1) {
            return false;
        } else if (currentURL.indexOf('/edit') > -1) {
            return true;
        }
        return null;
    }



    createUser(request) {
        return this.http.post<any>(this.endpoints.E_WALLET_SYSTEM_USER_URL, request,
            { headers: this.getHeaders() })
            .toPromise()
            .then(data => {
                return data
            }, error => {
                console.log("API error : " + JSON.stringify(error));
                if (error)
                    return error.error;
                else
                    return null;
            }
            );
    }
    modeifyUser(request, code) {
        console.log('request to update ',request);
        return this.http.put<any>(this.endpoints.E_WALLET_SYSTEM_USER_URL + "/" + code, request,
            { headers: this.getHeaders() })
            .toPromise()
            .then(data => {
                return data
            }, error => {
                console.log("API error : " + JSON.stringify(error));
                if (error)
                    return error.error;
                else
                    return null;
            }
            );
    }
    groupMaster() {
        return this.http.get<any>(this.endpoints.E_WALLET_GROUP_URL + '/all',
            { headers: this.getHeaders() })

    }
    roleMaster() {
        return this.http.get<any>(this.endpoints.E_WALLET_ROLE_URL + '/all',
            { headers: this.getHeaders() })

    }
    idProofTypeMaster() {
        return this.http.get<any>(this.endpoints.E_WALLET_IDPROOFTYPE_URL ,
            { headers: this.getHeaders() })
    }
    


    async callGetUser(request) {
        console.log('url ' + this.endpoints.E_WALLET_SYSTEM_USER_URL + '/all?' + request);
        return this.http.get<any>(this.endpoints.E_WALLET_SYSTEM_USER_URL + '/all?' + request, { headers: this.getHeaders() }).toPromise()
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

    public getByCode(code: string) {
        return this.http.get<any>(this.endpoints.E_WALLET_SYSTEM_USER_URL  + '/' + code).toPromise()
        .then(data => {
            return data["user"];
        }, error => {  
            return null;
        }
        );  
    }

    private getHeaders() {
        var token = this.session.getLoginToken();
        console.log('token ' + token);
        return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
   
    }



    public makeEntryToApproval(Info: any, updatedData?: any): Observable<any> {
        const approvalRequest = this.prepareDataApprovalRequest(Info, updatedData);
        console.log('--request--', approvalRequest);
        return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
    }

    private prepareDataApprovalRequest(Info: any, updatedData?: any) {
         let dataApprovalList = [];

            dataApprovalList.push({
        
            featureCode: ApprovalConstants.featureCode.USER,
            entityCode: Info.code,
            actionType: updatedData ? 'Updated' : 'Created',
            updatedInformation: updatedData ? updatedData :{},
            comments: '',
            status:  updatedData ? ApprovalConstants.status.code.UPDATED :ApprovalConstants.status.code.CREATED,
            assignTo: '',
            entityName: Info.userName,
            
        });
        console.log("########",updatedData,dataApprovalList);
        return {dataApprovalList : dataApprovalList};
    }
    preparedUpdatedDataForApproval(unChangedData: any, updatedData: any) {
        
        let updatedInfo: any = {};

        if(unChangedData.roleCode != updatedData.role_code){
        updatedInfo.roleCode = updatedData.role_code;
        }
        if(unChangedData.firstName != updatedData.first_name){
        updatedInfo.firstName = updatedData.first_name;
        }
        if(unChangedData.lastName != updatedData.last_name){
        updatedInfo.lastName = updatedData.last_name;
        }
        if(unChangedData.userName != updatedData.user_name){
        updatedInfo.userName = updatedData.user_name;
        }
        if(unChangedData.email != updatedData.email){
        updatedInfo.email = updatedData.email;
        }
        if(unChangedData.mobileNumber != updatedData.mobile_number){
        updatedInfo.mobileNumber = updatedData.mobile_number;
        }
        if(unChangedData.employeeId != updatedData.employeeId){
        updatedInfo.employeeId = updatedData.employeeId;
        }
        // if(unChangedData.idProofNumber != updatedData.idProofNumber){
        // updatedInfo.idProofNumber = updatedData.idProofNumber;
        // }
        // if(unChangedData.idProofTypeCode != updatedData.idProofType){
        // updatedInfo.idProofTypeCode = updatedData.idProofType;
        // }
        // if(unChangedData.idExpiryDate != this.formatDatePicker(updatedData.idExpiryDate)){
        // updatedInfo.idExpiryDate =this.formatDatePicker(updatedData.idExpiryDate);
        // }
        // if(unChangedData.toDate != this.formatDatePicker(updatedData.todate)){
        // updatedInfo.toDate =this.formatDatePicker(updatedData.todate);
        // }
        // if(unChangedData.fromDate != this.formatDatePicker(updatedData.fromdate)){
        //     updatedInfo.fromDate =this.formatDatePicker(updatedData.fromdate);
        //  }
        if( this.approvalService.getDataApprovalStatus(unChangedData.status) != updatedData.status){
          updatedInfo.status = updatedData.status;
        }
        if(updatedData.todate &&  updatedData.todate !=null && updatedData.todate!=undefined){
          if(unChangedData.toDate != this.formatDatePicker(updatedData.todate)){
          updatedInfo.toDate =this.formatDatePicker(updatedData.todate);
        }
        }
        if(updatedData.fromdate &&  updatedData.fromdate !=null && updatedData.fromdate!=undefined){
          if(unChangedData.fromDate != this.formatDatePicker(updatedData.fromdate)){
          updatedInfo.fromDate =this.formatDatePicker(updatedData.fromdate);
        }
        }
         
        return updatedInfo;
    }

    formatDatePicker(date : any){
  
        return formatDate(date.year+'-'+ date.month+'-'+ date.day, "yyyy-MM-dd", "en") ;

    }

}



