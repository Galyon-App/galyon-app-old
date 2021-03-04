/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  id: any;
  loaded: boolean;
  orderDetail: any[] = [];
  orders: any[] = [];
  payMethod: any;
  status: any[] = [];
  datetime: any;
  orderAt: any;
  address: any;
  userInfo: any;
  driverInfo: any[] = [];
  changeStatusOrder: any;
  userLat: any;
  userLng: any;
  driverId: any;

  stores: any[] = [];

  canCancle: boolean;

  isDelivered: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    private navCtrl: Location
  ) {
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.loaded = false;
        this.getOrder();
      } else {
        this.navCtrl.back();
      }
    });
  }

  getOrder() {
    const param = {
      id: this.id
    };
    this.api.post('orders/getById', param).then((data: any) => {
      console.log(data);
      this.loaded = true;
      if (data && data.status === 200 && data.data.length > 0) {
        const info = data.data[0];
        console.log(info);
        this.orderDetail = JSON.parse(info.notes);
        const order = JSON.parse(info.orders);
        console.log('order=====>>', order);
        const finalOrder = [];
        const ids = [...new Set(order.map(item => item.store_id))];
        ids.forEach(element => {
          const param = {
            id: element,
            order: []
          };
          finalOrder.push(param);
        });

        ids.forEach((element, index) => {
          order.forEach(cart => {
            if (cart.variations && cart.variations !== '' && typeof cart.variations === 'string') {
              cart.variations = JSON.parse(cart.variations);
              console.log(cart['variant']);
              if (cart["variant"] === undefined) {
                cart['variant'] = 0;
              }
            }
            if (cart.store_id === element) {
              finalOrder[index].order.push(cart);
            }
          });
        });
        console.log('final order', finalOrder);
        this.orders = finalOrder;
        this.status = JSON.parse(info.status);
        console.log('order status--------------------', this.status);

        const status = this.status.filter(x => x.status === 'created');
        if (status.length === this.status.length) {
          this.canCancle = true;
        } else {
          this.canCancle = false;
        }

        const delivered = this.status.filter(x => x.status === 'delivered');
        if (delivered.length === this.status.length) {
          this.isDelivered = true;
        } else {
          this.isDelivered = false;
        }

        // if()
        this.datetime = moment(info.date_time).format('dddd, MMMM Do YYYY');
        this.payMethod = info.paid_method === 'cod' ? 'COD' : 'PAID';
        this.orderAt = info.order_to;
        this.driverId = info.driver_id;
        if (this.driverId && this.driverId !== '') {
          const userinfo = {
            id: this.driverId
          };
          this.api.post('drivers/getDriversData', userinfo).then((data: any) => {
            console.log('driverid>', data);
            if (data && data.status === 200 && data.data && data.data.length) {
              this.driverInfo = data.data;
              console.log(this.driverInfo);
            }
          }, error => {
            console.log(error);
          });
        }

        const stores = {
          id: info.store_id
        };
        this.api.post('stores/getStoresData', stores).then((data: any) => {
          console.log('store=-============>>', data);
          console.log('store=-============>>', data);
          if (data && data.status === 200 && data.data.length) {
            this.stores = data.data;

          } else {
            // this.util.showToast('No Stores Found', 'danger', 'bottom');
            this.util.toast('error', this.util.translate('Error'), this.util.translate('No Stores Found'));
            this.back();
          }
        }, error => {
          console.log('error', error);
          this.util.errorMessage(this.util.translate('Something went wrong'));
        });
        if (this.orderAt === 'home') {
          const address = JSON.parse(info.address);
          console.log('---address', address);
          if (address && address.address) {
            this.userLat = address.lat;
            this.userLng = address.lng;
            this.address = address.landmark + ' ' + address.house + ' ' + address.address + ' ' + address.pincode;
            this.getDrivers();
          }
        }
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  ngOnInit(): void {
  }


  getDrivers() {
    const param = {
      id: this.driverId
    };
    this.api.post('drivers/getById', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }

  getStoreName(id) {
    const item = this.stores.filter(x => x.uid === id);
    if (item && item.length) {
      return item[0].name;
    }
    return 'Store';
  }

  getOrderStatus(id) {
    const item = this.status.filter(x => x.id === id);
    if (item && item.length) {
      return item[0].status;
    }
    return 'created';
  }

  goToTracker() {
    this.router.navigate(['/tracker']);
  }

  back() {
    this.navCtrl.back();
  }

  contanct(item) {
    console.log(item);
  }

  contanctDriver(item) {
    console.log(item);
  }
}
