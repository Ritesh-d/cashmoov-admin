import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { Options } from 'select2';
@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit, DoCheck {

  @Input('items')
  public itemList: any;
  @Input()
  public type: string;
  public options: Options;
  public _value: string[];

  @Output()
  public myEvent = new EventEmitter();
  
  set value(value: string[]) {
    this._value = value;
  }

  ngOnInit() {
    this.options = {
      width: '100%',
      multiple: true,
      tags: true
    };
  }

  ngDoCheck() {
    this.myEvent.emit({
      'type': this.type,
      'selected': this._value
    });
  }

}
