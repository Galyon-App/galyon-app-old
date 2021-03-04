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
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  segment = 1;

  newOrders: any[] = [];
  onGoingOrders: any[] = [];
  oldOrders: any[] = [];
  dummy = Array(50);
  olders: any[] = [];
  limit: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router,
  ) {
    this.getOrder();
    this.util.subscribeOrder().subscribe((data) => {
      this.getOrders('', false);
    });
  }

  ngOnInit() {
  }

  getOrder() {
    console.log('enter');
    this.segment = 1;
    this.newOrders = [];
    this.onGoingOrders = [];
    this.oldOrders = [];
    this.dummy = Array(50);
    this.getOrders('', false);
  }

  onClick(val) {
    this.segment = val;
  }

  goToOrder(ids) {
    console.log(ids);
    const navData: NavigationExtras = {
      queryParams: {
        id: ids.id
      }
    };
    this.router.navigate(['/order-detail'], navData);
  }



  getOrders(event, haveRefresh) {
    this.limit = 1;
    this.dummy = Array(50);

    const param = {
      id: localStorage.getItem('uid')
    };
    this.newOrders = [];
    this.onGoingOrders = [];
    this.oldOrders = [];
    this.api.post('orders/getByStore', param).subscribe((data: any) => {
      console.log('by store id', data);
      this.dummy = [];
      if (data && data.status === 200 && data.data.length > 0) {
        data.data.forEach(async (element, index) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders = await element.orders.filter(x => x.store_id === localStorage.getItem('uid'));
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter(x => x.id === localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach(order => {
                  if (order.variations && order.variations !== '' && typeof order.variations === 'string') {
                    console.log('strings', element.id);
                    order.variations = JSON.parse(order.variations);
                    console.log(order['variant']);
                    if (order["variant"] === undefined) {
                      order['variant'] = 0;
                    }
                  }
                });
                const status = selected[0].status;
                element['storeStatus'] = status;
                if (status === 'created') {
                  this.newOrders.push(element);
                } else if (status === 'accepted' || status === 'picked' || status === 'ongoing') {
                  this.onGoingOrders.push(element);
                } else if (status === 'rejected' || status === 'cancelled' || status === 'delivered' || status === 'refund') {
                  // this.oldOrders.push(element);
                  this.olders.push(element);
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
  getProfilePic(item) {
    return item && item.cover ? item.cover : 'assets/imgs/user.jpg';
  }

  getCurrency() {
    // return this.util.getCurrecySymbol();
    return '$';
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
