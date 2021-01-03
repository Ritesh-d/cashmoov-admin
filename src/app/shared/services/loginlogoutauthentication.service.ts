import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Endpoints } from '../endpoints';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { loginDataBuilder } from '../login-data.builder';

@Injectable({ providedIn: 'root' })
export class LoginLogoutAuthenticationService {
    constructor(private http: HttpClient,
        private endpoints: Endpoints,
        private loginDataBuilder : loginDataBuilder,
        private configService: ConfigService) { }

    logIn(username: string, password: string): Observable<any> {
        return this.http.post(this.endpoints.E_WALLET_LOGIN_URL, this.getParams(username, password),
            {
                headers: this.getHeaders()
            });
    }

    get logout(): Observable<any> {
        return this.http.post(this.endpoints.E_WALLET_LOGOUT_URL, { } );
    }

    logOut(url: string, request: any) {
        return this.http.post<any>(url, request)
            .toPromise()
            .then(data => {
                return data
            }, error => {
                console.log("API error : " + JSON.stringify(error));
                return null;
            });
    }

 

    private getHeaders() {
        return new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', 'Basic ' + window.btoa(this.configService.authKey))
            .set('source', 'ADMIN');
    }

    private getParams(username: string, password: string) {
        return new HttpParams()
            .set('grant_type', 'password')
            .set('scope', 'read write')
            .set('username', username)
            .set('password', password);
    }

    findActionPriority(levelList: any[], subLevelIdLocal: string) {
        var subLevel;
        levelList.filter((element) => (element.level.find(level => level.subLevel.find(function (sub) { if (sub.roleId == subLevelIdLocal) subLevel = sub }))))
        return subLevel.actionPriority.split(",");
    }
}