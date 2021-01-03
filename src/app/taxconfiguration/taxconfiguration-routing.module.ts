import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TaxConfigurationComponent } from './taxconfiguration.component';
import { EditTaxConfigurationComponent } from './edit/edittaxconfiguration.component';
import { AddTaxConfigurationComponent } from './add/addtaxconfiguration.component';
import { TaxTypeComponent } from './taxtype/taxtype.component';
 
const routes: Routes = [
    { path: '', component: TaxTypeComponent, pathMatch: "full" },
    { path: 'add', component: AddTaxConfigurationComponent },
    { path: 'edit', component: EditTaxConfigurationComponent },
    { path: 'taxtype' , component: TaxTypeComponent },
    {path: 'taxconfiguration', component:TaxConfigurationComponent}
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class TaxConfigurationRoutingModule{}