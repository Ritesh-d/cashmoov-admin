import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { CountryComponent } from './country.component';
import { CreateRegionComponent } from './create-region/create-region.component';
import { CountryRegionComponent } from './country-region/country-region.component';
import { CountryCurrencyComponent } from './country-currency/country-currency.component';
import { CountryRemittanceComponent } from './country-remittance/country-remittance.component';

 
const routes: Routes = [
    { path: '', component: CountryComponent, pathMatch: "full" },
    { path: 'region', component: CountryRegionComponent },
    { path: 'region/add', component: CreateRegionComponent },
    { path: 'region/add/:id', component: CreateRegionComponent },
    { path: 'region/edit/:id', component: CreateRegionComponent },
    { path: 'currency', component: CountryCurrencyComponent},
    { path: 'remittance', component: CountryRemittanceComponent}
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class CountryRoutingModule{}