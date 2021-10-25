/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { UtilService } from 'src/app/services/util.service';
import { Location } from '@angular/common';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
declare var google: any;

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {

  uuid: any;

  myOrders: any[] = [];
  myaddress: any[] = [];
  reviews: any[] = [];

  role: any = '';
  email: any = '';
  photo: any = '';
  cover: any = '';

  fname: any = '';
  lname: any = '';
  mobile: any = '';
  gender: any = '';
  city: any = '';
  joined: any = '';

  address: any = '';
  lat: any = '';
  lng: any = '';
  cities: any[] = [];
  
  vehicles: any[] = [];
  stores: any[] = [];

  constructor(
    public api: ApisService,
    private route: ActivatedRoute,
    private toastyService: ToastyService,
    private util: UtilService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.route.queryParams.subscribe(data => {
      if (data && data.uuid) {
        this.uuid = data.uuid;
        this.getProfile();
        this.getCity();
        // this.getMyOrders();
        this.getAddress();
        //this.getReviews();
      }
    });
  }

  handleAddressChange(address: Address) {
    this.address = address.formatted_address;
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
  }

  getCity() {
    this.api.get('galyon/v1/cities/getAllCities').then((response: any) => {
      if (response && response.success && response.data) {
        this.cities = response.data;
      }
    }, error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.error(this.api.translate('Something went wrong'));
    });
  }

  /**
   * Get the profile of this user.
   */
  getProfile() {
    this.api.post('galyon/v1/users/getByID', {
      uuid: this.uuid
    }).then((response: any) => {
      if (response && response.success && response.data) {
        this.email = response.data.email;
        this.photo = this.api.mediaURL + response.data.cover;
        this.role = response.data.type;
        this.fname = response.data.first_name;
        this.lname = response.data.last_name;
        this.mobile = response.data.phone;
        this.gender = response.data.gender;
        this.joined = moment(response.data.timestamp).format('YYYY-MM-DD');        
      }
    }, error => {
      console.log(error);
      this.util.error('Something went wrong');
    });
  }

  /**
   * Get all reviews created by this user.
   */
  getReviews() {
    this.api.post('galyon/v1/reviews/getByUid', {
      uuid: this.uuid,
    }).then((response: any) => {
      if (response && response.success && response.data) {
        this.reviews = response.data;
      }
    }, error => {
      console.log(error);
      this.util.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.util.error('Something went wrong');
    });
  }

  /**
   * Get the address of this user.
   */
  getAddress() {
    this.api.post('galyon/v1/address/getByUser', {
      uuid: this.uuid,
    }).then((response: any) => {
      if (response && response.success && response.data) {
        this.myaddress = response.data;
      }
    }, error => {
      console.log(error);
      this.util.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.util.error('Something went wrong');
    });
  }

  preview_banner(files) {
    console.log('file-info', files);
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    if (files) {
      this.spinner.show();
      this.api.uploadFile(files).subscribe((response: any) => {
        this.spinner.hide();
        if (response && response.success && response.data) {
          this.cover = response.data;
          this.photo = this.api.mediaURL + response.data;
        }
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    } else {
      console.log('no');
    }
  }

  updateProfile() {
    if(!this.fname || this.fname == '' || !this.lname || this.lname == '' || !this.mobile || this.mobile == '' || !this.gender || this.gender == '') {
      this.util.error('Required fields cannot be empty!');
    }

    this.api.post('galyon/v1/users/updateUserProfile', {
      uuid: this.uuid,
      first_name: this.fname,
      last_name: this.lname,
      phone: this.mobile,
      gender: this.gender,
      cover: this.cover
    }).then((response: any) => {
      if (response && response.success && response.data) {
        this.util.success('User profile is now updated!');
      } else {
        this.util.error(response.message);
      }
    }, error => {
      console.log(error);
      this.util.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.util.error('Something went wrong');
    });
  }

  getDate(date) {
    return moment(date).format('llll');
  }


  getMyOrders() {

    const param = {
      id: this.uuid
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
      this.util.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.util.error('Something went wrong');
    });
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }
}
