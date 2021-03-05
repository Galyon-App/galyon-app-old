/*
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  App Name : Galyon App
  Created : 01-Sep-2020
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
