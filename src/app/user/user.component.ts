import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { UserService } from './user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserConstants } from './user.constant';
import {TranslatelanguageService} from '../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  users: any[];
  roles: any[];
  searchUserForm: FormGroup;
  displaytable: Boolean = false;
  successMessage: string;
  fetchingData = true;
  msg: string = '';
  offset: number = 0;
  limit: number;
  setPermission: any;
  constructor(private userService: UserService, private modalService: NgbModal,
    private route: ActivatedRoute,
     private formBuilder: FormBuilder,
     private translate: TranslatelanguageService,
    private router: Router) {
  }

  async ngOnInit() {
     
    
    this.setPermission = this.userService.setPermission;
    console.log(' setPermission',this.setPermission);
    this.searchUserForm = this.formBuilder.group({
      code: [''], employeeId: [''],
      userName: [''], roleName: ['-1'],
      mobileNumber: [''], email: [''],
      status: ['-1'],
      stage: ['-1'],
    });

    this.showMessage();
    this.callOnLoad();
  }
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
        if(this.userService.approvalRequired){
        //this.successMessage = 'User Added successfully, sent for approval';
        this.translate.languageText('USER.userAddedsuccessfullysentforapproval', data=> {
          this.successMessage =data;
          });
        }else{
          //this.successMessage = 'User Added successfully';
          this.translate.languageText('USER.userAddedsuccessfully', data=> {
            this.successMessage =data;
            });
        }
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        if(this.userService.approvalRequired){
        //this.successMessage = 'User Updation sent for approval successfully.';
        this.translate.languageText('USER.userUpdationsentforapprovalsuccessfully', data=> {
          this.successMessage =data;
          });
        }else{
          //this.successMessage = 'User Updated successfully.';
          this.translate.languageText('USER.userUpdatedsuccessfully', data=> {
            this.successMessage =data;
            });
            
        }
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
    }
  }
  async callOnLoad() {

    let params = new URLSearchParams();
    params.append("offset", UserConstants.offset);
    params.append("limit", UserConstants.limit);
    this.users = await this.userService.getusersDetail(params);
   if(this.users == undefined ){this.users= [];}
    this.users = this.users.filter(function(e1){
      return e1 != null;
      
    });
   
    this.userService.roleMaster().subscribe(data => {
      console.log(data)
      this.roles = data.roleList;
    })
    
    // if(this.users.length > 0){
    this.displaytable = true;
    this.fetchingData = false;
    // }
    // let nextEvent = (document.getElementById("DataTables_Table_0_next") as HTMLInputElement);
    // if(nextEvent != null){
    // nextEvent.onclick= this.searchData;
    // }
  }
   
  async searchData() {

    console.log('called searchData');
    this.fetchingData = true;
    this.displaytable = false;

    var code = this.searchUserForm.get("code").value; console.log('code' + code);
    var userName = this.searchUserForm.get("userName").value; console.log('user name' + userName);
    var role = this.searchUserForm.get("roleName").value; console.log('role name' + role);
    var email = this.searchUserForm.get("email").value; console.log('email' + email);
    var mobileNumber = this.searchUserForm.get("mobileNumber").value; console.log('mobilenumber' + mobileNumber);
    // var idProofNumber = this.searchUserForm.get("idProofNumber").value; console.log('idProofNumber' + mobilenumber);
    
    var employeeId = this.searchUserForm.get("employeeId").value; console.log('employeeId' + employeeId);

    var status = this.searchUserForm.get("status").value; console.log('status' + status);
    var stage = this.searchUserForm.get("stage").value; console.log('stage' + stage);

    let params = new URLSearchParams();
    if (code != '' && code != '%3D') {
      params.append("code", code);
    } if (userName != '') {
      params.append("userName", userName);
    } if (role != '-1') {
      params.append("roleCode", role);
    } if (email != '') {
      params.append("email", email);
    } if (mobileNumber != '') {
      params.append("mobileNumber", mobileNumber);
    } if (employeeId != '') {
      params.append("employeeId", employeeId);
    } if (status != '-1') {
      params.append("status", status);
    } if (stage != '-1') {
      params.append("state", stage);
    }

    params.append("offset", UserConstants.offset);
    params.append("limit", UserConstants.limit);
    console.log('params' + params);

    this.users = await this.userService.getusersDetail(params);
    
    this.displaytable = true;
    this.fetchingData = false;
 
  }
  advanceSearchOption(event: any) {

    var x = document.getElementById("advSearchOpt");
    if (x.style.display === "none") {
      x.style.display = "block";
      event.srcElement.classList.remove("fa-plus-circle");
      event.srcElement.classList.add("fa-minus-circle");
    } else {
      x.style.display = "none";
      event.srcElement.classList.remove("fa-minus-circle");
      event.srcElement.classList.add("fa-plus-circle");

    }
  }
}



// async hasNext(){

  //   let params = new URLSearchParams();
  //   params.append("offset",(this.offset ++ ) +'');
  //   params.append("limit", UserConstants.limit);
  //  this.users = await this.userService.getusersDetail(params);

  // }
  // async hasPrevious(){
  //   let params = new URLSearchParams();
  //   if(this.offset >=0 ){
  //     params.append("offset",(this.offset -- ) +'');
  //     params.append("limit", UserConstants.limit);
  //     this.users = await this.userService.getusersDetail(params);
  //   }else{
  //     this.offset = 0;
  //   }

  // }