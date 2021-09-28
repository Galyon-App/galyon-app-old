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
import { MerchantService } from 'src/app/services/merchant.service';
import { Store } from 'src/app/models/store.model';
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
  storeId: any = '';

  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private authServ: AuthService,
    private merchant: MerchantService
  ) {
    if(this.authServ.is_merchant) {
      this.merchant.request((stores: Store[]) => {
        this.storeId = this.merchant.stores.length > 0 ? this.merchant.stores[0].uuid : ""
        this.getOrders('', false, this.storeId);
      })
    }
    // this.getOrder();
    // this.util.subscribeOrder().subscribe((data) => {
    //   this.getOrders('', false);
    // });
  }

  ngOnInit() {
  }

  getOrder() {
    this.segment = 1;
    this.newOrders = [];
    this.onGoingOrders = [];
    this.oldOrders = [];
    this.dummy = Array(5);
    this.getOrders('', false, this.storeId);
  }

  onClick(val) {
    this.segment = val;
  }

  goToOrder(order) {
    const navData: NavigationExtras = {
      queryParams: {
        uuid: order.uuid
      }
    };
    this.router.navigate(['merchant/order-detail'], navData);
  }

  getOrders(event, haveRefresh, store_id = '') {
    
    this.limit = 1;
    this.dummy = Array(50);

    this.newOrders = [];
    this.onGoingOrders = [];
    this.oldOrders = [];

    this.api.post('galyon/v1/orders/getOrdersByStore', {
      store_id: store_id,
      has_store_name: "1",
      has_user_name: "1"
    }).subscribe((response: any) => {
      
      if (response && response.success && response.data) {
        this.dummy = [];

        response.data.forEach(async (element, index) => {
            if (element.stage === 'created') {
              this.newOrders.push(element);
            } else if (element.stage === 'ongoing' || element.stage === 'shipping') {
              this.onGoingOrders.push(element);
            } else if (element.stage === 'rejected' || element.stage === 'cancelled' || element.stage === 'delivered' || element.stage === 'refund') {
              this.oldOrders.push(element);
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
    this.getOrders(event, true, this.storeId);
  }

  async loadMore(event, value) {

    this.getOrders(event, true, this.storeId);
    //TODO: Fetch new orders with last id and put it to this.olders.

    // await this.olders.forEach((element, index) => {
    //   this.oldOrders.push(element);
    // });

    // if (event != null) {
    //   event.target.complete();
    // }
  }
}
