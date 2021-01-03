import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service';
import { Endpoints } from '../shared/endpoints';
import { Observable } from 'rxjs';
import { ApprovalConstants } from '../approval/approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable({
    providedIn: 'root',
})
export class ExchangerateService{
    setPermission: any;
    approvalRequired : boolean = false;
    constructor(private router: Router,private route: ActivatedRoute,
        private http: HttpClient,private commonHttpService: CommonHelperService,
        private session: SessionMgtService,
        private endpoints: Endpoints) {
            // this.route.queryParams.subscribe((params: Params) => {
            //     if(params['property']){
            //     this.setPermission = JSON.parse(params['property']);
            //    console.log('  this.setPermission',  this.setPermission);
            //     }
            //   });
            
            this.apporvalRequired(ApprovalConstants.featureCode.EXCHNAGERATE);
          
        }
        apporvalRequired(code: string) {
    
            this.setPermission = JSON.parse(localStorage.getItem(code));
    
            this.commonHttpService.approvalRequired(code,
                (status) => {
                    this.approvalRequired = status
                }
            )
    
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
    public getDetail(){
        return [{
            code: 10000,
            name:"Euro-GNF",
            sendingcurrency : 'Euro',
            sendingcountry:'Any',
            remittingagent:'Any',
            remittingbranch:'Any',
            receivingcurrency:'Euro',
            receivingcountry:'Any',
            payingagent:'Any',
            payingbranch:'Any',
            conversionrate:'1.12'
          
        },
        {
            code: 10002,
            name:"Dll drh",
            sendingcurrency : 'US Doller',
            sendingcountry:'Any',
            remittingagent:'Any',
            remittingbranch:'Any',
            receivingcurrency:'Morocco Dirham',
            receivingcountry:'Morocco',
            payingagent:'Any',
            payingbranch:'Any',
            conversionrate:'1'
        },
        { 
            code: 10003,
            name:"gnf xof",
            sendingcurrency : 'Any',
            sendingcountry:'Any',
            remittingagent:'Any',
            remittingbranch:'Any',
            receivingcurrency:'Guinea Franc',
            receivingcountry:'Any',
            payingagent:'Any',
            payingbranch:'Any',
            conversionrate:'0.069'

        }
    ];
    }
    private getHeaders() {
        var token = this.session.getLoginToken();
        console.log('token ' + token);
        return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token);
    }
   public  callGetDetail(request ) : Observable <any>{
        console.log('url ' + this.endpoints.E_WALLET_EXCHANGE_RATE_URL + '/all?'+request);
        return this.http.get<any>(this.endpoints.E_WALLET_EXCHANGE_RATE_URL + '/all?'+request, { headers: this.getHeaders() });
    }
    public  callGetCountry() : Observable <any>{
        console.log('url ' + this.endpoints.E_WALLET_COUNTRY_URL + '/all');
        return this.http.get<any>(this.endpoints.E_WALLET_COUNTRY_URL + '/all', { headers: this.getHeaders() });
    }
    public  callGetCurrency() : Observable <any>{
         return this.http.get<any>(this.endpoints.E_WALLET_CURRENCY_URL + '/all', { headers: this.getHeaders() });
    }
    public  callGetWalletOwner(ownercode) : Observable <any>{
          return this.http.get<any>(this.endpoints.E_WALLET_OWNER_URL + '/all?offset=0&limit=100&status=Y&walletOwnerCategoryCode='+ownercode );
    }
    public  callGetWalletOwnerOfParent(ownercode,parentCode) : Observable <any>{
        // console.log('url ' + this.endpoints.E_WALLET_OWNER_URL + '/all?offset=0&limit=100&walletOwnerCategoryCode='+ownercode+'&walletOwnerParentCode='+parentCode);
         return this.http.get<any>(this.endpoints.E_WALLET_OWNER_URL + '/all?status=Y&walletOwnerParentCode='+parentCode, { headers: this.getHeaders() });
        
        }
    

    createExchangeRate(request) {
 
        return this.http.post<any>(this.endpoints.E_WALLET_EXCHANGE_RATE_URL , request,
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
    modifyExchangeRate(request, code :string){

        return this.http.put<any>(this.endpoints.E_WALLET_EXCHANGE_RATE_URL + '/'+ code, request,
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

    public makeEntryToApproval(Info: any, updatedData?: any): Observable<any> {
        const approvalRequest = this.prepareDataApprovalRequest(Info, updatedData);
        console.log('--request--', approvalRequest);
        return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
    }

    private prepareDataApprovalRequest(Info: any, updatedData?: any) {
         let dataApprovalList = [];

            dataApprovalList.push({
            featureCode: ApprovalConstants.featureCode.EXCHNAGERATE,
            entityCode: Info.code,
            actionType: updatedData ? 'Updated' : 'Created',
            updatedInformation: updatedData ? updatedData :{},
            comments: '',
            status:  updatedData ? ApprovalConstants.status.code.UPDATED :ApprovalConstants.status.code.CREATED,
            assignTo: '',
            entityName: Info.name,
            
        });
        return {dataApprovalList : dataApprovalList};
    }

    preparedUpdatedDataForApproval(unChangedData: any, updatedData: any) {
      
        let updatedInfo: any = {};
            if(unChangedData.name != updatedData.name){
            updatedInfo.name = updatedData.name;
            }
            if(unChangedData.sendCurrencyCode != updatedData.sendCurrencyCode){
            updatedInfo.sendCurrencyCode = updatedData.sendCurrencyCode;
            }
            if(unChangedData.receiveCurrencyCode != updatedData.receiveCurrencyCode){
                updatedInfo.receiveCurrencyCode = updatedData.receiveCurrencyCode;
                }
                if(unChangedData.sendCountryCode != updatedData.sendCountryCode){
                    updatedInfo.sendCountryCode = updatedData.sendCountryCode;
                    }
                    if(unChangedData.receiveCountryCode != updatedData.receiveCountryCode){
                        updatedInfo.receiveCountryCode = updatedData.receiveCountryCode;
                        }
                        if(unChangedData.remitAgentCode != updatedData.remitAgentCode){
                            updatedInfo.remitAgentCode = updatedData.remitAgentCode;
                            }
                            if(unChangedData.remitBranchCode != updatedData.remitBranchCode){
                                updatedInfo.remitBranchCode = updatedData.remitBranchCode;
                                }
                                if(unChangedData.payAgentCode != updatedData.payAgentCode){
                                    updatedInfo.payAgentCode = updatedData.payAgentCode;
                                    }
                                    if(unChangedData.payBranchCode != updatedData.payBranchCode){
                                        updatedInfo.payBranchCode = updatedData.payBranchCode;
                                        }
                                        if(unChangedData.value != updatedData.value){
                                            updatedInfo.value = updatedData.value;
                                            }

                                            if(unChangedData.payInstituteCode != updatedData.payInstituteCode){
                                                updatedInfo.payInstituteCode = updatedData.payInstituteCode;
                                                }
                                                if(unChangedData.remitInstituteCode != updatedData.remitInstituteCode){
                                                    updatedInfo.remitInstituteCode = updatedData.remitInstituteCode;
                                                    }
                                            
        return updatedInfo;
    }
}