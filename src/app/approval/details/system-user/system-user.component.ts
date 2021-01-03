import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../user/user.service';
import { DetailsService } from '../details.service';
import { ApprovalService } from '../../approval.service';
import { ApprovalConstants } from '../../approval.constants';
@Component({
  selector: 'app-system-user',
  templateUrl: './system-user.component.html',
  styleUrls: ['./system-user.component.css']
})
export class SystemUserComponent implements OnInit {

  user: any;
  users: any;
  groups:any;
  roles:any;
  groupName : string;
  statusName: string;
  roleName : string;
  @Input() entityCode :string;
  @Input() approvalData : any;
  updatedInfo : any;
  unchanged = {
       
        groupCode: true,
        roleCode: true,
        userName: true,
        firstName :true,
        lastName :true,
        email :true,
        fromDate : true,
        toDate: true,
        employeeId : true,
        mobileNumber :true,
     
    
        // idExpiryDate : true,
        // idProofTypeName : true,
        // idProofNumber: true,
        status :true 
       
  };
  constructor(private userService : UserService , private  detailService : DetailsService,private approvalService: ApprovalService) { }
 
  errorMessage: string;
  
  ngOnInit() {
      // this.updatedInfo = JSON.parse(this.approvalData.updatedInformation);
      this.updatedInfo = (this.approvalData.updatedInformation);
      console.log(' this.updatedInfo' , this.updatedInfo);
      console.log(' this.approvalData' , this.approvalData.actionType);
      
      this.getUser();console.log(' **************' ,this.getUser());
      this.user = this.approvalData.entity;
      console.log("Entity User--",this.user)
     
  }

  async getUser() {
     
    this.user = this.approvalData.entity;
    // this.user = await this.userService.getByCode(this.entityCode);
    // if(this.approvalData.actionType = "Approved"){
    //   this.updatedInfo = this.user;
    // }else{
      if(this.approvalData.actionType== ApprovalConstants.status.text.UPDATED || this.approvalData.actionType==  ApprovalConstants.status.text.CLAIMED ){
       this.compareChanges();
      }
    // }
    
   }
  compareChanges(){
    if(this.updatedInfo){
    if(this.updatedInfo.status){
    this.statusName = this.approvalService.getValueOnCode(this.updatedInfo.status);
    }

    if(this.updatedInfo.status && this.user.status != this.updatedInfo.status){
      this.unchanged.status= false;
     }
    // if(this.updatedInfo.fromDate && this.user.fromDate != this.updatedInfo.fromDate){
    //   this.unchanged.fromDate= false;
    //  }
    //  if(this.updatedInfo.toDate && this.user.toDate != this.updatedInfo.toDate){
    //   this.unchanged.toDate= false;
    //  }
    // if(this.updatedInfo.idProofNumber && this.user.idProofNumber != this.updatedInfo.idProofNumber){
    //   this.unchanged.idProofNumber= false;
 
    // }
    // if(this.updatedInfo.idProofTypeName && this.user.idProofTypeName != this.updatedInfo.idProofTypeName){
    //   this.unchanged.idProofTypeName= false;
 
    // }
    if(this.updatedInfo.employeeId && this.user.employeeId != this.updatedInfo.employeeId){
      this.unchanged.employeeId= false;
    }
    if(this.updatedInfo.mobileNumber && this.user.mobileNumber != this.updatedInfo.mobileNumber){
      this.unchanged.mobileNumber= false;
     }
     
    if( this.updatedInfo.email && this.user.email != this.updatedInfo.email){
      this.unchanged.email= false;
     }
    if( this.updatedInfo.lastName && this.user.lastName != this.updatedInfo.lastName){
      this.unchanged.lastName= false;
     }
    if(this.updatedInfo.firstName && this.user.firstName != this.updatedInfo.firstName){
      this.unchanged.firstName= false;
     }
    if(this.updatedInfo.userName && this.user.userName != this.updatedInfo.userName){
      this.unchanged.userName= false;
     }
     
    if(this.updatedInfo.roleCode && this.user.roleCode != this.updatedInfo.roleCode){
      this.unchanged.roleCode= false;
      this.detailService.getByCode('Role',this.updatedInfo.roleCode).subscribe(response => {
        if (response.resultCode === '0') {
          this.roleName = response.role.name;
        } else {
          this.roleName = '';
        }
      });
     }
       
    // if(this.updatedInfo.groupCode && this.user.groupCode != this.updatedInfo.groupCode){
    //   this.unchanged.groupCode= false;
    //   this.detailService.getByCode('Groups',this.updatedInfo.groupCode).subscribe(response => {
    //     if (response.resultCode === '0') {
    //       this.groupName = response.group.name;
    //     } else {
    //       this.groupName = '';
    //     }
    //   });
    // }
  }
  
    }
   
    
        
    // this.detailService.getByCode('Role',this.updatedInfo.roleCode).subscribe(response => {
    //   if (response.resultCode === '0') {
    //     this.groupName = response.role.name;
    //   } else {
    //     this.roleName = '';
    //   }
    // });
  
  

 

}
