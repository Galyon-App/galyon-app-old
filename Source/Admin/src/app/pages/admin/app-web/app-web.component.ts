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
  selector: 'app-app-web',
  templateUrl: './app-web.component.html',
  styleUrls: ['./app-web.component.css']
})
export class AppWebComponent {

  email: any;
  mobile: any;
  address: any;
  state: any;
  zip: any;
  city: any;
  country: any;
  min: any;
  free: any;
  tax: any;
  shippingPrice: any;
  shippingBase: any;
  shipping: any = 'fixed';

  constructor(
    public api: ApisService,
    private util: UtilService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private router: Router
  ) {
    this.getGeneralSetting();
  }

  getGeneralSetting() {
    this.spinner.show();
    this.api.post('galyon/v1/settings/getGroupOptions/general', {
      limit_start: 0,
      limit_length: 100
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
          const info = response.data;
          this.address = info.address;
          this.city = info.city;
          this.country = info.country;
          this.email = info.email;
          this.free = info.free_delivery;
          this.min = info.minimum_order;
          this.mobile = info.phone;
          this.shippingBase = info.shippingBase;
          this.shippingPrice = info.shippingPrice;
          this.shipping = info.shipping;
          this.state = info.province;
          this.tax = info.tax;
          this.zip = info.zipcode;
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
    if (!this.email || this.email === '' || !this.mobile || this.mobile === '' || 
    !this.address || this.address === '' || !this.state || this.state === '' || 
    !this.zip || this.zip === '' || !this.city || this.city === '' || 
    !this.country || this.country === '' || !this.min || this.min === '' ||
    !this.free || this.free === '' || !this.tax || this.tax === '' || 
    !this.shippingPrice || this.shippingPrice === '' || !this.shipping || this.shipping === '') {
      this.util.error('All Fields are required');
      return false;
    }

    this.spinner.show();
    this.api.post('galyon/v1/settings/saveGroupOptions/general', {
      email: this.email,
      phone: this.mobile,
      address: this.address,
      province: this.state,
      zipcode: this.zip,
      city: this.city,
      country: this.country,
      minimum_order: this.min,
      free_delivery: this.free,
      tax: this.tax,
      shippingBase: this.shippingBase,
      shippingPrice: this.shippingPrice,
      shipping: this.shipping,
    }).then((response: any) => {
      this.spinner.hide();
      if (response && response.success && response.data) {
        this.util.success('Updated successfully!');
      } else {
        this.util.error(response.message);
      }
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.util.error('Something went wrong');
    });
  }
}
