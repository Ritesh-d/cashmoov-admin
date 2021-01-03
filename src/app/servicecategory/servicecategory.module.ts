import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceCategoryService } from './servicecategory.service';
import { ServiceRoutingModule } from './servicecategory-routing.module';
import { CreateServiceCategoryComponent } from './createservicecategory/create-service-category.component';
import { ServiceCategoryModalComponent } from './servicecategory-modal/servicecategory-modal.component';
import { ServiceComponent } from './service/service.component';
import { CreateOperatorComponent } from './createoperator/createoperator.component';
import { OperatorModalComponent } from './operator-modal/operator-modal.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

   @NgModule({
  declarations: [
         CreateServiceCategoryComponent,
         ServiceCategoryModalComponent,
         OperatorModalComponent,
         ServiceComponent,
         CreateOperatorComponent
     ],
  entryComponents: [ServiceCategoryModalComponent ,OperatorModalComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceRoutingModule,
    DataTablesModule,
    CalendarModule,
    TranslateModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [
    ServiceCategoryService
  ]
})
export class ServiceModule { }