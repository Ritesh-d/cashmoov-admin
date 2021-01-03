import { OnInit, Component, Input } from '@angular/core';
import { template } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadMoneyService } from '../loadmoneyservice.service';
import { TranslatelanguageService } from '../../shared/services/translatelanguage.service';

@Component({
    selector: 'app-viewloadmoney',
    templateUrl: './viewloadmoney.component.html',
    styleUrls: ['./viewloadmoney.component.css']
})


export class ViewLoadMoneyComponent {
    @Input() data;
    successMessage: string ;
    errorMessage: string ;
    constructor(private loadMoneyService: LoadMoneyService,
        public activeModal: NgbActiveModal,
        private router: Router,
        private activatedrouter: ActivatedRoute,
        private route: ActivatedRoute,
        private translate : TranslatelanguageService,
        private modalService: NgbModal, ) {
        //    this.getReceiptFile();
        this.getcurrentLang=this.translate.getcurrentLang();
          
        }
        images: any;
        receiptFile: any;
        viewDocument: boolean= false;
        getcurrentLang:any;

        getReceiptFile(content){
              
            
                this.receiptFile = this.loadMoneyService.getReceipt(this.data.code,this.data.fileName);
                let _this=this;
                _this.loadMoneyService.convertBase64(this.receiptFile,function(base64){ 
           
                            _this.receiptFile=base64;
                            _this.viewDocument = true;

         
           })
           this.modalService.open(content,{ size: 'lg' }).result.then(
            result => {
              },
            reason => {
            }
           
          );
        //   document.querySelector('#viewer').scrollIntoView({ behavior: 'smooth', block: 'center' });

        }
 
        downloadReceipt(){
       
            this.loadMoneyService.downloadRecipt(this.data.code,this.data.fileName).subscribe(response => {
                console.log("response from download", response);
                // var downloadURL = window.URL.createObjectURL(response);
                // window.open(downloadURL);
                var downloadURL = window.URL.createObjectURL(response);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = this.data.fileName;
                link.click();

                //this.successMessage= 'File downloaded successfully'
                this.translate.languageText('EMONEY.filedownloadedsuccessfully', data=> {
                    this.successMessage=data;
                  });

                if (response["resultCode"] == "200") {
      
                    this.successMessage= response["resultDescription"];
                }else{
                    this.errorMessage= response["resultDescription"];
                }
            },err=> this.errorMessage= 'Can not download file' );//err.error.resultDescription);
        }
 
    }