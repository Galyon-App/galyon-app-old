/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { uniq } from 'lodash';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  products: any[] = [];
  dummyTopProducts: any[] = [];
  filter: any = '1';
  limit: any;
  maxLimit: any;
  loaded: boolean;
  id: any;
  name: any;
  mode: any = 'grid';
  storeIsActive: boolean = false;

  constructor(
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: Location
  ) {
    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.limit = 1;
      this.loaded = false;
      this.name = this.route.snapshot.paramMap.get('name');
      this.dummyTopProducts = Array(30);
      this.getStoreStatus();
      this.getOffers();
    }
  }

  ngOnInit(): void {
  }

  getStoreStatus() {
    const param = {
      id: this.id
    };

    this.api.post('stores/getByUid', param).then((datas: any) => {
      console.log('store info...', datas);
      if (datas && datas.status === 200 && datas.data.length) {
        if (datas.data[0] && datas.data[0].status === '1') {
          this.storeIsActive = true;
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  getOffers() {

    const param = {
      id: this.id,
      limit: this.limit * 12
    };
    this.api.post('products/getProductByStores', param).then((data: any) => {
      console.log('top products', data);
      this.maxLimit = (this.limit * 12) - 1;
      this.products = [];
      this.dummyTopProducts = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        data.data.forEach(element => {
          if (element.variations && element.size === '1' && element.variations !== '') {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              element.variations = JSON.parse(element.variations);
              element['variant'] = 0;
            } else {
              element.variations = [];
              element['variant'] = 1;
            }
          } else {
            element.variations = [];
            element['variant'] = 1;
          }
          if (this.cart.itemId.includes(element.id)) {
            const index = this.cart.cart.filter(x => x.id === element.id);
            element['quantiy'] = index[0].quantiy;
          } else {
            element['quantiy'] = 0;
          }
          this.products.push(element);
        });
        if (this.loaded) {
          this.loaded = false;
        }
        this.products = this.products.filter(x => x.status === '1');
        this.products = uniq(this.products, 'id');
      } else {
        this.navCtrl.back();
      }

    }, error => {
      console.log(error);
      this.dummyTopProducts = [];
    }).catch((error) => {
      console.log(error);
      this.dummyTopProducts = [];
    });
  }

  goToShopDetail() {
    this.router.navigate(['/shop-detail']);
  }

  onChange(value) {
    this.filter = value;
    switch (this.filter) {
      case 1:
        console.log('its rating');
        // this.products = this.products.sort((a, b) => parseInt(b.total_rating) - parseInt(a.total_rating));
        this.products = this.products.sort((a, b) =>
          parseFloat(b.total_rating) < parseFloat(a.total_rating) ? -1
            : (parseFloat(b.total_rating) > parseFloat(a.total_rating) ? 1 : 0));
        break;

      case 2:
        console.log('its low to high');
        this.products = this.products.sort((a, b) =>
          parseFloat(a.original_price) < parseFloat(b.original_price) ? -1
            : (parseFloat(a.original_price) > parseFloat(b.original_price) ? 1 : 0));
        break;

      case 3:
        console.log('its highht to low');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.original_price) < parseFloat(a.original_price) ? -1
            : (parseFloat(b.original_price) > parseFloat(a.original_price) ? 1 : 0));
        break;

      case 4:
        console.log('its a - z');
        this.products = this.products.sort((a, b) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
        break;

      case 5:
        console.log('its z - a');
        this.products = this.products.sort((a, b) => {
          if (a.name > b.name) { return -1; }
          if (a.name < b.name) { return 1; }
          return 0;
        });
        break;

      case 6:
        console.log('its % off');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.discount) < parseFloat(a.discount) ? -1
            : (parseFloat(b.discount) > parseFloat(a.discount) ? 1 : 0));
        break;

      default:
        break;
    }
  }

  loadData() {
    this.limit = this.limit + 1;
    this.loaded = true;
    this.getOffers();
  }

  singleProduct(item) {
    console.log('-->', item);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate(['product', name, item.id]);
  }

  addToCart(item, index) {
    console.log(item);
    this.products[index].quantiy = 1;
    this.cart.addItem(item);
  }

  add(product, index) {
    console.log(product);
    if (this.products[index].quantiy > 0) {
      this.products[index].quantiy = this.products[index].quantiy + 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }

  remove(product, index) {
    console.log(product, index);
    if (this.products[index].quantiy === 1) {
      this.products[index].quantiy = 0;
      this.cart.removeItem(product.id)
    } else {
      this.products[index].quantiy = this.products[index].quantiy - 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }
}
