import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreatetransferComponent } from './createtransfer/createtransfer.component';
 
 
 
const routes: Routes = [
    { path: '', component: CreatetransferComponent, pathMatch: "full" },
    { path: 'add', component: CreatetransferComponent }, 
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class WallettransferRoutingModule{}