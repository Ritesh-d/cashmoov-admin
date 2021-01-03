import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { CommonHelperService } from '../../shared/services/common-helper-service';
import { UserDetailsService } from './user-details.service';
import { formatDate } from '@angular/common';
import { AddWalletOwnerService } from '../add-wallet-owner/add-wallet-owner-service';
import {TranslatelanguageService} from '../../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  dtOptions: any = {};
  walletOwnerCode: string;
  errorMessage: string;
  users: any[];
  successMessage :any ;
  constructor(private route: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private userDetailsService: UserDetailsService,
    private translate: TranslatelanguageService,
    private router: Router,private addWalletOwnerService: AddWalletOwnerService) { }

  ngOnInit() {
    this.showMessage();
    this.route.params.subscribe((params: Params) => {
      if (params.walletOwnerCode) {
        this.walletOwnerCode = params.walletOwnerCode;
        this.userDetailsService.walletOwnerCode = this.walletOwnerCode;
        this.userDetailsService.getUsersOfWallet(params.walletOwnerCode).subscribe(data => {
          if(data.resultCode === '0') {
            this.users = data.walletOwnerUserList;
          } else if (data.resultCode === '1010') {
            this.users = [];
            this.errorMessage = data.resultDescription;
          } else {
            this.errorMessage = data.resultDescription;
          }
        });
      }
    });
    
    this.dtOptions = this.commonHelperService.settingDataTable();
    
  }

  viewUser(userCode: string) {
    this.addWalletOwnerService.selectedCategoryCode=this.users[0].walletOwnerCategoryCode;
    this.router.navigate(['../../viewUser', userCode], { relativeTo: this.route });
  }

  editUser(userCode: string) {
    this.addWalletOwnerService.selectedCategoryCode=this.users[0].walletOwnerCategoryCode;

    this.router.navigate(['../../editUser', userCode], { relativeTo: this.route });
  }

  adduser() {
    this.addWalletOwnerService.selectedCategoryCode=this.users[0].walletOwnerCategoryCode;

    this.router.navigate(['../../addUser', this.walletOwnerCode], { relativeTo: this.route });
  }
  onCancel(){
    this.router.navigate(['/wallet-owner'], { relativeTo: this.route });

  }
  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      if (this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
        //this.successMessage = 'User Added successfully, sent for approval';
        this.translate.languageText('USER.userAddedsuccessfullysentforapproval', data=> {
          this.successMessage =data;
          });
      } else if (this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        //this.successMessage = 'User Updation sent for approval successfully.';
        this.translate.languageText('USER.userUpdationsentforapprovalsuccessfully', data=> {
          this.successMessage =data;
          });
      }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 10 * 1000);
    }
  }

}
