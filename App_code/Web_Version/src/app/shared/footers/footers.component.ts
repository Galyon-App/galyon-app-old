/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-footers',
  templateUrl: './footers.component.html',
  styleUrls: ['./footers.component.scss']
})
export class FootersComponent implements OnInit {

  fb: any = '';
  insta: any = '';
  twitter: any = '';
  ll: any = '';
  email: any = '';

  year: any;
  constructor(
    private router: Router,
    public util: UtilService,
    private api: ApiService) {
    this.fb = environment.social.fb;
    this.insta = environment.social.insta;
    this.twitter = environment.social.twitter;
    this.ll = environment.social.linkedIn;
    this.year = moment().format('YYYY');

  }

  ngOnInit(): void {
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToOrders() {
    if (this.util && this.util.userInfo && this.util.userInfo.first_name) {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'order']);
    } else {
      this.util.publishModalPopup('login');
    }

  }

  goToAccount() {
    if (this.util && this.util.userInfo && this.util.userInfo.first_name) {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'profile']);
    } else {
      this.util.publishModalPopup('login');
    }
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }

  goToPrivacy() {
    this.router.navigate(['/privacy-policy']);
  }

  goToContact() {
    this.router.navigate(['/contact']);
  }

  goToRefund() {
    this.router.navigate(['/refund-policy']);
  }

  goToHelp() {
    this.router.navigate(['/help']);
  }

  about() {
    this.router.navigate(['about']);
  }

  subscribe() {
    if (!this.email || this.email === '') {
      return false;
    }
    const param = {
      email: this.email,
      timestamp: moment().format('YYYY-MM-DD')
    }
    this.util.start();
    this.api.post('users/registerSubscriber', param).then((data) => {
      console.log(data);
      this.util.stop();
      this.util.suucessMessage(this.util.translate('Added'));
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch((error) => {
      console.log(error);
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
    })
  }

  //
}
