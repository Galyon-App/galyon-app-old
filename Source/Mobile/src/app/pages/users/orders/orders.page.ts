/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  dummy: any[] = [];
  public orders: any[] = [];

  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService,
    private auth: AuthService
  ) {
  }

  ionViewWillEnter() {
    this.getOrders('', false);
  }

  getOrders(event, haveRefresh) {
    this.dummy = Array(15);
    this.orders = [];
    this.api.post('galyon/v1/orders/getOrdersByUser', {
      uid: this.auth.userToken.uuid,
      has_store_name: "1",
    }).subscribe((response: any) => {
      this.dummy = [];
      if (response && response.success  && response.data) {

        // this.orders = data.data;
        const orders = response.data;
        orders.forEach(element => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.items);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
          }
        });
        this.orders = orders;
        if (haveRefresh) {
          event.target.complete();
        }
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

  goToOrder(id) {
    const navData: NavigationExtras = {
      queryParams: {
        uuid: id
      }
    }
    this.router.navigate(['user/orders/details'], navData);
  }

  doRefresh(event) {
    this.getOrders(event, true);
  }

}
