/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
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
    private authServ: AuthService
  ) {
    this.getOrder();
    this.util.subscribeOrder().subscribe((data) => {
      this.getOrders('', false);
    });
  }

  ngOnInit() {
  }

  getOrder() {
    this.segment = 1;
    this.newOrders = [];
    this.onGoingOrders = [];
    this.oldOrders = [];
    this.dummy = Array(5);
    this.getOrders('', false);
  }

  onClick(val) {
    this.segment = val;
  }

  goToOrder(ids) {
    console.log(ids);
    const navData: NavigationExtras = {
      queryParams: {
        uuid: ids.id
      }
    };
    this.router.navigate(['merchant/order-detail'], navData);
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
      this.dummy = [];
      if (data && data.status === 200 && data.data.length > 0) {
        data.data.forEach(async (element, index) => {

          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {

            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders = await element.orders.filter(x => x.store_id === localStorage.getItem('uid'));

            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {

              const info = JSON.parse(element.status);
              const selected = info.filter(x => x.uuid === this.authServ.userToken.uuid);

              if (selected && selected.length) {

                element.orders.forEach(order => {
                  if (order.variations && order.variations !== '' && typeof order.variations === 'string') {
                    order.variations = JSON.parse(order.variations);
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
                  this.oldOrders.push(element);
                }
              }
            }
          }

          if (data.data.length === (index + 1)) {
            //console.log('same index');
            //this.loadMore(null, true);
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
    return environment.general.symbol;
  }

  doRefresh(event) {
    console.log(event);
    this.getOrders(event, true);
  }

  async loadMore(event, value) {

    //TODO: Fetch new orders with last id and put it to this.olders.

    await this.olders.forEach((element, index) => {
      this.oldOrders.push(element);
    });

    if (event != null) {
      event.target.complete();
    }
  }
}
