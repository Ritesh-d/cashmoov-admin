import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service';
import { Endpoints } from '../shared/endpoints';
import { Observable } from 'rxjs';
import { ApprovalConstants } from '../approval/approval.constants';
import { ApprovalService } from '../approval/approval.service';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Injectable({
    providedIn: 'root',
})
export class LoadMoneyService{
    setPermission: any;
    approvalRequired: Boolean=false;
    allowedFileType = [];
    fileSize: number;
    constructor(private router: Router,private route: ActivatedRoute,
        private http: HttpClient,
        private session: SessionMgtService,
       
        private approvalService : ApprovalService,
        private commonHttpService: CommonHelperService,
        private endpoints: Endpoints) {
            // this.route.queryParams.subscribe((params: Params) => {
            //     if(params['property']){
            //     this.setPermission = JSON.parse(params['property']);
            //     }
            //   });
           this.apporvalRequired(ApprovalConstants.featureCode.EMONEYCREATION);
     
        }
        apporvalRequired(code: string) {
    
            this.setPermission = JSON.parse(localStorage.getItem(code));
    
            this.commonHttpService.approvalRequired(code,
                (status) => {
                    this.approvalRequired = status
                }
            )
    
       }
       get allowedTypes() {
        return this.commonHttpService.configData['allowedDocumentType'];
      }
      get allowedFileSize() {
        return this.commonHttpService.configData['allowedFileSize'];
      }
       get getNote(): string {
        this.allowedFileType = this.allowedTypes;
        this.fileSize = +this.allowedFileSize;
        let docInfo = '* allowed format are as: '
        this.allowedFileType.forEach(item => {
          docInfo = docInfo + item+ ',';
        });
        docInfo = docInfo + ' maximum file size allowed ' + (this.fileSize/1000) + ' kb' ;
        return docInfo;
      }
      
  validFile(file: File): { valid: boolean, message: string } {
    if (file.size > this.fileSize) {
      return { valid: false, message: 'File size exceeds' };
    } else if (!this.allowedFileType.includes(file.type)) {
      return { valid: false, message: 'Invalid file extension' };
    } else {
      return { valid: true, message: undefined };
    }
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
    
    private getHeaders() {
        var token = this.session.getLoginToken();
        console.log('token ' + token);
        return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token);
    }
    
   public  callGetDetail( ) : Observable <any>{
        // console.log('url ' + this.endpoints.E_WALLET_EMONEY_CREATION_URL + '/all?'+request);
        return this.http.get<any>(this.endpoints.E_WALLET_EMONEY_CREATION_URL + '/all', { headers: this.getHeaders() });
    }
 
    // createLoadMoney(request: any) {
    //     return this.http.post<any>(this.endpoints.E_WALLET_EMONEY_CREATION_URL, request);       
    // }
     
    createLoadMoney(request) {
 
        return this.http.post<any>(this.endpoints.E_WALLET_EMONEY_CREATION_URL , request,
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
    modifyLoadMoney(request, code :string){

        return this.http.put<any>(this.endpoints.E_WALLET_EMONEY_CREATION_URL + '/'+ code, request,
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

    callGetWalletOwner(ownercode) : Observable <any>{
        return this.http.get<any>(this.endpoints.E_WALLET_CONTROLACCOUNT_URL + '/all?offset=0&limit=100&walletOwnerCategoryCode='+ownercode, { headers: this.getHeaders() });

    }
    

    callGetWalletOwnerCategory() : Observable <any>{
        return this.http.get<any>(this.endpoints.E_WALLET_MASTERS_URL + 'CATEGORY' , { headers: this.getHeaders() });
    }
    

    public  callGetCurrency(walletOwnerCode) : Observable <any>{
        return this.http.get<any>(this.endpoints.E_WALLET_WALLETOWNER_COUNTRYCURRENCY_URL + '/'+ walletOwnerCode, { headers: this.getHeaders() });
   }

   public uploadReceipt( file: File , transactionCode : string){
    const formData = new FormData();
    formData.append('file', file);
    formData.append('transactionCode', transactionCode);
    console.log('formData', formData);
    return this.http.post<any>(this.endpoints.E_WALLET_EMONEY_CREATION_URL + '/fileUpload' ,formData ,
    {
        reportProgress: true,
        observe: 'events'
      }
    );


   }
  public  downloadRecipt(transactionCode: string,fileName : string): Observable<Blob>{
    return this.http.get<any>(this.endpoints.E_WALLET_EMONEY_CREATION_URL + 
        '/download/'+transactionCode+'/'+fileName , {  responseType: 'blob' as 'json',}  );
   }

   public  getReceipt(transactionCode: string,fileName : string){
    return  (this.endpoints.E_WALLET_EMONEY_CREATION_URL + 
        '/download/'+transactionCode+'/'+fileName  );
   }

   convertBase64(url,  callback) {
 
    let _this=this;
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
              var reader = new FileReader();  
              reader.onloadend = function(data) {
            var exprots:any=reader.result;   
              var arr = exprots.split(',');
                  var base64 = arr[arr.length-1];
          callback(base64);
                
        
                
              };
              reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.send();
        
          }

    // public makeEntryToApproval(Info: any, updatedData?: any): Observable<any> {
       
    //     console.log("######---1",Info,updatedData);
    //     const approvalRequest = this.prepareDataApprovalRequest(Info, updatedData);
    //     console.log('--request--', +approvalRequest);
    //     console.log("######--2",Info);
    //     return this.http.post(this.endpoints.E_WALLET_DATA_APPROVAL_URL, approvalRequest);
    // }

    // private prepareDataApprovalRequest(Info: any, updatedData?: any) {
    //         let dataApprovalList = [];

    //         dataApprovalList.push({
    //         featureCode: ApprovalConstants.featureCode.EMONEYCREATION,
    //         entityCode: Info.code,
    //         actionType: updatedData ? 'Updated' : 'Created',
    //         updatedInformation: updatedData ? updatedData :{},
    //         comments: '',
    //         status:  updatedData ? ApprovalConstants.status.code.UPDATED :ApprovalConstants.status.code.CREATED,
    //         assignTo: '',
    //         entityName: 'LoadMoney',
    //         entity:Info.createLoadMoneyForm
                       
    //     });
    //     console.log("########",Info.createLoadMoneyForm);
    //     return {dataApprovalList : dataApprovalList};
    // }


    public makeEntryToApproval(featureCode: string, featureInfo: any, updatedData?: any): Observable<any> {
        console.log('info',featureInfo,featureCode);
        const approvalRequest = this.prepareDataApprovalRequest(featureCode, featureInfo, updatedData);
        console.log('info',featureInfo,featureCode);
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
            entityName: 'E-Money Creation'
         });
   
        return { dataApprovalList: dataApprovalList };
    }
    preparedUpdatedDataForApproval(unChangedData: any, updatedData: any) {
      
        let updatedInfo: any = {};
            if(unChangedData.walletOwnerCode != updatedData.walletOwnerCode){
            updatedInfo.walletOwnerCode = updatedData.walletOwnerCode;
            }
            if(unChangedData.currencyCode != updatedData.currencyCode){
            updatedInfo.currencyCode = updatedData.currencyCode;
            }
            
            if(unChangedData.amount != updatedData.amount){
                updatedInfo.amount = updatedData.amount;
                }
                   
                if( this.approvalService.getDataApprovalStatus(unChangedData.status) != updatedData.status){
                    updatedInfo.status = updatedData.status;
                  }                               
        return updatedInfo;
    }
}
