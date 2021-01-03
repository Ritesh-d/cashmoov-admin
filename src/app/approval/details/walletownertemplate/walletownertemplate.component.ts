import { Component, OnInit, Input } from '@angular/core';
 
 

 import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonHelperService } from '../../../shared/services/common-helper-service';
import { ApprovalService } from '../../approval.service';
import { DetailsService } from '../details.service';
 @Component({
  selector: 'app-ownertemplate',
  templateUrl: './walletownertemplate.component.html',
  styleUrls: ['./walletownertemplate.component.css']
})
export class WalletOwnerTemplateComponent implements OnInit {



  @Input() approvalData: any;
  data: any;
  updatedInfo: any;
  wallet: any= {
    walletOwnerCode : '',
    ownerName:''

  };
  walletOwnerTemplateList:any;
  
  

  constructor(private modalService: NgbModal, private commonHelperService: CommonHelperService, private detailService: DetailsService, private approvalService: ApprovalService) { }

  errorMessage: string;
  templatesControlOfList: any;
  ngOnInit() {
    this.updatedInfo = (this.approvalData.updatedInformation);
    console.log('fee this.updatedInfo', this.updatedInfo);
    this.templatesControlOfList = this.updatedInfo.walletOwnerTemplateList;
    
    console.log('this.templatesControlOfList updatedInfo list', this.templatesControlOfList);
    console.log('fee this.approvalData', this.approvalData.actionType);
    console.log('this.approvalData', this.approvalData);
    this.getDetail();
  }

  async getDetail() {
    if (this.approvalData.entity) {
      this.wallet = this.approvalData.entity.walletOwner;
      this.walletOwnerTemplateList = this.approvalData.entity.walletOwnerTemplateList;
      console.log('this.walletOwnerTemplateList entity list ', this.walletOwnerTemplateList);
      if(this.templatesControlOfList){
      this.templatesControlOfList.forEach(newelement => {
        let isexist = false;
        this.walletOwnerTemplateList.forEach(oldelement => {
          if(oldelement.templateCategoryCode == newelement.templateCategoryCode){
               newelement.templateNameOld = oldelement.templateName;
               isexist= true;
          }
           
        });
        if(!isexist){
          newelement.templateNameOld = newelement.templateName;
        }
      });
     }
    } 
    
    console.log('this.templatesControlOfList result ',this.templatesControlOfList);
   }
}
