import { Injectable,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class ConfigService {
  
  apiBaseUrl : string;
  masterKey : string;
  apiReportBaseUrl : string;
  userInactiveTime: string;
  authKey: string;
  configData: any;
  sourceType : string='';


  constructor(){}

}