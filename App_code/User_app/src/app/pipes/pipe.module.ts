/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/

import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate/translate.pipe';
import { CurrencyPipe } from './currency/currency.pipe';
@NgModule({
  declarations: [TranslatePipe, CurrencyPipe],
  imports: [],
  exports: [TranslatePipe, CurrencyPipe]
})
export class PipeModule { }
