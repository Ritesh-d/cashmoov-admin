import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRegionComponent } from './create-region/create-region.component';
import { RegionModalComponent } from './region-modal/region-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { CountryComponent } from './country.component';
import { CountryRoutingModule } from './country-routing.module';
import { CountryService } from './country.service';
import { CurrencyModalComponent } from './currency-modal/currency-modal.component';
import { CurrencyService } from './currency-modal/currency.service';
import { CountryRegionComponent } from './country-region/country-region.component';
import { CountryCurrencyComponent } from './country-currency/country-currency.component';
import { CountryRemittanceComponent } from './country-remittance/country-remittance.component';
@NgModule({
  declarations: [CountryComponent,
    CreateRegionComponent,
    RegionModalComponent,
    CurrencyModalComponent,
    CountryRegionComponent,
    CountryCurrencyComponent,
    CountryRemittanceComponent],
  entryComponents: [RegionModalComponent, CurrencyModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CountryRoutingModule,
    DataTablesModule,
    CalendarModule,
    TranslateModule,
    NgbModule.forRoot()
  ],
  providers: [
    CurrencyService
  ]
})
export class CountryModule { }