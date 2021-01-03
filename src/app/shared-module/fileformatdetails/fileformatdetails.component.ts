import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fileformatdetails',
  templateUrl: './fileformatdetails.component.html',
  styleUrls: ['./fileformatdetails.component.css']
})
export class FileformatdetailsComponent {

  @Input() fileNameFormat: string;

  constructor() { }

}
