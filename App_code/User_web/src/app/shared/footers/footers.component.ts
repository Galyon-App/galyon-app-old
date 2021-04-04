/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
  twitter: any = '';
  youtube: any = '';
  playstore: any = '';
  email: any = '';

  year: any;
  constructor(
    private router: Router,
    public util: UtilService,
    private api: ApiService) {
    this.fb = environment.social.fb;
    this.twitter = environment.social.twitter;
    this.youtube = environment.social.youtube;
    this.playstore = environment.social.playstore;
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
