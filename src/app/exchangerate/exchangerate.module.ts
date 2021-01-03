import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { ExchangerateRoutingModule } from './exchangerate-routing.module';
import { ExchangerateComponent } from './searchexchnagerate/exchangerate.component';
import { CreateExchangerateComponent } from './createexchangerate/createexchangerate.component';
import { ViewExchangerateComponent } from './viewexchangerate-model/viewexchangerate.component';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
    declarations: [  ExchangerateComponent,CreateExchangerateComponent,ViewExchangerateComponent],
    entryComponents: [ ViewExchangerateComponent ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ExchangerateRoutingModule,
      DataTablesModule,
      CalendarModule,
      TranslateModule,
      NgxPaginationModule,
      
      NgbModule.forRoot()
    ],
    providers: [
       
    ]
  })
export class ExchangerateModule{}