/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UtilService {

  report: any;
  private ejectMessages = new Subject<any>();
  private langs = new Subject<any>();
  public general: any;
  public languages: any[] = [];
  public currecny: any = '$';
  public cside: any = 'right';
  public countrys = [
    {
      country_code: 'PH',
      country_name: 'Philippines',
      dialling_code: '63'
    },
  ];
  constructor(

  ) { }


  setReport(data) {
    this.report = data;
  }

  ejectMsg() {
    this.ejectMessages.next();
  }

  successEject(): Subject<any> {
    return this.ejectMessages;
  }

  ejectLangs() {
    this.langs.next();
  }

  subLangs(): Subject<any> {
    return this.langs;
  }

  getReport() {
    return this.report;
  }

  getCurrencyCode() {
    return environment.general.code;
  }

  getCurrecySymbol() {
    return environment.general.symbol;
  }
}
