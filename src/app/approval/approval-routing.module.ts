import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalComponent } from './approval.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
    { path: '', component: ApprovalComponent, pathMatch: "full" },
    { path: 'approve/:id', component: DetailsComponent }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ApprovalRoutingModule{}