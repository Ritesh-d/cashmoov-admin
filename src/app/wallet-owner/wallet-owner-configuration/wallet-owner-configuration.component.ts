import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WalletOwnerCurrencyComponent } from './wallet-owner-currency/wallet-owner-currency.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wallet-owner-configuration',
  templateUrl: './wallet-owner-configuration.component.html',
  styleUrls: ['./wallet-owner-configuration.component.css']
})
export class WalletOwnerConfigurationComponent implements OnInit {
  walletOwner : any;
  constructor( private router: Router,private route: ActivatedRoute,private modalService: NgbModal) { }

     
  ngOnInit() {
      this.route.queryParams.subscribe((params: Params) => {
      console.log(' params ',params);
      if (params) {
        this.walletOwner= params;
        
      }
    });
  }
  currency(){

    const modalRef = this.modalService.open(WalletOwnerCurrencyComponent);
      modalRef.componentInstance.walletOwner = this.walletOwner;
  }
  onCancel(){
    this.router.navigate(['/wallet-owner'], { relativeTo: this.route });

  }

}
