import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { loginDataBuilder } from '../login-data.builder';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Endpoints } from '../endpoints';
import { HttpClient } from '@angular/common/http';
 import {TranslatelanguageService} from './translatelanguage.service';
@Injectable({ providedIn: "root" })
export class CommonHelperService {
getcurrentLang:any;
  constructor(private translateService: TranslateService,
    private router: Router,private endpoints: Endpoints,private http: HttpClient,
      private translatelanguageService: TranslatelanguageService,
    private loginDataBuilder: loginDataBuilder,
    private configService: ConfigService) {
      console.log('called  CommonHelperService');
       this.getcurrentLang=this.translatelanguageService.getcurrentLang();

  }

  public languageText(key: string): string {
    let text: string;
    this.translateService.get(key).subscribe(data => {
      text = data;
    });
    return text;
  }

  public settingDataTable() {

             
this.getcurrentLang=this.translatelanguageService.getcurrentLang();
 
let language= {
            "lengthMenu": "Show _MENU_ entries",
            "zeroRecords": "No matching records found",          
            "info": "Showing _START_ to _END_ of _TOTAL_ entries",
            "infoEmpty": "No records available",
            "infoFiltered": "(filtered from _MAX_ total entries)",
            "search":"Search",
            "paginate": {
               "first": "First",
               "next": "Next",
                      "previous": "Previous",
                       "last": "Last"
                        }
        }
 if(this.getcurrentLang=='fr'){ 
    language= {
            "lengthMenu": "Afficher _MENU_ donnees",
            "zeroRecords": "aucune donnee correspondante trouvee",
            "info": "Affichage _START_ A _END_ de _TOTAL_ donnees",
            "infoEmpty": "pas de donnees disponibles",
            "infoFiltered": "(filtré de _MAX_ enregistrements totaux)",
            "search":"Rechercher",
            "paginate": {
               "first": "Première",
               "next": "Prochaine",
                      "previous": "Précédente",
                       "last": "Dernière"
                        }
        } 
 }
 


    return {
    paging: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      empty: 'No data available in table',
      searching: true,
      //columnDefs:columnDefs, 
      //order:orders, 
      language:language
    
  }  
  }
  public settingDataTableNew(columnDefs:any=[],orders:any=[]) { 
             
    this.getcurrentLang=this.translatelanguageService.getcurrentLang();
     
        
    let language= {
                "lengthMenu": "Show _MENU_ entries",
                "zeroRecords": "No matching records found",          
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No records available",
                "infoFiltered": "(filtered from _MAX_ total entries)",
                "search":"Search",
                "paginate": {
                   "first": "First",
                   "next": "Next",
                          "previous": "Previous",
                           "last": "Last"
                            }
            }
     if(this.getcurrentLang=='fr'){
       
        language= {
                "lengthMenu": "Afficher _MENU_ donnees",
                "zeroRecords": "aucune donnee correspondante trouvee",
                "info": "Affichage _START_ A _END_ de _TOTAL_ donnees",
                "infoEmpty": "pas de donnees disponibles",
                "infoFiltered": "(filtré de _MAX_ enregistrements totaux)",
                "search":"Rechercher",
                "paginate": {
                   "first": "Première",
                   "next": "Prochaine",
                          "previous": "Précédente",
                           "last": "Dernière"
                            }
            } 
     }
     
    
    
        return {
        paging: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          processing: false,
          empty: 'No data available in table',
          searching: true,
          columnDefs:columnDefs, 
          order:orders, 
          language:language
        
      }
    }
  public getDataTableOptions(jsonData, jsonColumn, reportName) {
    return {
      data: jsonData,
      
      paging: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      empty: 'No data available in table',
      searching: true,
      
      dom: 'Bfrtip',
      buttons: [
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf-o" style="font-size:17px;color:red"></i> Pdf',
          titleAttr: 'Pdf',
          orientation: 'landscape',
          title:reportName,
          customize: function ( doc ) {
            doc.defaultStyle.alignment = 'center';
            doc.styles.tableHeader.alignment = 'center';
            doc.content[1].table.widths = "*";
            doc.content.splice( 1, 0, {
                margin: [ 0, 0, 0, 12 ],
                alignment: 'center',
                width:50,
                height:50,
                image:'data:image/png;base64,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'
      
            } );
          }
                   
        },
        {
          extend:    'csv',
          text:      '<i class="fas fa-file-csv"  style="font-size:17px;color:#4caf50"></i> Csv',
          titleAttr: 'Csv',
          title:reportName
        },
        {
          extend:    'excel',
          text:      '<i class="fas fa-file-excel" style="font-size:17px;color:#008080;"></i> Excel',
          titleAttr: 'Excel',
          title:reportName
        },
        {
          extend:    'print',
          text:      '<i class="fas fa-print" style="font-size:17px;color:red"></i> Print',
          titleAttr: 'Print',
          title:reportName
        }
    
      ],
      language: {
        paginate: {
          next: "&#8594;",
          previous: "&#8592;"
        }

      },
      
      columns: jsonColumn,
      reportByName:reportName,
    };
  }
  
  public get isEditMode(): boolean {
    const currentURL = this.router.url;
    if (currentURL.indexOf('/edit') > -1) {
      return true;
    }
    return false;
  }

  public get isEnrollMode(): boolean {
    const currentURL = this.router.url;
    console.log('currentURL'+ currentURL);
    if (currentURL.indexOf('/enroll') > -1) {
      return true;
    }
    return false;
  }
  get loggedInUserData() {
    return this.loginDataBuilder.userData;
  }

  approvalRequired(featureCode: string,callback=null): any{
    console.log('--approvalRequired--', featureCode);
     let flag ;
     this.featuresByCriteria(featureCode).subscribe(response => {
       let data: any;
      if(response.resultCode=="0")   {
        data = response.featureList[0];
        console.log('data' , data);  
        console.log('data required ',data.approvalRequired);
        if(callback){
          callback(data.approvalRequired);
        }


      }else{
        callback(false);
      }
     
    });
   
  }
  featuresByCriteria(featureCode: string): Observable<any> {
  
    return this.http.get<any>(this.endpoints.E_WALLET_FEATUREALLBYCRITERIA_URL + '?featureTypeCode=100000&status=Y&code='+featureCode);
    
 }
  // TODO: temporary method
  // public formatDate(dateString: string): Date {
  //   console.log('--date--', dateString, new Date(dateString));
  //   return new Date(dateString);
  // }
  public formatDate(dateObj: { year: number; month: number; day: number }): Date {
    console.log('--dateObj--', dateObj);
    return new Date(dateObj.year.toString() + '-'
      + this.appendZeroIfNeeded(dateObj.month) + '-'
      + this.appendZeroIfNeeded(dateObj.day));
  }

  private appendZeroIfNeeded(monthDate: number) {
    let monthDateStr: string = monthDate.toString();
    if (monthDate < 10) {
      monthDateStr = '0' + monthDate.toString();
    }
    return monthDateStr.toString();
  }

  get configData() {
    return this.configService.configData;
  }
}