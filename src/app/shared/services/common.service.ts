import {Injectable } from '@angular/core';
import { FormGroup,FormControl   } from '@angular/forms';
import {HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {NavigationStart, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';  
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { CommonHelperService } from './common-helper-service';
import { SessionMgtService } from './SessionMgt.service';
import * as moment from 'moment';
 
@Injectable({
  providedIn: 'root'
})
export class CommonService { 
  public projectBaseUrl:string;
  constructor(   private http: HttpClient, 
    private configService: ConfigService,
    private commonHelperService: CommonHelperService,
    private sessionSerivce: SessionMgtService,
    public router: Router, activeroute:ActivatedRoute) { 
 
 
  } 
 
  public convertDatepicker(dateObjs:any ) {  
    let dateObj=dateObjs['_d'];
   var month = dateObj.getMonth() + 1;
  var date = dateObj.getDate();
  var year = dateObj.getFullYear();
  
      return  { year: year, month: month, day: date };
    }
  getServiceCode( serviceCategoryCode){ 
    let menuList = this.sessionSerivce.getLeftMenu();
 
 for (var i = 0; i < menuList.length; i++) {  
let res = menuList[i].serviceCategoryList.filter(it => it.code.includes(serviceCategoryCode)); 
 if(res.length>0){ 
 return {"channelTypeCode":'100000',   "serviceCode": res[0].serviceCode,  "serviceCategoryCode":  res[0].code}

} 
}; 


  }


getFileExtension(filename)
{
 return filename.split('.').pop().trim();
}
 convertBase64(url,  callback) {
 
let _this=this;
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
          var reader = new FileReader();  
          reader.onloadend = function(data) {
        var exprots:any=reader.result;   
          var arr = exprots.split(',');
              var base64 = arr[arr.length-1];
      callback(base64);
            
    
            
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    
      }

  public convertDate(dateObj: { year: number; month: number; day: number }) {
    let dateformat=dateObj.year.toString() + '-'
      + this.appendZeroIfNeeded(dateObj.month) + '-' + this.appendZeroIfNeeded(dateObj.day);

 
    return  dateformat;
  }
public fixedTo(num, nofixed=0) { 
   return Number.parseFloat(num).toFixed(nofixed);
  }


  private appendZeroIfNeeded(monthDate: number) {
    let monthDateStr: string = monthDate.toString();
    if (monthDate < 10) {
      monthDateStr = '0' + monthDate.toString();
    }
    return monthDateStr.toString();
  }



      private getHeaders() {
        return new HttpHeaders()
         .set('Content-Type', 'application/json') 
    }

 private getHeadersFile() {
        return new HttpHeaders()
         .set('observe', 'events')
         .set('reportProgress', 'true')
            
    }

   
createjson(x){ 
 return x;
   
}

dateDiff(startDate,endDate){   
var startDate:any = moment(startDate, "YYYY-MM-DD");
  var endDate:any = moment(endDate, "YYYY-MM-DD");
 
 return endDate.diff(startDate, 'days');
   
}



 validateAllFields(formGroup: FormGroup) {         
        Object.keys(formGroup.controls).forEach(field => {  
            const control = formGroup.get(field);            
            if (control instanceof FormControl) {             
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {        
                this.validateAllFields(control);  
            }
        });
        return formGroup;
    }

 
   public postRequest(API_URL: any,queryparam: any): Observable<any> {
 var _this=this;
   return  this.http.post(API_URL,queryparam,{
                headers: _this.getHeaders()
            }).pipe(map((response:Response)=>response));
    
  }

   public postRequestFile(API_URL: any,queryparam: any): Observable<any> {
 var _this=this;
   return  this.http.post(API_URL,queryparam,{
                headers: _this.getHeadersFile()
            }).pipe(map((response:Response)=>response));
    
  }
   public putRequest(API_URL: any,queryparam: any): Observable<any> {
 var _this=this;
   return  this.http.put(API_URL,queryparam,{
                headers: _this.getHeaders()
            }).pipe(map((response:Response)=>response));
    
  }
 

scrollTo(el: Element,position:any): void {
   if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: position });
   }
}
scrollToElement(ele:string,position='start'): void {  
   const firstElementWithError = document.querySelector(ele);
   this.scrollTo(firstElementWithError, position);
}
 

 


}