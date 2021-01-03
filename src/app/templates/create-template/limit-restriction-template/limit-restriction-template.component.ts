import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-limit-restriction-template',
  templateUrl: './limit-restriction-template.component.html',
  styleUrls: ['./limit-restriction-template.component.css']
})
export class LimitRestrictionTemplateComponent implements OnInit {

  constructor(private router : Router,private route: ActivatedRoute) { }

  ngOnInit() {
  }

  navigateBack(){
    const firstPath = window.location.pathname.split('/')[1];
    this.router.navigate( ['../add'], {relativeTo: this.route} );
  }
}



