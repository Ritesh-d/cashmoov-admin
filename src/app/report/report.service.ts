import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service';
import { Endpoints } from '../shared/endpoints';
import { Observable } from 'rxjs';
import { CreateReportRequestModel } from './report-request.model';
import { ReportType } from './report-type';
import { formatDate } from '@angular/common';



@Injectable({
    providedIn: 'root',
})
export class ReportService {

    public data: any;
    public lang: string = "EN";

    constructor(
        private router: Router,
        private http: HttpClient,
        private session: SessionMgtService,
        private endpoints: Endpoints
        ) {}

    public detailReportmdl: any
    public reportmdl: any

    public getCurrentURL() {
        return this.router.url;
    }

    private getHeaders() {
        var token = this.session.getLoginToken();
        console.log('token ' + token);
        return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token)
    }

    public fetchReport(report: CreateReportRequestModel, endPoint: any, procSetupName: any, Format: string, reportType: string): Observable<CreateReportRequestModel> {

        console.log("ReportRequest : " + JSON.stringify(report));
        console.log(endPoint + "," + procSetupName + "," + Format + "," + reportType) ;

        let obserableCreate = Observable.create((obserle: any) => {
            if (reportType === ReportType.SIMPLE) {
                this.reportmdl = report as CreateReportRequestModel;
                this.reportmdl.reportType = reportType;
            }
            this.reportmdl.viewFormat = Format;
            this.reportmdl.setupName = procSetupName;
            // console.log("Programe is not running well !!!!!",this.getReportRequest(this.reportmdl, endPoint));
            this.getReportRequest(this.reportmdl, endPoint).subscribe(res => {
                this.reportmdl = res;
                // console.log("Programe is running well !!!!!", this.reportmdl);
                obserle.next(this.reportmdl);
                obserle.complete();
            })
        })
        return obserableCreate;
    };

    getReportRequest(request: any, uri: string): Observable<any> {
        console.log("<<<<<<<<<<<<<<<<<<<-------->>>>>>>>>>>>>>>>>>>" + JSON.stringify(request));
        console.log(uri, "\n" + JSON.stringify(request))

        return this.http.post(this.endpoints.E_WALLET_SIMPLE_REPORT_URL, request, { headers: this.getHeaders() });
        //  return this.http.get<any>('data/data.json')
    }

    getTransType() : Observable <any>{
        return this.http.get<any>(this.endpoints.E_WALLET_TRANS_TYPE_URL + '/all' , { headers: this.getHeaders() });
    }

    getWalletOwner() : Observable <any>{
        return this.http.get<any>(this.endpoints.E_WALLET_OWNER_URL + '/all?offset=0&limit=20', { headers: this.getHeaders() });

    }

    formatDatePicker(date : any){
        return formatDate(date.year+'-'+ date.month+'-'+ date.day, "yyyy-MM-dd", "en") ;
    }

    
}