import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionMgtService } from '../shared/services/SessionMgt.service';

// @Injectable()
// export class RoleGuard implements CanActivate {

//     constructor(private router: Router) { }


//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//         console.log("auth called");
//         if (sessionStorage.getItem('currentuser')) {
//             // logged in so return true
//             return true;
//         }

//         // not logged in so redirect to login page with the return url
//         this.router.navigate(["/authentication/login"]);
//         return false;
//     }
// }

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private router: Router, private sessionService: SessionMgtService) { }


    canActivate(route: ActivatedRouteSnapshot) {
        console.log("role guard called");
        if(this.isSessionTimeout()){
            // this.router.navigate(["/authentication/login"], { queryParams: { refresh: new Date() } });
            // setTimeout('window.location.reload()', 500);
        }
        console.log('route.data.expectedRole',route);
        const expectedRole = route.data.expectedRole;

        var expectedRoleResult = false;
        JSON.parse(sessionStorage.getItem("levelList")).filter((element) => (element.level.find(level => level.subLevel.find(function (sub) { if (sub.url == expectedRole) expectedRoleResult = true }))))

        if (expectedRoleResult) {
            return true;
        }

        // not logged in so redirect to login page with the return url
        // this.router.navigate(["/authentication/login"]);
        return false;
    }
    isSessionTimeout():boolean{
        let diff: number = Number(sessionStorage.getItem("SESSION_START_TIME"))-new Date().getTime();
        console.log("Difference==" + diff)
        if (diff < 0) {
            return true;
        }
        let time:Date=new Date();
        time.setMinutes(time.getMinutes()+Number(sessionStorage.getItem("BROWSER_SESSION_TIMEOUT")));
        sessionStorage.setItem("SESSION_START_TIME",time.getTime().toString());
        return false;
    }
}