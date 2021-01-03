import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalService } from './approval.service';
import { loginDataBuilder } from '../shared/login-data.builder';
import { DetailsService } from './details/details.service';
import { ApprovalConstants } from './approval.constants';
import { CommonHelperService } from '../shared/services/common-helper-service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { startWith, tap, delay } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import {TranslatelanguageService} from '../shared/services/translatelanguage.service';
 

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  fetchingData = true;
  successMessage: string;
  dtOptions: any = {};
  multiClaim = false;
  approvals: any[];
  selectAll = false;
  featureDropDown: any[] = [];
  errorMessage: string;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private approvalService: ApprovalService,
    private commonHelperService: CommonHelperService,
    private translate: TranslatelanguageService,
    private loginDataBuilder: loginDataBuilder,
    private detailsService: DetailsService) {

  }

  ngOnInit() {
    this.showMessage();
    this.prepareFeatureDropDown();
   this.fetchingApprovals();
    this.dtOptions = this.commonHelperService.settingDataTable();
    // this.dtOptions = {
    //   columnDefs: [
  
    //   { targets: 4, type: 'date' }
  
    //      ]
    //     }
  }

  private prepareFeatureDropDown() {
    console.log('this.loginDataBuilder.userData.featuresList' + JSON.stringify(this.loginDataBuilder.userData.featuresList));
    if (this.loginDataBuilder.userData.featuresList) {
      this.loginDataBuilder.userData.featuresList.forEach(element => {
        // if (element.approve) {
          this.featureDropDown.push(element);
        // }
      });
    }
  }

  public fetchingApprovals() {
    // setTimeout(() => {
    this.approvalService.approvals.subscribe(approvals => {
      console.log('approvals' ,approvals);
      if (approvals.resultCode === '0') {
        this.errorMessage = undefined;
        this.approvals = approvals.dataApprovalList.map(approval => {
          return {
            ...approval,
            // creationDate : formatDate(approval.creationDate, 'dd/MM/yyyy' ,'en-US' ),
            checked: false,
            claimed: approval.assignTo ? true : false
          };
        });
        this.fetchingData = false;
      } else {
        this.errorMessage = approvals.resultDescription;
        this.fetchingData = false;
      }
    });
  // },0);
  }

  onClaim(index: number, approvalData: any) {
    console.log('--onClaim--', index, approvalData.code);
    this.approvalService.approvalAction(ApprovalConstants.status.text.CLAIMED, approvalData)
    .subscribe(data => {
      
        if (data.resultCode === '0') {
              this.errorMessage = undefined;
             // this.successMessage = 'You have claimed, successfully.';
             this.translate.languageText('APPROVAL.youhaveclaimedsuccessfully', data=> {
              this.successMessage =data;
              });
              this.claimed();
              this.approvals[index].status=ApprovalConstants.status.text.IN_PROGRESS;
              this.approvals[index].claimed = true;
              this.approvals[index].checked = false;
            } else {
              this.errorMessage = data.resultDescription;
              this.claimed();
            }
       
    });
  }

  claimSelected() {
    const selectedApprovals: string[] = [];
   
    this.approvals.forEach((approval,index) => {
      if (approval.checked) {
      
        selectedApprovals.push(approval.code);
        this.multiclaimSelected(index, approval) ;
       
      }
      if(selectedApprovals.length>0){
      this.successMessage = 'You have claimed '+selectedApprovals.length+ ' features, successfully.';
      this.claimed();
      }else{
        //this.errorMessage ='Please select a checkbox'
        this.translate.languageText('APPROVAL.pleaseselectacheckbox', data=> {
          this.errorMessage =data;
          });
      }
    });
    
  }
  multiclaimSelected(index: number, approvalData: any) {
    
    this.approvalService.approvalAction(ApprovalConstants.status.text.CLAIMED, approvalData)
    .subscribe(data => {
      
        if (data.resultCode === '0') {
              this.errorMessage = undefined;
              this.approvals[index].status=ApprovalConstants.status.text.IN_PROGRESS;
              this.approvals[index].claimed = true;
              this.approvals[index].checked = false;
            } else {
              this.errorMessage = data.resultDescription;
              this.claimed();
            }
       
    });
  }

  onMultiClaim() {
    this.multiClaim = !this.multiClaim;
  }

  selectAllApproval() {
    this.selectAll = !this.selectAll;
    this.approvals.forEach(approval => {
      if (this.selectAll && !approval.claimed) {
        approval.checked = true;
      } else {
        approval.checked = false;
      }
    });
  }

  navigateToDetails(feature: string, code: string, entityCode: string) {
    this.router.navigate(['approve', +code], { relativeTo: this.route, queryParams: { feature: feature, entityCode: entityCode } });
  }

  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status')) {
      const status = this.route.snapshot.queryParamMap.get('status').toString();
      
      if (status === ApprovalConstants.status.text.CLAIMED) {
        const feature = this.route.snapshot.queryParamMap.get('feature').toString();
        
       // this.successMessage = feature + ' Claimed successfully.';
       this.translate.languageText('APPROVAL.claimedsuccessfully', data=> {
        this.successMessage =feature + data;
        });
      } else if (status === ApprovalConstants.status.text.APPROVED) {
        const feature = this.route.snapshot.queryParamMap.get('feature').toString();
       
        //this.successMessage = feature + ' Approved successfully.';
        this.translate.languageText('APPROVAL.approvedsuccessfully', data=> {
          this.successMessage =feature + data;
          });
      } else if (status === ApprovalConstants.status.text.REJECTED) {
        const feature = this.route.snapshot.queryParamMap.get('feature').toString();
        //this.successMessage = feature + ' Rejectded successfully.';
        this.translate.languageText('APPROVAL.rejectdedsuccessfully', data=> {
          this.successMessage =feature + data;
          });
      } else if (status === 'updated') {
        //this.successMessage = 'Role Updated successfully.';
        this.translate.languageText('APPROVAL.roleUpdatedsuccessfully', data=> {
          this.successMessage =data;
          });
          
      }
      console.log('successMessage' ,this.successMessage);
      this.claimed();
    }
  }

  private claimed() {
    setTimeout(() => {
      this.successMessage = undefined;
      this.errorMessage = undefined;
    }, 20 * 1000);
  }

  showClaimed(approval: any): boolean {
    if (approval.claimed || approval.status === ApprovalConstants.status.text.APPROVED) {
          return false;
    }
    return true;
  }

  public onSearch() {
   this.fetchingData = true;
   this.approvals= [];
   let code= (document.getElementById('code')  as HTMLInputElement).value;
   let name=(document.getElementById('name')  as HTMLInputElement).value;
   let feature=(document.getElementById('feature')  as HTMLInputElement).value;
   let status= (document.getElementById('status')  as HTMLInputElement).value;
  
   let params = new URLSearchParams();
    if (code != ''  ) {
      params.append("entityCode", code);
    } 
     if (name != '') {
      params.append("entityName", name);
    } if (feature != '-1') {
      params.append("featureCode", feature);
    } if (status != '-1') {
      params.append("status", status);
    }
  
    console.log('params' +  (params ));
    this.approvalService.approvalsearch(params).subscribe(approvals => {
      console.log('approvals' ,approvals);
      if (approvals.resultCode === '0') {
        // this.errorMessage = undefined;
        this.approvals = approvals.dataApprovalList.map(approval => {
          return {
            ...approval,
            checked: false,
            claimed: approval.assignTo ? true : false
          };
        });
        this.fetchingData = false;
      } else {
        // this.errorMessage = approvals.resultDescription;
        this.fetchingData = false;
      }
    });
  }

}