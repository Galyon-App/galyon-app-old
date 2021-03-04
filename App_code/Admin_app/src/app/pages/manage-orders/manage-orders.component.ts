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
import { ApisService } from 'src/app/services/apis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
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
    public api: ApisService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.api.auth(param).then((data) => {
      if (data !== true) {
        localStorage.removeItem('uid');
        this.router.navigate(['login']);
      }
    }, error => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    }).catch((error) => {
      console.log(error);
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    });
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.spinner.show();
        this.loaded = false;
        this.getOrder();
      } else {
        this.navCtrl.back();
      }
    });
  }

  ngOnInit(): void {
  }
  back() {
    this.navCtrl.back();
  }

  getOrder() {
    const param = {
      id: this.id
    };
    this.api.post('orders/getById', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      this.loaded = true;
      if (data && data.status === 200 && data.data.length > 0) {
        const info = data.data[0];
        console.log(info);
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.orders)) {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.notes)) {
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
              }).catch(error => {
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
                this.error('No Stores Found');
                this.back();
              }
            }, error => {
              console.log('error', error);
              this.error('Something went wrong');
            }).catch(error => {
              console.log('error', error);
              this.error('Something went wrong');
            });
            if (this.orderAt === 'home') {
              const address = JSON.parse(info.address);
              console.log('---address', address);
              if (address && address.address) {
                this.userLat = address.lat;
                this.userLng = address.lng;
                this.address = address.address;
              }
            }
          }
        }

      } else {
        this.back();
        this.error('Something went wrong');
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.loaded = true;
      this.back();
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.loaded = true;
      this.back();
      this.error('Something went wrong');
    });
  }

  error(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Error'),
      msg: this.api.translate(message),
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }
  success(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Success'),
      msg: this.api.translate(message),
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
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
}
