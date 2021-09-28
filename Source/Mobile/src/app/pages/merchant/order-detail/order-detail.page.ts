/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { SelectDriversPage } from '../select-drivers/select-drivers.page';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import * as moment from 'moment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  id: any;
  loaded: boolean;
  orderDetail: any[] = [];
  orders: any[] = [];
  payMethod: any;
  status: any;
  datetime: any;
  orderAt: any;
  address: any;
  userInfo: any;
  driverInfo: any;
  changeStatusOrder: any;
  drivers: any[] = [];
  dummyDrivers: any[] = [];
  userLat: any;
  userLng: any;
  driverId: any;
  assignee: any[] = [];
  assigneeDriver: any = [];

  orderStatus: any[] = [];
  statusText: any = '';
  orderString: any[] = [];

  grandTotal: any;
  tax: any;

  // deliveryCharge: any = 0;
  orderTax: any = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    public util: UtilService,
    public api: ApiService,
    private modalController: ModalController,
    private printer: Printer,
    private alertController: AlertController,
    private iab: InAppBrowser
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data && data.uuid) {
        this.id = data.uuid;
        this.loaded = false;
        this.getOrder();
        // if (this.util.store && this.util.store.name) {
        //   this.statusText = ' by ' + this.util.store.name;
        // }
      } else {
        //Show warning order not found.
      }
    });
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    console.log(lat1, lon1, lat2, lon2);
    const earthRadiusKm = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  getDrivers() {
    if (this.util.store && this.util.store.cid) {
      const param = {
        id: this.util.store.cid
      };

      this.api.post('drivers/geyByCity', param).subscribe((data: any) => {
        console.log('driver data--------------->>', data);
        if (data && data.status === 200 && data.data.length) {
          const info = data.data.filter(x => x.status === '1');
          info.forEach(async (element) => {
            const distance = await this.distanceInKmBetweenEarthCoordinates(
              this.userLat,
              this.userLng,
              parseFloat(element.lat),
              parseFloat(element.lng));

            console.log('distance---------->>', distance);
            if (distance < 500 && element.current === 'active' && element.status === '1') {
              this.dummyDrivers.push(element);
            }
            console.log('dummtasedr', this.dummyDrivers);
          });
        }
      }, error => {
        console.log(error);
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    }
  }

  getItemPrice(item, quantity = 1){
    if(item) {
      let sell_price = 0;
      const item_price = parseFloat(item.price);
      const item_discount = parseFloat(item.discount);
      const item_discounted = item.dicount_type == "percent" ? item_price*(item_discount/100) : item_discount;
      sell_price = item_price-item_discounted;

      item.variations.forEach(pvar => {
        const var_price = parseFloat(pvar.price);
        const var_discount = parseFloat(pvar.discount);
        const var_discounted = var_price-(var_price*(var_discount/100));
        sell_price += var_discounted;
      });
      sell_price *= quantity;

      return sell_price.toFixed(2);
    }
  }

  order: any;

  getOrder() {
    this.api.post('galyon/v1/orders/getOrdersById', {
      uuid: this.id,
      has_store_name: "1",
      has_user_name: "1",
      has_address_name: "1"
    }).subscribe((response: any) => {
      this.loaded = true;
      if (response && response.success && response.data) {
        this.order = response.data;
        console.log(this.order);

        // this.orderDetail = JSON.parse(info.notes);
        // const order = JSON.parse(info.orders);
        // this.orders = order.filter(x => x.store_id === localStorage.getItem('uid'));
        // console.log('order=====>>', this.orders);
        // // this.grandTotal = 0;
        // let total = 0;
        // this.orders.forEach((element) => {
        //   let price = 0;
        //   if (element.variations && element.variations !== '' && typeof element.variations === 'string') {
        //     console.log('strings', element.uuid);
        //     element.variations = JSON.parse(element.variations);
        //     console.log(element['variant']);
        //     if (element["variant"] === undefined) {
        //       element['variant'] = 0;
        //     }
        //   }
        //   if (element && element.discount > 0) {
        //     if (element.size === '1' || element.size === 1) {
        //       if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
        //         price = price + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantity);
        //       } else {
        //         price = price + (parseFloat(element.variations[0].items[element.variant].price) * element.quantity);
        //       }
        //     } else {
        //       price = price + (parseFloat(element.orig_price) * element.quantity);
        //     }
        //   } else {
        //     if (element.size === '1' || element.size === 1) {
        //       if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
        //         price = price + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantity);
        //       } else {
        //         price = price + (parseFloat(element.variations[0].items[element.variant].price) * element.quantity);
        //       }
        //     } else {
        //       price = price + (parseFloat(element.sell_price) * element.quantity);
        //     }
        //   }
        //   console.log('PRICEEE-->', price);
        //   // const price = element.sell_price === '0.00' ? parseFloat(element.orig_price) : parseFloat(element.sell_price);
        //   const items = '<div style="border-bottom:1px dashed lightgray;display:flex;flex-direction:row;justify-content:space-between;"> <p style="font-weight:bold">' + element.name + ' X ' + element.quantity + '</p> <p style="font-weight:bold">' + price + this.util.currecny + ' </p>  </div>';
        //   this.orderString.push(items);
        //   console.log(total, price);
        //   total = total + price;
        // });
        // console.log('==>', total);
        // this.grandTotal = total.toFixed(2);
        // const storesStatus = JSON.parse(info.status);
        // console.log('------------------', storesStatus);
        // this.orderStatus = storesStatus;
        // const current = storesStatus.filter(x => x.uuid === localStorage.getItem('uid')); //TODO: Verify
        // console.log('*************************', current);
        // if (current && current.length) {
        //   this.status = current[0].status;
        // }
        // this.datetime = moment(info.date_time).format('dddd, MMMM Do YYYY');
        // this.payMethod = info.paid_method === 'cod' ? 'COD' : 'PAID';
        // this.orderAt = info.order_to;
        // this.tax = info.tax;
        // this.driverId = info.driver_id;
        // if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.extra)) {
        //   const extras = JSON.parse(info.extra);
        //   console.log('extra===>>', extras);
        //   if (extras && extras.length) {
        //     const storeExtra = extras.filter(x => x.store_id === localStorage.getItem('uid'));
        //     console.log('--< storeExtra->', storeExtra);
        //     if (storeExtra && storeExtra.length) {
        //       // const deliveryCharge = parseFloat(storeExtra[0].distance) * parseFloat(storeExtra[0].shippingPrice);
        //       // this.deliveryCharge = deliveryCharge.toFixed(2);
        //       // console.log('delivery charge will be', this.deliveryCharge);
        //       this.orderTax = parseFloat(storeExtra[0].tax).toFixed(2);
        //       this.grandTotal = parseFloat(this.grandTotal) + parseFloat(this.orderTax);
        //     }
        //   }
        // }
        // if (info.uid) {
        //   const userinfo = {
        //     id: info.uid
        //   };
        //   this.api.post('users/getById', userinfo).subscribe((data: any) => {
        //     console.log('user info=>', data);
        //     if (data && data.status === 200 && data.data && data.data.length) {
        //       this.userInfo = data.data[0];
        //       console.log(this.userInfo);
        //     }
        //   }, error => {
        //     console.log(error);
        //   });
        // }
        // if (this.orderAt === 'home') {
        //   const address = JSON.parse(info.address);
        //   console.log('---address', address);
        //   if (address && address.address) {
        //     this.userLat = address.lat;
        //     this.userLng = address.lng;
        //     this.address = address.landmark + ' ' + address.house + ' ' + address.address + ' ' + address.pincode;
        //     this.getDrivers();

        //   }
        //   if (info.assignee && info.assignee !== '') {
        //     const assignee = JSON.parse(info.assignee);
        //     this.assignee = assignee;
        //     const driver = this.assignee.filter(x => x.assignee === localStorage.getItem('uid'));
        //     console.log('-------------', driver);
        //     if (driver && driver.length) {
        //       this.driverId = driver[0].driver;
        //       console.log('driverid===================', this.driverId);
        //     }
        //   }
        //   if (info.driver_id && info.driver_id !== '') {
        //     const drivers = info.driver_id.split(',');
        //     this.assigneeDriver = drivers;
        //   }
        //   console.log('----', this.assignee);
        //   console.log('----', this.assigneeDriver);
        //}
      } else {
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
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

  getOrderStatus(uuid) {
    const item = this.status.filter(x => x.uuid === uuid);
    if (item && item.length) {
      return this.util.getString(item[0].status);
    }
    return 'created';
  }

  ngOnInit() {
  }

  back() {
    //this.util.refreshOrder();
    console.log('asdasdasdasdasdas');
    this.router.navigate(['merchant/orders']);
  }

  call() {
    if (this.userInfo.mobile) {
      this.iab.create('tel:' + this.userInfo.mobile, '_system')
    } else {
      this.util.errorToast(this.util.getString('Number not found'));
    }
  }

  email() {
    if (this.userInfo.email) {
      this.iab.create('mailto:' + this.userInfo.email, '_system')
    } else {
      this.util.errorToast(this.util.getString('Email not found'));
    }
  }

  printOrder() {
    console.log('print order');
    const options: PrintOptions = {
      name: 'Galyon App Summary',
      duplex: false,
    };
    const order = this.orderString.join('');
    const content = '<div style="padding: 20px;display: flex;flex-direction: column;"> <h2 style="text-align: center;">Galyon Order Summary</h2> <p style="float: left;margin:0px;"><b>' + this.util.store.name + '</b></p> <p style="float: left;margin:0px;"><b> ' + this.userInfo.first_name + ' ' + this.userInfo.last_name + ' </b></p> <p style="float: left;margin:0px;">' + this.datetime + ' </p> </div>' + order
      + '<p style="border-bottom: 1px solid black;margin:10px 0px;"> <span style="float: left;font-weight: bold;">SubTotal</span> <span style="float: right;font-weight: bold;">' + this.grandTotal +
      '$</span> </p> <br> <p style="border-bottom: 1px solid black;margin:10px 0px;"> <span style="float: left;font-weight: bold;">Delivery Charge</span> <span style="float: right;font-weight: bold;">' + this.grandTotal +
      '$</span> </p> <br> <p style="border-bottom: 1px solid black;margin:10px 0px;"> <span style="float: left;font-weight: bold;">Service Tax</span> <span style="float: right;font-weight: bold;">' + this.tax +
      '$</span> </p> <br> <p style="border-bottom: 1px solid black;margin:10px 0px;"> <span style="float: left;font-weight: bold;">Total</span> <span style="float: right;font-weight: bold;">' + this.grandTotal + '$</span> </p>';
    console.log(content);
    this.printer.print(content, options).then((data) => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SelectDriversPage,
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        item: this.dummyDrivers
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role === 'selected') {
        this.drivers = data.data;
        if (this.drivers && this.drivers.length) {
          const newOrderNotes = {
            status: 1,
            value: 'Order ' + 'accepted' + this.statusText,
            time: moment().format('lll'),
          };
          this.orderDetail.push(newOrderNotes);

          this.util.show();
          const assignee = {
            driver: this.drivers[0].uuid,
            assignee: localStorage.getItem('uid')
          };
          this.assignee.push(assignee);
          console.log('*********************************', this.assignee);
          this.assigneeDriver.push(this.drivers[0].uuid);
          console.log('////////////////////////////', this.assigneeDriver);
          const param = {
            uuid: this.id,
            notes: JSON.stringify(this.orderDetail),
            status: JSON.stringify(this.orderStatus),
            driver_id: this.assigneeDriver.join(),
            assignee: JSON.stringify(this.assignee)
          };
          console.log('===================================', param);
          this.api.post('orders/editList', param).subscribe((data: any) => {
            console.log('order', data);
            this.util.hide();
            this.updateDriver(this.drivers[0].uuid, 'busy');
            if (data && data.status === 200) {
              this.sendNotification('accepted');
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
      }
    });
    await modal.present();
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

  updateStatus(value) {
    const newOrderNotes = {
      status: 1,
      value: 'Order ' + value + this.statusText,
      time: moment().format('lll'),
    };
    this.orderDetail.push(newOrderNotes);

    this.util.show();
    const param = {
      uuid: this.id,
      notes: JSON.stringify(this.orderDetail),
      status: JSON.stringify(this.orderStatus)
    };
    this.api.post('orders/editList', param).subscribe((data: any) => {
      console.log('order', data);
      this.util.hide();
      if (data && data.status === 200) {
        this.sendNotification(value);
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

  changeStatus(value) {
    this.presentAlertConfirm(value);
  }

  async presentAlertConfirm(method) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Do you really want to '+method+' this order?',
      buttons: [
        {
          text: 'Go Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel Press');
          }
        }, {
          text: 'Continue',
          handler: async () => {
            console.log('Confirm Okay');

            this.api.post('galyon/v1/orders/'+method+'Order', {
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
      this.api.sendNotification('Your order #' + this.id + ' ' + value, 'Order ' + value, this.userInfo.fcm_token)
        .subscribe((data: any) => {
          console.log('onesignal', data);
        }, error => {
          console.log('onesignal error', error);
        });
    }
  }

  changeOrderStatus() {
    if(this.changeStatusOrder == 'delivered') {
      this.updateOrderStatus('delivered', 'deliver');
    } else if(this.changeStatusOrder == 'shipping') {
      this.updateOrderStatus('shipping', 'ship');
    } else if(this.changeStatusOrder == 'cancelled') {
      this.updateOrderStatus('cancelled', 'cancel');
    }
  }

  async updateOrderStatus(method, endpoint) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Do you really want to set the order status to '+method+'?',
      buttons: [
        {
          text: 'Go Back',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel Press');
          }
        }, {
          text: 'Continue',
          handler: async () => {
            console.log('Confirm Okay');

            this.api.post('galyon/v1/orders/'+endpoint+'Order', {
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

}
