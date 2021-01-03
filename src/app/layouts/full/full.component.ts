import { Component, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { API_URLs } from '../../shared/models/constants';
import { loginDataBuilder } from '../../shared/login-data.builder';
import { LoginLogoutAuthenticationService } from '../../shared/services/loginlogoutauthentication.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit, AfterViewInit {
  //color = 'defaultdark';
  color = 'blue';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  userName: string;
  showNotificationMsg : boolean = false;
  userId : string;
  passwordExpirydays : number;
  @ViewChild('pageWrapper', { static: false }) pageWrapper: ElementRef;

  public innerWidth: any;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(public router: Router,
    private route: ActivatedRoute,
    private apiUrls: API_URLs,
    private loginDataBuilder: loginDataBuilder,
    private loginLogoutAuthenticationService: LoginLogoutAuthenticationService) { }

  ngOnInit() {
    console.log("in full component");
    this.userName = this.loginDataBuilder.userName;
    

    if (this.router.url === '/') {
      this.router.navigate(['/dashboard/dashboard1']);
    }

    this.firstTimeLogin();
    this.changePasswordAlert();
    this.handleLayout();
  }

  ngAfterViewInit() {
    this.apiUrls.pageWrapperId = this.pageWrapper.nativeElement.id;
    console.log("id ==== " + this.pageWrapper.nativeElement.id);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleLayout();
  }

  toggleSidebar() {
    this.showMinisidebar = !this.showMinisidebar;
  }

  handleLayout() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 576) {
      this.showMinisidebar = true;
    } else {
      this.showMinisidebar = false;
    }
  }

  private firstTimeLogin() {
    let skipped: string;
    if (this.route.snapshot.queryParamMap.get('skipped')) {
      skipped = this.route.snapshot.queryParamMap.get('skipped').toString();
    }
    if (this.loginDataBuilder.userData.firstLoginStatus === 'Y' && skipped !== 'true') {
      this.router.navigate(['/authentication/change-password']);
    }
  }

  private changePasswordAlert() {
      this.userId = this.loginDataBuilder.userData.username;
      let datepassword = (this.loginDataBuilder.userData.passwordExpiry).toString();
      this.passwordExpirydays = Math.floor( (new Date(+datepassword).getTime() - new Date().getTime()  )/(1000 * 3600 * 24));
      console.log('passwordExpirydays ',this.passwordExpirydays);
      if(this.passwordExpirydays  <= 5 && this.passwordExpirydays >0){
      this.showNotificationMsg = true;
      }
      
  }

  logout() {
    this.loginLogoutAuthenticationService.logout.subscribe(data => {
      if (data.resultCode === '0') {
        sessionStorage.clear();
        this.router.navigate(['/authentication/login']);
      } else {
        console.log('--ERROR in Logout--');
      }
    });

  }
  chnagepassword() {
     
        
        this.router.navigate(['/changepassword/password'],{ queryParams: { language: this.loginDataBuilder.language } });
  

  }


}
