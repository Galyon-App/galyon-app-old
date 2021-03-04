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
  selector: 'app-app-web',
  templateUrl: './app-web.component.html',
  styleUrls: ['./app-web.component.css']
})
export class AppWebComponent implements OnInit {
  id: any;
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
  lat: any;
  lng: any;
  shippingPrice: any;
  shipping: any = 'fixed';
  haveSave: boolean;
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
    this.api.get('general').then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        if (data && data.data && data.data.length) {
          this.haveSave = true;
          const info = data.data[0];
          this.id = info.id;
          this.address = info.address;
          this.city = info.city;
          this.country = info.country;
          this.email = info.email;
          this.free = info.free;
          this.min = info.min;
          this.mobile = info.mobile;
          this.shippingPrice = info.shippingPrice;
          this.shipping = info.shipping;
          this.state = info.state;
          this.tax = info.tax;
          this.zip = info.zip;
        }
      } else {
        this.haveSave = false;
      }

      console.log('havesave?', this.haveSave);
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
    if (!this.mobile || this.mobile === '' || !this.email || this.email === '' || !this.address || this.address === '' ||
      !this.city || this.city === '' || !this.state || this.state === '' || !this.zip || this.zip === '' || !this.country ||
      this.country === '' || !this.min || this.min === '' || !this.free || this.free === '' || !this.tax || this.tax === '' ||
      !this.shippingPrice || this.shippingPrice === '') {
      console.log('not ok');
      this.error('All Fields are required');
      return false;
    }
    if (this.haveSave) {
      console.log('update');
      const param = {
        mobile: this.mobile,
        email: this.email,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
        min: this.min,
        free: this.free,
        tax: this.tax,
        shipping: this.shipping,
        shippingPrice: this.shippingPrice,
        id: this.id
      };

      console.log('param', param);
      this.spinner.show();
      this.api.post('general/editList', param).then((data: any) => {
        console.log('data', data);
        this.spinner.hide();
        if (data && data.status === 200) {
          this.success('Setting updated');
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

      console.log('ok');

      const param = {
        mobile: this.mobile,
        email: this.email,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
        min: this.min,
        free: this.free,
        tax: this.tax,
        shipping: this.shipping,
        shippingPrice: this.shippingPrice
      };

      console.log('param', param);
      this.spinner.show();
      this.api.post('general/save', param).then((data: any) => {
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
}
