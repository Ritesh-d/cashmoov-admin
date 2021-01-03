
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateFormatConstant } from '../../shared/models/dateformat';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {

    if (args && args === 'dateOnly') {
      return super.transform(value);
    }

    if (args && args === 'dateTime') {
      return super.transform(value, DateFormatConstant.DATE_TIME_FMT);
    }

    return super.transform(value, DateFormatConstant.DATE_FMT);
  }
}