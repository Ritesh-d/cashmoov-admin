import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Endpoints } from '../shared/endpoints';
import { SessionMgtService } from '../shared/services/SessionMgt.service';
  

@Injectable()
export class DroplistDataService {
    
    constructor(private http: HttpClient,
        private router: Router,
        private session:SessionMgtService,
        private endpoints: Endpoints) { }
 
   groupMaster() {
    return this.http.get<any>(this.endpoints.E_WALLET_GROUP_URL+'/all',
        { headers: this.getHeaders() })
    } 

    private getHeaders() {
        var token=this.session.getLoginToken();
        return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + token);
    }
}