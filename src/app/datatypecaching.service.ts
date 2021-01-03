import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()
export class DataTypeCachingService{
    cache = new Map();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    
    // if(sessionStorage.getItem("cache")){
    //   this.cache = new Map(Object.entries(sessionStorage.getItem("cache")));
    // }
    
    const cached = this.cache.get(url);
    if (!cached) {
      return undefined;
    }

    return cached.response;
  }

  
  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.url;
    const entry = { url, response}; 
    // if(sessionStorage.getItem("cache")){
    //   this.cache = new Map(Object.entries(sessionStorage.getItem("cache")));   
    // }    
    this.cache.set(url, entry);   
   // sessionStorage.setItem("cache",JSON.stringify(this.cache)); 
  }

  // removeFromCache(url:any){
  //   this.cache = new Map(Object.entries(sessionStorage.getItem("cache")));
  //  this.cache.delete(url);   
  //  sessionStorage.setItem("cache",JSON.stringify(this.cache)); 
  // }
}