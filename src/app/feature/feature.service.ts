import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../shared/endpoints';
import { Observable } from 'rxjs';

@Injectable()
export class FeatureService {

    constructor(private http: HttpClient,
        private endpoints: Endpoints) { }

    get features(): Observable<any> {
        return this.http.get<any>(this.endpoints.E_WALLET_FEATURE_URL + '/all');
    }
    
    get featuresByCriteria(): Observable<any> {
        return this.http.get<any>(this.endpoints.E_WALLET_FEATUREALLBYCRITERIA_URL + '?featureTypeCode=100000&status=Y');
     }
     featureUpdate(code : string,request : any): Observable<any> {
        return this.http.put(this.endpoints.E_WALLET_FEATURE_URL + '/'+ code, request);
    
      }

}