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
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  tabID: any;
  catID: any;
  subId: any;
  dummys = Array(20);

  limit: any;
  maxLimit: any;
  haveSub: boolean = false;
  categories: any[] = [];
  dummyProducts: any[] = [];
  products: any[] = [];
  filter: any = '1';
  loaded: boolean;
  banners: any[] = [];
  dummyBanners = Array(5);

  myCarouselOptions = {
    loop: false,
    margin: 20,
    nav: false,
    dots: true,
    autoplay: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1
      },
      800: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  }

  options: Options = {
    floor: 0,
    ceil: 100,
    showTicks: true
  };


  min: any;
  max: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService
  ) {
    this.init();
  }

  init() {
    console.log('current route', this.router.url);
    if (this.router.url.includes('/sub/')) {
      console.log('its sub category')
      this.haveSub = true;
      this.catID = this.route.snapshot.paramMap.get('id');
      this.subId = this.route.snapshot.paramMap.get('sub_id');
    } else if (this.router.url.includes('/categories/')) {
      console.log('it category');
      this.catID = this.route.snapshot.paramMap.get('id');
    }
    this.limit = 1;
    this.loaded = false;
    this.categories = [];
    this.banners = [];
    this.products = [];
    this.getCates();
    this.getBanners();
  }

  getCates() {
    this.api.get('categories').then((datas: any) => {
      if (datas && datas.data && datas.data.length) {
        const list = datas.data.filter(x => x.status === '1');
        console.log('not selected');
        this.categories = [];
        list.forEach(element => {
          const obj = {
            id: element.id,
            name: element.name,
            sub: []
          };
          this.categories.push(obj);
        });
        console.log('categories', this.categories);

        this.getSubCates();
      }
    }, error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    })

  }

  getSubCates() {
    this.api.get('subcate').then((datas: any) => {
      console.log(datas);
      if (datas && datas.data && datas.data.length) {
        const list = datas.data.filter(x => x.status === '1');
        this.categories.forEach((element, index) => {
          list.forEach(sub => {
            if (element.id === sub.cate_id) {
              this.categories[index].sub.push(sub);
            }
          });
        });

        console.log('all cates', this.categories);
        if (this.haveSub === false) {
          const index = this.categories.findIndex(x => x.id === this.catID);
          console.log('index', index);
          this.subId = this.categories[index].sub[0].id;
          console.log('sub id-----', this.subId);
        }
        this.getProducts();
      }
    }, error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  getProducts() {
    const stores = {
      id: localStorage.getItem('city')
    };
    this.api.post('stores/getByCity', stores).then((stores: any) => {
      if (stores && stores.status === 200 && stores.data && stores.data.length) {
        this.util.active_store = [...new Set(stores.data.map(item => item.uid))];
        const param = {
          id: this.catID,
          cid: localStorage.getItem('city'),
          sid: this.subId,
          limit: this.limit * 12
        };
        console.log('parma', param);
        this.dummys = Array(20);
        this.products = [];
        this.api.post('products/getByCSID', param).then((cates: any) => {
          console.log(cates);
          this.dummys = [];
          if (cates && cates.status === 200 && cates.data && cates.data.length) {
            this.maxLimit = (this.limit * 12) - 1;
            console.log('Max Limit0000', this.maxLimit);
            console.log('products', cates.data);
            const products = cates.data;
            window.scrollTo(0, 0);
            this.products = products.filter(x => x.status === '1' && this.util.active_store.includes(x.store_id));
            this.products = uniq(this.products, 'id');
            this.max = Math.max(...this.products.map(o => o.original_price), 0);
            console.log('maxValueOfPrice', this.max);
            this.min = Math.min.apply(null, this.products.map(item => item.original_price))
            console.log('min', this.min);
            this.products.forEach((info: any) => {
              if (info.variations && info.size === '1' && info.variations !== '') {
                if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.status)) {
                  info.variations = JSON.parse(info.variations);
                  info['variant'] = 0;
                } else {
                  info.variations = [];
                  info['variant'] = 1;
                }
              } else {
                info.variations = [];
                info['variant'] = 1;
              }
              if (this.cart.itemId.includes(info.id)) {
                const index = this.cart.cart.filter(x => x.id === info.id);
                info['quantiy'] = index[0].quantiy;
              } else {
                info['quantiy'] = 0;
              }
            });
            this.dummyProducts = this.products;
            this.onChange(this.filter);
            this.dummys = [];
          } else {
            this.dummys = [];
          }
          if (this.loaded) {
            this.loaded = false;
          }

        }, error => {
          console.log(error);
          this.dummys = [];
          this.dummyProducts = [];
          this.products = [];
          this.util.toast('error', this.util.translate('Error'), this.util.translate('wrong input'));
        });
      } else {
        this.dummys = [];
        this.dummyProducts = [];
        this.products = [];
        this.router.navigate(['']);
        this.util.toast('error', this.util.translate('Error'), this.util.translate('wrong input'));
      }
    }).catch((error) => {
      console.log('error-/>', error);
      console.log(error);
      this.dummys = [];
      this.dummyProducts = [];
      this.products = [];
      this.util.toast('error', this.util.translate('Error'), this.util.translate('wrong input'));
    });

  }

  ngOnInit(): void {
  }

  catChange(val) {
    console.log(val);
    this.catID = val;
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

  loadData() {
    this.limit = this.limit + 1;
    this.loaded = true;
    this.getProducts();
  }

  getBanners() {
    this.dummyBanners = Array(30);
    this.api.get('banners').then((data: any) => {
      console.log(data);
      this.dummyBanners = [];
      this.banners = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        data.data.forEach(element => {
          if (element && element.status === '1') {
            if (element.position === '0') {
              this.banners.push(element);
            }
          }
        });

        console.log('top', this.banners);
        console.log('detect changes');
      }
    }, error => {
      console.log(error);
      this.dummyBanners = [];
    });
  }

  openLink(item) {
    console.log(item);

    if (item.type === '0') {
      console.log('open category');
      const name = this.categories.filter(x => x.id === item.link);
      let cateName: any = '';
      if (name && name.length) {
        cateName = name[0].name;
      }
      const routeName = cateName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
      this.router.navigate([]).then(result => { window.open('categories/' + item.link + '/' + routeName, '_blank'); });
    } else if (item.type === '1') {
      console.log('open product');
      const name = item.message.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
      this.router.navigate(['product', name, item.link]);
    } else {
      console.log('open link');
      window.open(item.link, '_blank');
    }
  }

  onUserChange(event) {
    console.log(event);
    const products = [];
    this.dummyProducts.forEach(element => {
      if (parseFloat(element.original_price) >= event.value && parseFloat(element.original_price) <= event.highValue) {
        products.push(element);
      }
      this.products = products;
    });
  }
}
