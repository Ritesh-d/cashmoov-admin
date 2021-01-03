import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../guards/role.guard';
import { CreateOperatorComponent } from './createoperator/createoperator.component';
import { CreateServiceCategoryComponent } from './createservicecategory/create-service-category.component';
import { ServiceComponent } from './service/service.component';
 
  
 
 
const routes: Routes = [
    { path: '', component: ServiceComponent, pathMatch: "full" },
    { path: 'category', component: ServiceComponent },
    { path: 'category/add',   component: CreateServiceCategoryComponent },
    { path: 'category/add/:id',  component: CreateServiceCategoryComponent },
    { path: 'category/edit/:id',  component: CreateServiceCategoryComponent },
    { path: 'operator/add',  component: CreateOperatorComponent },
    { path: 'operator/add/:id',  component: CreateOperatorComponent },
    { path: 'operator/edit/:id',   component: CreateOperatorComponent },
    ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ServiceRoutingModule{}