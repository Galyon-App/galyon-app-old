/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { CurrencyPipe } from './currency.pipe';

describe('CurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
