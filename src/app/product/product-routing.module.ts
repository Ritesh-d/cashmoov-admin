import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './searchproduct/product.component';
import { CreateProductComponent } from './createproduct/createproduct.component';
import { ViewProductComponent } from './product-model/viewproduct.component';
    
const routes: Routes = [
    { path: '', component: ProductComponent, pathMatch: "full" },
    { path: 'add', component: CreateProductComponent },
    { path: 'edit', component: CreateProductComponent },
    { path: 'view', component: ViewProductComponent }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ProductRoutingModule{}