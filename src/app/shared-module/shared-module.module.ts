import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleRoutingModule } from './shared-module-routing.module';
import { DateFormatPipe } from './dateformatpipe/customdateformat.pipe';
import { ModalModule} from 'ngx-bootstrap/modal';
import { AlertComponent } from './alert/alert.component';
import { FileformatdetailsComponent } from './fileformatdetails/fileformatdetails.component'
@NgModule({
  imports: [
    CommonModule,
    SharedModuleRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [DateFormatPipe , AlertComponent, FileformatdetailsComponent],
  exports:[DateFormatPipe , AlertComponent, FileformatdetailsComponent],
  providers:[DateFormatPipe
  ]

})
export class SharedModule { }
