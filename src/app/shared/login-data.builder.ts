import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class loginDataBuilder {
    private tokendata;
    private leftMenuData;
    private username: string;
    private userdata: any;
    language = 'en';
    constructor() {
      
    }



    setTokenData(token) {
        this.tokendata=token;
        localStorage.setItem('token',JSON.stringify(token));
    }
    get token() {
       

       if(this.tokendata)
        return this.tokendata;
        else
        return JSON.parse(localStorage.getItem('token'));
    }

    setLeftMenu(menu) {
        this.leftMenuData=menu;
    }
    get leftMenu() {
       return this.leftMenuData;
    }

    setUserName(userName) {
        this.username = userName;
    }
    get userName() {
        
        if(this.username)
        return this.username;
        else
        return localStorage.getItem('username');
    }

    setUserData(userData : any){
        this.userdata = userData;
    }
    get userData(): any{
        
        if(this.userdata)
        return this.userdata;
        else
        return JSON.parse(localStorage.getItem('userdata'));
    }

}