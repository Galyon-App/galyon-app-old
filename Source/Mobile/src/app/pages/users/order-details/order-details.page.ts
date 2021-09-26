/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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

  public order: any;
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

  public has_stage(string: any): boolean {
    if(this.order?.stage) {
      return this.order.stage == string;
    }
    return false;
  }
  
  
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
      if (data && data.uuid) {
        this.id = data.uuid;
        this.loaded = false;
        this.getOrder();
      } else {
        this.back();
      }
    });
  }

  back() {
    this.router.navigate(['user/orders']);
  }

  getItemPrice(item, quantity = 1){
    if(item) {
      let sell_price: number = 0;
      let item_price: number = parseFloat(item.price);
      let item_discount: number = parseFloat(item.discount);
      if(item.discount_type == "percent") {
        item_discount = item_price*(item_discount/100);
      } else if(item.discount_type == "fixed") {
        item_discount = item_discount;
      } else {
        item_discount = 0;
      }
      sell_price = item_price-item_discount;

      item.variations.forEach(pvar => {
        let var_price = parseFloat(pvar.price);
        let var_discount = parseFloat(pvar.discount);
        let var_discounted = var_price-(var_price*(var_discount/100));
        sell_price += var_discounted;
      });
      sell_price *= quantity;

      return sell_price.toFixed(2);
    }
  }

  getOrder() {
    this.api.post('galyon/v1/orders/getOrdersById', {
      uuid: this.id,
      has_store_name: "1",
      has_address_name: "1"
    }).subscribe((reponse: any) => {
      this.loaded = true;
      if (reponse && reponse.success && reponse.data) {
        this.order = reponse.data;
      }



      // this.loaded = true;
      // if (data && data.status === 200 && data.data.length > 0) {
      //   const info = data.data[0];
      //   console.log(info);
      //   this.orderDetail = JSON.parse(info.notes);
      //   console.log('driver???? ======>', this.orderDetail);
      //   const order = JSON.parse(info.orders);
      //   console.log('order=====>>', order);
      //   const finalOrder = [];
      //   if (info.assignee && info.assignee !== '') {
      //     this.assigneeDriver = JSON.parse(info.assignee);
      //     console.log('ASSSIGNEE---->>>>', this.assigneeDriver);
      //   }
      //   const ids = [...new Set(order.map(item => item.store_id))];
      //   ids.forEach(element => {
      //     const param = {
      //       id: element,
      //       order: []
      //     };
      //     finalOrder.push(param);
      //   });

      //   ids.forEach((element, index) => {
      //     order.forEach(cart => {
      //       console.log('cart->>>???', cart);
      //       if (cart.variations && cart.variations !== '' && typeof cart.variations === 'string') {
      //         cart.variations = JSON.parse(cart.variations);
      //         console.log(cart['variant']);
      //         if (cart["variant"] === undefined) {
      //           cart['variant'] = 0;
      //         }
      //       }
      //       if (cart.store_id === element) {
      //         finalOrder[index].order.push(cart);
      //       }
      //     })
      //   });
      //   console.log('final order', finalOrder);
      //   this.orders = finalOrder;
      //   this.status = JSON.parse(info.status);
      //   console.log('order status--------------------', this.status);

      //   const status = this.status.filter(x => x.status === 'created');
      //   if (status.length === this.status.length) {
      //     this.canCancle = true;
      //   } else {
      //     this.canCancle = false;
      //   }

      //   // if()
      //   this.datetime = moment(info.date_time).format('dddd, MMMM Do YYYY');
      //   this.payMethod = info.paid_method === 'cod' ? 'COD' : 'PAID';
      //   this.orderAt = info.order_to;
      //   this.driverId = info.driver_id;
      //   if (this.driverId && this.driverId !== '') {
      //     const userinfo = {
      //       id: this.driverId
      //     };
      //     this.api.post('drivers/getDriversData', userinfo).subscribe((data: any) => {
      //       console.log('driverid>', data);
      //       if (data && data.status === 200 && data.data && data.data.length) {
      //         this.driverInfo = data.data;
      //         console.log(this.driverInfo);
      //       }
      //     }, error => {
      //       console.log(error);
      //     });
      //   }

      //   const stores = {
      //     id: info.store_id
      //   };
      //   this.api.post('stores/getStoresData', stores).subscribe((data: any) => {
      //     console.log('store=-============>>', data);
      //     console.log('store=-============>>', data);
      //     if (data && data.status === 200 && data.data.length) {
      //       this.stores = data.data;

      //     } else {
      //       this.util.showToast(this.util.getString('No Stores Found'), 'danger', 'bottom');
      //       this.back();
      //     }
      //   }, error => {
      //     console.log('error', error);
      //     this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
      //   });
      //   if (this.orderAt === 'home') {
      //     const address = JSON.parse(info.address);
      //     console.log('---address', address);
      //     if (address && address.address) {
      //       this.userLat = address.lat;
      //       this.userLng = address.lng;
      //       this.address = address.landmark + ' ' + address.house + ' ' + address.address + ' ' + address.pincode;
      //     }
      //   }
      // } else {
      //   this.util.errorToast(this.util.getString('Something went wrong'));
      // }
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
                uuid: this.id
              }
            }
            this.router.navigate(['order-rating'], param);
          }
        }
      ]
    });

    await alert.present();
  }

  cancelOrder() {
    this.presentAlertConfirmCancel();
  }

  async presentAlertConfirmCancel() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        {
          text: 'Go Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Registration');
          }
        }, {
          text: 'Cancel',
          handler: () => {
            console.log('Confirm Okay');
            this.api.post('galyon/v1/orders/cancelOrder', {
              uuid: this.id,
              store_id: this.order.store_id
            }).subscribe((response: any) => {
              if(response && response.success && response.data) {
                this.order.progress = JSON.parse(response.data.progress);
                this.order.stage = response.data.stage;
              } else {
                this.util.errorToast(response.message);
              }
            }, error => {
              console.log(error);
              this.util.hide();
              this.util.errorToast(this.util.getString('Something went wrong'));
            });
          }
        }
      ]
    });

    await alert.present();
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

  getOrderStatus(uuid) {
    const item = this.status.filter(x => x.uuid === uuid);
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
    const navData: NavigationExtras = {
      queryParams: {
        lat: item.lat,
        lng: item.lng,
        who: type,
        id: item.uuid,
        orderAt: this.orderAt,
        homeLat: this.userLat ? this.userLat : 'none',
        homeLng: this.userLng ? this.userLng : 'none',
        orderId: this.id
      }
    };
    this.router.navigate(['direction'], navData);

  }
}
