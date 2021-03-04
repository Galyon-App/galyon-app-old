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
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  segId: any = 1;
  orders: any[] = [];
  oldOrders: any;
  olders: any[] = [];
  limit: any;
  dummy = Array(50);
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.getOrder();
    this.util.subscribeOrder().subscribe((data) => {
      this.getOrders('', false);
    });
    // getByDriverId
  }
  getOrder() {
    this.segId = 1;
    this.orders = [];
    this.oldOrders = [];
    this.dummy = Array(50);
    this.getOrders('', false);
  }
  ngOnInit() {
  }

  getOrders(event, haveRefresh) {
    this.dummy = Array(50);
    this.limit = 1;
    const param = {
      id: localStorage.getItem('uid')
    };
    this.oldOrders = [];
    this.orders = [];
    this.api.post('orders/getByDriverId', param).subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data.length > 0) {
        data.data.forEach(async (element, index) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const assinee = JSON.parse(element.assignee);
              const storeInfo = assinee.filter(x => x.driver === localStorage.getItem('uid'));
              if (storeInfo && storeInfo.length) {
                const storeStatus = JSON.parse(element.status);

                const orderStatus = storeStatus.filter(x => x.id === storeInfo[0].assignee);

                if (orderStatus && orderStatus.length) {
                  element.orders.forEach(order => {

                    if (order.variations && order.variations !== '' && typeof order.variations === 'string') {

                      order.variations = JSON.parse(order.variations);

                      if (order["variant"] === undefined) {
                        order['variant'] = 0;
                      }
                    }
                  });
                  const stat = orderStatus[0].status;

                  element['orderStatus'] = stat;
                  element.orders = await element.orders.filter(x => x.store_id === storeInfo[0].assignee);
                  if (stat === 'delivered' || stat === 'cancelled' || stat === 'rejected' || stat === 'refund') {
                    // this.oldOrders.push(element);
                    this.olders.push(element);
                  } else {
                    this.orders.push(element);
                  }
                }
              }
            }
          }
          if (data.data.length === (index + 1)) {
            console.log('same index');
            this.loadMore(null, false);
          }
        });
        if (haveRefresh) {
          event.target.complete();
        }
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  goToOrder(ids) {
    console.log(ids);
    const navData: NavigationExtras = {
      queryParams: {
        id: ids.id
      }
    };
    this.router.navigate(['/order-details'], navData);
  }

  doRefresh(event) {
    console.log(event);
    this.getOrders(event, true);
  }

  loadMore(event, value) {
    const limit = this.limit * 10;
    console.log(limit);
    this.oldOrders = [];
    this.olders.forEach((element, index) => {
      if (index <= limit) {
        this.oldOrders.push(element);
      }
      if (value) {
        event.target.complete();
      }
    });
    this.limit = this.limit + 1;
    console.log('old orders-<', this.oldOrders.length, this.olders.length);
  }
}
