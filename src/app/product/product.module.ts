import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { ProductRoutingModule } from './product-routing.module';
  import { NgxPaginationModule } from 'ngx-pagination';
import { CreateProductComponent } from './createproduct/createproduct.component';
import { ViewProductComponent } from './product-model/viewproduct.component';
import { ProductComponent } from './searchproduct/product.component';
@NgModule({
    declarations: [  ProductComponent,CreateProductComponent,ViewProductComponent],
    entryComponents: [ ViewProductComponent ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ProductRoutingModule,
      DataTablesModule,
      CalendarModule,
      TranslateModule,
      NgxPaginationModule,
      
      NgbModule.forRoot()
    ],
    providers: [
       
    ]
  })
export class ProductModule{}