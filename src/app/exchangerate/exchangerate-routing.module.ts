import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExchangerateComponent } from './searchexchnagerate/exchangerate.component';
import { CreateExchangerateComponent } from './createexchangerate/createexchangerate.component';
import { ViewExchangerateComponent } from './viewexchangerate-model/viewexchangerate.component';
 
const routes: Routes = [
    { path: '', component: ExchangerateComponent, pathMatch: "full" },
    { path: 'add', component: CreateExchangerateComponent },
    { path: 'edit', component: CreateExchangerateComponent },
    { path: 'view', component: ViewExchangerateComponent }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ExchangerateRoutingModule{}