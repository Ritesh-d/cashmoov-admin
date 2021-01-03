import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from './feature.service';
import { CommonHelperService } from '../shared/services/common-helper-service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit {

  fetchingData = true;
  successMessage: undefined;
  dtOptions: any = {};
  features: any[];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private commonHelperService: CommonHelperService,
    private featureService: FeatureService) {

  }

  ngOnInit() {
    this.featureService.featuresByCriteria.subscribe(response => {
      this.fetchingData = false;
      this.features = response.featureList;
    });
    this.dtOptions = this.commonHelperService.settingDataTable();
  }

  errorMessage : string;
  takeAction(index: number) {
  
    this.featureService.featureUpdate(this.features[index].code,this.prepareRequest(index)).subscribe(response => {
       if(response.resultCode=="0")   {
        this.successMessage = response.resultDescription;

       }else{
        this.errorMessage = response.resultDescription;
       }
    });
  }
  prepareRequest(index){
    console.log(this.features[index].code, this.features[index].name, !this.features[index].approvalRequired);

    return {
      "name": this.features[index].name,
      "status": this.features[index].status,
      "featureTypeCode": this.features[index].featureTypeCode,
      "approvalRequired": !this.features[index].approvalRequired
    }
  }
}