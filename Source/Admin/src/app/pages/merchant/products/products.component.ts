/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
*/
import { Component } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { Router, NavigationExtras } from '@angular/router';
import { _, orderBy } from 'lodash';

import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from 'src/app/services/util.service';
import { StoresService } from 'src/app/services/stores.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  
  products: any[] = [];
  dummProducts: any[] = [];
  dummy = Array(5);
  page = 1;

  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public util: UtilService,
    private storeService: StoresService
  ) {
    this.getProducts();
  }

  getProducts() {
    const store_id = this.storeService.storeValue.uuid;
    this.api.post('galyon/v1/products/getProductsByStore', { uuid: store_id }).then((response: any) => {
      this.dummy = [];
      if (response && response.success == true && response.data) {
        this.products = response.data;
        this.dummProducts = response.data;
      }
    }, error => {
      console.log(error);
      this.util.error(this.util.getString('Something went wrong'));
      this.dummy = [];
    });
  }

  search(string) {
    this.resetChanges();
    this.products = this.filterItems(string);
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
      return 'btn btn-success btn-round btn-outline_success';
    } else {
      return 'btn btn-danger btn-round btn-outline-danger';
    }
  }

  openOrder(item) {
    const navData: NavigationExtras = {
      queryParams: {
        id: item.uuid
      }
    };
    this.router.navigate(['merchant/manage-products'], navData);
  }
  
  createNew() {
    this.router.navigate(['merchant/manage-products']);
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
            this.util.error(this.util.getString('Something went wrong'));
            console.log(error);
          }).catch(error => {
            this.spinner.hide();
            console.log(error);
            this.util.error(this.util.getString('Something went wrong'));
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
            this.util.error(this.util.getString('Something went wrong'));
            console.log(error);
          }).catch(error => {
            this.spinner.hide();
            console.log(error);
            this.util.error(this.util.getString('Something went wrong'));
          });
        }
      });
    }
  }
}
