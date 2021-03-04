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
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import swal from 'sweetalert2';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import * as moment from 'moment';
@Component({
  selector: 'app-stripe-payments',
  templateUrl: './stripe-payments.page.html',
  styleUrls: ['./stripe-payments.page.scss'],
})
export class StripePaymentsPage implements OnInit {

  cards: any[] = [];
  token: any;
  paykey: any;
  constructor(
    private router: Router,
    private api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    public cart: CartService
  ) {
    // const items = this.cart.cart;
  }

  ngOnInit() {
  }

  getCards() {
    console.log(this.util.userInfo.stripe_key);
    this.api.httpGet('https://api.stripe.com/v1/customers/' + this.util.userInfo.stripe_key +
      '/sources?object=card', this.util.stripe).subscribe((cards: any) => {
        console.log(cards);
        if (cards && cards.data) {
          this.cards = cards.data;
          this.token = this.cards[0].id;
        }
      }, (error) => {
        console.log(error);
        if (error && error.error && error.error.error && error.error.error.message) {
          this.util.showErrorAlert(error.error.error.message);
          return false;
        }
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
  }

  payment() {
    console.log('place order');

    swal.fire({
      title: this.util.getString('Are you sure?'),
      text: this.util.getString('Orders once placed cannot be cancelled and are non-refundable'),
      icon: 'question',
      confirmButtonText: this.util.getString('Yes'),
      cancelButtonText: this.util.getString('cancel'),
      showCancelButton: true,
      backdrop: false,
      background: 'white'
    }).then((data) => {
      console.log(data);
      if (data && data.value) {
        console.log('go to procesed,,');
        const options = {
          amount: this.cart.grandTotal * 100,
          currency: this.util.stripeCode,
          customer: this.util.userInfo.stripe_key,
          card: this.token,
        };
        console.log('options', options);
        const url = 'https://api.stripe.com/v1/charges';
        this.util.show();
        this.api.externalPost(url, options, this.util.stripe).subscribe((data: any) => {
          console.log('------------------------->', data);
          this.paykey = data.id;
          this.util.hide();
          this.util.showToast(this.util.getString('Payment Success'), 'success', 'bottom');
          this.createOrder();
        }, (error) => {
          this.util.hide();
          console.log(error);
          this.util.hide();
          if (error && error.error && error.error.error && error.error.error.message) {
            this.util.showErrorAlert(error.error.error.message);
            return false;
          }
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      }
    });
  }

  async createOrder() {
    // 2020-07-23 14:09:19
    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      }
      orderStatus.push(info)
    });
    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];
    const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId.join(),
      date_time: this.cart.datetime === 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: 'stripe',
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart),
      notes: JSON.stringify(notes),
      address: this.cart.deliveryAt === 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      driver_id: '',
      total: this.cart.totalPrice,
      tax: this.cart.orderTax,
      grand_total: this.cart.grandTotal,
      delivery_charge: this.cart.deliveryPrice,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: '',
      status: JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores)
    }

    console.log('param----->', param);

    this.util.show();
    this.api.post('orders/save', param).subscribe((data: any) => {
      console.log(data);
      this.util.hide();
      this.api.createOrderNotification(this.cart.stores);
      this.cart.clearCart();
      this.util.publishNewOrder();
      this.navCtrl.navigateRoot(['/tabs/orders']);
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
    });
  }

  onAdd() {
    this.router.navigate(['tabs/cart/add-card']);
  }

  back() {
    this.navCtrl.back();
  }

  changeMethod(id) {
    this.token = id;
  }

  ionViewWillEnter() {
    if (this.util.userInfo && this.util.userInfo.stripe_key) {
      this.getCards();
    }

  }
}
