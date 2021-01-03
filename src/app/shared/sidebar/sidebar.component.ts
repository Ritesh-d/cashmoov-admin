import { Component, OnInit, NgZone, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ROUTES } from './menu-items';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginLogoutAuthenticationService } from '../services/loginlogoutauthentication.service';
import { LogoutRequestModel } from '../models/logoutrequest.model';
import { LogoutModel } from '../models/logout.model';
import { TranslateService } from '@ngx-translate/core';
import { Location, formatDate } from '@angular/common';
import { API_URLs } from '../models/constants';
import { SessionMgtService } from '../../shared/services/SessionMgt.service';
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[];
  logoutrequest: LogoutRequestModel = new LogoutRequestModel();
  logoutdata: LogoutModel = new LogoutModel();
  error = '';
  loginId: string;
  languagecode: string = "en";
  menusList: any = { "levelList": JSON.parse(sessionStorage.getItem("levelList")) };
  userName: string = sessionStorage.getItem("userName");
  errorMessage: string;

  // this is for the open close
  addExpandClass(element: any) {
    console.log("element : " + element);
    console.log("showmenu : " + this.showMenu);
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  constructor(private modalService: NgbModal,
    private router: Router,
    private loginauthenticationservice: LoginLogoutAuthenticationService,
    private activatedrouter: ActivatedRoute,
    private sessionSerivce: SessionMgtService,
    private translateservice: TranslateService,
    private zone: NgZone,
    private location: Location,
    private ref: ChangeDetectorRef,
    private app: ApplicationRef,
    private apiurls: API_URLs) { }

  // End open close
  rajatfcodes = [
    1,
    2,
    100000,
    100001,
    100002,
    100003,
    100004,
    100005,
    100006,
    100007,
    100008,
    100009,
    100010,
    100011,
    100012,
    100013,
    100014,
    100015,
    // 100034,
    100016];

  features = [
    {
      walletowner: []
    },
    {
      walletmanagement: []
    },
    {
      systemuser: []
    },
    {
      groups: []
    },
   
    {
      other: []
    },
    {
      reports: []
    },
    {
      productcategory: []
    },
  ];

  // featureList; features: grant to user from api
  featureList = this.sessionSerivce.getLeftMenu();
  ngOnInit() {
    this.loginId = sessionStorage.getItem('loginId');
    // all the available menu items
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);

    // if (this.loginId == 'rajat.sharma' || this.loginId == 'Ankit') {
    //   for (var i = 0; i < this.sidebarnavItems.length; i++) {
    //     for (var j = 0; j < this.rajatfcodes.length; j++) {
    //       if (this.sidebarnavItems[i].code == this.rajatfcodes[j]) {
    //         console.log(this.sidebarnavItems[i].headingcode)
    //         if (this.sidebarnavItems[i].headingcode == '01')
    //           this.features[0].walletowner.push(this.sidebarnavItems[i]);
    //         if (this.sidebarnavItems[i].headingcode == '02')
    //           this.features[2].systemuser.push(this.sidebarnavItems[i]);
    //         if (this.sidebarnavItems[i].headingcode == '03')
    //           this.features[3].groups.push(this.sidebarnavItems[i]);
    //         if (this.sidebarnavItems[i].headingcode == '04')
    //           this.features[4].other.push(this.sidebarnavItems[i]);
    //           if (this.sidebarnavItems[i].headingcode == '05')
    //           this.features[1].walletmanagement.push(this.sidebarnavItems[i]);
    //           if (this.sidebarnavItems[i].headingcode == '06')
    //           this.features[5].reports.push(this.sidebarnavItems[i]);
    //       }
    //     }
    //   }
    // }

    // if (this.loginId != 'rajat.sharma' && this.loginId != 'Ankit' && this.loginId != undefined) {
      for (var i = 0; i < this.sidebarnavItems.length; i++) {
        if(this.featureList != null && this.featureList != undefined){
        for (var j = 0; j < this.featureList.length; j++) {
          if (this.sidebarnavItems[i].code == this.featureList[j].featuresCode) {
            console.log(this.sidebarnavItems[i].headingcode)
 
            // this.sidebarnavItems[i].permission.push(JSON.stringify(this.featureList[j]))
            localStorage.setItem(this.featureList[j].featuresCode,JSON.stringify(this.featureList[j]));
            if (this.sidebarnavItems[i].headingcode == '01')
              this.features[0].walletowner.push({...this.sidebarnavItems[i],...this.featureList[j]});
            if (this.sidebarnavItems[i].headingcode == '02')
              this.features[2].systemuser.push({...this.sidebarnavItems[i],...this.featureList[j]});
            if (this.sidebarnavItems[i].headingcode == '03')
              this.features[3].groups.push({...this.sidebarnavItems[i],...this.featureList[j]});
            if (this.sidebarnavItems[i].headingcode == '04')
              this.features[4].other.push({...this.sidebarnavItems[i],...this.featureList[j]});
              if (this.sidebarnavItems[i].headingcode == '05')
              this.features[1].walletmanagement.push({...this.sidebarnavItems[i],...this.featureList[j]});
              // if (this.sidebarnavItems[i].headingcode == '06')
              // this.features[5].reports.push({...this.sidebarnavItems[i],...this.featureList[j]});  // Removed for UAT 
              if (this.sidebarnavItems[i].headingcode == '07')
              this.features[6].productcategory.push({...this.sidebarnavItems[i],...this.featureList[j]});
          }
        }
      }
      }
    // }
  }

  logOut() {
    // this.logoutdata.loginId = sessionStorage.getItem('loginId');
    this.logoutdata.loginId = sessionStorage.getItem("currentuser");
    this.logoutdata.channel = "IWP";
    this.logoutdata.comments = "User Logout request";
    this.logoutdata.requestcts = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss.SSS", "en");
    this.logoutdata.userId = sessionStorage.getItem("userId");

    this.logoutrequest.action = "LOGOUT";
    this.logoutrequest.request = this.logoutdata;

    console.log("LOGOUT request : " + JSON.stringify(this.logoutrequest));

    /*
        sessionStorage.removeItem('currentuser');
        sessionStorage.removeItem('loginId');
        sessionStorage.removeItem('loginId');
        sessionStorage.removeItem('masterdata');
        this.router.navigate(["/authentication/login"]);
    
        window.location.reload(true)
        this.zone.run(() => {
          window.location.reload(true);
          this.location.forward();
          angular2.reRenderUIPart();
          angular.reRenderUIPart();
    
          setTimeout('location.reload(true)', 2000);
          setTimeout(function () {
            window.location.href = "/#/authentication/login";
          }, 2000);
          setTimeout('this.location.forward()', 2000);
          setTimeout('location.reload(true)', 2000);
          setTimeout(this.app.tick(), 2000);
        });
    
        
        setTimeout(() => {
          this.app.tick();
        }, 2000);
    
        this.ref.detach();
        setInterval(() => {
          this.ref.detectChanges();
        }, 2000);
    
        this.router.navigate(["/authentication/login"], { queryParams: { refresh: new Date() } });
        this.zone.run(() => this.router.navigate(["/authentication/login?refresh=1"]));
    
        this.router.navigateByUrl('/authentication/login', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/authentication/login"]));
    
        this.loginauthenticationservice.logOut(this.apiurls.URL_LOGOUT, this.logoutrequest)
          .then(
            data => {
              console.log("data : " + JSON.stringify(data));
              if (data == null) {
                this.translateservice.get('common_error_message').subscribe((text: string) => { this.errorMessage = text; });
              } else if (data["response"]["resultCode"] == this.apiurls.RESULT_CODE) {
                this.router.navigate(["/authentication/login"], { queryParams: { refresh: new Date() } });
                setTimeout('window.location.reload()', 500);
              } else {
                this.translateservice.get('err_logout').subscribe((text: string) => { this.errorMessage = text; });
                alert(this.errorMessage);
              } 
            }
          );
      */ 

  }

/*
  onChangePassword() {
    // this.router.navigate(['/user/change-password'],{queryParams : {language : this.languagecode}});
    // this.router.navigate(['/authentication/change-password'],{queryParams : {language : this.languagecode}});
    this.router.navigate(['/password/changepassword'], { queryParams: { language: this.languagecode } });
  }

  onSearchUser() {
    this.router.navigate(['/user/searchuser'], { queryParams: { language: this.languagecode } });
  }

  onPartnerProfile() {
    this.router.navigate(['/profilemanagement/partnerprofile'], { queryParams: { language: this.languagecode } });

  }

  onGenerateVoucher() {
    this.router.navigate(['/vouchergeneration/generatevoucher'], { queryParams: { language: this.languagecode } });

  }
  
  onOrderVoucher() {
    this.router.navigate(['/voucherorder/ordervoucher'], { queryParams: { language: this.languagecode } });

  }

  onSearchRoleType() {
    this.router.navigate(['/roletype/searchroletype'], { queryParams: { language: this.languagecode } });
  }

  onVoucherActivation() {
    this.router.navigate(['/voucheractivationanddistribution/voucheractivation'], { queryParams: { language: this.languagecode } });

  }

  onVoucherDeactivation() {
    this.router.navigate(['/voucheractivationanddistribution/voucherdeactivation'], { queryParams: { language: this.languagecode } });
  }

  onVoucherRecharge() {
    this.router.navigate(['/voucherrecharge/voucherrecharge'], { queryParams: { language: this.languagecode } });
  }

  onPrintingSupplierSearch() {
    this.router.navigate(['/printingsupplier/searchprintingsupplier'], { queryParams: { language: this.languagecode } });
  }
  
  onCreatePrintingSupplier() {
    this.router.navigate(["/printingsupplier/createprintingsupplier"], { queryParams: { language: this.languagecode } });
  }

  onCreateRoleType() {
    this.router.navigate(["/roletype/createroletype"], { queryParams: { language: this.languagecode } });
  }

  onCreateGroupType() {
    this.router.navigate(["/rolegroup/creategrouptype"], { queryParams: { language: this.languagecode } });
  }

  onSearchGroupType() {
    this.router.navigate(["/rolegroup/searchgrouptype"], { queryParams: { language: this.languagecode } });
  }

  onCreateInternalUser() {
    this.router.navigate(["/internaluser/newinternaluser"], { queryParams: { language: this.languagecode } });
  }

  onSearchInternalUser() {
    this.router.navigate(["/internaluser/searchinternaluser"], { queryParams: { language: this.languagecode } });
  }
    
  navigateToPage(sublevel: any) {
    if (sublevel.url) {
      console.log("sublevel.url:" + sublevel.url);
      this.router.navigate([sublevel.url], { queryParams: { language: this.languagecode, sublevelid: sublevel.roleId } });
    }
  }

  showUser() {
    let admin = this.getAdminList();
    if (admin != null && admin.USERS != undefined) {
      return true;
    } else {
      return false;
    }
  }

  getAdminList() {
    let obj = JSON.parse(sessionStorage.getItem('currentuser'));
    if (obj != undefined && obj.response != undefined && obj.response.levelList != undefined) {
      if (obj.response.levelList[0] != undefined && obj.response.levelList[0].ADMIN != undefined) {
        return obj.response.levelList[0].ADMIN;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
*/

}
