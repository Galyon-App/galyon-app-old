/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css']
})
export class ManageAdminComponent implements OnInit {
  cities: any[] = [];
  new: boolean;
  id: any;
  fname: any = '';
  lname: any = '';
  email: any = '';
  password: any = '';
  mobile: any;
  city: any;
  coverImage: any = '';
  status: any = '';
  address: any = '';
  lat: any = '';
  others: any = '';
  lng: any = '';
  gender: any = '1';

  imageUrl: any;

  mobileCcode: any = '91';
  constructor(
    private route: ActivatedRoute,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location,
    private router: Router,
    public util: UtilService
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
    this.route.queryParams.subscribe((data: any) => {
      this.new = data.register === 'true' ? true : false;
      if (!this.new && data.id) {
        this.id = data.id;
        this.getAdmin();
      }
    });

  }

  getAdmin() {
    const param = {
      id: this.id
    };
    this.spinner.show();
    this.api.post('users/getById', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200 && data.data.length) {
        const info = data.data[0];
        this.fname = info.first_name;
        this.lname = info.last_name;
        this.email = info.email;
        this.city = info.city;
        this.gender = info.gender;
        this.coverImage = info.cover;
        this.imageUrl = this.api.mediaURL + this.coverImage;
        this.mobile = info.mobile;
        this.others = info.others;
        this.lat = info.lat;
        this.lng = info.lng;
        this.address = info.address;
      } else {
        this.error('Something went wrong');
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    });
  }

  ngOnInit(): void {

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

  create() {
    console.log('--->>', this.mobileCcode);
    if (this.email === '' || this.password === '' || this.fname === '' || this.lname === '' || this.gender === '' ||
      this.mobile === '' || !this.mobile) {
      this.error('All Fields are required');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.error('Please enter valid email');
      return false;
    }

    this.spinner.show();

    this.lat = '';
    this.lng = '';
    console.log('----->', this.lat, this.lng);

    const param = {
      first_name: this.fname,
      last_name: this.lname,
      gender: 1,
      email: this.email,
      password: this.password,
      type: 'admin',
      status: 1,
      lat: '0',
      lng: '0',
      cover: 'NA',
      mobile: this.mobile,
      verified: 1,
      fcm_token: 'NA',
      others: '1',
      date: moment().format('YYYY-MM-DD'),
      stripe_key: '',
      country_code: '+' + this.mobileCcode
    };

    this.spinner.show();
    this.api.post('users/registerUser', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.data && data.status === 200) {
        this.navCtrl.back();
      } else {
        if (data && data.data && data.data.message) {
          this.error(data.data.message);
          return false;
        }
        this.error(data.message);
        return false;
      }
    });


  }


  update() {

    if (this.fname === '' || this.lname === '' || this.gender === '' ||
      this.mobile === '' || !this.mobile) {
      this.error('All Fields are required');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.error('Please enter valid email');
      return false;
    }

    this.spinner.show();

    this.lat = '';
    this.lng = '';
    console.log('----->', this.lat, this.lng);

    const param = {
      first_name: this.fname,
      last_name: this.lname,
      gender: this.gender,
      lat: this.lat,
      lng: this.lng,
      mobile: this.mobile,
      others: this.others,
      id: this.id
    };

    this.api.post('users/edit_profile', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.data && data.status === 200) {
        this.navCtrl.back();
      } else {
        if (data && data.data && data.data.message) {
          this.error(data.data.message);
          this.navCtrl.back();
          return false;
        }
        this.navCtrl.back();
        this.error(data.message);
        return false;
      }
    });

  }


}
