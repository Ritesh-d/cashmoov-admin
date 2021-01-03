import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EncryptData } from '../../shared/services/encryptdata.service';
import { Endpoints } from '../../shared/endpoints';
import { HttpClient } from '@angular/common/http';
import { loginDataBuilder } from '../../shared/login-data.builder';

@Injectable()
export class ChangePasswordService {

    constructor(private encryptData : EncryptData,
        private http: HttpClient,
        private endpoints: Endpoints,
        private loginDataBuilder: loginDataBuilder){}

    changePassword(formData: any): Observable<any> {
        // console.log('--formData--', formData);
        // console.log('--oldPassword--', formData.oldPassword);
        // const encryptedOldPassword = this.encryptData.encryptData(formData.oldPassword)
        // console.log('--encryptedOldPassword--', encryptedOldPassword);
        // console.log(this.prepareChangePasswordRequest(formData));
        // return new Observable(obserever => {obserever.next()});

        return this.http.put(this.endpoints.E_WALLET_CHANGE_PASSWORD_URL,
            this.prepareChangePasswordRequest(formData));
    }

    private prepareChangePasswordRequest(formData: any) {
        return {
            userCode: this.loginDataBuilder.userData.userCode,
            oldPassword: this.encryptData.encryptData(formData.oldPassword),
            password: this.encryptData.encryptData(formData.newPassword)
        };
    }
}