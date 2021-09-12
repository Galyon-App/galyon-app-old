/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { ApisService } from 'src/app/services/apis.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  report: any;
  private ejectMessages = new Subject<any>();
  public translations: any[] = [];

  public appClosed: boolean;

  public appClosedMessage: any = '';

  public direction: any;
  public currecny: any = '₱';
  public cside: any = 'right';

  public appPages: any[] = [];

  public general: any;
  public languages: any[] = [];
  public user_login: any = '0';
  public reset_pwd: any = '0';

  private langs = new Subject<any>();
  public countrys = [
    {
      country_code: 'PH',
      country_name: 'Philippines',
      dialling_code: '63'
    },
  ];
  constructor(
    private toastyService: ToastyService,
    public api: ApisService,
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

  error(message) {
    Swal.fire(
      'Something went wrong',
      message,
      'error'
    );
    // const toastOptions: ToastOptions = {
    //   title: this.api.translate('Error'),
    //   msg: this.api.translate(message),
    //   showClose: true,
    //   timeout: 2000,
    //   theme: 'default',
    //   onAdd: (toast: ToastData) => {
    //     console.log('Toast ' + toast.id + ' has been added: '+message);
    //   },
    //   onRemove: () => {
    //     console.log('Toast  has been removed!');
    //   }
    // };
    // // Add see all possible types in one shot
    // this.toastyService.error(toastOptions);
  }

  success(message) {
    Swal.fire(
      'Congratualtions!',
      message ? message : "Your request was sent and approved by the server.",
      'success'
    );
    // const toastOptions: ToastOptions = {
    //   title: this.api.translate('Success'),
    //   msg: this.api.translate(message),
    //   showClose: true,
    //   timeout: 2000,
    //   theme: 'default',
    //   onAdd: (toast: ToastData) => {
    //     console.log('Toast ' + toast.id + ' has been added: '+message);
    //   },
    //   onRemove: () => {
    //     console.log('Toast  has been removed!');
    //   }
    // };
    // // Add see all possible types in one shot
    // this.toastyService.success(toastOptions);
  }

  changeLng(item) {
    console.log(item);
    localStorage.setItem('language', item.file);
    window.location.reload();
  }

  jwtDecode(token: string) {
    const jwt = new JwtHelperService();
    return jwt.decodeToken(token);
  }

  getString(str) {
    // if (this.translations[str]) {
    //   return this.translations[str];
    // }
    return str;
  }
}
