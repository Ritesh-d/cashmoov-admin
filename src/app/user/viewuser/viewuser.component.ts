import { Component, OnInit, Input  } from '@angular/core';
import { UserModel } from '../user.model';
import { UserService } from '../user.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.css']
})
export class ViewuserComponent implements OnInit {

 
  editMode = false;
  paramList :any;
  userModel: UserModel;
  id : number;
  code	:String ='' ;
  group_code	 :String ;
  role_code	 :String ;
  user_name	 :String ;
  alias_name	 :String ;
  national_id	 :number ;
  mobile_number: number	 ;
  hr_id	:number ;
  bob_title	 :String ;
  department_name	:String ; 
  status	 :String ;
  state	 :String ;
  creation_date	: Date ;
  created_by	 :String ;
  updation_date	 :Date;
  updated_by	 :String ;
  email : String;
  last_name: String;
  first_name: String;

  constructor(private userService: UserService,private formBuilder: FormBuilder, private router: Router, private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute) {
         
       
    
     this.ngOnInit();
     
       
   
     }

   
    @Input() userid: any;

  ngOnInit() {

    if(this.userid) {
      console.log("params" + this.userid);
        this.id = this.userModel.id;
        this.code	= this.userModel.code;
        this.group_code	= this.userModel.groupCode;;
        this.role_code	= this.userModel.roleCode;
        this.first_name	= this.userModel.firstName;
        this.last_name	= this.userModel.lastName;
        this.user_name	= this.userModel.userName;
        this.alias_name	 = this.userModel.aliasName;
        this.national_id	= this.userModel.nationalId;
        this.email	= this.userModel.email;
        this.mobile_number= this.userModel.mobileNumber;
        this.hr_id= this.userModel.hrId;
        this.bob_title= this.userModel.bobTitle;
        this.department_name= this.userModel.departmentName;
        this.status	= this.userModel.status;
        this.state	= this.userModel.state;
        this.creation_date= this.userModel.creationDate;
        this.created_by	= this.userModel.created_by;
        this.updation_date	= this.userModel.updation_date;
        this.updated_by	 = this.userModel.updated_by;
      }
  }

  navigateToSytemUserCreation(){
    
      this.router.navigate( ['/user'], {relativeTo: this.route} );
    
  }
   

  onCancel() {
    
  
      this.router.navigate( ['/user'], {relativeTo: this.route} );
     
  }

}
