/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { SelectDriversPage } from './../select-drivers/select-drivers.page';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
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
    private navCtrl: NavController,
    public util: UtilService,
    public api: ApiService,
    private modalController: ModalController,
    private printer: Printer,
    private iab: InAppBrowser
  ) {
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.loaded = false;
        this.getOrder();
        console.log('store=-============---=-=0-=-=-=-', this.util.store);
        if (this.util.store && this.util.store.name) {
          this.statusText = ' by ' + this.util.store.name;
        }
      } else {
        this.navCtrl.back();
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
        this.orders = order.filter(x => x.store_id === localStorage.getItem('uid'));
        console.log('order=====>>', this.orders);
        // this.grandTotal = 0;
        let total = 0;
        this.orders.forEach((element) => {
          let price = 0;
          if (element.variations && element.variations !== '' && typeof element.variations === 'string') {
            console.log('strings', element.id);
            element.variations = JSON.parse(element.variations);
            console.log(element['variant']);
            if (element["variant"] === undefined) {
              element['variant'] = 0;
            }
          }
          if (element && element.discount === '0') {
            if (element.size === '1' || element.size === 1) {
              if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
                price = price + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantiy);
              } else {
                price = price + (parseFloat(element.variations[0].items[element.variant].price) * element.quantiy);
              }
            } else {
              price = price + (parseFloat(element.original_price) * element.quantiy);
            }
          } else {
            if (element.size === '1' || element.size === 1) {
              if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
                price = price + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantiy);
              } else {
                price = price + (parseFloat(element.variations[0].items[element.variant].price) * element.quantiy);
              }
            } else {
              price = price + (parseFloat(element.sell_price) * element.quantiy);
            }
          }
          console.log('PRICEEE-->', price);
          // const price = element.sell_price === '0.00' ? parseFloat(element.original_price) : parseFloat(element.sell_price);
          const items = '<div style="border-bottom:1px dashed lightgray;display:flex;flex-direction:row;justify-content:space-between;"> <p style="font-weight:bold">' + element.name + ' X ' + element.quantiy + '</p> <p style="font-weight:bold">' + price + this.util.currecny + ' </p>  </div>';
          this.orderString.push(items);
          console.log(total, price);
          total = total + price;
        });
        console.log('==>', total);
        this.grandTotal = total.toFixed(2);
        const storesStatus = JSON.parse(info.status);
        console.log('------------------', storesStatus);
        this.orderStatus = storesStatus;
        const current = storesStatus.filter(x => x.id === localStorage.getItem('uid'));
        console.log('*************************', current);
        if (current && current.length) {
          this.status = current[0].status;
        }
        this.datetime = moment(info.date_time).format('dddd, MMMM Do YYYY');
        this.payMethod = info.paid_method === 'cod' ? 'COD' : 'PAID';
        this.orderAt = info.order_to;
        this.tax = info.tax;
        this.driverId = info.driver_id;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.extra)) {
          const extras = JSON.parse(info.extra);
          console.log('extra===>>', extras);
          if (extras && extras.length) {
            const storeExtra = extras.filter(x => x.store_id === localStorage.getItem('uid'));
            console.log('--< storeExtra->', storeExtra);
            if (storeExtra && storeExtra.length) {
              // const deliveryCharge = parseFloat(storeExtra[0].distance) * parseFloat(storeExtra[0].shippingPrice);
              // this.deliveryCharge = deliveryCharge.toFixed(2);
              // console.log('delivery charge will be', this.deliveryCharge);
              this.orderTax = parseFloat(storeExtra[0].tax).toFixed(2);
              this.grandTotal = parseFloat(this.grandTotal) + parseFloat(this.orderTax);
            }
          }
        }
        if (info.uid) {
          const userinfo = {
            id: info.uid
          };
          this.api.post('users/getById', userinfo).subscribe((data: any) => {
            console.log('user info=>', data);
            if (data && data.status === 200 && data.data && data.data.length) {
              this.userInfo = data.data[0];
              console.log(this.userInfo);
            }
          }, error => {
            console.log(error);
          });
        }
        if (this.orderAt === 'home') {
          const address = JSON.parse(info.address);
          console.log('---address', address);
          if (address && address.address) {
            this.userLat = address.lat;
            this.userLng = address.lng;
            this.address = address.landmark + ' ' + address.house + ' ' + address.address + ' ' + address.pincode;
            this.getDrivers();

          }
          if (info.assignee && info.assignee !== '') {
            const assignee = JSON.parse(info.assignee);
            this.assignee = assignee;
            const driver = this.assignee.filter(x => x.assignee === localStorage.getItem('uid'));
            console.log('-------------', driver);
            if (driver && driver.length) {
              this.driverId = driver[0].driver;
              console.log('driverid===================', this.driverId);
            }
          }
          if (info.driver_id && info.driver_id !== '') {
            const drivers = info.driver_id.split(',');
            this.assigneeDriver = drivers;
          }
          console.log('----', this.assignee);
          console.log('----', this.assigneeDriver);
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

  back() {
    this.util.newOrder();
    this.navCtrl.back();
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
      name: 'Groceryee App Summary',
      duplex: false,
    };
    const order = this.orderString.join('');
    const content = '<div style="padding: 20px;display: flex;flex-direction: column;"> <h2 style="text-align: center;">Groceryee Order Summary</h2> <p style="float: left;margin:0px;"><b>' + this.util.store.name + '</b></p> <p style="float: left;margin:0px;"><b> ' + this.userInfo.first_name + ' ' + this.userInfo.last_name + ' </b></p> <p style="float: left;margin:0px;">' + this.datetime + ' </p> </div>' + order
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
            driver: this.drivers[0].id,
            assignee: localStorage.getItem('uid')
          };
          this.assignee.push(assignee);
          console.log('*********************************', this.assignee);
          this.assigneeDriver.push(this.drivers[0].id);
          console.log('////////////////////////////', this.assigneeDriver);
          const param = {
            id: this.id,
            notes: JSON.stringify(this.orderDetail),
            status: JSON.stringify(this.orderStatus),
            driver_id: this.assigneeDriver.join(),
            assignee: JSON.stringify(this.assignee)
          };
          console.log('===================================', param);
          this.api.post('orders/editList', param).subscribe((data: any) => {
            console.log('order', data);
            this.util.hide();
            this.updateDriver(this.drivers[0].id, 'busy');
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
      id: this.id,
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
    console.log(value);

    this.orderStatus.forEach(element => {
      if (element.id === localStorage.getItem('uid')) {
        element.status = value;
      }
    });
    console.log(this.orderDetail);
    if (value === 'accepted' && this.orderAt === 'home') {
      this.presentModal();
    } else if (value === 'accepted' && this.orderAt !== 'home') {
      this.util.show();
      const newOrderNotes = {
        status: 1,
        value: 'Order ' + value + this.statusText,
        time: moment().format('lll'),
      };
      this.orderDetail.push(newOrderNotes);
      const param = {
        id: this.id,
        notes: JSON.stringify(this.orderDetail),
        status: JSON.stringify(this.orderStatus),
      };
      this.api.post('orders/editList', param).subscribe((data: any) => {
        console.log('order', data);
        this.util.hide();
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
    } else {
      this.updateStatus(value);
    }

    // this.api
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
    console.log(this.changeStatusOrder);
    console.log(this.orderDetail);
    if (this.changeStatusOrder) {
      this.orderStatus.forEach(element => {
        if (element.id === localStorage.getItem('uid')) {
          element.status = this.changeStatusOrder;
        }
      });
      if (this.changeStatusOrder !== 'ongoing' && this.orderAt === 'home' && this.driverId !== '0') {
        // release driver from this order
        console.log('relase driver');

        const newOrderNotes = {
          status: 1,
          value: 'Order ' + this.changeStatusOrder + this.statusText,
          time: moment().format('lll'),
        };
        this.orderDetail.push(newOrderNotes);

        this.util.show();
        const param = {
          id: this.id,
          notes: JSON.stringify(this.orderDetail),
          status: JSON.stringify(this.orderStatus),
        };
        this.api.post('orders/editList', param).subscribe((data: any) => {
          console.log('order', data);
          this.util.hide();
          this.updateDriver(this.driverId, 'active');
          if (data && data.status === 200) {
            this.sendNotification(this.changeStatusOrder);
            this.back();
          } else {
            this.util.errorToast(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.getString('Something went wrong'));
        });



      } else {
        const newOrderNotes = {
          status: 1,
          value: 'Order ' + this.changeStatusOrder + this.statusText,
          time: moment().format('lll'),
        };
        this.orderDetail.push(newOrderNotes);

        this.util.show();
        const param = {
          id: this.id,
          notes: JSON.stringify(this.orderDetail),
          status: JSON.stringify(this.orderStatus),
        };
        this.api.post('orders/editList', param).subscribe((data: any) => {
          console.log('order', data);
          this.util.hide();
          if (data && data.status === 200) {
            this.sendNotification(this.changeStatusOrder);
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
  }

}
