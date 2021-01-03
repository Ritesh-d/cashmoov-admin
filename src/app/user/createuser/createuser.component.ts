import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateUserRequestModel } from '../create-user-request.model';
import { UserService } from '../user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApprovalConstants } from '../../approval/approval.constants';
import { ApprovalService} from '../../approval/approval.service';
import { formatDate } from '@angular/common';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit {
  @Input() user;
  model: NgbDateStruct;
  model1: NgbDateStruct;
  createUserForm: FormGroup;
  editMode = false;
  paramList: any;
  userModel: any;

  createUserRequestModel: CreateUserRequestModel;
  id: number;
  code: String = '';
  group_code: String = "";
  role_code: String = "";
  user_name: String = "";
  alias_name: String = "";
  // idProofNumber: string;
  // idExpiryDate: any;
  // idProfType: string = '';
  employeeId : string="";
  mobile_number: number;
  hr_id: number;
  job_title: String = "";
  department_name: String = "";
  status: String = "";
  state: String = "";
  creation_date: Date;
  created_by: String = "";
  updation_date: Date;
  updated_by: String = "";
  first_name: String = "";
  last_name: String = "";
  email: String = "";
  errorMessges = "";
  groups; roles; idproofTypeList;
  submitted: Boolean = false;
  todate : any;
  fromdate: any;

  constructor(private userService: UserService,
     private formBuilder: FormBuilder,
      private router: Router, 
      private activatedrouter: ActivatedRoute,
    private route: ActivatedRoute,
    private translate: TranslatelanguageService,
     private approvalService : ApprovalService) { }

  createForm() {
    this.createUserForm = this.formBuilder.group({
      id: [this.id],
      code: [this.code],
      role_code: [this.role_code, [Validators.required]],
      user_name: [this.user_name, [Validators.required,Validators.pattern('^[a-zA-Z0-9-àâçéèêëîïôûùüÿñæœ\/\'._]+$'),Validators.minLength(4),Validators.maxLength(30)]],
      first_name: [this.first_name, [Validators.required,Validators.pattern('^[a-zA-Z-àâçéèêëîïôûùüÿñæœ\/\']+$'),Validators.minLength(4),Validators.maxLength(30)]],
      last_name: [this.last_name,[Validators.pattern('^[a-zA-Z-àâçéèêëîïôûùüÿñæœ\/\']+$'),Validators.minLength(4),Validators.maxLength(30)]],
      email: [this.email, [Validators.required,Validators.email]],
      // idProofNumber: [this.idProofNumber, [Validators.required]],
      // idProfType: [this.idProfType, [Validators.required]],
      // idExpiryDate: [this.idExpiryDate, [Validators.required]],
      employeeId : [this.employeeId,[Validators.pattern('^[a-zA-Z0-9]*$'),Validators.minLength(4),Validators.maxLength(30)]],
     // mobile_number: [this.mobile_number, [Validators.required,Validators.pattern('^[0-9]*$')]],
      mobile_number: [this.mobile_number, [Validators.required,Validators.pattern('^[0-9]*[1-9][0-9]*$'),Validators.minLength(10)]],
     
        

      status: [this.status],
      state: [this.state],
      todate : [this.todate],
      fromdate : [this.fromdate]

    });
  }


  ngOnInit() {
console.log('this.approvalrequired' + this.userService.approvalRequired);
    // this.todate = formatDate(new Date(), "dd/MM/yyyy", "en");
    // this.fromdate = formatDate(new Date(), "dd/MM/yyyy", "en");
    this.editMode = this.userService.prepareUserAction();
    console.log('--editMode--', this.editMode);

    this.activatedrouter.queryParams.subscribe((params: Params) => {

      if (params && this.editMode) {

        this.userModel = params;

        this.id = this.userModel.id;
        this.code = this.userModel.code;
        this.role_code = this.userModel.roleCode;
        this.first_name = this.userModel.firstName;
        this.last_name = this.userModel.lastName;
        this.user_name = this.userModel.userName;
        // this.idProofNumber = this.userModel.idProofNumber;
        // this.idProfType = this.userModel.idProofTypeCode;
        // this.idExpiryDate = formatDate(this.userModel.idExpiryDate, "dd/MM/yyyy", "en");
        this.employeeId = this.userModel.employeeId;
        this.mobile_number = this.userModel.mobileNumber;
        this.email = this.userModel.email;
        this.status = this.userModel.status;
        this.state = this.userModel.state;
        this.creation_date = this.userModel.creationDate;
        this.created_by = this.userModel.created_by;
        this.updation_date = this.userModel.updation_date;
        this.updated_by = this.userModel.updated_by;
      
        this.status = this.approvalService.getDataApprovalStatus(this.status.toString());
      
        if(this.status == ApprovalConstants.status.code.SUSPENDED){
          this.showDateOptions=true;
          const [day, month, year] = formatDate(this.userModel.fromDate, "dd/MM/yyyy", "en").split('/');
          this.model = { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
          const [day1, month1, year1] = formatDate(this.userModel.toDate, "dd/MM/yyyy", "en").split('/'); 
          this.model1 = { year: parseInt(year1), month: parseInt(month1), day: parseInt(day1) };

        }
      }
      this.createForm();
      // const [day, month, year] = this.idExpiryDate.split('/');
      // const ngxobj = { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
      // console.log('ngxobj', ngxobj)
      // this.model = ngxobj;

    });
    // this.userService.idProofTypeMaster().subscribe(data => {
    //   console.log('idproofTypeList', data)
    //   this.idproofTypeList = [{ code: '', type: 'select id type' }, ...data.idProffTypeList];
    // })

    this.userService.roleMaster().subscribe(data => {
      console.log(data)
      this.roles = [{ code: '', name: 'select role' }, ...data.roleList];
    })
  }

  navigateToSytemUserCreation() {
    const firstPath = window.location.pathname.split('/')[1];
    if (this.editMode) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  onReset() {
    this.createUserForm.reset();
  }
  onCancel() {
    const firstPath = window.location.pathname.split('/')[1];
    this.router.navigate(['/user'], { relativeTo: this.route });


  }

  async onSubmit() {

    console.log("sumbmitted++" + this.userService.approvalRequired, this.createUserForm.invalid );//+ this.userService.formatDatePicker(this.createUserForm.value.idExpiryDate)
    this.submitted = true;
    

    this.errorMessges = "";
    if (this.createUserForm.invalid) {
      return;
    }
    
    var code = this.createUserForm.value.code;
    var roleCode = this.createUserForm.value.role_code;
    var userName = this.createUserForm.value.user_name;
    var firstName = this.createUserForm.value.first_name;
    var lastName = this.createUserForm.value.last_name;
    var email = this.createUserForm.value.email;
    var employeeId =  this.createUserForm.value.employeeId;
    // var idProofNumber = this.createUserForm.value.idProofNumber;
    // var idProofTypeCode = this.createUserForm.value.idProfType;
    // var idExpiryDate = this.createUserForm.value.idExpiryDate;
    var mobileNumber = this.createUserForm.value.mobile_number;
    var todate = this.createUserForm.value.todate;
    var fromdate = this.createUserForm.value.fromdate;
    this.status = this.createUserForm.value.status;
    // this.createUserRequestModel = { code, roleCode, userName, idProofNumber, idProofTypeCode, idExpiryDate, mobileNumber, firstName, lastName, email }
    this.createUserRequestModel = { code, roleCode, userName,employeeId, mobileNumber, firstName, lastName, email, todate, fromdate, status }

    this.createUserRequestModel.roleCode = this.createUserForm.value.role_code;
    this.createUserRequestModel.userName = this.createUserForm.value.user_name;

    if (!this.editMode) {
      this.createUserRequestModel.code = this.createUserForm.value.code;
    }
    if (this.editMode) {
      this.createUserRequestModel.status = this.createUserForm.value.status;
      if(this.status == ApprovalConstants.status.code.SUSPENDED){
        this.createUserRequestModel.todate = this.userService.formatDatePicker(this.createUserForm.value.todate);
        this.createUserRequestModel.fromdate = this.userService.formatDatePicker(this.createUserForm.value.fromdate);
      }
    }
    this.createUserRequestModel.email = this.createUserForm.value.email;

    this.createUserRequestModel.mobileNumber = this.createUserForm.value.mobile_number;
    this.createUserRequestModel.firstName = this.createUserForm.value.first_name;
    this.createUserRequestModel.lastName = this.createUserForm.value.last_name;
    this.createUserRequestModel.email = this.createUserForm.value.email;
    this.createUserRequestModel.employeeId = this.createUserForm.value.employeeId;
    if(this.userService.approvalRequired){
    
        this.createUserRequestModel.status = ApprovalConstants.status.code.ACTIVE ;
     }
    

    console.log(this.code + 'this.createUserRequestModel' + JSON.stringify(this.createUserRequestModel));

    if (!this.editMode) {
      console.log('Request for create user \n' + JSON.stringify(this.createUserRequestModel));
      let data = await this.userService.createUser(this.createUserRequestModel);
      console.log('data', data);
      if (data == null) {
        //this.errorMessges = "There is some error, Please try after some time.";
        this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
          this.errorMessges =data;
          });
      }
      else if (data["resultCode"] == "0") {
        if(this.userService.approvalRequired){
        this.userService.makeEntryToApproval(data.user).subscribe(approvalData => {
          console.log('approvalData', approvalData)
          if (approvalData === null) {
            //this.errorMessges = "There is some error, Please try after some time.";
            this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
              this.errorMessges =data;
              });
          } else {
            if (approvalData["resultCode"] == "0") {
              this.errorMessges = undefined;
              this.router.navigate(['/user'], { relativeTo: this.route, queryParams: { status: 'added' } });
            } else {
              this.errorMessges = approvalData["resultDescription"];
            }
          }
        });
      }
      else{
        this.errorMessges = undefined;
        this.router.navigate(['/user'], { relativeTo: this.route, queryParams: { status: 'added' } });
      }

      } else {
        this.errorMessges = data["resultDescription"];
      }

    } else if(this.editMode){
      if(this.userService.approvalRequired){
      const updatedInfo = this.userService.preparedUpdatedDataForApproval(this.userModel, this.createUserForm.value);
      console.log('updatedInfo', updatedInfo);
      let data = await this.userService.modeifyUser(this.prepareDataForUpdateStatus(this.userModel), this.code);
      console.log('updated : data ', data);
      if (data == null) {
        //this.errorMessges = "There is some error, Please try after some time.";
        this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
          this.errorMessges =data;
          });
      }
      else if (data["resultCode"] == "0") {
        this.userService.makeEntryToApproval(this.userModel, updatedInfo).subscribe(approvalData => {
          console.log('--approvalData--', approvalData);
          if (approvalData === null) {
            //this.errorMessges = "There is some error, Please try after some time.";
            this.translate.languageText('MASTER.thereissomeerrorPleasetryaftersometime', data=> {
              this.errorMessges =data;
              });
          } else {
            if (approvalData.resultCode === '0') {

              this.errorMessges = undefined;
              this.router.navigate(['/user'], { relativeTo: this.route, queryParams: { status: 'updated' } });
            } else {
              this.errorMessges = approvalData.resultDescription;
            }
          }
        });
      }
    }else{
      let data = await this.userService.modeifyUser(this.prepareDataForUpdate(this.createUserForm.getRawValue()), this.code);
      if (data.resultCode === '0') {

        this.errorMessges = undefined;
        this.router.navigate(['/user'], { relativeTo: this.route, queryParams: { status: 'updated' } });
      } else {
        this.errorMessges = data.resultDescription;
      }
    }
    }

  }
  get f() {
     return this.createUserForm.controls;
  }

  prepareDataForUpdateStatus(data) {
    return {
      ...data,
      createdBy: "",
      creationDate: "",
      status: this.approvalService.getDataApprovalStatus(data.status) ,
      state: ApprovalConstants.status.code.UPDATED
    }
    
  }
  prepareDataForUpdate(data) {
    return {
      ...data,
      createdBy: "",
      creationDate: "",
      status: this.approvalService.getDataApprovalStatus(data.status) ,
      state: ApprovalConstants.status.code.APPROVED
    }
    
  }
  showDateOptions:boolean=false;
  onChange(event){
    let status = event.target.value;
    console.log('status  ' + event.target.value);
  if(status == ApprovalConstants.status.code.SUSPENDED){
    this.showDateOptions = true;
      const [day, month, year] = formatDate(new Date(), "dd/MM/yyyy", "en").split('/');
      const ngxobj = { year: parseInt(year), month: parseInt(month), day: parseInt(day) };
      this.model = ngxobj;
      this.model1 = ngxobj;
  }else{
    this.showDateOptions = false;
    this.model = undefined;
    this.model1 = undefined;
  }

  } 

}
