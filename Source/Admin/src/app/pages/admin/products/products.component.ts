/*
  Name: Galyon App
  Authors : Bytes Crafter
  Website : https://bytescrafter.net
  Created : 01-Jan-2021
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
export class ProductsComponent {

  searchText: string = '';
  products: any[] = [];
  dummProducts: any[] = [];
  dummy = Array(5);
  page = 1;

  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private util: UtilService
  ) {
    this.getAllProducts(null);
  }

  getAllProducts(filter) {
    this.api.post('galyon/v1/products/getAllProducts', {
      filter_term: filter ? filter:"",
      search: filter,
      limit_start: 0,
      limit_length: 100,
      order_column: 'updated_at',
      order_mode: 'DESC',
    }).then((response: any) => {
      if (response && response.success == true && response.data) {
        let product_list = response.data;
        this.dummy = [];
        this.products = product_list;
        this.dummProducts = product_list;
      }
    }).catch(error => {
      console.log(error);
      this.util.error('Something went wrong');
    });
  }

  getClass(item) {
    if (item === '1') {
      return 'btn btn-success btn-round btn-outline_success';
    } else {
      return 'btn btn-danger btn-round btn-outline-danger';
    }
  }

  getSellPrice(item) {
    let discount = item.discount_type == 'percent' ? item.orig_price*(item.discount/100):item.discount;
    return item.orig_price - discount;
  }

  getDates(date) {
    return moment(date).format('llll');
  }

  getCurrency() {
    return this.api.getCurrecySymbol();
  }

  search() {
    this.getAllProducts(this.searchText);
  }

  filter(string) {
    this.resetChanges();
    this.products = this.filterItems(string);
  }

  protected resetChanges = () => {
    this.products = this.dummProducts;
  }

  setFilteredItems() {
    this.products = [];
    this.products = this.dummProducts;
  }

  filterItems(searchTerm) {
    return this.products.filter((item) => {
      if(item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
      item.store_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        return true;
      }
      return false;
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

  manage(item) {
    const navData: NavigationExtras = {
      queryParams: {
        uuid: item.uuid
      }
    };
    this.router.navigate(['admin/manage-products'], navData);
  }

  createNew() {
    this.router.navigate(['admin/manage-products']);
  }

  /**
   * Change the status of the product to activate or deactivate.
   * @param item 
   */
  changeStatus(item) {
    const actions = item.status === '1' ? 'deactivate' : 'activate';

    Swal.fire({
      title: this.api.translate('Are you sure?'),
      text: this.api.translate('To ') + actions + this.api.translate(' this product!'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.api.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.api.translate('Cancel'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {
        this.spinner.show();
        this.api.post('galyon/v1/products/'+actions, {
          uuid: item.uuid
        }).then((response) => {
          if(response.success) {
            let index = this.products.findIndex((x => x.uuid == item.uuid));
            this.products[index].status = response.data.status;
            if(response.success) {
              this.util.success(null);
            } else {
              this.util.error(response.message);
            }
          } else {
            this.util.error( response.message );
          }
          this.spinner.hide();
        }, error => {
          console.log(error);
          this.spinner.hide();
        }).catch(error => {
          this.spinner.hide();
          console.log(error);
        });
      }
    });
  }
}
