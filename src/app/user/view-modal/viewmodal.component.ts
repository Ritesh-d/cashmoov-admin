import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserModel } from '../user.model';
import { UserService } from '../user.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApprovalConstants } from '../../approval/approval.constants';

@Component({
  selector: 'app-viewmodal',
  templateUrl: './viewmodal.component.html',
  styleUrls: ['./viewmodal.component.css']
})
export class viewModalComponent {
  @Input() user;


  editMode = false;
  paramList: any;
  userModel: UserModel;
  id: number;
  code: String = '';
  group_code: String;
  roleName: String;
  groupName: String;
  role_code: String;
  user_name: String;
  alias_name: String;
  national_id: number;
  mobile_number: number;
  hr_id: number;
  job_title: String;
  department_name: String;
  status: String;
  state: String;
  creation_date: Date;
  created_by: String;
  updation_date: Date;
  updated_by: String;
  email: String;
  last_name: String;
  first_name: String;
  fromDate: string;
  toDate: string;
  // idExpiryDate: string;
  // idProofTypeName: string;
  // idProofNumber: string;
  employeeId : string;
  showDateOptions: boolean= false;
  constructor(public activeModal: NgbActiveModal, private userService: UserService, private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute) {


    this.ngOnInit();

  }

  ngOnInit() {


    if (this.user) {
      console.log("params", this.user);
      this.id = this.user.id;
      this.code = this.user.code;

      this.roleName = this.user.roleName;

      this.role_code = this.user.roleCode;
      this.first_name = this.user.firstName;
      this.last_name = this.user.lastName;
      this.user_name = this.user.userName;
      this.employeeId = this.user.employeeId;
      // this.idProofNumber = this.user.idProofNumber;
      // this.idProofTypeName = this.user.idProofTypeName;
      // this.idExpiryDate = this.user.idExpiryDate

      this.email = this.user.email;
      this.mobile_number = this.user.mobileNumber;

      this.status = this.user.status;
      this.state = this.user.state;
      this.creation_date = this.user.creationDate;
   
      if(this.status == ApprovalConstants.status.text.SUSPENDED){
        this.showDateOptions=true;
          this.fromDate =  this.user.fromDate;
          this.toDate =  this.user.toDate;
      }

    }
  }
  fromdate : any;
  todate : any;
  navigateToSytemUserCreation() {

    this.router.navigate(['../../'], { relativeTo: this.route });

  }


  onCancel() {


    this.router.navigate(['../../'], { relativeTo: this.route });

  }

}