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
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';
import * as moment from 'moment';

@Component({
  selector: 'app-instamojocallback',
  templateUrl: './instamojocallback.component.html',
  styleUrls: ['./instamojocallback.component.scss']
})
export class InstamojocallbackComponent implements OnInit {

  status: any;
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log('=======================>', data);
      this.status = data.status;
      if (data && data.payment_status && data.payment_id) {
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(localStorage.getItem('cartItems'))) {

          this.cart.cart = JSON.parse(localStorage.getItem('cartItems'));
          this.cart.deliveryAt = localStorage.getItem('deliveryAt');
          this.cart.datetime = localStorage.getItem('datetime');
          this.cart.totalPrice = localStorage.getItem('totalPrice');
          this.cart.orderTax = localStorage.getItem('orderTax');
          this.cart.grandTotal = localStorage.getItem('grandTotal');
          this.cart.deliveryPrice = localStorage.getItem('deliveryPrice');
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(localStorage.getItem('appliedCoupon'))) {
            this.cart.coupon = JSON.parse(localStorage.getItem('appliedCoupon'))
          } else {
            this.cart.coupon = null;
          }
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(localStorage.getItem('userOrderTaxByStores'))) {
            this.cart.userOrderTaxByStores = JSON.parse(localStorage.getItem('userOrderTaxByStores'))
          } else {
            this.cart.userOrderTaxByStores = [];
          }
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(localStorage.getItem('selectedAddress'))) {
            this.cart.deliveryAddress = JSON.parse(localStorage.getItem('selectedAddress'))
          } else {
            this.cart.deliveryAddress = null;
          }

          this.cart.discount = localStorage.getItem('discount');

          console.log('cart instance calcuatelllll,,,,,', this.cart);
          this.createOrder('instamojo', data.payment_id);
        } else {
          console.log('somerthing went wrong');
          localStorage.removeItem('cartItems');
          localStorage.removeItem('deliveryAt');
          localStorage.removeItem('datetime');
          localStorage.removeItem('totalPrice');
          localStorage.removeItem('orderTax');
          localStorage.removeItem('grandTotal');
          localStorage.removeItem('deliveryPrice');
          localStorage.removeItem('appliedCoupon');
          localStorage.removeItem('userOrderTaxByStores');
          localStorage.removeItem('discount');
          localStorage.removeItem('selectedAddress');
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }

      } else {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('deliveryAt');
        localStorage.removeItem('datetime');
        localStorage.removeItem('totalPrice');
        localStorage.removeItem('orderTax');
        localStorage.removeItem('grandTotal');
        localStorage.removeItem('deliveryPrice');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('userOrderTaxByStores');
        localStorage.removeItem('discount');
        localStorage.removeItem('selectedAddress');
        this.util.errorMessage(this.util.translate('Something went wrong'));
        this.router.navigate(['']);
      }
    });
  }

  async createOrder(payMethod, payKey) {
    //////////// new
    //////////// new

    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      };
      orderStatus.push(info);
    });
    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];
    this.cart.deliveryAt = this.cart.deliveryAt ? this.cart.deliveryAt : '';
    const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId.join(),
      date_time: this.cart.datetime === 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: payMethod,
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
      pay_key: payKey,
      status: JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores)
    };

    console.log('param----->', param);

    this.util.start();
    this.api.post('orders/save', param).then((data: any) => {
      console.log(data);
      this.util.stop();
      localStorage.removeItem('cartItems');
      localStorage.removeItem('deliveryAt');
      localStorage.removeItem('datetime');
      localStorage.removeItem('totalPrice');
      localStorage.removeItem('orderTax');
      localStorage.removeItem('grandTotal');
      localStorage.removeItem('deliveryPrice');
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('userOrderTaxByStores');
      localStorage.removeItem('discount');
      localStorage.removeItem('selectedAddress');
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.api.createOrderNotification(this.cart.stores);
      this.cart.clearCart();
      this.util.publishNewOrder();
      // this.router.navigate(['orders']);
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'order']);
    }, error => {
      console.log(error);
      this.util.stop();
      localStorage.removeItem('cartItems');
      localStorage.removeItem('deliveryAt');
      localStorage.removeItem('datetime');
      localStorage.removeItem('totalPrice');
      localStorage.removeItem('orderTax');
      localStorage.removeItem('grandTotal');
      localStorage.removeItem('deliveryPrice');
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('userOrderTaxByStores');
      localStorage.removeItem('discount');
      localStorage.removeItem('selectedAddress');
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch((error) => {
      console.log(error);
      this.util.stop();
      localStorage.removeItem('cartItems');
      localStorage.removeItem('deliveryAt');
      localStorage.removeItem('datetime');
      localStorage.removeItem('totalPrice');
      localStorage.removeItem('orderTax');
      localStorage.removeItem('grandTotal');
      localStorage.removeItem('deliveryPrice');
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('userOrderTaxByStores');
      localStorage.removeItem('discount');
      localStorage.removeItem('selectedAddress');
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }
  ngOnInit(): void {
  }

}
