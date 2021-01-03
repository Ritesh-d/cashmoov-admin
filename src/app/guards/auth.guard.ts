import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,private session: SessionMgtService) { }
    

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log("auth called");
    //   if (sessionStorage.getItem('currentuser')) {
        if (this.session.getLoginToken()!=null && this.session.getLoginToken()!=undefined) {
            // logged in so return true
           
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(["/authentication/login"]);
        return false;
    }
}