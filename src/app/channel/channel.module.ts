import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { ChannelService } from './channel.service';
import { ChannelRoutingModule } from './channel-routing.module';
import { ChannelComponent } from './channel.component';
import { EditChannelComponent } from './editchannel/editchannel.component';

@NgModule({
    declarations: [ChannelComponent,EditChannelComponent  ],
    entryComponents: [ ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ChannelRoutingModule,
      DataTablesModule,
      CalendarModule,
      TranslateModule,
      NgbModule.forRoot()
    ],
    providers: [
      ChannelService
    ]
  })
export class ChannelModule{}