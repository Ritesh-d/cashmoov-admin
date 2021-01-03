import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
 
import { TranslateModule } from '@ngx-translate/core';
import { TaxConfigurationService } from './taxconfiguration.service';
import { TaxConfigurationComponent } from './taxconfiguration.component';
import { TaxConfigurationRoutingModule } from './taxconfiguration-routing.module';
import { ViewTaxConfigurationComponent } from './view/viewtaxconfiguration.component';
import { AddTaxConfigurationComponent } from './add/addtaxconfiguration.component';
import { EditTaxConfigurationComponent } from './edit/edittaxconfiguration.component';
import { TaxTypeComponent } from './taxtype/taxtype.component';

@NgModule({
    declarations: [TaxConfigurationComponent,AddTaxConfigurationComponent,EditTaxConfigurationComponent,ViewTaxConfigurationComponent,TaxTypeComponent ],
    entryComponents: [ViewTaxConfigurationComponent],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      TaxConfigurationRoutingModule,
      DataTablesModule,
      CalendarModule,
      TranslateModule,
      NgbModule.forRoot()
    ],
    providers: [
      TaxConfigurationService
    ]
  })
export class TaxConfigurationModule{}