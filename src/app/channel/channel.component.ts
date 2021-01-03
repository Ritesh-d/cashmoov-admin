
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonHelperService } from '../shared/services/common-helper-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChannelService } from './channel.service';
import { TranslatelanguageService } from '../shared/services/translatelanguage.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  createForm: FormGroup;
  editMode: boolean = false;
  fetchingData: boolean = false;
  submitted: boolean = false;
  errorMessges: string;
  successMessage: string;
  displaytable: boolean = false;;
  dtOption: any = {};
  channelList: any;
  walletOwnerCode: string='';
  channelTypeCode: string='';
  status: string;
  walletOwnerList : any;
  channelTypeList: any;
  setPermission: any;
  getcurrentLang:any;

  constructor(private channelService: ChannelService,
      private modalService: NgbModal,
      private commonHelperService: CommonHelperService,
      private translate : TranslatelanguageService,
      private route: ActivatedRoute, private router: Router) {
        this.getcurrentLang=this.translate.getcurrentLang();
  }

  ngOnInit() {
    this.setPermission =  this.channelService.setPermission;
    this.createFormGroup();
    this.callOnLoad();
    this.showMessage();

  }


  callOnLoad() {
    this.displaytable = false;

    this.channelService.getAllDetail().subscribe(result => {
      if (result["resultCode"] === '0') {
        this.channelList = result["channelList"];
        console.log('channelList', this.channelList);
        this.dtOption = this.commonHelperService.settingDataTable();
        this.displaytable = true;
      }
    }, error => console.log('error', error))
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

  }

  get f() { return this.createForm.controls; }


  public onSubmit() {
    this.clearMsg();
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    console.log('request for create service ', this.createForm.getRawValue());

    this.channelService.createChannel(this.createForm.getRawValue()).subscribe(result => {
      console.log('result.channel', result.channel);
      if (result.resultCode === '0') {

        this.errorMessges = undefined;
        this.successMessage = result.resultDescription;

        this.callOnLoad();

      } else {
        this.errorMessges = result.resultDescription;
      }
    })
  }
 
  createFormGroup() {

    this.createForm = new FormGroup({
      channelTypeCode: new FormControl(this.channelTypeCode, [Validators.required]),
      walletOwnerCode: new FormControl(this.walletOwnerCode, [Validators.required]),
      status: new FormControl(this.status),
    });
  }
  editForm(channel: any) {

    this.router.navigate(['./edit'], {queryParams: channel, relativeTo: this.route, skipLocationChange: true });

  }
  clearMsg() {
    this.errorMessges = '';
    this.successMessage = '';
  }
  viewForm(template: any) {
    // const modalRef = this.modalService.open(ViewChannel);
    // modalRef.componentInstance.data = template;
  }
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        //this.successMessage = 'Channel Updated successfully';
        this.translate.languageText('CHANNEL.channelUpdatedsuccessfully', data=> {
          this.successMessage=data;
        });
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
    }
  }
}
