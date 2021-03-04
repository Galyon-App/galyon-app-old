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
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  myOrders: any[] = [];
  id: any;
  myaddress: any[] = [];
  reviews: any[] = [];
  name: any = '';
  email: any = '';
  photo: any = '';
  constructor(
    public api: ApisService,
    private route: ActivatedRoute,
    private toastyService: ToastyService,
    private router: Router
  ) {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.api.auth(param).then((data) => {
      console.log('auth data->>', data);
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
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getProfile();
        this.getMyOrders();
        this.getAddress();
        this.getReviews();
      }
    });
  }

  ngOnInit() {

  }
  getProfile() {
    const param = {
      id: this.id
    };
    this.api.post('users/getById', param).then((data: any) => {
      console.log('user info=>', data);
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data[0];
        console.log('info', info);
        this.email = info.email;
        this.name = info.first_name + ' ' + info.last_name;
        this.photo = this.api.mediaURL + info.cover;
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    });
  }

  getReviews() {
    const param = {
      id: this.id,
      where: 'uid = ' + this.id
    };

    this.api.post('rating/getFromIDs', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        this.reviews = data.data;
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.error('Something went wrong');
    });
  }

  getAddress() {
    const param = {
      id: this.id
    }
    this.myaddress = [];
    this.api.post('address/getByUid', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data.length) {
        this.myaddress = data.data;
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.error('Something went wrong');
    });
  }

  getMyOrders() {

    const param = {
      id: this.id
    }
    this.api.post('orders/getByUid', param).then((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data.length > 0) {
        // this.orders = data.data;
        const orders = data.data;
        orders.forEach(element => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.store_id = element.store_id.split(',');
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            if (element && element.address) {
              element.address = JSON.parse(element.address);
            }
            element.orders.forEach(order => {
              console.log(element.id, '=>', order.variations);
              if (order.variations && order.variations !== '' && typeof order.variations === 'string') {
                console.log('strings', element.id);
                order.variations = JSON.parse(order.variations);
                console.log(order['variant']);
                if (order["variant"] === undefined) {
                  order['variant'] = 0;
                }
              }
            });
          }
        });
        this.myOrders = orders;
        console.log('orderss==>?', this.myOrders);
      }
    }, error => {
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.error('Something went wrong');
    });
  }

  getDate(date) {
    return moment(date).format('llll');
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
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

}
