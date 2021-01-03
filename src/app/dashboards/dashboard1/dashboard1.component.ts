import { Component, AfterViewInit } from '@angular/core';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SessionMgtService } from '../../shared/services/SessionMgt.service';

declare var require: any;

const data: any = require('./data.json');

@Component({
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements AfterViewInit {
  subtitle: string;
  constructor(public translate: TranslateService,private sessionSerivce:SessionMgtService) {
    console.log('--Dashboard1Component--');
    this.subtitle = 'This is some text within a card block.';
  }
  ngAfterViewInit() {}
}
