import { Component, OnInit,Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatelanguageService { 
  languageArr:any={'en':'English','fr':'French' };
constructor(private translate: TranslateService) { 
        translate.addLangs(['en', 'fr']); 
    if (localStorage.getItem('locale')) {  
      const browserLang = localStorage.getItem('locale');  
      translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');  
    } else {  
      localStorage.setItem('locale', 'en');  
      translate.setDefaultLang('en');  
    }  
 

    }

changeLanguage(language: string) {  
    localStorage.setItem('locale', language);  
    this.translate.use(language);  
  }  
getLanguage() {  
     return this.translate.getLangs();
  }  
getcurrentLang() {  
     return this.translate.currentLang;
  } 

  public languageText(key: string,callback=null)  {
    let text: string;
 
    this.translate.get(key).subscribe(data => { 
      text = data;
      if(callback){
          callback(text);
              }
    });
    return text;
  }

}



 