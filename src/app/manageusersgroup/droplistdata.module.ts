import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DragDropConnectedGroup } from './droplistdata.component';
import { DragDropConnectedGroupRoutingModule } from './droplistdata-routing.module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { DroplistDataService } from './droplistdata.service';
import { TranslateModule } from '@ngx-translate/core';
 
@NgModule({

    declarations: [ DragDropConnectedGroup],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      DragDropConnectedGroupRoutingModule,
      DataTablesModule,
      DragDropModule,
      TranslateModule,
      NgbModule.forRoot()
    ],
    providers: [
      DroplistDataService
    ],
    exports:[
      CdkStepperModule,
      CdkTableModule,
      CdkTreeModule,
      DragDropModule,
      ScrollingModule
    ]
  })
export class DragDropConnectedGroupModel{}