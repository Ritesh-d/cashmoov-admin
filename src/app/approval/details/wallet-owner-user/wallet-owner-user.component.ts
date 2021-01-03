



import { Component, OnInit, Input } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ApprovalService } from '../../approval.service';
import { DetailsService } from '../details.service';
import { ApprovalConstants } from '../../approval.constants';

@Component({
  selector: 'app-wallet-owner-user',
  templateUrl: './wallet-owner-user.component.html',
  styleUrls: ['./wallet-owner-user.component.css']
})
export class WallerOwnerUser implements OnInit {
   
    @Input() approvalData : any;
    user :any;
    addressList : any;
    updatedInfo : any;
    errorMessage: any;
    unchanged = {
        code:  true,
        firstName: true,
        lastName: true,
        userName: true,
        mobileNumber: true,
        email: true,
        walletOwnerUserTypeCode: true,
        walletOwnerUserTypeName: true,
        userCode: true,
        status: true,
        state: true,
        gender:true ,
        dateOfBirth: true ,
        idProofTypeCode: true,
        idProofTypeName: true,
        idProofNumber: true,
        issuingCountryCode: true,
        issuingCountryName: true,
        idExpiryDate: true,
        fromDate : true,
        toDate: true
    };
    address = {
        // walletOwnerUserCode: true,
        walletOwnerUserName: true,
        // addTypeCode: true,
        addTypeName: true,
        // regionCode: true,
        regionName: true,
        // countryCode: true,
        countryName: true,
        city: true,
        addressLine1: true,
        addressLine2: true,
        location: true,
        status: true,
    };
    showdate : boolean= false;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private approvalService: ApprovalService,
        private detailsService: DetailsService) {
      }
    
      ngOnInit() {
        this.updatedInfo = (this.approvalData.updatedInformation);
        console.log(' this.updatedInfo' , this.updatedInfo);
        console.log(' this.approvalData' , this.approvalData.actionType);
        this.getUser();
    }
  
    async getUser() {
      this.user = this.approvalData.entity;
      console.log(' this.user' , this.user);
    
      this.user.status = this.approvalService.getValueOnCode(this.user.status);
      this.user.gender = this.getGenderName(this.user.gender);

      this.addressList = this.user.addressList;
      console.log(' this.addressList' , this.addressList);
      if(this.approvalData.actionType== ApprovalConstants.status.text.UPDATED || this.approvalData.actionType==  ApprovalConstants.status.text.CLAIMED ){
              this.compareChanges();
       }      
     }
    compareChanges(){
      if(this.updatedInfo){
        if(this.updatedInfo.status){
            if((this.updatedInfo.status === ApprovalConstants.status.code.SUSPENDED ) ){
                this.showdate= true;
            }
        this.updatedInfo.status = this.approvalService.getValueOnCode(this.updatedInfo.status);
        this.unchanged.status= false;
        }else if( ( this.user.status === ApprovalConstants.status.code.SUSPENDED )){
           this.showdate= true;
        }
        if(this.updatedInfo.userName){ this.unchanged.userName= false;}
        if(this.updatedInfo.fromDate) {   this.unchanged.fromDate= false; }
        if(this.updatedInfo.toDate )  {   this.unchanged.toDate= false;   }
        if(this.updatedInfo.firstName){  this.unchanged.firstName= false; }
        if(this.updatedInfo.lastName ){   this.unchanged.lastName= false;}
        if(this.updatedInfo.userName ){   this.unchanged.userName= false;}
        if(this.updatedInfo.mobileNumber ){   this.unchanged.mobileNumber= false;}
        if(this.updatedInfo.email ){   this.unchanged.email= false;}
        if(this.updatedInfo. userCode ){   this.unchanged.userCode= false;}
        if(this.updatedInfo.gender ){   this.unchanged.gender= false;}
        if(this.updatedInfo.dateOfBirth ){   this.unchanged.dateOfBirth= false;}                      
        if(this.updatedInfo.idProofTypeName ){   this.unchanged.idProofTypeName= false;}
        if(this.updatedInfo.idProofNumber ){   this.unchanged.idProofNumber= false;}
        if(this.updatedInfo.issuingCountryName ){   this.unchanged.issuingCountryName= false;}
        if(this.updatedInfo.idExpiryDate){   this.unchanged.idExpiryDate= false;}
      


        
 

        console.log('updated  .addressList' , this.updatedInfo.addressList);

        if( this.updatedInfo.addressList){
       
                for(let i= 0; i < this.updatedInfo.addressList.length; i++){
                    if(this.updatedInfo.addressList[0].addressLine1 ){   
                        this.address.addressLine1= false;
                        this.updatedInfo.addressLine1 =this.updatedInfo.addressList[0].addressLine1 ;
                    }
                    if(this.updatedInfo.addressList[0].addressLine2 ){   
                        this.address.addressLine2= false;
                        this.updatedInfo.addressLine2 =this.updatedInfo.addressList[0].addressLine2 ;
                    }
                    if(this.updatedInfo.addressList[0].countryCode ){   
                        this.address.countryName= false;
                        this.updatedInfo.countryName =this.updatedInfo.addressList[0].countryName ;
                    }
                    if(this.updatedInfo.addressList[0].regionCode ){   
                        this.address.regionName= false;
                        this.updatedInfo.regionName =this.updatedInfo.addressList[0].regionName ;
                    }
                    if(this.updatedInfo.addressList[0].addTypeName ){   
                        this.address.addTypeName= false;
                        this.updatedInfo.addTypeName =this.updatedInfo.addressList[0].addTypeName ;
                    }
                    if(this.updatedInfo.addressList[0].city ){   
                        this.address.city= false;
                        this.updatedInfo.city =this.updatedInfo.addressList[0].city ;
                    }
                    if(this.updatedInfo.addressList[0].location ){   
                        this.address.location= false;
                        this.updatedInfo.location =this.updatedInfo.addressList[0].location ;
                    }
                }
        }
    
        console.log('address ' ,this.address);
      }
    
    }
    getGenderName(gender :string){
       return  gender == 'M' ? "Male" : "Female"

    }
 
}
  
 
