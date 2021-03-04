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
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { NavController, AlertController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as moment from 'moment';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

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
  assigneeDriver: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public util: UtilService,
    public api: ApiService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private iab: InAppBrowser
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

  back() {
    this.navCtrl.back();
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
        console.log('driver???? ======>', this.orderDetail);
        const order = JSON.parse(info.orders);
        console.log('order=====>>', order);
        const finalOrder = [];
        if (info.assignee && info.assignee !== '') {
          this.assigneeDriver = JSON.parse(info.assignee);
          console.log('ASSSIGNEE---->>>>', this.assigneeDriver);
        }
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
            console.log('cart->>>???', cart);
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
          })
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
          if (address && address.address) {
            this.userLat = address.lat;
            this.userLng = address.lng;
            this.address = address.landmark + ' ' + address.house + ' ' + address.address + ' ' + address.pincode;
          }
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

  ngOnInit() {
  }



  call() {
    if (this.userInfo.mobile) {
      // window.open('tel:' + this.userInfo.mobile);
      this.iab.create('tel:' + this.userInfo.mobile, '_system');
    } else {
      this.util.errorToast(this.util.getString('Number not found'));
    }
  }

  email() {
    if (this.userInfo.email) {
      // window.open('mailto:' + this.userInfo.email);
      this.iab.create('mailto:' + this.userInfo.email, '_system');
    } else {
      this.util.errorToast(this.util.getString('Email not found'));
    }
  }

  callStore(item) {
    if (item) {
      // window.open('tel:' + item);
      this.iab.create('tel:' + item, '_system');
    } else {
      this.util.errorToast(this.util.getString('Number not found'));
    }
  }

  emailStore(item) {
    if (item) {
      // window.open('mailto:' + item);
      this.iab.create('mailto:' + item, '_system');
    } else {
      this.util.errorToast(this.util.getString('Email not found'));
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.util.getString('How was your experience?'),
      message: this.util.getString('Rate your experience with stores and driver'),
      mode: 'ios',
      buttons: [
        {
          text: this.util.getString('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.getString('Yes'),
          handler: () => {
            console.log('Confirm Okay');
            // this.util.setOrders(this.orderData);
            const param: NavigationExtras = {
              queryParams: {
                id: this.id
              }
            }
            this.router.navigate(['order-rating'], param);
          }
        }
      ]
    });

    await alert.present();
  }

  changeStatus() {
    console.log('status');

    const newOrderNotes = {
      status: 1,
      value: this.util.getString('Order ') + this.util.getString('cancelled by you'),
      time: moment().format('lll'),
    };
    this.orderDetail.push(newOrderNotes);

    this.status.forEach(element => {
      if (element.status === 'created') {
        element.status = 'cancelled';
      }
    });

    this.util.show();
    const param = {
      id: this.id,
      notes: JSON.stringify(this.orderDetail),
      status: JSON.stringify(this.status),
    };
    console.log('---->', this.status)
    this.api.post('orders/editList', param).subscribe((data: any) => {
      console.log('order', data);
      this.util.hide();
      if (this.orderAt === 'home' && this.driverId !== '0') {
        this.updateDriver(this.driverId, 'active');
      }
      if (data && data.status === 200) {
        this.sendNotification('cancelled');
        this.back();
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.getString('Something went wrong'));
    });

  }

  sendNotification(value) {
    if (this.userInfo && this.userInfo.fcm_token) {
      this.api.sendNotification(this.util.getString('Your order #') + this.id + ' ' + value, this.util.getString('Order')
        + ' ' + value, this.userInfo.fcm_token)
        .subscribe((data: any) => {
          console.log('onesignal', data);
        }, error => {
          console.log('onesignal error', error);
        });
    }
  }

  updateDriver(uid, value) {
    const param = {
      id: uid,
      current: value
    };
    console.log('param', param);
    this.api.post('drivers/edit_profile', param).subscribe((data: any) => {
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
      return this.util.getString(item[0].status);
    }
    return 'created';
  }

  getOrderStatusFromDriver(id) {
    const item = this.assigneeDriver.filter(x => x.driver === id);
    if (item && item.length) {
      return this.getOrderStatus(item[0].assignee);
    }
    return 'rejected';
  }

  async contanct(item) {
    console.log(item);
    const alert = await this.alertController.create({
      header: this.util.getString('Contact') + ' ' + item.name,
      inputs: [
        {
          name: 'mail',
          type: 'radio',
          label: this.util.getString('Email'),
          value: 'mail',
        },
        {
          name: 'call',
          type: 'radio',
          label: this.util.getString('Call'),
          value: 'call'
        },
        {
          name: 'msg',
          type: 'radio',
          label: this.util.getString('Message'),
          value: 'msg'
        },
      ],
      buttons: [
        {
          text: this.util.getString('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.util.getString('Ok'),
          handler: (data) => {
            console.log('Confirm Ok', data);
            if (data && data === 'mail') {
              this.emailStore(item.email);
            } else if (data && data === 'call') {
              this.callStore(item.mobile);
            } else if (data && data === 'msg') {
              console.log('none');
              const param: NavigationExtras = {
                queryParams: {
                  id: item.uid,
                  name: item.name,
                  uid: localStorage.getItem('uid')
                }
              };
              this.router.navigate(['inbox'], param);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async contanctDriver(item) {
    console.log(item);
    const alert = await this.alertController.create({
      header: this.util.getString('Contact') + ' ' + item.first_name,
      inputs: [
        {
          name: 'mail',
          type: 'radio',
          label: this.util.getString('Email'),
          value: 'mail',
        },
        {
          name: 'call',
          type: 'radio',
          label: this.util.getString('Call'),
          value: 'call'
        },
      ],
      buttons: [
        {
          text: this.util.getString('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.util.getString('Ok'),
          handler: (data) => {
            console.log('Confirm Ok', data);
            if (data && data === 'mail') {
              this.emailStore(item.email);
            } else if (data && data === 'call') {
              this.callStore(item.mobile);
            } else {
              console.log('none');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  direction(item, type) {
    console.log(item, type);
    const navData: NavigationExtras = {
      queryParams: {
        lat: item.lat,
        lng: item.lng,
        who: type,
        id: type === 'store' ? item.uid : item.id,
        orderAt: this.orderAt,
        homeLat: this.userLat ? this.userLat : 'none',
        homeLng: this.userLng ? this.userLng : 'none',
        orderId: this.id
      }
    };
    this.router.navigate(['direction'], navData);

  }
}
