/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
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
