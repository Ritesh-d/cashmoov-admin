import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateLoadMoneyComponent } from './createloadmoney/createloadmoney.component';
import { ViewLoadMoneyComponent } from './vieweloadmoney-model/viewloadmoney.component';
import { LoadMoneyComponent }  from './searchloadmoney/searchloadmoney.component';
 
 
 
const routes: Routes = [
    { path: '', component: LoadMoneyComponent, pathMatch: "full" },
    { path: 'add', component: CreateLoadMoneyComponent },
    { path: 'edit', component: CreateLoadMoneyComponent },
    { path: 'view', component: ViewLoadMoneyComponent }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class LoadMoneyRoutingModule{}