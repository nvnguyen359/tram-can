import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatValue'
})
export class FormatValuePipe implements PipeTransform {

  transform(value: any): string {
    if (value == undefined) return value;
    if (this.isNumeric(value)) {
      return parseInt(value).toLocaleString('vi');
    } else {
      if (new Date(value).toString() != "Invalid Date") {
        return new Date(value).toLocaleDateString("vi");
      } else {
        return value;
      }
    }
  }
  isNumeric(str: any) {
    return /^-?\d+$/.test(str);
  }
  isValidDate(d: any) {
    return d instanceof Date;
  }
}
