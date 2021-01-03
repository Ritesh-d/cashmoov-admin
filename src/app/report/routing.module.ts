import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgentAgeingReportComponent } from './agent-ageing/agent-ageing.component';

 
const routes: Routes = [
    { path: '', component: AgentAgeingReportComponent, pathMatch: "full" },
   
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ReportRoutingModule{}