import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';

const routes: Routes = [
    { path: '', component: GroupsComponent, pathMatch: "full" },
    { path: 'create', component: CreateGroupComponent }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class GroupsRoutingModule{}