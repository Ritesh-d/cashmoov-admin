import { Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { ConfigService } from './shared/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonHelperService } from './shared/services/common-helper-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'app';
  subscription:Subscription;

  constructor(private translateService : TranslateService ,private router:Router,private commonHelpeService: CommonHelperService){
      
    //this.translateService.setDefaultLang('en'); 
  } 

  ngOnInit(){
    
   
    document.body.style.fontSize = this.commonHelpeService.configData['appFontSize']+'rem'
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => window.scroll(0,0))
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  @HostListener("window:beforeunload",["$event"])
  clearLocalStorage(event){
    // console.log('listen');
          // this.router.navigate(['/authentication/login']);
         
          // localStorage.clear();
    //     })
    //     let xhr = new XMLHttpRequest()
    //  xhr.open("POST",'/services/alfaRestService',false);
    //  xhr.send(this.logOutRequest);
    // console.log(event);
    //   this.apiService.logOutApi().subscribe(result=>{
    //    console.log(result);
       
    //   });
  
      
  }
  
}
