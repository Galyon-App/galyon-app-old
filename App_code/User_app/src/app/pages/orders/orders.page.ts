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
import { UtilService } from '../../services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  dummy: any[] = [];
  orders: any[] = [];
  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService,) {

  }

  ionViewWillEnter() {
    this.getOrders('', false);
  }
  getOrders(event, haveRefresh) {
    this.dummy = Array(15);
    this.orders = [];
    const param = {
      id: localStorage.getItem('uid')
    }
    this.api.post('orders/getByUid', param).subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data.length > 0) {
        // this.orders = data.data;
        const orders = data.data;
        orders.forEach(element => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders.forEach(order => {
              console.log(element.id, '=>', order.variations);
              if (order.variations && order.variations !== '' && typeof order.variations === 'string') {
                console.log('strings', element.id);
                order.variations = JSON.parse(order.variations);
                console.log(order['variant']);
                if (order["variant"] === undefined) {
                  order['variant'] = 0;
                }
              }
            });
          }

        });
        this.orders = orders;
        if (haveRefresh) {
          event.target.complete();
        }
        console.log('orderss==>?', this.orders);
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.orders = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  ngOnInit() {
  }

  openMenu() {
    this.util.openMenu();
  }

  goToOrder(val) {
    const navData: NavigationExtras = {
      queryParams: {
        id: val.id
      }
    }
    this.router.navigate(['/order-details'], navData);
  }

  doRefresh(event) {
    console.log(event);
    this.getOrders(event, true);
  }

}
