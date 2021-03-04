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
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { _, orderBy } from 'lodash';

import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  dummProducts: any[] = [];
  dummy = Array(5);
  page = 1;
  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    public util: UtilService
  ) {
    this.getProducts();
  }

  ngOnInit(): void {
  }

  getProducts() {
    const param = {
      id: localStorage.getItem('uid'),
      limit: 5000,
    };
    this.api.post('products/getByStoreId', param).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200) {
        this.products = data.data;
        this.dummProducts = data.data;
      }
    }, error => {
      console.log(error);
      this.error(this.util.getString('Something went wrong'));
      this.dummy = [];
    });
  }

  search(string) {
    this.resetChanges();
    console.log('string', string);
    this.products = this.filterItems(string);
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

  protected resetChanges = () => {
    this.products = this.dummProducts;
  }

  setFilteredItems() {
    console.log('clear');
    this.products = [];
    this.products = this.dummProducts;
  }

  filterItems(searchTerm) {
    return this.products.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  sortByName() {
    this.products = orderBy(this.products, ['name'], ['asc']);
  }

  sortByRating() {
    this.products = orderBy(this.products, ['rating'], ['desc']);
  }

  sortByHome() {
    this.products = orderBy(this.products, ['in_home'], ['desc']);
  }


  getClass(item) {
    if (item === '1') {
      return 'btn btn-primary btn-round';
    } else if (item === '0') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  openOrder(item) {
    console.log(item);
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['manage-products'], navData);
  }
  getDates(date) {
    return moment(date).format('llll');
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }

  update(item, value) {
    if (value === 'home') {
      console.log('home', item);
      Swal.fire({
        title: this.util.getString('Are you sure?'),
        text: 'To change it',
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: this.util.getString('Yes'),
        showCancelButton: true,
        cancelButtonText: this.util.getString('Cancle'),
        backdrop: false,
        background: 'white'
      }).then((data) => {
        if (data && data.value) {
          console.log('update it');
          const param = {
            id: item.id,
            in_home: item.in_home === '1' ? 0 : 1
          };
          this.spinner.show();
          this.api.post('products/editList', param).then((datas) => {
            this.spinner.hide();
            this.getProducts();
          }, error => {
            this.spinner.hide();
            this.error(this.util.getString('Something went wrong'));
            console.log(error);
          }).catch(error => {
            this.spinner.hide();
            console.log(error);
            this.error(this.util.getString('Something went wrong'));
          });
        }
      });
      // this.sp
    } else if (value === 'status') {
      console.log('status', item);

      Swal.fire({
        title: this.util.getString('Are you sure?'),
        text: 'To change it',
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: this.util.getString('Yes'),
        showCancelButton: true,
        cancelButtonText: this.util.getString('Cancle'),
        backdrop: false,
        background: 'white'
      }).then((data) => {
        if (data && data.value) {
          console.log('update it');
          const param = {
            id: item.id,
            status: item.status === '1' ? 0 : 1
          };
          this.spinner.show();
          this.api.post('products/editList', param).then((datas) => {
            this.spinner.hide();
            this.getProducts();
          }, error => {
            this.spinner.hide();
            this.error(this.util.getString('Something went wrong'));
            console.log(error);
          }).catch(error => {
            this.spinner.hide();
            console.log(error);
            this.error(this.util.getString('Something went wrong'));
          });
        }
      });
    }
  }

  createNew() {
    this.router.navigate(['manage-products']);
  }
}
