import { Component, OnInit, PipeTransform, Pipe, Output, Input, EventEmitter, setTestabilityGetter, ViewChild } from '@angular/core';
import { UserModel } from '../user.model';
import { UserService } from '../user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { viewModalComponent } from '../view-modal/viewmodal.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Endpoints } from '../../shared/endpoints';
import { UserConstants } from '../user.constant';
import { CommonHelperService } from '../../shared/services/common-helper-service';


@Component({
  selector: 'app-userlist',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponentList implements OnInit {
  @Input() users: any;
  @Input() displaytable;
  @Input() fetchingData;
  dtOption: any = {};
  roles: any[];
  filterOptions: any[];
  searchUserForm: FormGroup;
  setPermission: any;
  // @ViewChild(DataTableDirective,{static:false}) dtElement: DataTableDirective;
  // dtOptions: any = {};
  // dtTrigger: Subject<any> = new Subject();

  constructor(private userService: UserService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private commonHelperService: CommonHelperService,
    private router: Router) {
  }

  ngOnInit() {
    this.setPermission = this.userService.setPermission;

     this.callOnLoad();
  }

  async callOnLoad() {
   
    this.userService.roleMaster().subscribe(data => {
      console.log(data)
      this.roles = data.roleList;
    })

    this.dtOption = this.commonHelperService.settingDataTable();
    this.dtOption  = {... this.dtOption , order:[[5, 'desc']] };

 
    this.displaytable = true;
    this.fetchingData = false;
    
   
    }

  viewUser(user: any) {
    const modalRef = this.modalService.open(viewModalComponent);
    modalRef.componentInstance.user = user;
   //this.router.navigate( ['view', userid], {relativeTo: this.route} );
  }

  editUser(user: any) {
    this.router.navigate(['edit', user], { queryParams: user, skipLocationChange: true, relativeTo: this.route });
  }
  deleteUser(userid: any) {
    console.log('delete called');
    const index: number = this.users.indexOf(userid);
    console.log('delete called' + index);
    this.users.splice(index, 1);
  }



}
