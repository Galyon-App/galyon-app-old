/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalController, NavController, NavParams } from '@ionic/angular';
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
  fromPosPay: boolean = false;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    public cart: CartService,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {
    if(navParams.get('from') == 'pos-pay') {
      this.fromPosPay = true;
    }
    this.getOffers();
  }

  ngOnInit() {
  }

  getOffers() {
    // this.dummy = Array(5);
    this.api.get('offers').subscribe((data: any) => {
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
    if(this.fromPosPay) {
      this.modalCtrl.dismiss(null, 'close')
    } else {
      this.navCtrl.back();
    }
  }

  selected(item) {
    if(this.fromPosPay) {
      this.modalCtrl.dismiss(item, 'submit')
    } else {
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

  }

  getTime(time) {
    return moment(time).format('LLLL');
  }

}
