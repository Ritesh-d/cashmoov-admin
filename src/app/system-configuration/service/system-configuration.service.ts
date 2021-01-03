
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { DialogoverviewexampledialogComponent } from '../dialogoverviewexampledialog/dialogoverviewexampledialog.component';
//const InterceptorSkipHeader = 'X-Skip-Interceptor';
//const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

@Injectable()
export class SystemConfigurationService {

  storage: any;
  sharedData : any;



  public constructor(private http: HttpClient,private modalService: NgbModal) { }

  callToSystemConfigurationApi(url: string, request: any) {
    return this.http.post<any>(url, request)
      .toPromise()
      .then(data => {
        return data
      }, error => {
        console.log("API error : " + JSON.stringify(error));
        return null;
      }
      );
  }
  
}