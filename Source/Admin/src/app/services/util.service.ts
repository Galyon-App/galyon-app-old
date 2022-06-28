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
  public cside: any = 'left';

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

  error(message, callback = null) {
    Swal.fire(
      'Something went wrong',
      message,
      'error'
    ).then(function() {
      if(callback != null) {
        callback();
      }
    });
  }

  success(message, callback = null) {
    Swal.fire(
      'Congratualtions!',
      message ? message : "Your request was sent and approved by the server.",
      'success'
    ).then(function() {
      if(callback != null) {
        callback();
      }
    });
    
  }

  showToast(toastServ: ToastyService, message = '', type = 'info', title = '') {
    const toastOptions: ToastOptions = {
      title: this.api.translate(title),
      msg: this.api.translate(message),
      showClose: true,
      timeout: 4000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added: '+message);
      },
      onRemove: () => {
        //console.log('Toast  has been removed!');
      }
    };
    
    if(type == 'success') {
      toastServ.success(toastOptions);
    } else if(type == 'warning') {
      toastServ.warning(toastOptions);
    } else if(type == 'error') {
      toastServ.error(toastOptions);
    } else {
      toastServ.info(toastOptions);
    }
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

  getSellPrice(item) {
    let discount: any = this.getDiscountText(item, true);
    discount = discount?parseFloat(discount):0;
    return (item.orig_price - discount).toFixed(2);
  }

  getDiscountText(item, with_price = false) {
    if(item && item.discount_type && item.discount ) {
      let discount = parseFloat(item.discount);
      if(discount > 0) {
        if(item.discount_type == 'percent') {
          if(with_price) {
            return parseFloat(item.orig_price)*(discount/100)
          } else {
            return discount +'%';
          }
        } else if(item.discount_type == 'fixed') {
          return this.currecny+discount +'off';
        }
      }      
    }

    return '';
  }

  getString(str) {
    // if (this.translations[str]) {
    //   return this.translations[str];
    // }
    return str;
  }

  safeText(title: string = '', length: number = null, end: any = '...', empty: string = '') {
    if(title && length) {
      if(title.length > length) {
        if(end === true) {
          end = '...';
        }
        return title.substring(0, length)+end;
      }
      return title;
    }
    return empty;
  }
}
