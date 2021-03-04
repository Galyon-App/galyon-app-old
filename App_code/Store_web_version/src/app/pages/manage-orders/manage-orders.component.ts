/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from 'src/app/services/util.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  @ViewChild('content', { static: false }) content: any;
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
  selectedDriver: any = '';
  constructor(
    public api: ApisService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    public util: UtilService,
    private modalService: NgbModal,
  ) {
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.loaded = false;
        this.getOrder();
        console.log('store=-============---=-=0-=-=-=-', this.util.storeInfo);
        if (this.util.storeInfo && this.util.storeInfo.name) {
          this.statusText = ' by ' + this.util.storeInfo.name;
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
    if (this.util.storeInfo && this.util.storeInfo.cid) {
      const param = {
        id: this.util.storeInfo.cid
      };

      this.api.post('drivers/geyByCity', param).then((data: any) => {
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
            // if (distance < 50 && element.current === 'active' && element.status === '1') {
            this.dummyDrivers.push(element);
            // }
            console.log('dummtasedr', this.dummyDrivers);
          });
        }
      }, error => {
        console.log(error);
        this.error(this.util.getString('Something went wrong'));
      });
    }
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
    this.spinner.show();
    this.api.post('orders/getById', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      this.loaded = true;
      if (data && data.status === 200 && data.data.length > 0) {
        const info = data.data[0];
        console.log(info);
        this.orderDetail = JSON.parse(info.notes);
        const order = JSON.parse(info.orders);
        this.orders = order.filter(x => x.store_id === localStorage.getItem('uid'));
        console.log('order=====>>', this.orders);
        let total = 0;
        this.orders.forEach((element) => {
          let price = 0;
          console.log('-->', element);
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
          const items = '<div style="border-bottom:1px dashed lightgray;display:flex;flex-direction:row;justify-content:space-between;"> <p style="font-weight:bold">'
            + element.name + ' X ' + element.quantiy + '</p> <p style="font-weight:bold">' + price + '$ </p>  </div>';
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
        if (info.uid) {
          const userinfo = {
            id: info.uid
          };
          this.api.post('users/getById', userinfo).then((data: any) => {
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
        this.error(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  error(message) {
    const toastOptions: ToastOptions = {
      title: this.util.getString('Error'),
      msg: message,
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
      title: this.util.getString('Success'),
      msg: message,
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

  call() {
    if (this.userInfo.mobile) {
      window.open('tel:' + this.userInfo.mobile);
    } else {
      this.error('Number not found');
    }
  }

  email() {
    if (this.userInfo.email) {
      window.open('mailto:' + this.userInfo.email);
    } else {
      this.error('Email not found');
    }
  }

  printOrder() {
    // console.log('print order');
    // const options: PrintOptions = {
    //   name: 'Groceryee App Summary',
    //   duplex: false,
    // };
    // const order = this.orderString.join('');
    // const content = '<div style="padding: 20px;display: flex;flex-direction: column;"> <h2 style="text-align: center;">Groceryee Order Summary</h2> <p style="float: left;margin:0px;"><b>' + this.util.store.name + '</b></p> <p style="float: left;margin:0px;"><b> ' + this.userInfo.first_name + ' ' + this.userInfo.last_name + ' </b></p> <p style="float: left;margin:0px;">' + this.datetime + ' </p> </div>' + order
    //   + '<p style="border-bottom: 1px solid black;margin:10px 0px;"> <span style="float: left;font-weight: bold;">SubTotal</span> <span style="float: right;font-weight: bold;">' + this.grandTotal +
    //   '$</span> </p> <br> <p style="border-bottom: 1px solid black;margin:10px 0px;"> <span style="float: left;font-weight: bold;">Delivery Charge</span> <span style="float: right;font-weight: bold;">' + this.grandTotal +
    //   '$</span> </p> <br> <p style="border-bottom: 1px solid black;margin:10px 0px;"> <span style="float: left;font-weight: bold;">Service Tax</span> <span style="float: right;font-weight: bold;">' + this.tax +
    //   '$</span> </p> <br> <p style="border-bottom: 1px solid black;margin:10px 0px;"> <span style="float: left;font-weight: bold;">Total</span> <span style="float: right;font-weight: bold;">' + this.grandTotal + '$</span> </p>';
    // console.log(content);
    // this.printer.print(content, options).then((data) => {
    //   console.log(data);
    // }).catch(error => {
    //   console.log(error);
    // });
  }

  async presentModal() {
    console.log(status);
    try {
      this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
    } catch (error) {
      console.log(error);
    }

  }

  close() {
    console.log('dismiss');
    const driver = this.dummyDrivers.filter(x => x.id === this.selectedDriver);
    console.log(driver);
    this.modalService.dismissAll();
    if (driver && driver.length > 0) {
      console.log('selected');
      this.drivers = driver;
      if (this.drivers && this.drivers.length) {
        const newOrderNotes = {
          status: 1,
          value: 'Order ' + 'accepted' + this.statusText,
          time: moment().format('lll'),
        };
        this.orderDetail.push(newOrderNotes);

        this.spinner.show();
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
        this.api.post('orders/editList', param).then((data: any) => {
          console.log('order', data);
          this.spinner.hide();
          this.updateDriver(this.drivers[0].id, 'busy');
          this.back();
          if (data && data.status === 200) {
            this.sendNotification('accepted');
          } else {
            this.error(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.spinner.hide();
          this.error(this.util.getString('Something went wrong'));
        });
      }
    }
  }

  updateDriver(uid, value) {
    const param = {
      id: uid,
      current: value
    };
    console.log('param', param);
    this.api.post('drivers/edit_profile', param).then((data: any) => {
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

    this.spinner.show();
    const param = {
      id: this.id,
      notes: JSON.stringify(this.orderDetail),
      status: JSON.stringify(this.orderStatus)
    };
    this.api.post('orders/editList', param).then((data: any) => {
      console.log('order', data);
      this.spinner.hide();
      if (data && data.status === 200) {
        this.sendNotification(value);
        this.back();
      } else {
        this.error(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
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
      this.spinner.show();
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
      this.api.post('orders/editList', param).then((data: any) => {
        console.log('order', data);
        this.spinner.hide();
        if (data && data.status === 200) {
          this.sendNotification('accepted');
          this.back();
        } else {
          this.error(this.util.getString('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.util.getString('Something went wrong'));
      });
    } else {
      this.updateStatus(value);
    }

    // this.api
  }

  sendNotification(value) {
    if (this.userInfo && this.userInfo.fcm_token) {
      this.api.sendNotification2('Your order #' + this.id + ' ' + value, 'Order ' + value, this.userInfo.fcm_token)
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

        this.spinner.show();
        const param = {
          id: this.id,
          notes: JSON.stringify(this.orderDetail),
          status: JSON.stringify(this.orderStatus),
        };
        this.api.post('orders/editList', param).then((data: any) => {
          console.log('order', data);
          this.spinner.hide();
          this.updateDriver(this.driverId, 'active');
          if (data && data.status === 200) {
            this.sendNotification(this.changeStatusOrder);
            this.back();
          } else {
            this.error(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.spinner.hide();
          this.error(this.util.getString('Something went wrong'));
        });



      } else {
        const newOrderNotes = {
          status: 1,
          value: 'Order ' + this.changeStatusOrder + this.statusText,
          time: moment().format('lll'),
        };
        this.orderDetail.push(newOrderNotes);

        this.spinner.show();
        const param = {
          id: this.id,
          notes: JSON.stringify(this.orderDetail),
          status: JSON.stringify(this.orderStatus),
        };
        this.api.post('orders/editList', param).then((data: any) => {
          console.log('order', data);
          this.spinner.hide();
          if (data && data.status === 200) {
            this.sendNotification(this.changeStatusOrder);
            this.back();
          } else {
            this.error(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.spinner.hide();
          this.error(this.util.getString('Something went wrong'));
        });
      }

    }
  }

}
