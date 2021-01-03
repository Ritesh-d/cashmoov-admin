import { Component, OnInit, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { TemplatesService } from './templates.service';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonHelperService } from '../shared/services/common-helper-service';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateTemplateService } from './create-template/create-template.service'
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  dtOptions: any = {};
  fetchingData = true;
  templates = [];
  successMessage: string;
  setPermission : any;

  constructor(private templatesService: TemplatesService, private modalService: NgbModal,
    private commonHelpetrService: CommonHelperService,
    private route: ActivatedRoute, private createTemplateService: CreateTemplateService,
    private router: Router) { }
  public data = [];
  public settings = {};
  public selectedItems = [];
  transTemplateCategories;
  viewTranstemplate; template;
  openModal(content, tmpcategory, tmpcode, template) {
    this.template = template;
    if (tmpcategory == 'Transaction') {
      this.templatesService.getTemplateDetails(tmpcode).subscribe(response => {
        this.viewTranstemplate = response;
        this.modalService.open(content, { windowClass: "myCustomModalClass" });
      })

    }
    else
      this.modalService.open(content, { windowClass: "myCustomModalClass" });
  }
  ngOnInit() {
    this.setPermission = this.templatesService.setPermission;
    this.showMessage();
    this.templatesService.allTemplates.subscribe(response => {
      this.fetchingData = false;
      this.templates = response.templateList;
      console.log('--this.templates--', this.templates);
      this.dtOptions = {
        paging: true,
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        empty: 'No data available in table',
        searching: true,
        order: [[4, "desc"]],
        language: {
          paginate: {
            next: "&#8594;",
            previous: "&#8592;"
          }

        }
      };

    });


    this.createTemplateService.getTransTemplateCategoryMasters().subscribe(result => {
      this.transTemplateCategories = result;

      this.transTemplateCategories = this.transTemplateCategories.transTypeList;
      console.log(this.transTemplateCategories);
      if (this.transTemplateCategories) {
        for (var i = 0; i < this.transTemplateCategories.length; i++) {
          var obj = { item_id: this.transTemplateCategories[i].code, item_text: this.transTemplateCategories[i].name }
          // this.data[i]['item_id']=this.transTemplateCategories.transTypeList[i].code;
          // this.data[i]['item_text']=this.transTemplateCategories.transTypeList[i].name;
          this.data.push(obj);
        }
      }
    })
  }

  private showMessage() {
    if (this.route.snapshot.queryParamMap.get('status') &&
      this.route.snapshot.queryParamMap.get('status').toString() === 'added') {
        if(this.templatesService.approvalRequired){
         this.successMessage = 'Template Added successfully';
        }else{
          this.successMessage = 'Template Added successfully';
        }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
    }
    if (this.route.snapshot.queryParamMap.get('status') &&
      this.route.snapshot.queryParamMap.get('status').toString() === 'updated') {
        if(this.templatesService.approvalRequired){
          this.successMessage = 'Template Updated successfully and sent for Approval';

         }else{
           this.successMessage = 'Template Updated successfully';
         }
    
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
    }
    if (this.route.snapshot.queryParamMap.get('status') &&
      this.route.snapshot.queryParamMap.get('status').toString() === 'transTemplateadded') {
      if(this.templatesService.approvalRequired){
        this.successMessage = 'Transaction Template Added successfully and sent for approval';


       }else{
         this.successMessage = 'Transaction Template Added successfully';
       }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
    }

    if (this.route.snapshot.queryParamMap.get('status') &&
      this.route.snapshot.queryParamMap.get('status').toString() === 'transTemplateupdated') {
      
      if(this.templatesService.approvalRequired){
        this.successMessage = 'Transaction Template Updated successfully and sent for approval';


       }else{
         this.successMessage = 'Transaction Template Updated successfully';
       }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
    }
    if (this.route.snapshot.queryParamMap.get('status') &&
      this.route.snapshot.queryParamMap.get('status').toString() === 'serviceadded') {
      if(this.templatesService.approvalRequired){
        this.successMessage = 'Service Template Added successfully , sent for approval';



       }else{
         this.successMessage = 'Service Template Updated successfully';
       }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
    }
    if (this.route.snapshot.queryParamMap.get('status') &&
      this.route.snapshot.queryParamMap.get('status').toString() === 'serviceupdated') {

      if(this.templatesService.approvalRequired){
        this.successMessage = 'Service Template Updated successfully , sent for approval';



       }else{
         this.successMessage = 'Service Template Template Updated successfully';
       }
      setTimeout(() => {
        this.successMessage = undefined;
      }, 5000);
    }

  }
  openTransTemplate(tempcode, tempname, state, template) {
    if (state == 'Approved')
      this.templatesService.getTemplateDetails(tempcode).subscribe(result => {
        console.log(result)
        var tmp = { code: tempcode, name: tempname, state: state, transtemplatelist: result, template: template };
        this.router.navigate(['./createTransactionTemplate'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp) } });
        // this.router.navigate(['./add'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } });

      })
    else {
      var tmp = { code: tempcode, name: tempname, state: state, template: template };
      this.router.navigate(['./createTransactionTemplate'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp) } });
      // this.router.navigate(['./add'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } });

    }
  }

  opentTemplate(tempcode, tempname, state, template) {
    if (state == 'Approved')
      this.templatesService.getTemplateDetails(tempcode).subscribe(result => {
        console.log(result)
        var tmp = { code: tempcode, name: tempname, state: state, transtemplatelist: result, template: template };
        // this.router.navigate(['./createTransactionTemplate'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } });
        this.router.navigate(['./add'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp) } });

      })
    else {
      var tmp = { code: tempcode, name: tempname, state: state, template: template };
      // this.router.navigate(['./createTransactionTemplate'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp:JSON.stringify(tmp) } });
      this.router.navigate(['./add'], { relativeTo: this.route, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp) } });

    }
  }
  openTemplate(template: any) {

    // this.router.navigate(['./add'], { relativeTo: this.route, queryParams: { template:JSON.stringify(template) , templateCase: 'update'}});    
    template.templateCase = 'update';
    this.router.navigate(['./add'], { relativeTo: this.route, skipLocationChange: true, queryParams: template });

  }
  openServiceTemplate(template: any) {


    var tmp = {
      code: template.code, name: template.name, state: template.state, walletOwnerCategoryName: template.walletOwnerCategoryName, templateCategoryName: template.templateCategoryName,
      walletOwnerCategoryCode: template.walletOwnerCategoryCode, templateCategoryCode: template.templateCategoryCode
    };
    if (template.templateCategoryCode == 100000) {
      this.router.navigate(['./createServiceTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'block' } });
    }
    else if (template.templateCategoryCode == 100002) {
      this.router.navigate(['./createFeeTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'block' } });

    }
    else if (template.templateCategoryCode == 100009) {
      this.router.navigate(['./createFeeCommisionTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'block' } });

    }
    else if (template.templateCategoryCode == 100008) {
      this.router.navigate(['./tranLimitTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'block' } });

    } else if (template.templateCategoryCode == 100010) {
      this.router.navigate(['./createIncentiveTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'block' } });

    }



  }
  viewServiceTemplate(template: any) {


    var tmp = { code: template.code, name: template.name, state: template.state, walletOwnerCategoryName: template.walletOwnerCategoryName,walletOwnerCategoryCode:template.walletOwnerCategoryCode, templateCategoryName: template.templateCategoryName };
    if (template.templateCategoryCode == 100000) {
      this.router.navigate(['./createServiceTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'none' } });
    }
    else if (template.templateCategoryCode == 100002) {
      this.router.navigate(['./createFeeTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'none' } });

    }
    else if (template.templateCategoryCode == 100009) {
      this.router.navigate(['./createFeeCommisionTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'none' } });

    }
    else if (template.templateCategoryCode == 100008) {
      this.router.navigate(['./tranLimitTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'none' } });

    } else if (template.templateCategoryCode == 100010) {
      this.router.navigate(['./createIncentiveTemplate'], { relativeTo: this.route, skipLocationChange: true, queryParams: { data: JSON.stringify(this.data), temp: JSON.stringify(tmp), display: 'none' } });

    }

  }




}