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
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  dummy = Array(5);
  list: any[] = [];
  dummyList: any[] = [];
  page = 1;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    public cart: CartService
  ) {
    this.getOffers();
  }

  ngOnInit() {
  }

  getOffers() {
    // this.dummy = Array(5);
    this.api.get('offers').subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data.filter(x => x.status === '1');
        this.list = info;
        this.dummyList = info;
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
  }

  selected(item) {
    console.log(item);
    const min = parseFloat(item.min);
    if (this.cart.totalPrice >= min) {
      this.cart.coupon = item;
      this.util.publishCoupon(item);
      this.back();
    } else {
      console.log('not valid with minimum amout', min);
      this.util.showToast(this.util.getString('Sorry') + '\n' + this.util.getString('minimum cart value must be') + ' ' + min +
        ' ' + this.util.getString('or equal'), 'danger', 'bottom');
    }

  }

  getTime(time) {
    return moment(time).format('LLLL');
  }

}
