import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
 
import { loginDataBuilder } from '../login-data.builder';
 
@Injectable()
export class SessionMgtService {
    toBeAuthenticated: boolean = false;
    basicAuthCredentials: string;
    features: any;
    constructor(private loginBuilder: loginDataBuilder ) {
      

    }
    
  
    setLoginToken(token) {
        this.loginBuilder.setTokenData(token);
        localStorage.setItem('token',JSON.stringify(token));
    }
    setLeftMenu(menu) {
        this.loginBuilder.setLeftMenu(menu);
        localStorage.setItem('menu',JSON.stringify(menu));
    }
    getLoginToken() {
        if(this.loginBuilder.token)
        return this.loginBuilder.token;
        else
        return JSON.parse(localStorage.getItem('token'));
    }
    getLeftMenu() {
        
        if(this.loginBuilder.leftMenu)
        return this.loginBuilder.leftMenu;
        else
        return JSON.parse(localStorage.getItem('menu'));
    }
    setUserName(userName: string) {
        this.loginBuilder.setUserName(userName);
        localStorage.setItem('username',userName);
    }
    setUserData(userData: any) {
        this.loginBuilder.setUserData(userData);
        localStorage.setItem('userdata',JSON.stringify(userData));
    }
    setLanguage(language: string) {
        this.loginBuilder.language = language;
        localStorage.setItem('language',language);
    }
}

