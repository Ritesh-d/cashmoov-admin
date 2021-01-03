import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
 
 
 
import { DragDropConnectedGroup } from './droplistdata.component';
const routes: Routes = [
    { path: '', component: DragDropConnectedGroup, pathMatch: "full" },
 
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class DragDropConnectedGroupRoutingModule{}

