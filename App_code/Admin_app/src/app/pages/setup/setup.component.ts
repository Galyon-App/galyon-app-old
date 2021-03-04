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
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  email: any = '';
  password: any = '';
  first_name: any = '';
  last_name: any = '';
  mobile: any = '';
  ip: any;
  appName: any;
  mobileCcode: any = '91';
  constructor(
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient,
    private title: Title,
    public util: UtilService
  ) {
    this.getIP().then(data => {
      console.log(data);
      this.ip = data;
    }).catch(error => {
      console.log(error);
    });
    this.appName = this.title.getTitle();
  }

  ngOnInit(): void {
  }
  login() {
    console.log('mobileCcode ', this.mobileCcode);
    if (!this.first_name || !this.last_name || this.first_name === '' || this.last_name === ''
      || !this.email || this.email === '' || !this.password || this.password === '' || !this.mobile || this.mobile === '') {
      this.error('All Fields are required');
      return false;
    }

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error('Please enter valid email');
      return false;
    }

    console.log('OK');
    const param = {
      first_name: this.first_name,
      last_name: this.last_name,
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
      console.log('datas', data);
      this.spinner.hide();
      if (data && data.status === 200) {
        localStorage.setItem('uid', 'admin');
        localStorage.setItem('type', 'admin');
        this.postLicense();
        this.router.navigate(['']);
      } else if (data && data.status === 500) {
        if (data.data && data.data.message) {
          this.error(data.data.message);
        } else {
          this.error(this.api.translate('Something went wrong'));
        }
      } else {
        this.error(this.api.translate('Something went wrong'));
      }

    }).catch(error => {
      this.spinner.hide();
      console.log('errror', error);
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

  getIP(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get('http://api.ipify.org/?format=json').subscribe((res: any) => {
        resolve(res.ip);
      }, error => {
        reject(error);
      });
    });
  }

  postLicense() {
    const param = {
      name: 'groceryee',
      title: this.appName,
      ip: this.ip
    };
    const params = this.api.JSON_to_URLEncoded(param);
    console.log(params);
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    };
    this.http.post('https://initappz.com/license/index.php/basics/save', params, header).subscribe((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }
}
