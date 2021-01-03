import { Component, OnInit } from '@angular/core';
import { GroupsService } from './groups.service';
import { ActivatedRoute } from '@angular/router';
import { CommonHelperService } from '../shared/services/common-helper-service';
import {TranslatelanguageService} from '../shared/services/translatelanguage.service'; 

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  fetchingData = true;
  groups: any[] = [];
  dtOptions: any = {};
  successMessage: string;
  setPermission: any;
  // TODO : take it from configuration
  public static BLANK_VALUE = '-';

  constructor(private groupsService: GroupsService,
    private translate: TranslatelanguageService,
    private commonHelperService: CommonHelperService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.setPermission = this.groupsService.setPermission;
    this.showMessage();
    this.groupsService.allGroups.subscribe(response => {
      this.fetchingData = false;
      // this.groups = response.groupList;
      response.groupList.forEach(element => {
        element.regionName = this.returnDefaultValue(element.regionName);
        element.regionalAreaName = this.returnDefaultValue(element.regionalAreaName);
        element.governorateName = this.returnDefaultValue(element.governorateName);
        this.groups.push(element);
      });
      this.dtOptions = this.commonHelperService.settingDataTable();
    });
  }

  private returnDefaultValue(value: any) {
    return (value === '' ? GroupsComponent.BLANK_VALUE : value);
  }

  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status') &&
      this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
      //this.successMessage = 'Group Added successfully';
      this.translate.languageText('GROUPS.groupAddedsuccessfully', data=> {
        this.successMessage=data;
      });
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
    }
  }

}