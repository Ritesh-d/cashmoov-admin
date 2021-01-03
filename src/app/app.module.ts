import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule, LocationStrategy, HashLocationStrategy,PathLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { NgModule, ErrorHandler,APP_INITIALIZER } from '@angular/core';
import { FormsModule , ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule,HttpClient, HTTP_INTERCEPTORS, HttpHeaders} from '@angular/common/http';
import { RouterModule} from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
import { TranslateModule , TranslateLoader, MissingTranslationHandler, TranslateService } from '@ngx-translate/core';
import { AuthGuard } from './guards/auth.guard';
import { MasterDataService } from './shared/services/masterdataservice.service';
import { OverlayModule } from "@angular/cdk/overlay";
import { CustomTranslateLoader } from './customloader.service';
import { ConfigService } from './shared/services/config.service';
import { CustomErrorHandler } from './customerrorhandler.service';
import { AuthenticationService } from './authentication/service/authentication.service';
import { API_URLs } from './shared/models/constants';
import { DataTypeCachingService } from './datatypecaching.service';
import { DataTypeCachingInterceptor } from './datatypecachinginterceptor.service';
import { CachingService } from './shared/services/caching.service';
import { CustomMissingTranslationHandler } from './custommissingtranslationhandler.service';
import { RoleGuard } from './guards/role.guard';
import { EncryptData } from './shared/services/encryptdata.service';
import { map } from 'rxjs/operators';
import { NgbDateMomentParserFormatter } from './ngbcustomdateformatter.service';
import { ErrorMessageProvider } from './shared/services/errormessageprovider.service';
import { ComboBoxValidatorService } from './shared/services/validator.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { SuccessMessageProvider } from './shared/services/successmessageprovider.service';
import { BreadCrumbService } from './shared/services/BreadCrumb.service';

import { SessionMgtService } from './shared/services/SessionMgt.service';
import { CommonViewService } from './shared/services/CommonView.service';
//import { DataTableDemoComponent } from './datatabledemo/data-table-demo/data-table-demo.component';
//import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { DataTablesModule } from 'angular-datatables';
import { AuthInterceptorService } from './shared-module/interceptors/auth-interceptor.service';

 

   
export function translateHttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export function load(http: HttpClient, config: ConfigService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      var contentHeader = new HttpHeaders(
        {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        });

       http.get('./assets/data/config.json' ,{ headers: contentHeader })
         .pipe(
           map((x: ConfigService) => {
             config.apiBaseUrl = x.apiBaseUrl;
             config.masterKey = x.masterKey;
             config.apiReportBaseUrl = x.apiReportBaseUrl;
             config.userInactiveTime = x.userInactiveTime;
             config.authKey = x.authKey;
             config.configData = x.configData;
             resolve(true);
           })
         ).subscribe();
    });
  };
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [AppComponent,  FullComponent, SpinnerComponent,BlankComponent,
     NavigationComponent, BreadcrumbComponent, SidebarComponent],
  imports: [
    DataTablesModule,
    DataTablesModule.forRoot(),
    CommonModule,
    //Ng4LoadingSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    OverlayModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(Approutes, { useHash: true}),
    // RouterModule.forRoot(Approutes),
    PerfectScrollbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass : CustomTranslateLoader,
        useFactory: translateHttpLoaderFactory, 
        deps: [HttpClient]
      },
      missingTranslationHandler:{
        provide : MissingTranslationHandler,
        useClass : CustomMissingTranslationHandler
      }
    }),
    LoggerModule.forRoot({serverLoggingUrl: '/data/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR})
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      deps: [
        HttpClient,
        ConfigService
      ],
      multi: true
    },
    AuthGuard,
    RoleGuard,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy ,
     
    },
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
    MasterDataService,
    ConfigService,
    API_URLs,
    AuthenticationService,
    DataTypeCachingService , 
    CachingService,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: DataTypeCachingInterceptor, 
      multi: true 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true   // for multiple interceptor services
    },
    { 
      provide: NgbDateParserFormatter, 
      useFactory: () => { return new NgbDateMomentParserFormatter("DD/MM/YYYY") } 
    },
    EncryptData,
    ErrorMessageProvider,
    ComboBoxValidatorService,
    SuccessMessageProvider,
    BreadCrumbService,

    SessionMgtService,
    DataTypeCachingInterceptor,
    CommonViewService,
    // [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]  

    // {provide: APP_BASE_HREF, useValue: '/cashmoov/admin'}
  ],
  bootstrap: [AppComponent],
 


})
export class AppModule {}
