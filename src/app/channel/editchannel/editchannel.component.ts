
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from '@angular/router';
 import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalService } from '../../approval/approval.service';
import { ChannelService } from '../channel.service';

@Component({
  selector: 'app-editchannel',
  templateUrl: './editchannel.component.html',
  styleUrls: ['./editchannel.component.css']
})
export class EditChannelComponent implements OnInit {

  createForm: FormGroup;
  editMode: boolean = false;
  fetchingData: boolean = false;
  submitted: boolean = false;
  errorMessges: string;
  successMessage: string;
  displaytable: boolean = false;;
  dtOption: any = {};
  channelList: any;
  channelCode : string;
  walletOwnerList : any;
  channelTypeList: any;
  constructor(private approvalService : ApprovalService, private channelService: ChannelService, private modalService: NgbModal,  private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe( (params : Params) => {
      this.channelCode = params.code;
      this.walletOwnerCode = params.walletOwnerCode;
      this.channelTypeCode = params.channelTypeCode;
      this.status = this.approvalService.getDataApprovalStatus(params.status);
    });
    this.channelService.getAllChannelType().subscribe(result => {
      if (result["resultCode"] === '0') {
        this.channelTypeList = result["channelTypeList"];
        console.log('channelTypeList', this.channelTypeList);
       
      }
    }, error => console.log('error', error))
    this.channelService.getAllWalletOwner().subscribe(result => {
      if (result["resultCode"] === '0') {
        this.walletOwnerList = result["walletOwnerList"];
        console.log('walletOwnerList', this.walletOwnerList);
       
      }
    }, error => console.log('error', error))
    this.createFormGroup();
  }
  get f() { return this.createForm.controls; }

  public onSubmit() {
    
    this.clearMsg();
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    console.log('request for create service ',this.channelCode, this.createForm.getRawValue());

    this.channelService.modifyChannel(this.createForm.getRawValue(),this.channelCode).subscribe(result => {
      console.log('result.channel', result.channel);
      if (result.resultCode === '0') {

        this.errorMessges = undefined;
        this.successMessage = result.resultDescription;
        this.router.navigate(['../'], {queryParams: { status: 'updated' }, relativeTo: this.activatedRoute, skipLocationChange: true });
 

      } else {
        this.errorMessges = result.resultDescription;
      }
    })
  }
  walletOwnerCode: string;
  channelTypeCode: string;
  status: string;
  createFormGroup() {

    this.createForm = new FormGroup({
      channelTypeCode: new FormControl(this.channelTypeCode,[Validators.required]),
      walletOwnerCode: new FormControl(this.walletOwnerCode,[Validators.required]),
      status: new FormControl(this.status),
    });
  }
  
  clearMsg() {
    this.errorMessges = '';
    this.successMessage = '';
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.activatedRoute, skipLocationChange: true });

  }

 
}
