/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit {
  symbol: any;
  cside: any;
  direction: any;
  haveSave: boolean;
  logo: any;
  twillo: any;
  creds = {
    sid: '',
    token: '',
    from: ''
  };
  delivery: any;
  id: any;
  web_category: any = '';
  user_login: any;
  store_login: any;
  driver_login: any;
  web_login: any;
  reset_pwd: any;
  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private router: Router
  ) {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.api.auth(param).then((data) => {
      if (data !== true) {
        localStorage.removeItem('uid');
        this.router.navigate(['login']);
      }
    }, error => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    }).catch((error) => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    });
    this.getCurrennt();
  }

  ngOnInit(): void {
  }


  getCurrennt() {
    this.spinner.show();
    this.api.get('settings').then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        if (data && data.data && data.data.length) {
          this.haveSave = true;
          const info = data.data[0];
          this.id = info.id;
          this.symbol = info.currencySymbol;
          this.cside = info.currencySide;
          this.direction = info.appDirection;
          this.logo = info.logo;
          this.twillo = info.twillo;
          if (this.twillo === '1') {
            const creds = JSON.parse(info.creds);
            this.creds = creds;
          }
          this.delivery = info.delivery;
          this.user_login = info.user_login;
          this.store_login = info.store_login;
          this.driver_login = info.driver_login;
          this.web_login = info.web_login;
          this.reset_pwd = info.reset_pwd;
        }
        console.log(this);
      } else {
        this.haveSave = false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    });
  }

  error(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Error'),
      msg: this.api.translate(message),
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }

  success(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Success'),
      msg: this.api.translate(message),
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }


  submit() {

    if (!this.direction || this.direction === '' || !this.symbol || this.symbol === '' || !this.cside || this.cside === ''
    ) {
      this.error('All Fields are required');
      return false;
    }

    if (this.logo === '' || !this.logo) {
      this.error(this.api.translate('Please add image'));
      return false;
    }
    if (this.twillo === '1' || this.delivery === '1') {
      if (this.creds.from === '' || this.creds.sid === '' || this.creds.from === '') {
        this.error('All Fields are required');
        return false;
      }
    }
    console.log('all ok');
    if (this.haveSave) {
      console.log('update');

      const param = {
        currencySymbol: this.symbol,
        currencySide: this.cside,
        appDirection: this.direction,
        id: this.id,
        twillo: this.twillo,
        creds: JSON.stringify(this.creds),
        delivery: this.delivery,
        logo: this.logo,
        driver_login: this.driver_login,
        store_login: this.store_login,
        user_login: this.user_login,
        web_login: this.web_login,
        reset_pwd: this.reset_pwd
      };

      console.log('param', param);
      this.spinner.show();
      this.api.post('settings/editList', param).then((data: any) => {
        console.log('data', data);
        this.spinner.hide();
        if (data && data.status === 200) {
          this.success('status updated');
          this.haveSave = true;
        } else {
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      });


    } else {
      console.log('create');

      const param = {
        currencySymbol: this.symbol,
        currencySide: this.cside,
        appDirection: this.direction,
        twillo: this.twillo,
        creds: JSON.stringify(this.creds),
        delivery: this.delivery,
        logo: this.logo,
        driver_login: this.driver_login,
        store_login: this.store_login,
        user_login: this.user_login,
        web_login: this.web_login,
        reset_pwd: this.reset_pwd
      };

      console.log('param', param);
      this.spinner.show();
      this.api.post('settings/save', param).then((data: any) => {
        console.log('data', data);
        this.spinner.hide();
        if (data && data.status === 200) {
          this.success('status updated');
          this.haveSave = true;
          this.id = data.data.id;
        } else {
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      });

    }

  }

  preview_banner(files) {
    console.log('fle', files);
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    if (files) {
      console.log('ok');
      this.spinner.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        console.log('==>>', data);
        this.spinner.hide();
        if (data && data.status === 200 && data.data) {
          this.logo = data.data;
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }
}
