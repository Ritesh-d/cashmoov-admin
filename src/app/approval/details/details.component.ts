import { Component, OnInit, Input } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ApprovalService } from '../approval.service';
import { DetailsService } from './details.service';
import { ApprovalConstants } from '../approval.constants';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  claimed = false;
  feature: string;
  entityCode: string;
  approval: any;
  errorMessage: string;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private approvalService: ApprovalService,
    private detailsService: DetailsService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        if (this.route.snapshot.queryParamMap.get('feature')) {
          this.feature = this.route.snapshot.queryParamMap.get('feature').toString();
          this.entityCode = this.route.snapshot.queryParamMap.get('entityCode').toString();
        }
        // this.approval ={
        //   "id": 188,
        //   "code": "1000000196",
        //   "featureCode": "100045",
        //   "featureName": "Reversal",
        //   "entityCode": "1000000757",
        //   "entityName": "Reversal",
        //   "actionType": "Created",
        //   "assignTo": "100041",
        //   "status": "In Progress",
        //   "creationDate": "2020-12-22T22:21:25.293+0530",
        //   "modificationDate": "2020-12-23T11:06:56.050+0530",
        //   "createdBy": "100250",
        //   "modifiedBy": "100041",
        //   "updatedInformation": {
        //     "feeReverse": true,
        //     "amount": 1000
        //   },
        //   "entity": {
        //     "id": 383,
        //     "transTypeCode": "101612",
        //     "transTypeName": "Float Transfer",
        //     "code": "1000000757",
        //     "transactionId": "2298",
        //     "srcWalletOwnerCode": "BRN1000",
        //     "desWalletOwnerCode": "INST90003",
        //     "srcWalletCode": "1000005213",
        //     "desWalletCode": "1000005168",
        //     "srcCurrencyCode": "100003",
        //     "srcCurrencyName": "USD",
        //     "srcCurrencySymbol": "$",
        //     "desCurrencyCode": "100003",
        //     "desCurrencyName": "USD",
        //     "desCurrencySymbol": "$",
        //     "srcWalletTypeCode": "100008",
        //     "desWalletTypeCode": "100008",
        //     "srcWalletOwnerName": "CachmoovBranch",
        //     "desWalletOwnerName": "Estel-Institute9003",
        //     "transactionAmount": 1000.0,
        //     "fee": 100.0,
        //     "createdBy": "100607",
        //     "creationDate": 1608640791015,
        //     "transactionReversed": false,
        //     "status": "In Progress"
        //   }
        // }
        this.approvalService.getApproval(params.id).subscribe(approval => {
          if (approval.resultCode === '0') {
            this.errorMessage = undefined;
            this.approval = approval.dataApproval;
            this.claimed = this.approval.assignTo ? true : false;
            // this.showClaimed;
          } else {
            this.errorMessage = approval.resultDescription;
          }
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  onReject() {
    console.log('--onReject--', this.approval);
    this.approvalService.approvalAction(ApprovalConstants.status.text.REJECTED, this.approval).subscribe(data => {
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
        this.router.navigate(['../../'], {
          relativeTo: this.route, queryParams:
            { status: ApprovalConstants.status.text.REJECTED, feature: this.feature }
        });
     
      } else {
        this.errorMessage = data.resultDescription;
      }
    });
  }

  onDisclaim() {
    console.log('--onDisclaim--', this.approval);
    this.approvalService.approvalAction(ApprovalConstants.status.text.DISCLAIMED, this.approval).subscribe(data => {
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
              this.router.navigate(['../../'], {
                relativeTo: this.route, queryParams:
                  { status: ApprovalConstants.status.text.DISCLAIMED, feature: this.feature }
              });
         
      } else {
        this.errorMessage = data.resultDescription;
      }
    });
  }

  onApprove() {
    console.log('--OnApprove--', this.approval);
    this.approvalService.approvalAction(ApprovalConstants.status.text.APPROVED, this.approval)
      .subscribe(data => {
        console.log('response from approval' ,data);
        if (data.resultCode === '0') {
            this.errorMessage = undefined;
                  this.router.navigate(['../../'], {
                    relativeTo: this.route, queryParams:
                      { status: ApprovalConstants.status.text.APPROVED, feature: this.feature }
                  });
        } else {
          this.errorMessage = data.resultDescription;
        }
      });
  
  }

  onClaim() {
    console.log('--onClaim--', this.approval);
    this.approvalService.approvalAction(ApprovalConstants.status.text.CLAIMED, this.approval).subscribe(data => {
      if (data.resultCode === '0') {
        this.errorMessage = undefined;
              this.router.navigate(['../../'], {
                relativeTo: this.route, queryParams:
                  { status: ApprovalConstants.status.text.CLAIMED, feature: this.feature }
              });
      } else {
        this.errorMessage = data.resultDescription;
      }
    });
  }

  get showClaimed(): boolean {
    if (this.approval) {
      if (this.claimed || this.approval.status === ApprovalConstants.status.text.APPROVED) {
        return false;
      }
      return true;
    }
  }

  get showDisclaimed(): boolean {
    return this.claimed;
  }

  get showReject(): boolean {
    if (this.approval) {
      if (this.claimed && this.approval.status !== ApprovalConstants.status.text.APPROVED) {
        return true;
      } else {
        return false;
      }
      return true;
    }
  }

  get showApproved(): boolean {
    if (this.approval) {
      if (this.claimed && this.approval.status !== ApprovalConstants.status.text.APPROVED) {
        return true;
      } else {
        return false;
      }
      return true;
    }
  }
}
