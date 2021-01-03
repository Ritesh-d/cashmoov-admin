import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EditChannelComponent } from './editchannel/editchannel.component';
import { ChannelComponent } from './channel.component';
 
const routes: Routes = [
    { path: '', component: ChannelComponent, pathMatch: "full" },
 
    { path: 'edit', component: EditChannelComponent }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ChannelRoutingModule{}