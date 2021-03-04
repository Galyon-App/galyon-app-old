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
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { uniq } from 'lodash';
@Component({
  selector: 'app-home-products',
  templateUrl: './home-products.component.html',
  styleUrls: ['./home-products.component.scss']
})
export class HomeProductsComponent implements OnInit {
  products: any[] = [];
  dummyTopProducts: any[] = [];
  filter: any = '1';
  limit: any;
  maxLimit: any;
  loaded: boolean;
  from: any;
  stores: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private router: Router
  ) {
    this.from = this.route.snapshot.paramMap.get('from');
    if (this.from && this.from === 'top-picked') {
      this.limit = 5;
      this.loaded = false;
      this.dummyTopProducts = Array(30);
      this.getTop();
    } else {
      this.limit = 5;
      this.loaded = false;
      this.dummyTopProducts = Array(30);
      this.getOffers();
    }
  }

  getTop() {
    const storesparma = {
      id: localStorage.getItem('city')
    };
    this.api.post('stores/getByCity', storesparma).then((stores: any) => {
      console.log('stores', stores)
      this.stores = [];
      if (stores && stores.status === 200 && stores.data && stores.data.length) {
        this.stores = stores.data;
        this.util.active_store = [...new Set(this.stores.map(item => item.uid))];

        const param = {
          id: localStorage.getItem('city'),
          limit: this.limit * 12
        };
        this.api.post('products/getTopRatedAll', param).then((data: any) => {
          console.log('top products', data);
          this.maxLimit = (this.limit * 12) - 1;
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
              if (this.util.active_store.includes(element.store_id)) {
                this.products.push(element);
              }
            });
            this.products = uniq(this.products, 'id');
          }
          if (this.loaded) {
            this.loaded = false;
          }
        }, error => {
          console.log(error);
          this.dummyTopProducts = [];
        });

      }
    }, error => {
      console.log(error);
      this.dummyTopProducts = [];
    }).catch((error) => {
      console.log(error);
      this.dummyTopProducts = [];
    })

  }

  ngOnInit(): void {
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
      this.cart.removeItem(product.id);
    } else {
      this.products[index].quantiy = this.products[index].quantiy - 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }
  loadData() {
    this.limit = this.limit + 1;
    this.loaded = true;
    if (this.from && this.from === 'top-picked') {
      this.getTop();
    } else {
      this.getOffers();
    }
  }

  getOffers() {

    const storesparma = {
      id: localStorage.getItem('city')
    };
    this.api.post('stores/getByCity', storesparma).then((stores: any) => {
      this.stores = [];
      if (stores && stores.status === 200 && stores.data && stores.data.length) {
        this.stores = stores.data;
        this.util.active_store = [...new Set(this.stores.map(item => item.uid))];

        const param = {
          id: localStorage.getItem('city'),
          limit: this.limit * 12
        };
        this.api.post('products/getOffersList', param).then((data: any) => {
          console.log('top products', data);
          this.maxLimit = (this.limit * 12) - 1;
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
              if (this.util.active_store.includes(element.store_id)) {
                this.products.push(element);
              }
            });
            this.products = uniq(this.products, 'id');
          }
          if (this.loaded) {
            this.loaded = false;
          }
        }, error => {
          console.log(error);
          this.dummyTopProducts = [];
        });

      }
    }, error => {
      console.log(error);
      this.dummyTopProducts = [];
    }).catch((error) => {
      console.log(error);
      this.dummyTopProducts = [];
    })
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

  singleProduct(item) {
    console.log('-->', item);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate(['product', name, item.id]);
  }
}
