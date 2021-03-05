/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
*/
import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private util: UtilService) {

  }
  transform(str: string) {
    const value = this.util.translations[str];
    console.log('valueeee', value);
    if (value && value !== undefined) {
      return this.util.translations[str];
    }
    return str;
  }

}
