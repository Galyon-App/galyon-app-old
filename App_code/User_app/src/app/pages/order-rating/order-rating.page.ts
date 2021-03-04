/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { StoreRatingPage } from './../store-rating/store-rating.page';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ProductRatingPage } from '../product-rating/product-rating.page';
import { DriverRatingPage } from '../driver-rating/driver-rating.page';

@Component({
  selector: 'app-order-rating',
  templateUrl: './order-rating.page.html',
  styleUrls: ['./order-rating.page.scss'],
})
export class OrderRatingPage implements OnInit {
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
  changeStatusOrder: any;
  userLat: any;
  userLng: any;
  driverId: any;
  stores: any[] = [];
  driverInfo: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public util: UtilService,
    public api: ApiService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
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
    this.api.post('orders/getById', param).subscribe((data: any) => {
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
            if (cart.store_id === element) {
              finalOrder[index].order.push(cart);
            }
          })
        });
        console.log('final order', finalOrder);
        this.orders = finalOrder;
        this.status = JSON.parse(info.status);
        console.log('order status--------------------', this.status);

        // if()
        this.datetime = moment(info.date_time).format('dddd, MMMM Do YYYY');
        this.payMethod = info.paid_method === 'cod' ? 'COD' : 'PAID';
        this.orderAt = info.order_to;
        this.driverId = info.driver_id;
        if (this.driverId && this.driverId !== '') {
          const userinfo = {
            id: this.driverId
          };
          this.api.post('drivers/getDriversData', userinfo).subscribe((data: any) => {
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
        this.api.post('stores/getStoresData', stores).subscribe((data: any) => {
          console.log('store=-============>>', data);
          console.log('store=-============>>', data);
          if (data && data.status === 200 && data.data.length) {
            this.stores = data.data;

          } else {
            this.util.showToast(this.util.getString('No Stores Found'), 'danger', 'bottom');
            this.back();
          }
        }, error => {
          console.log('error', error);
          this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
        });
        if (this.orderAt === 'home') {
          const address = JSON.parse(info.address);
          console.log('---address', address);
        }
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }


  getStoreName(id) {
    const item = this.stores.filter(x => x.uid === id);
    if (item && item.length) {
      return item[0].name;
    }
    return 'Store';
  }

  async rateProduct(item) {
    const modal = await this.modalCtrl.create({
      component: ProductRatingPage,
      cssClass: 'modalContact',
      backdropDismiss: false,
      swipeToClose: true,
      componentProps: {
        id: item.id,
        name: item.name
      }
    });
    return await modal.present();
  }

  async rateStore(item) {
    const modal = await this.modalCtrl.create({
      component: StoreRatingPage,
      cssClass: 'modalContact',
      componentProps: {
        id: item,
        name: this.getStoreName(item)
      },
      backdropDismiss: false,
      swipeToClose: true,
    });
    return await modal.present();
  }



  ngOnInit() {
  }
  back() {
    this.navCtrl.back();
  }

  async ratDriver(item) {
    console.log(item);
    const modal = await this.modalCtrl.create({
      component: DriverRatingPage,
      cssClass: 'modalContact',
      backdropDismiss: false,
      swipeToClose: true,
      componentProps: {
        id: item.id,
        name: item.first_name + ' ' + item.last_name
      }
    });
    return await modal.present();
  }
}
