import { mergeMap, map, filter } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreadCrumbService } from '../services/BreadCrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  providers: [BreadCrumbService]
})
export class BreadcrumbComponent implements OnInit {
  @Input() layout;
  languagecode: string;
  sublevelId: string;
  pageInfo;
  reportType: any;
  pageType: any;
  eventDataObj:any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title,
    private translateservice: TranslateService, private breadCrumbService: BreadCrumbService) {
    console.log("bredacrumb");
    console.log("constructor=========================================================================================");
    this.activatedRoute
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        console.log("activatedRoute=========================================================================================");
        this.reportType = params.reportType;
        this.pageType = params.pagetype;
        this.eventDataObj=params;
        console.log("====== > " + this.reportType + "=== > " + this.pageType);
        console.log("EventDataObj==>"+JSON.stringify(this.eventDataObj));
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {

        //this.titleService.setTitle(event['title']);
        var eventData: any;
        var urls: Array<any> = [];
        if(this.eventDataObj.breadCrumb){
          urls.push({ "title": this.eventDataObj.title1, "url": this.eventDataObj.url1 });
          urls.push({ "title": this.eventDataObj.title2, "url": this.eventDataObj.url2 });
          urls.push({ "title": this.eventDataObj.title3 });
          event["title"]=this.eventDataObj.title;
          event["urls"]=urls;
          console.log("Object has ===>"+JSON.stringify(event));
        }
        // if (this.reportType == "useractivity") {
        //   eventData = { "title": "lbl_report", "urls": [{ "title": "LABEL_HOME", "url": "/dashboard/dashboard1" }, { "title": "lbl_report", "url": "/report/useractivityreport" }, { "title": "brcr_useractivityreport" }] };
        // } 
        // else if (this.reportType == "userstatus") {
        //   eventData = { "title": "lbl_report", "urls": [{ "title": "LABEL_HOME", "url": "/dashboard/dashboard1" }, { "title": "lbl_report", "url": "/report/userstatusreport" }, { "title": "brcr_userstatusreport" }] };

        // }
        //  else if (this.reportType == "usermatrix") {
        //   eventData = { "title": "lbl_report", "urls": [{ "title": "LABEL_HOME", "url": "/dashboard/dashboard1" }, { "title": "lbl_report", "url": "/report/usermatrixreport" }, { "title": "brcr_usermatrixreport" }] };

        // }
        //  else if (this.reportType == "usertransaction") {
        //   eventData = { "title": "lbl_report", "urls": [{ "title": "LABEL_HOME", "url": "/dashboard/dashboard1" }, { "title": "lbl_report", "url": "/report/usertransaction" }, { "title": "brcr_usertransactionreport" }] };

        // }
         if (this.pageType == "maker") {
          eventData = {
            "title": 'lbl_view_voucher_activation',
            "urls": [{ title: 'LABEL_HOME', url: '/dashboard/dashboard1' }, { title: 'brcr_voucheractivation', url: '/voucheractivation/searchvoucheractivationmaker' }, { title: 'brcr_viewvoucheractivation' }]
          }
        }
         else if (this.pageType == 'checker') {
          eventData = {
            "title": 'lbl_view_voucher_activation',
            "urls": [{ title: 'LABEL_HOME', url: '/dashboard/dashboard1' }, { title: 'brcr_voucheractivation', url: '/voucheractivation/searchvoucheractivationchecker' }, { title: 'brcr_viewvoucheractivation' }]
          }
        }
         else if (this.reportType == 'orderInfo') {
          eventData = {
            "title": 'lbl_report',
            "urls": [{ title: 'LABEL_HOME', url: '/dashboard/dashboard1' }, { title: 'lbl_report', url: '/report/orderinformationreport' }, { title: 'brcr_orderinformationreport' }]
          }
        } 
        else if (this.reportType == 'purOrderReport') {
          eventData = {
            "title": 'lbl_report',
            "urls": [{ title: 'LABEL_HOME', url: '/dashboard/dashboard1' }, { title: 'lbl_report', url: '/report/purchaseorderreport' }, { title: 'brcr_purchaseorderreport' }]
          }
        } 
        else {
          eventData = event;
        }
        this.pageInfo = eventData;
        console.log("pageinfo : " + JSON.stringify(this.pageInfo));

      });
    console.log("inside=========================================================================================");
  }
  ngOnInit() { }

  redirectToUrl(url: string) {
    var sublevelId;
    JSON.parse(sessionStorage.getItem("levelList")).filter((element) => (element.level.find(level => level.subLevel.find(function (sub) { if (sub.url == url) sublevelId = sub.roleId }))))
    console.log("sublevel id : " + sublevelId);
    if (sublevelId) {

      this.router.navigate([url], { queryParams: { language: this.languagecode, pageType: "br", sublevelid: sublevelId } });
    } else {
      this.router.navigate([url], { queryParams: { language: this.languagecode } });
    }

  }

}
