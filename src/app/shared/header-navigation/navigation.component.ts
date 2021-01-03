import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LoginLogoutAuthenticationService } from '../services/loginlogoutauthentication.service';
import { first } from 'rxjs/operators';
import { LogoutRequestModel } from '../models/logoutrequest.model';
import { LogoutModel } from '../models/logout.model';
import { Router , ActivatedRoute} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { API_URLs } from '../models/constants';



declare var $: any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit , OnInit{
  @Output() toggleSidebar = new EventEmitter<void>();

  loginId : string;
  logoutrequest : LogoutRequestModel = new LogoutRequestModel();
  logoutdata : LogoutModel = new LogoutModel();
  error = '';
  languagecode : string;
  errorMessage:string;


  public config: PerfectScrollbarConfigInterface = {};
  constructor(private modalService: NgbModal ,  private router: Router, private loginauthenticationservice : LoginLogoutAuthenticationService,
    private activatedrouter : ActivatedRoute,  private translateservice : TranslateService, private apiurls:API_URLs) {
   
  }

  ngOnInit(){
    this.activatedrouter.queryParams.subscribe(params =>{
      //this.languagecode = params.language;
     // this.translateservice.use(params.language);
      });
    this.loginId = sessionStorage.getItem('loginId');
  }

  
  public showSearch = false;

  // This is for Notifications
  notifications: Object[] = [
    {
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      round: 'round-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      round: 'round-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  ngAfterViewInit() {}

  logOut(){
    this.logoutdata.loginId = sessionStorage.getItem('loginId');
    this.logoutdata.channel = "IWP";
    this.logoutdata.comments = "User Logout request";

    this.logoutrequest.action = "LOGOUT";

    this.logoutrequest.request = this.logoutdata;
    sessionStorage.removeItem('currentuser');
    sessionStorage.removeItem('loginId');
    sessionStorage.removeItem('loginId');
    this.router.navigate(["/authentication/login"]);
    console.log("LOGOUT request : "+ JSON.stringify(this.logoutrequest));

    this.loginauthenticationservice.logOut(this.apiurls.URL_LOGOUT , this.logoutrequest)
    .then(
      data => {
        console.log("data : " + JSON.stringify(data));
        if (data == null) {
          this.translateservice.get('common_error_message').subscribe((text: string) => { this.errorMessage = text; });
        } else if (data["response"]["resultCode"] == this.apiurls.RESULT_CODE) {      
          console.log("Correct");        
        } else {
          this.errorMessage = "Failed : Error Code : " + data["response"]["resultCode"] + " : Error Desc : " + data["response"]["resultCodeDesc"];
        }
      }
    );
  }
}