/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent {

  symbol: any;
  cside: any;
  direction: any;
  logo: any;
  delivery: any;
  user_login: any;
  store_login: any;
  driver_login: any;
  web_login: any;
  reset_pwd: any;

  constructor(
    public api: ApisService,
    private util: UtilService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private router: Router
  ) {
    this.getSettingOptions();
  }

  getSettingOptions() {
    this.spinner.show();
    this.api.get('galyon/v1/settings/getGroupOptions/setting').then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
          const info = response.data;
          this.symbol = info.currencySymbol;
          this.cside = info.currencySide;
          this.direction = info.appDirection;
          this.logo = info.logo;
          this.reset_pwd = info.reset_pwd;
          this.delivery = info.delivery;
          this.user_login = info.user_login;
          this.store_login = info.store_login;
          this.driver_login = info.driver_login;
          this.web_login = info.web_login;
      } else {
        this.util.error(response.message);
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  submit() {
    if (!this.symbol || this.symbol === '' || !this.cside || this.cside === '' || 
    !this.direction || this.direction === '' || !this.logo || this.logo === '' || 
    !this.delivery || this.delivery === '' || !this.reset_pwd || this.reset_pwd === '' || 
    !this.user_login || this.user_login === '' || !this.store_login || this.store_login === '' ||
    !this.driver_login || this.driver_login === '' || !this.web_login || this.web_login === '' ) {
      this.util.error('All Fields are required');
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/settings/saveGroupOptions/setting', {
      currencySymbol: this.symbol,
      currencySide: this.cside,
      appDirection: this.direction,
      logo: this.logo,
      delivery: this.delivery,
      user_login: this.user_login,
      store_login: this.store_login,
      driver_login: this.driver_login,
      web_login: this.web_login,
      reset_pwd: this.reset_pwd,
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.error('Updated successfully!');
      } else {
        this.util.error(response.message);
      }
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error('Something went wrong');
    });
  }

  preview_banner(files) {
    console.log('file-info', files);
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    if (files) {
      this.spinner.show();
      this.api.uploadFile(files).subscribe((data: any) => {
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
