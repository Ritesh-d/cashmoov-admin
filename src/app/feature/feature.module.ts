import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared-module.module';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatureComponent } from './feature.component';
import { FeatureRoutingModule } from './feature-routing.module';
import { FeatureService } from './feature.service';

@NgModule({
  declarations: [FeatureComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FeatureRoutingModule,
    DataTablesModule,
    TranslateModule,
    NgbModule.forRoot()
  ],
  providers: [
    FeatureService
  ]
})
export class FeatureModule { }