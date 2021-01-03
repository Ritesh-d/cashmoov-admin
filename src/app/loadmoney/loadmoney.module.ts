import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewLoadMoneyComponent } from './vieweloadmoney-model/viewloadmoney.component';
import { LoadMoneyComponent } from './searchloadmoney/searchloadmoney.component';
import { CreateLoadMoneyComponent } from './createloadmoney/createloadmoney.component';
import { LoadMoneyRoutingModule } from './routing.module';
import { LoadMoneyService } from './loadmoneyservice.service';
import { ImageViewerModule } from 'ng2-image-viewer';
@NgModule({
    declarations: [  LoadMoneyComponent,CreateLoadMoneyComponent,ViewLoadMoneyComponent],
    entryComponents: [ ViewLoadMoneyComponent ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      LoadMoneyRoutingModule,
      DataTablesModule,
      CalendarModule,
      TranslateModule,
      NgxPaginationModule,
      ImageViewerModule,
      NgbModule.forRoot()
    ],
    providers: [
      LoadMoneyService
    ]
  })
export class LoadMoneyModule{}