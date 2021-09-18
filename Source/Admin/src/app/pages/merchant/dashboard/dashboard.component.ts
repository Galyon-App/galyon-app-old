/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NavigationExtras, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { StoresService } from 'src/app/services/stores.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('content', { static: false }) content: any;

  dummy = Array(5);
  page: number = 1;

  orders: any[] = [];
  dummOrders: any[] = [];
  stores: any[] = [];
  users: any[] = [];

  newOrders: any[] = [];
  onGoingOrders: any[] = [];
  oldOrders: any[] = [];

  allOrders: any[] = [];
  orderStatus: any[] = [];
  orderDetail: any[] = [];
  statusText: any = '';
  id: any;
  userInfo: any;
  userLat: any;
  userLng: any;
  driverId: any;
  assignee: any[] = [];
  assigneeDriver: any = [];
  address: any;
  drivers: any[] = [];
  dummyDrivers: any[] = [];
  selectedDriver: any = '';
  current: any = 'all';

  constructor(
    public api: ApisService,
    private router: Router,
    private modalService: NgbModal,
    public util: UtilService,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private authService: AuthService,
    private storeService: StoresService
  ) {
    let owner_id = this.authService.userValue.uuid;
    this.storeService.getStoreByOwner(owner_id, (response) => {
      if(response) {
        //this.statusText = ' by ' + this.storeService.storeValue.name;
        //this.getData();
      }
    });
    this.getOrdersForThisStore();
  }

  getOrdersForThisStore() {
    this.api.post('galyon/v1/orders/getOrdersByStore', {
      store_id: this.storeService.storeValue.uuid,
      limit_start: 0,
      limit_length: 1000
    }).then((response: any) => {
      console.log(response);
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
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.orders = [];
    });
  }


  ngOnInit(): void {
  }

  getData() {
    if(this.storeService.storeValue) {
      this.api.post('galyon/v1/orders/getByStore', {
        uuid: this.storeService.storeValue.uuid
      }).then((response: any) => {
        this.dummy = [];
        this.orders = [];
        this.newOrders = [];
        this.onGoingOrders = [];
        this.oldOrders = [];
        if (response && response.success == true && response.data) {
          console.log(response);
          response.data.forEach(async (element) => {
            element['storeStatus'] = status;
            element.orders.forEach(order => {
              if (order.variations && order.variations !== '' && typeof order.variations === 'string') {
                order.variations = JSON.parse(order.variations);
                if (order["variant"] === undefined) {
                  order['variant'] = 0;
                }
              }
            });
            this.orders.push(element);
            this.dummOrders.push(element);
            if (status === 'created') {
              this.newOrders.push(element);
            } else if (status === 'accepted' || status === 'picked' || status === 'ongoing') {
              this.onGoingOrders.push(element);
            } else if (status === 'rejected' || status === 'cancelled' || status === 'delivered' || status === 'refund') {
              this.oldOrders.push(element);
            }
          });
        }
      }, error => {
        console.log(error);
      }).catch(error => {
        console.log(error);
      });
    } else {
      console.log('Store info is null, cant get order list');
      this.util.error('Something went wrong!');
    }
  }

  getCurrency() {
    return environment.general.symbol;
  }

  getClass(item) {
    if (item === 'created' || item === 'accepted' || item === 'picked') {
      return 'btn btn-primary btn-round';
    } else if (item === 'delivered') {
      return 'btn btn-success btn-round';
    } else if (item === 'rejected' || item === 'cancel') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  getDates(date) {
    return moment(date).format('llll');
  }

  openOrder(item) {
    const navData: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };
    this.router.navigate(['merchant/manage-orders'], navData);
  }

  async open(status) {
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
          this.getData();
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

  getDrivers() {
    if (this.storeService.storeValue && this.storeService.storeValue.city_id) {
      const param = {
        id: this.storeService.storeValue.city_id
      };
      this.spinner.show();
      this.api.post('drivers/geyByCity', param).then((data: any) => {
        console.log('driver data--------------->>', data);
        this.spinner.hide();
        if (data && data.status === 200 && data.data.length) {
          const info = data.data.filter(x => x.status === '1');
          info.forEach(async (element) => {
            const distance = await this.distanceInKmBetweenEarthCoordinates(
              this.userLat,
              this.userLng,
              parseFloat(element.lat),
              parseFloat(element.lng));

            console.log('distance---------->>', distance);
            if (distance < 50 && element.current === 'active' && element.status === '1') {
              this.dummyDrivers.push(element);
            }
            // this.dummyDrivers.push(element); // fetch all
            console.log('dummtasedr', this.dummyDrivers);
          });
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.util.getString('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.util.getString('Something went wrong'));
      });
    }
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

  changeStatus(value, item) {
    console.log(value, item);
    this.id = item.id;
    this.driverId = item.driver_id;
    const storesStatus = JSON.parse(item.status);
    console.log('------------------', storesStatus);
    this.orderStatus = storesStatus;
    this.orderDetail = JSON.parse(item.notes);

    if (item.uid) {
      const userinfo = {
        id: item.uid
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
    if (item.order_to === 'home') {
      const address = JSON.parse(item.address);
      console.log('---address', address);
      if (address && address.address) {
        this.userLat = address.lat;
        this.userLng = address.lng;
        this.address = address.address;
        this.getDrivers();
      }
      if (item.assignee && item.assignee !== '') {
        const assignee = JSON.parse(item.assignee);
        this.assignee = assignee;
        const driver = this.assignee.filter(x => x.assignee === localStorage.getItem('uid'));
        console.log('-------------', driver);
        if (driver && driver.length) {
          this.driverId = driver[0].driver;
          console.log('driverid===================', this.driverId);
        }
      }
      if (item.driver_id && item.driver_id !== '') {
        const drivers = item.driver_id.split(',');
        this.assigneeDriver = drivers;
      }
      console.log('----', this.assignee);
      console.log('----', this.assigneeDriver);
    }
    if (value === 'accepted' || value === 'ongoing') {
      console.log('***********////////////////////////', this.orderStatus);
      this.orderStatus.forEach(element => {
        if (element.id === localStorage.getItem('uid')) {
          element.status = value;
        }
      });
      if (value === 'accepted' && item.order_to === 'home') {
        this.open(item.storeStatus);
      } else if (value === 'accepted' && item.order_to !== 'home') {
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
          this.getData();
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
      } else {
        this.updateStatus(value);
      }
    } else {
      this.orderStatus.forEach(element => {
        if (element.id === localStorage.getItem('uid')) {
          element.status = value;
        }
      });
      if (value !== 'ongoing' && item.order_to === 'home' && this.driverId !== '0') {
        // release driver from this order
        console.log('relase driver');

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
          status: JSON.stringify(this.orderStatus),
        };
        this.api.post('orders/editList', param).then((data: any) => {
          console.log('order', data);
          this.spinner.hide();
          this.getData();
          this.updateDriver(this.driverId, 'active');
          if (data && data.status === 200) {
            this.sendNotification(value);
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
          value: 'Order ' + value + this.statusText,
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
          this.getData();
          if (data && data.status === 200) {
            this.sendNotification(value);
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

  sendNotification(value) {
    if (this.userInfo && this.userInfo.fcm_token) {
      // this.api.sendNotification2('Your order #' + this.id + ' ' + value, 'Order ' + value, this.userInfo.fcm_token)
      //   .subscribe((data: any) => {
      //     console.log('onesignal', data);
      //   }, error => {
      //     console.log('onesignal error', error);
      //   });
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
        this.getData();
        this.sendNotification(value);
      } else {
        this.error(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  orderChanged(event) {
    console.log(event);
    // this.open(this.content,);
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

  search(str) {
    this.current = 'all';
    this.resetChanges();
    console.log('string', str);
    this.orders = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.orders = this.dummOrders;
  }

  filterItems(searchTerm) {
    return this.orders.filter((item) => {
      return item.id.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  changeOrders() {
    console.log(this.current);
  }
}
